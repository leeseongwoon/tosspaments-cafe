'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import PageLayout from '@/components/PageLayout';
import PaymentSuccessContent from './PaymentSuccessContent';

export default function PaymentSuccessPage() {
  return (
    <PageLayout title="결제 완료">
      <div className="empty-state" style={{ marginTop: '30px' }}>
        <div className="empty-icon" style={{ color: '#4BB543' }}>
          <i className="fas fa-check-circle fa-3x"></i>
        </div>
        <h2 style={{ marginBottom: '15px', color: '#4BB543' }}>결제가 완료되었습니다</h2>
        
        <Suspense fallback={<p className="empty-text">결제 정보를 로딩 중입니다...</p>}>
          <PaymentSuccessContent />
        </Suspense>
        
        <Link href="/" className="action-btn" style={{ marginTop: '20px' }}>
          홈으로 돌아가기
        </Link>
      </div>
    </PageLayout>
  );
} 