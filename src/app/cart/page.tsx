'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import PageLayout from '@/components/PageLayout';
import { updateQuantity, removeItem, getCartItems, calculateTotal } from '@/data/cartUtils';
import { processPayment } from '@/data/paymentUtils';
import { CartItem } from '@/data/types';

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // 로컬 스토리지에서 장바구니 상태 가져오기
    setCartItems(getCartItems());
  }, []);
  
  // 수량 변경 핸들러
  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    const updatedCart = updateQuantity(itemId, newQuantity);
    setCartItems(updatedCart);
  };
  
  // 상품 삭제 핸들러
  const handleRemoveItem = (itemId: string) => {
    const updatedCart = removeItem(itemId);
    setCartItems(updatedCart);
  };
  
  // 총 주문 금액 계산
  const totalAmount = calculateTotal(cartItems);
  
  // 결제 처리
  const handlePayment = async () => {
    if (cartItems.length === 0) {
      alert('장바구니가 비어있습니다.');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // 네트워크 연결 상태 확인
      if (!navigator.onLine) {
        throw new Error('인터넷 연결이 끊어져 있습니다. 네트워크 연결을 확인하고 다시 시도해주세요.');
      }
      
      // 브라우저 환경 정보 로깅
      console.log('결제 환경 정보:');
      console.log('- 브라우저:', navigator.userAgent);
      console.log('- 화면 크기:', window.innerWidth, 'x', window.innerHeight);
      console.log('- 도메인:', window.location.origin);
      console.log('- 현재 경로:', window.location.pathname);
      console.log('- 네트워크 상태:', navigator.onLine ? '연결됨' : '연결 안됨');
      
      try {
        await processPayment(cartItems, totalAmount);
      } catch (error) {
        // processPayment에서 발생한 오류 처리
        if (error instanceof Error) {
          // 사용자 취소인 경우 오류로 처리하지 않음
          if (error.message.includes('USER_CANCEL') || 
              error.message.includes('결제가 취소되었습니다') || 
              error.message.includes('사용자가 결제를 취소했습니다')) {
            console.log('사용자가 결제를 취소했습니다.');
            return; // 취소 시 함수 종료
          }
          throw error; // 취소가 아닌 다른 오류는 다시 throw
        }
        throw error;
      }
    } catch (error) {
      console.error('결제 요청 실패:', error);
      
      // 오류 메시지 상세 표시
      let errorMessage = '결제 처리 중 오류가 발생했습니다.';
      
      if (error instanceof Error) {
        // 사용자 취소 처리 - 여기서도 한 번 더 체크
        if (error.message.includes('USER_CANCEL') || 
            error.message.includes('결제가 취소되었습니다') || 
            error.message.includes('사용자가 결제를 취소했습니다')) {
          console.log('사용자가 결제를 취소했습니다.');
          return; // 사용자가 취소한 경우 오류 메시지 표시하지 않음
        }
      
        // 네트워크 관련 오류 특별 처리
        if (error.message.includes('NETWORK_ERROR') || 
            error.message.includes('네트워크') || 
            error.message.includes('인터넷') ||
            !navigator.onLine) {
          errorMessage = '네트워크 연결 오류가 발생했습니다. 인터넷 연결을 확인하고 다시 시도해주세요.';
        } else if (error.message) {
          errorMessage += `\n\n${error.message}`;
        }
        
        alert(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageLayout title="장바구니" activeTab="cart">
      {cartItems.length > 0 ? (
        <>
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={80}
                  height={80}
                  className="cart-item-image"
                />
                <div className="cart-item-details">
                  <h3 className="cart-item-name">{item.name}</h3>
                  <p className="cart-item-price">{item.price.toLocaleString()}원</p>
                  <div className="quantity-control">
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      className="quantity-btn"
                    >
                      <i className="fas fa-minus"></i>
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      className="quantity-btn"
                    >
                      <i className="fas fa-plus"></i>
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="remove-btn"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <div className="total-amount" style={{marginBottom:'10px', marginLeft:'10px'}}>
              <span>총 주문금액</span>
              <span>{totalAmount.toLocaleString()}원</span>
            </div>
            <button onClick={handlePayment} className="checkout-btn">
              {isLoading ? '결제 처리 중...' : '결제하기'}
            </button>
          </div>
        </>
      ) : (
        <div className="empty-state">
          <i className="fas fa-shopping-cart fa-3x"></i>
          <p className="empty-message">장바구니가 비어있습니다</p>
        </div>
      )}
    </PageLayout>
  );
} 