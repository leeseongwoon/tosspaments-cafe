import { ReactNode } from 'react';
import NavBar from './NavBar';
import TabBar from './TabBar';

interface PageLayoutProps {
  title: string;
  children: ReactNode;
  activeTab?: 'home' | 'menu' | 'cart';
}

export default function PageLayout({ title, children, activeTab }: PageLayoutProps) {
  return (
    <>
      <NavBar title={title} />
      <div className="content">
        {children}
      </div>
      <TabBar activeTab={activeTab} />
    </>
  );
} 