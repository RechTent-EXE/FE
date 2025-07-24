"use client";

import { useState } from "react";
import { useCart } from "@/hooks/useCart";

// Components
import CartHeader from "@/components/cart/CartHeader";
import CartItem from "@/components/cart/CartItem";
import PromoCodeSection from "@/components/cart/PromoCodeSection";
import OrderSummary from "@/components/cart/OrderSummary";
import EmptyCart from "@/components/cart/EmptyCart";
import ShippingInformation from "@/components/cart/ShippingInformation";

export default function CartPage() {
  const [promoDiscount, setPromoDiscount] = useState(0);

  // Hooks
  const {
    cartItems,
    cartId,
    isLoading,
    error,
    updateQuantity,
    updateDates,
    removeFromCart,
    calculateItemTotal,
    calculateRentalDays,
    calculateSubtotal,
    calculateDeposit,
    getBrandName,
    getCartCount,
  } = useCart();

  // Debug: Log cartId to console
  console.log("Cart ID:", cartId);

  // Calculate totals
  const subtotal = calculateSubtotal();
  const discount = (subtotal * promoDiscount) / 100;
  const deposit = calculateDeposit();
  const total = subtotal - discount + deposit;
  const hasUnavailableItems = cartItems.some((item) => !item.isAvailable);

  // Promo code handler
  const handleApplyPromo = async (promoCode: string) => {
    try {
      // Mock promo code validation - replace with real API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (promoCode.toLowerCase() === "rechtent10") {
        setPromoDiscount(10);
        alert("Áp dụng mã giảm giá thành công! Giảm 10%");
      } else if (promoCode.toLowerCase() === "newuser20") {
        setPromoDiscount(20);
        alert("Áp dụng mã giảm giá thành công! Giảm 20%");
      } else {
        alert("Mã giảm giá không hợp lệ");
      }
    } catch (error) {
      console.error("Error applying promo code:", error);
      alert("Có lỗi xảy ra khi áp dụng mã giảm giá");
    }
  };

  // Update quantity handler with debug
  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    try {
      await updateQuantity(itemId, newQuantity);
    } catch (error) {
      console.error("Error updating quantity:", error);
      alert("Có lỗi xảy ra khi cập nhật số lượng");
    }
  };

  // Update dates handler with debug
  const handleUpdateDates = async (
    itemId: string,
    startDate: string,
    endDate: string
  ) => {
    try {
      await updateDates(itemId, startDate, endDate);
    } catch (error) {
      console.error("Error updating dates:", error);
      alert("Có lỗi xảy ra khi cập nhật thời gian thuê");
    }
  };

  // Remove item handler with debug
  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeFromCart(itemId);
    } catch (error) {
      console.error("Error removing item:", error);
      alert("Có lỗi xảy ra khi xóa sản phẩm");
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pt-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải giỏ hàng...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pt-20">
        <div className="text-center">
          <div className="text-red-500 mb-4">Có lỗi xảy ra: {error}</div>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pt-20 pb-16 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <CartHeader itemCount={getCartCount()} />

          {cartItems.length === 0 ? (
            /* Empty Cart */
            <EmptyCart />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-6">
                {cartItems.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onUpdateQuantity={handleUpdateQuantity}
                    onUpdateDates={handleUpdateDates}
                    onRemoveItem={handleRemoveItem}
                    getBrandName={getBrandName}
                    calculateItemTotal={calculateItemTotal}
                    calculateRentalDays={calculateRentalDays}
                  />
                ))}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Promo Code */}
                <PromoCodeSection
                  onApplyPromo={handleApplyPromo}
                  promoDiscount={promoDiscount}
                />

                {/* Shipping Information */}
                <ShippingInformation />

                {/* Order Summary */}
                <OrderSummary
                  itemCount={getCartCount()}
                  subtotal={subtotal}
                  discount={discount}
                  promoDiscount={promoDiscount}
                  deposit={deposit}
                  total={total}
                  hasUnavailableItems={hasUnavailableItems}
                  cartItems={cartItems}
                  cartId={cartId}
                  calculateItemTotal={calculateItemTotal}
                  calculateRentalDays={calculateRentalDays}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
