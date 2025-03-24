import { FeaturedItem, Promotion, InfoItem } from './types';

// 추천 메뉴 데이터
export const featuredItems: FeaturedItem[] = [
  {
    id: 'americano',
    name: '아메리카노',
    price: 4500,
    image: 'https://images.unsplash.com/photo-1550681560-af9bc1cb339e?q=80&w=200&auto=format'
  },
  {
    id: 'latte',
    name: '카페라떼',
    price: 5000,
    image: 'https://images.unsplash.com/photo-1529892485617-25f63cd7b1e9?q=80&w=200&auto=format'
  },
  {
    id: 'chocolatecake',
    name: '초콜릿 케이크',
    price: 6500,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=200&auto=format'
  },
  {
    id: 'croissant',
    name: '크루아상',
    price: 4000,
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=200&auto=format'
  }
];

// 프로모션 데이터
export const promotions: Promotion[] = [
  {
    id: 'blueberry-smoothie',
    title: '신메뉴 출시 🎉',
    description: '시즌 한정 블루베리 스무디\n지금 주문하세요!',
    price: 4800,
    icon: 'fas fa-glass-cheers'
  }
];

// 매장 정보 데이터
export const infoItems: InfoItem[] = [
  {
    id: 'hours',
    title: '영업시간',
    description: '매일 07:00 - 21:00',
    icon: 'fas fa-clock'
  },
  {
    id: 'location',
    title: '위치',
    description: '서울시 강남구 테헤란로',
    icon: 'fas fa-map-marker-alt'
  },
  {
    id: 'contact',
    title: '연락처',
    description: '02-123-4567',
    icon: 'fas fa-phone'
  }
]; 