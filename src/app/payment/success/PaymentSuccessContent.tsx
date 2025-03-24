'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { clearCart } from '@/data/cartUtils';

interface PaymentInfo {
  paymentKey: string;
  orderId: string;
  amount: string;
}

export default function PaymentSuccessContent() {
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
      
      // 결제 성공 시 장바구니 초기화
      clearCart();
    }
  }, [searchParams]);

  if (!paymentInfo) {
    return <p className="empty-text">결제 정보를 불러올 수 없습니다.</p>;
  }

  return (
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
  );
} 