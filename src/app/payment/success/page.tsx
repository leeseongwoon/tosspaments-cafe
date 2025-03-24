'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import PageLayout from '@/components/PageLayout';

interface PaymentInfo {
  paymentKey: string;
  orderId: string;
  amount: string;
}

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);

  useEffect(() => {
    // URL 파라미터에서 결제 정보 추출
    const paymentKey = searchParams.get('paymentKey');
    const orderId = searchParams.get('orderId');
    const amount = searchParams.get('amount');

    if (paymentKey && orderId && amount) {
      setPaymentInfo({
        paymentKey,
        orderId,
        amount: parseInt(amount, 10).toLocaleString(),
      });
    }
  }, [searchParams]);

  return (
    <PageLayout title="결제 완료">
      <div className="empty-state" style={{ marginTop: '30px' }}>
        <div className="empty-icon" style={{ color: '#4BB543' }}>
          <i className="fas fa-check-circle fa-3x"></i>
        </div>
        <h2 style={{ marginBottom: '15px', color: '#4BB543' }}>결제가 완료되었습니다</h2>
        
        {paymentInfo ? (
          <div className="cart-summary">
            <div className="total-row">
              <span className="total-label">주문 번호</span>
              <span>{paymentInfo.orderId}</span>
            </div>
            <div className="total-row">
              <span className="total-label">결제 금액</span>
              <span>{paymentInfo.amount}원</span>
            </div>
          </div>
        ) : (
          <p className="empty-text">결제 정보를 로딩 중입니다...</p>
        )}
        
        <Link href="/" className="action-btn" style={{ marginTop: '20px' }}>
          홈으로 돌아가기
        </Link>
      </div>
    </PageLayout>
  );
} 