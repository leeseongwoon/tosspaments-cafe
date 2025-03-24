import { nanoid } from 'nanoid';
import { CartItem } from './types';

// 토스페이먼츠 SDK 타입 정의
interface TossPaymentsInstance {
  requestPayment: (
    method: string,
    options: {
      amount: number;
      orderId: string;
      orderName: string;
      customerName: string;
      successUrl: string;
      failUrl: string;
      flowMode?: string;
      easyPay?: string;
    }
  ) => Promise<void>;
}

interface TossPaymentsConstructor {
  (clientKey: string): TossPaymentsInstance;
}

// Window 인터페이스 확장
declare global {
  interface Window {
    TossPayments?: TossPaymentsConstructor;
    __tossNetworkErrorHandler?: (isOnline: boolean) => void;
  }
}

// Toss Payments API 키
const TOSS_PAYMENTS_CLIENT_KEY = 'test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq';

// 모바일 여부 확인
const isMobile = (): boolean => {
  if (typeof window === 'undefined') return false;
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth <= 480;
};

// 네트워크 상태 확인
const checkNetworkStatus = (): boolean => {
  if (typeof navigator !== 'undefined') {
    return navigator.onLine;
  }
  return true; // SSR 환경에서는 기본적으로 true 반환
};

// 토스페이먼츠 SDK 존재 여부 체크
const checkTossPaymentsSDK = (): boolean => {
  return typeof window !== 'undefined' && 
         typeof window.TossPayments !== 'undefined';
};

// 토스페이먼츠 SDK 직접 로드 함수
const loadTossPaymentsSDK = (): Promise<TossPaymentsConstructor> => {
  return new Promise((resolve, reject) => {
    if (checkTossPaymentsSDK() && window.TossPayments) {
      // 이미 로드된 경우
      resolve(window.TossPayments);
      return;
    }

    // 동적으로 스크립트 로드
    const script = document.createElement('script');
    script.src = 'https://js.tosspayments.com/v1';
    script.async = true;
    
    script.onload = () => {
      if (checkTossPaymentsSDK() && window.TossPayments) {
        resolve(window.TossPayments);
      } else {
        reject(new Error('TossPayments SDK 로드 후에도 객체를 찾을 수 없습니다.'));
      }
    };
    
    script.onerror = () => {
      reject(new Error('TossPayments SDK 로드 실패'));
    };
    
    document.head.appendChild(script);
    
    // 타임아웃 설정
    setTimeout(() => {
      if (!checkTossPaymentsSDK()) {
        reject(new Error('TossPayments SDK 로드 시간 초과'));
      }
    }, 10000);
  });
};

// 결제 진행 함수 - 주 로직
const executePayment = async (cartItems: CartItem[], totalAmount: number): Promise<void> => {
  if (!window.TossPayments) {
    throw new Error('토스페이먼츠 SDK를 찾을 수 없습니다.');
  }
  
  const tossPayments = window.TossPayments(TOSS_PAYMENTS_CLIENT_KEY);
  
  // 주문 상품명 생성 (첫 상품 + 나머지 개수)
  const orderName = cartItems.length > 1 
    ? `${cartItems[0].name} 외 ${cartItems.length - 1}건` 
    : cartItems[0].name;
  
  console.log('결제 요청 준비 완료, 결제창 오픈 시도...');
  
  // 결제 요청 (디바이스에 맞는 설정 적용)
  await tossPayments.requestPayment('카드', {
    amount: totalAmount,
    orderId: nanoid(),
    orderName: orderName,
    customerName: '고객',
    successUrl: `${window.location.origin}/payment/success`,
    failUrl: `${window.location.origin}/payment/fail`,
    flowMode: isMobile() ? 'DIRECT' : 'POPUP', // 모바일에서는 직접 호출, 데스크톱에서는 팝업
    easyPay: isMobile() ? 'TOSSPAY' : undefined, // 모바일에서 토스페이 우선 노출
  });
};

// 네트워크 연결 대기 함수
const waitForNetworkConnection = (timeout = 10000): Promise<void> => {
  return new Promise((resolve, reject) => {
    // 이미 연결되어 있으면 바로 해결
    if (navigator.onLine) {
      resolve();
      return;
    }
    
    // 연결 이벤트 리스너
    const onlineHandler = () => {
      window.removeEventListener('online', onlineHandler);
      clearTimeout(timeoutId);
      resolve();
    };
    
    // 이벤트 리스너 설정
    window.addEventListener('online', onlineHandler);
    
    // 타임아웃 설정
    const timeoutId = setTimeout(() => {
      window.removeEventListener('online', onlineHandler);
      reject(new Error('네트워크 연결 대기 시간 초과'));
    }, timeout);
  });
};

// 결제 처리 (메인 함수)
export const processPayment = async (cartItems: CartItem[], totalAmount: number): Promise<void> => {
  if (cartItems.length === 0) {
    throw new Error('장바구니가 비어있습니다.');
  }
  
  // 네트워크 연결 확인
  if (!checkNetworkStatus()) {
    try {
      console.log('네트워크 연결 대기 중...');
      await waitForNetworkConnection();
    } catch (_) {
      throw new Error('네트워크 연결이 없습니다. 인터넷 연결을 확인해주세요.');
    }
  }
  
  // 최대 시도 횟수
  const MAX_RETRIES = 3;
  let retryCount = 0;
  let lastError: Error | null = null;
  
  while (retryCount < MAX_RETRIES) {
    try {
      // 직접 스크립트 로드 방식만 사용
      if (!checkTossPaymentsSDK()) {
        console.log(`토스페이먼츠 SDK 로드 시도 중... (시도 ${retryCount + 1}/${MAX_RETRIES})`);
        await loadTossPaymentsSDK();
      }
      
      // 결제 진행
      await executePayment(cartItems, totalAmount);
      return; // 성공하면 함수 종료
      
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.error(`결제 요청 실패 (시도 ${retryCount + 1}/${MAX_RETRIES}):`, error);
      
      // 사용자 취소는 재시도하지 않음
      if (error instanceof Error && 
          (error.message.includes('USER_CANCEL') || error.message.includes('결제가 취소되었습니다'))) {
        console.log('사용자가 결제를 취소했습니다.');
        return; // 오류를 발생시키지 않고 정상 종료
      }
      
      // 네트워크 오류면 잠시 대기 후 재시도
      if (error instanceof Error && 
          (error.message.includes('NETWORK_ERROR') || !checkNetworkStatus())) {
        console.log('네트워크 오류 발생, 재연결 대기 중...');
        try {
          await new Promise(resolve => setTimeout(resolve, 2000)); // 2초 대기
          await waitForNetworkConnection(5000); // 네트워크 연결 대기
        } catch (_) {
          // 네트워크 연결 대기 실패시 마지막 시도면 오류 발생
          if (retryCount === MAX_RETRIES - 1) {
            throw new Error('네트워크 연결 오류가 발생했습니다. 인터넷 연결을 확인하고 다시 시도해주세요.');
          }
        }
      }
      
      retryCount++;
      
      // 마지막 시도가 아니면 잠시 대기 후 재시도
      if (retryCount < MAX_RETRIES) {
        const waitTime = 1000 * retryCount; // 점점 대기 시간 증가
        console.log(`${waitTime/1000}초 후 재시도합니다...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }
  
  // 모든 시도 실패 후 적절한 오류 메시지 생성
  if (lastError) {
    // 빈 오류 객체 처리
    if (lastError.message === '{}' || lastError.message === '[object Object]' || !lastError.message) {
      throw new Error('토스페이먼츠 서비스 연결 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }
    
    // 네트워크 관련 오류
    if (lastError.message.includes('NETWORK_ERROR') || !checkNetworkStatus()) {
      throw new Error('네트워크 연결 오류가 발생했습니다. 인터넷 연결을 확인하고 다시 시도해주세요.');
    }
    
    throw lastError;
  }
  
  // 마지막 에러가 없는 경우 (거의 발생하지 않음)
  throw new Error('결제 처리 중 알 수 없는 오류가 발생했습니다.');
}; 