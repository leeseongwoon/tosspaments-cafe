'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

interface PaymentError {
  code: string;
  message: string;
}

export default function PaymentFailContent() {
  const searchParams = useSearchParams();
  const [errorInfo, setErrorInfo] = useState<PaymentError | null>(null);

  useEffect(() => {
    // URL 파라미터에서 에러 정보 추출
    const code = searchParams.get('code');
    const message = searchParams.get('message');

    if (code && message) {
      setErrorInfo({
        code,
        message
      });
    }
  }, [searchParams]);

  if (!errorInfo) {
    return <p className="empty-text">오류 정보를 불러올 수 없습니다.</p>;
  }

  return (
    <div className="cart-summary">
      <div className="total-row">
        <span className="total-label">오류 코드</span>
        <span>{errorInfo.code}</span>
      </div>
      <div className="total-row">
        <span className="total-label">오류 메시지</span>
        <span>{errorInfo.message}</span>
      </div>
    </div>
  );
} 