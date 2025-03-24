import { CartItem, MenuItem } from './types';

// 장바구니에서 아이템 가져오기
export const getCartItems = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  
  const storedCart = localStorage.getItem('cartItems');
  return storedCart ? JSON.parse(storedCart) : [];
};

// 장바구니에 메뉴 추가
export const addToCart = (item: MenuItem): void => {
  // 로컬 스토리지에서 장바구니 가져오기
  const cartItems = getCartItems();
  
  // 이미 있는 아이템인지 확인
  const existingItemIndex = cartItems.findIndex((cartItem: CartItem) => cartItem.id === item.id);
  
  if (existingItemIndex > -1) {
    // 이미 있는 아이템이면 수량 증가
    cartItems[existingItemIndex].quantity += 1;
  } else {
    // 새 아이템이면 추가
    cartItems.push({
      ...item,
      quantity: 1
    });
  }
  
  // 장바구니 상태 업데이트
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
};

// 수량 변경
export const updateQuantity = (itemId: string, newQuantity: number): CartItem[] => {
  if (newQuantity < 1) return getCartItems();
  
  const cartItems = getCartItems();
  const updatedCart = cartItems.map(item => 
    item.id === itemId ? { ...item, quantity: newQuantity } : item
  );
  
  localStorage.setItem('cartItems', JSON.stringify(updatedCart));
  return updatedCart;
};

// 상품 삭제
export const removeItem = (itemId: string): CartItem[] => {
  const cartItems = getCartItems();
  const updatedCart = cartItems.filter(item => item.id !== itemId);
  
  localStorage.setItem('cartItems', JSON.stringify(updatedCart));
  return updatedCart;
};

// 총 주문 금액 계산
export const calculateTotal = (cartItems: CartItem[]): number => {
  return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}; 