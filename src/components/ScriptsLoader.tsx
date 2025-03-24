'use client';

import { useEffect } from 'react';
import Script from 'next/script';

export default function ScriptsLoader() {
  useEffect(() => {
    // 토스페이먼츠 SDK 오류 처리를 위한 이벤트 리스너
    const handleError = (event: ErrorEvent) => {
      if (event.filename && event.filename.includes('tosspayments')) {
        console.error('토스페이먼츠 SDK 로드 실패:', event.error || event.message);
      }
    };

    // 네트워크 상태 관련 이벤트 리스너
    const handleOnline = () => {
      console.log('네트워크 연결이 복원되었습니다.');
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
    window.addEventListener('error', handleError);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // 전역 함수 정의
    window.__tossNetworkErrorHandler = function(isOnline: boolean) {
      const event = new CustomEvent('toss-network-status', {
        detail: { isOnline: isOnline }
      });
      window.dispatchEvent(event);
    };

    // 클린업
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      delete window.__tossNetworkErrorHandler;
    };
  }, []);

  return (
    <>
      {/* 토스페이먼츠 SDK 로드 */}
      <Script
        src="https://js.tosspayments.com/v1"
        strategy="afterInteractive"
        onError={(e) => {
          console.error('토스페이먼츠 SDK 로드 실패:', e);
        }}
      />
    </>
  );
}

// 타입스크립트 전역 정의 추가
declare global {
  interface Window {
    __tossNetworkErrorHandler?: (isOnline: boolean) => void;
  }
} 