import { MenuItem } from './types';

// 메뉴 데이터
export const menuItems: MenuItem[] = [
  {
    id: 'americano',
    name: '아메리카노',
    description: '깊고 진한 에스프레소에 물을 더해 깔끔한 맛의 커피',
    price: 4500,
    category: 'coffee',
    image: 'https://images.unsplash.com/photo-1550681560-af9bc1cb339e?q=80&w=200&auto=format'
  },
  {
    id: 'latte',
    name: '카페라떼',
    description: '에스프레소와 스팀 밀크가 어우러진 부드러운 커피',
    price: 5000,
    category: 'coffee',
    image: 'https://images.unsplash.com/photo-1529892485617-25f63cd7b1e9?q=80&w=200&auto=format'
  },
  {
    id: 'cappuccino',
    name: '카푸치노',
    description: '에스프레소에 스팀 밀크와 풍성한 우유 거품이 올라간 커피',
    price: 5000,
    category: 'coffee',
    image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?q=80&w=200&auto=format'
  },
  {
    id: 'greentea',
    name: '녹차',
    description: '향긋한 녹차를 우려낸 건강한 음료',
    price: 4500,
    category: 'tea',
    image: 'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?q=80&w=200&auto=format'
  },
  {
    id: 'chamomiletea',
    name: '캐모마일',
    description: '은은한 향의 허브티로 릴렉싱에 도움을 주는 차',
    price: 4500,
    category: 'tea',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=200&auto=format'
  },
  {
    id: 'cheesecake',
    name: '치즈케이크',
    description: '부드럽고 고소한 맛의 클래식 치즈케이크',
    price: 6500,
    category: 'dessert',
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&w=200&auto=format'
  },
  {
    id: 'chocolatecake',
    name: '초콜릿 케이크',
    description: '진한 초콜릿 풍미가 가득한 달콤한 케이크',
    price: 6500,
    category: 'dessert',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=200&auto=format'
  },
  {
    id: 'croissant',
    name: '크루아상',
    description: '바삭한 겉과 부드러운 속의 완벽한 프랑스식 빵',
    price: 4000,
    category: 'dessert',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=200&auto=format'
  }
]; 