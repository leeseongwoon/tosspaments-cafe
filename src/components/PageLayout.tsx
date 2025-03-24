'use client';

import { ReactNode, useEffect } from 'react';
import NavBar from './NavBar';
import TabBar from './TabBar';
import { clearCart } from '@/data/cartUtils';

interface PageLayoutProps {
  title: string;
  children: ReactNode;
  activeTab?: 'home' | 'menu' | 'cart';
}

export default function PageLayout({ title, children, activeTab }: PageLayoutProps) {
  useEffect(() => {
    const handleBeforeUnload = () => {
      clearCart();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // 브라우저 창 타이틀 업데이트
  useEffect(() => {
    // 홈과 메뉴 페이지일 경우 페이지 이름 추가
    let pageTitle = 'tosspaments cafe';
    if (activeTab === 'home') {
      pageTitle = 'tosspaments cafe - home';
    } else if (activeTab === 'menu') {
      pageTitle = 'tosspaments cafe - menu';
    } else if (activeTab === 'cart') {
      pageTitle = 'tosspaments cafe - cart';
    } else if (title && title !== 'tosspaments cafe') {
      pageTitle = `tosspaments cafe - ${title}`;
    }
    
    document.title = pageTitle;
    
    return () => {
      document.title = 'tosspaments cafe';
    };
  }, [title, activeTab]);

  return (
    <>
      <NavBar title={title}/>
      <div className="content">
        {children}
      </div>
      <TabBar activeTab={activeTab} />
    </>
  );
} 