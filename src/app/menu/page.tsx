"use client";

import { useState } from "react";
import Image from "next/image";
import PageLayout from "@/components/PageLayout";
import { menuItems } from "@/data/menuData";
import { addToCart } from "@/data/cartUtils";
import { MenuItem } from "@/data/types";

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [toast, setToast] = useState({ show: false, message: "" });

  // 장바구니에 메뉴 추가 및 토스트 표시
  const handleAddToCart = (item: MenuItem) => {
    addToCart(item);

    // 토스트 메시지 표시
    setToast({
      show: true,
      message: `${item.name}(이)가 장바구니에 추가되었습니다.`,
    });
    setTimeout(() => setToast({ show: false, message: "" }), 2000);
  };

  // 카테고리별 필터링
  const filteredMenuItems =
    selectedCategory === "all"
      ? menuItems
      : menuItems.filter((item) => item.category === selectedCategory);

  return (
    <PageLayout title="Menu" activeTab="menu">
      {/* 카테고리 필터 */}
      <div className="category-bar">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`category-btn ${
            selectedCategory === "all" ? "active" : ""
          }`}
        >
          ALL
        </button>
        <button
          onClick={() => setSelectedCategory("coffee")}
          className={`category-btn ${
            selectedCategory === "coffee" ? "active" : ""
          }`}
        >
          COFFEE
        </button>
        <button
          onClick={() => setSelectedCategory("tea")}
          className={`category-btn ${
            selectedCategory === "tea" ? "active" : ""
          }`}
        >
          TEA
        </button>
        <button
          onClick={() => setSelectedCategory("dessert")}
          className={`category-btn ${
            selectedCategory === "dessert" ? "active" : ""
          }`}
        >
          DESSERT
        </button>
      </div>

      {/* 메뉴 그리드 */}
      <div className="menu-grid">
        {filteredMenuItems.map((item) => (
          <div
            key={item.id}
            className="menu-item"
            onClick={() => handleAddToCart(item)}
          >
            <Image
              src={item.image}
              alt={item.name}
              className="menu-image"
              width={200}
              height={150}
            />
            <div className="menu-info">
              <h3 className="menu-title">{item.name}</h3>
              <p className="menu-description">{item.description}</p>
              <p className="menu-price">{item.price.toLocaleString()}원</p>
              <button className="add-btn">장바구니에 추가</button>
            </div>
          </div>
        ))}
      </div>

      {/* 토스트 메시지 */}
      {toast.show && (
        <div className="toast-message">
          <i className="fas fa-check-circle"></i>
          <span>{toast.message}</span>
        </div>
      )}
    </PageLayout>
  );
}
