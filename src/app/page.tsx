import Link from 'next/link';
import Image from 'next/image';
import PageLayout from '@/components/PageLayout';
import { featuredItems, promotions, infoItems } from '@/data/homeData';

export default function Home() {
  return (
    <PageLayout title="Tosspaments Cafe" activeTab="home">
      {/* 헤더 배너 */}
      <div className="home-banner">
        <div className="banner-content">
          <h2>맛있는 커피와<br />디저트를 만나보세요</h2>
          <p>토스 카페에서 준비한 다양한 메뉴</p>
          <Link href="/menu" className="banner-btn">
            주문하기 <i className="fas fa-arrow-right"></i>
          </Link>
        </div>
        <div className="banner-image">
          <i className="fas fa-coffee"></i>
        </div>
      </div>
      
      {/* 추천 메뉴 섹션 */}
      <div className="home-section">
        <div className="section-header">
          <h2>추천 메뉴</h2>
          <Link href="/menu" className="view-all">
            모두 보기 <i className="fas fa-angle-right"></i>
          </Link>
        </div>
        <div className="featured-items">
          {featuredItems.map(item => (
            <Link href={`/menu`} key={item.id} className="featured-item">
              <Image 
                src={item.image} 
                alt={item.name} 
                className="featured-image"
                width={130}
                height={100}
              />
              <div className="featured-info">
                <h3>{item.name}</h3>
                <p>{item.price.toLocaleString()}원</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      {/* 프로모션 섹션 */}
      <div className="home-section">
        {promotions.map(promo => (
          <div key={promo.id} className="promo-card">
            <div className="promo-content">
              <h3>{promo.title}</h3>
              <p>{promo.description.split('\n').map((line, i) => (
                <span key={i}>
                  {line}
                  {i < promo.description.split('\n').length - 1 && <br />}
                </span>
              ))}</p>
              <span className="promo-price">{promo.price.toLocaleString()}원</span>
            </div>
            <div className="promo-image">
              <i className={promo.icon}></i>
            </div>
          </div>
        ))}
      </div>
      
      {/* 매장 정보 */}
      <div className="home-section">
        <div className="info-box">
          {infoItems.map(item => (
            <div key={item.id} className="info-item">
              <i className={item.icon}></i>
              <div>
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* 여백 추가 */}
      <div style={{ height: '30px' }}></div>
    </PageLayout>
  );
}
