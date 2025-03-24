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