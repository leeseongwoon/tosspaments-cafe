// 메뉴 타입 정의
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'coffee' | 'tea' | 'dessert';
  image: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

// 홈 페이지 타입 정의
export interface FeaturedItem {
  id: string;
  name: string;
  price: number;
  image: string;
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  price: number;
  icon: string;
}

export interface InfoItem {
  id: string;
  title: string;
  description: string;
  icon: string;
} 