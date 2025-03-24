'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import PageLayout from '@/components/PageLayout';
import PaymentFailContent from './PaymentFailContent';

export default function PaymentFailPage() {
  return (
    <PageLayout title="결제 실패">
      <div className="empty-state" style={{ marginTop: '30px' }}>
        <div className="empty-icon" style={{ color: '#FF6B6B' }}>
          <i className="fas fa-times-circle fa-3x"></i>
        </div>
        <h2 style={{ marginBottom: '15px', color: '#FF6B6B' }}>결제에 실패했습니다</h2>
        
        <Suspense fallback={<p className="empty-text">오류 정보를 로딩 중입니다...</p>}>
          <PaymentFailContent />
        </Suspense>
        
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