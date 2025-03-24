'use client';

import { Geist } from "next/font/google";
import "./globals.css";
import Script from 'next/script';
import { useEffect, useState } from 'react';

const geist = Geist({ subsets: ["latin"] });

// Next.js의 메타데이터는 클라이언트 컴포넌트에서 작동하지 않으므로 제거
// export const metadata: Metadata = {
//   title: "토스 카페",
//   description: "토스 카페 주문 앱",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [tossScriptLoaded, setTossScriptLoaded] = useState(false);
  const [loadAttempts, setLoadAttempts] = useState(0);

  // 토스페이먼츠 SDK 로드 관리
  useEffect(() => {
    // 스크립트 로드 상태 확인
    const checkTossPaymentsStatus = () => {
      return typeof window !== 'undefined' && window.hasOwnProperty('TossPayments');
    };

    // 이미 로드되었으면 상태 업데이트
    if (checkTossPaymentsStatus()) {
      setTossScriptLoaded(true);
      return;
    }

    // 최대 3번 재시도
    if (loadAttempts < 3 && !tossScriptLoaded) {
      const script = document.createElement('script');
      script.src = 'https://js.tosspayments.com/v1';
      script.async = true;
      
      script.onload = () => {
        console.log('토스페이먼츠 SDK가 성공적으로 로드되었습니다.');
        setTossScriptLoaded(true);
      };
      
      script.onerror = (e) => {
        console.error('토스페이먼츠 SDK 로드 실패:', e);
        setLoadAttempts(prev => prev + 1);
      };
      
      document.head.appendChild(script);
    }
  }, [loadAttempts, tossScriptLoaded]);

  // 네트워크 상태 모니터링
  useEffect(() => {
    const handleOnline = () => {
      console.log('네트워크 연결이 복원되었습니다.');
      // 네트워크가 복구되면 토스페이먼츠 SDK 다시 로드 시도
      if (!tossScriptLoaded) {
        setLoadAttempts(0); // 재시도 카운터 초기화
      }
      if (window.__tossNetworkErrorHandler) {
        window.__tossNetworkErrorHandler(true);
      }
    };
    
    const handleOffline = () => {
      console.log('네트워크 연결이 끊어졌습니다.');
      if (window.__tossNetworkErrorHandler) {
        window.__tossNetworkErrorHandler(false);
      }
    };
    
    // 이벤트 리스너 등록
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // 전역 에러 핸들러 등록
    window.__tossNetworkErrorHandler = function(isOnline) {
      const event = new CustomEvent('toss-network-status', {
        detail: { isOnline: isOnline }
      });
      window.dispatchEvent(event);
    };
    
    // 전역 에러 핸들러 - 콘솔 오류 필터링
    const originalConsoleError = console.error;
    console.error = function(...args) {
      // USER_CANCEL 관련 오류는 표시하지 않음
      if (
        args.length > 0 && 
        (typeof args[0] === 'string' && 
         (args[0].includes('USER_CANCEL') || args[0].includes('결제가 취소되었습니다'))) ||
        (args[0] instanceof Error && 
         args[0].message && 
         (args[0].message.includes('USER_CANCEL') || args[0].message.includes('결제가 취소되었습니다')))
      ) {
        // 사용자 취소 메시지는 콘솔에 표시하지 않음
        return;
      }
      
      // 그 외 에러는 정상적으로 출력
      originalConsoleError.apply(console, args);
    };
    
    // unhandled promise rejection 핸들러 (토스페이먼츠 에러 처리)
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      // USER_CANCEL 관련 오류는 표시하지 않음 (이벤트 방지)
      if (event.reason && 
         (
           (typeof event.reason === 'string' && 
            (event.reason.includes('USER_CANCEL') || event.reason.includes('결제가 취소되었습니다'))) ||
           (event.reason instanceof Error && 
            event.reason.message && 
            (event.reason.message.includes('USER_CANCEL') || event.reason.message.includes('결제가 취소되었습니다')))
         )
      ) {
        event.preventDefault(); // 기본 동작 방지
        event.stopPropagation(); // 전파 방지
      }
    };
    
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      // 클린업 시 원래 console.error로 복원
      console.error = originalConsoleError;
    };
  }, [tossScriptLoaded]);

  return (
    <html lang="ko">
      <head>
        <title>토스 카페</title>
        <meta name="description" content="토스 카페 주문 앱" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#0070f3" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
      </head>
      <body className={geist.className}>
        <div className="app-container">
          {children}
        </div>
        
        {/* 전역 에러 핸들링 스크립트 */}
        <Script
          id="error-handler"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              // 모든 토스페이먼츠 관련 에러 메시지 처리를 위한 함수
              function isTossPaymentsCancelError(message) {
                return message && (
                  message.includes('USER_CANCEL') || 
                  message.includes('결제가 취소되었습니다')
                );
              }
              
              // 전역 에러 핸들러 - 기본 window.onerror
              window.onerror = function(message, source, lineno, colno, error) {
                if (source && source.includes('tosspayments') && message && isTossPaymentsCancelError(message.toString())) {
                  console.log('사용자가 결제를 취소했습니다.');
                  return true; // 에러 처리 완료로 표시
                }
                return false; // 기본 에러 처리 계속 진행
              };
              
              // DOM 에러 이벤트 핸들러
              window.addEventListener('error', function(event) {
                if (event.filename && event.filename.includes('tosspayments')) {
                  if (event.message && isTossPaymentsCancelError(event.message)) {
                    console.log('사용자가 결제를 취소했습니다.');
                    event.preventDefault();
                    event.stopPropagation();
                    return false;
                  }
                }
              }, true); // 캡처 단계에서 처리
              
              // unhandledrejection 이벤트 핸들러
              window.addEventListener('unhandledrejection', function(event) {
                const reason = event.reason;
                if (
                  (typeof reason === 'string' && isTossPaymentsCancelError(reason)) ||
                  (reason instanceof Error && reason.message && isTossPaymentsCancelError(reason.message)) ||
                  (reason && reason.name === 'PaymentsCancelError') ||
                  (reason && reason.message && isTossPaymentsCancelError(reason.message)) ||
                  (reason && reason.errorCode === 'USER_CANCEL')
                ) {
                  console.log('사용자가 결제를 취소했습니다.');
                  event.preventDefault();
                  event.stopPropagation();
                  return false;
                }
              }, true); // 캡처 단계에서 처리
              
              // 인터넷 연결 상태 저장
              window.__isOnline = navigator.onLine;
              
              // 토스페이먼츠 오류 직접 엘리먼트 선택 제거 (DOM 기반 추가 방어)
              setInterval(function() {
                const errorElements = document.querySelectorAll('[class*="error"]:not(.suppress-error-message)');
                errorElements.forEach(function(element) {
                  if (element.textContent && isTossPaymentsCancelError(element.textContent)) {
                    element.classList.add('suppress-error-message');
                    element.style.display = 'none';
                  }
                });
              }, 100);
              
              // 콘솔 오류 필터링 설정
              const originalConsoleError = console.error;
              console.error = function() {
                // 에러 메시지 체크 (다양한 형태 처리)
                if (arguments.length > 0) {
                  const firstArg = arguments[0];
                  let errorMessage = '';
                  
                  if (typeof firstArg === 'string') {
                    errorMessage = firstArg;
                  } else if (firstArg instanceof Error) {
                    errorMessage = firstArg.message || firstArg.toString();
                  } else if (firstArg && firstArg.message) {
                    errorMessage = firstArg.message;
                  } else if (firstArg && typeof firstArg.toString === 'function') {
                    errorMessage = firstArg.toString();
                  }
                  
                  // 취소 관련 메시지 필터링
                  if (isTossPaymentsCancelError(errorMessage)) {
                    return;
                  }
                }
                return originalConsoleError.apply(console, arguments);
              };
            `
          }}
        />
      </body>
    </html>
  );
}
