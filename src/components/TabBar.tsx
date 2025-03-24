import Link from 'next/link';

interface TabBarProps {
  activeTab?: 'home' | 'menu' | 'cart';
}

export default function TabBar({ activeTab }: TabBarProps) {
  return (
    <div className="tab-bar">
      <Link href="/" className={`tab-item ${activeTab === 'home' ? 'active' : ''}`}>
        <div className="icon">
          <i className="fas fa-home"></i>
        </div>
        <div>홈</div>
      </Link>
      <Link href="/menu" className={`tab-item ${activeTab === 'menu' ? 'active' : ''}`}>
        <div className="icon">
          <i className="fas fa-utensils"></i>
        </div>
        <div>메뉴</div>
      </Link>
      <Link href="/cart" className={`tab-item ${activeTab === 'cart' ? 'active' : ''}`}>
        <div className="icon">
          <i className="fas fa-shopping-cart"></i>
        </div>
        <div>장바구니</div>
      </Link>
    </div>
  );
} 