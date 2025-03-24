'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import PageLayout from '@/components/PageLayout';

interface PaymentError {
  code: string;
  message: string;
}

export default function PaymentFailPage() {
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

  return (
    <PageLayout title="결제 실패">
      <div className="empty-state" style={{ marginTop: '30px' }}>
        <div className="empty-icon" style={{ color: '#FF6B6B' }}>
          <i className="fas fa-times-circle fa-3x"></i>
        </div>
        <h2 style={{ marginBottom: '15px', color: '#FF6B6B' }}>결제에 실패했습니다</h2>
        
        {errorInfo ? (
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
        ) : (
          <p className="empty-text">오류 정보를 로딩 중입니다...</p>
        )}
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
          <Link href="/cart" className="action-btn">
            장바구니로 돌아가기
          </Link>
          <Link href="/" className="action-btn" style={{ backgroundColor: '#f0f0f0', color: '#333' }}>
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </PageLayout>
  );
} 