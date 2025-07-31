"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { Shield } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, calculateDiscountedSubtotal, calculateDeposit } =
    useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  const { subtotal, discountedSubtotal } = calculateDiscountedSubtotal();
  const deposit = calculateDeposit();
  const total = discountedSubtotal + deposit;

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      // Mock payment logic - replace with real PayOS integration
      console.log("Processing payment...");

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Redirect to success page
      router.push("/payment/success");
    } catch (error) {
      console.error("Payment error:", error);
      router.push("/payment/cancel");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pt-20 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Thanh toán</h1>

          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Tóm tắt đơn hàng
            </h3>

            {/* Order Items */}
            <div className="space-y-3 mb-6">
              {cartItems.map((item, index) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {item.name || `Sản phẩm ${index + 1}`} (x{item.quantity})
                  </span>
                  <span className="font-medium">
                    {(
                      (item.singleDayPrice || 0) * item.quantity
                    ).toLocaleString()}
                    đ
                  </span>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="space-y-2 pt-4 border-t">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tổng tiền thuê</span>
                <span>{subtotal.toLocaleString()}đ</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tiền cọc</span>
                <span>{deposit.toLocaleString()}đ</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Tổng thanh toán</span>
                <span className="text-blue-600">{total.toLocaleString()}đ</span>
              </div>
            </div>

            {/* Payment Button */}
            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 text-white py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  Đang xử lý...
                </>
              ) : (
                <>
                  <Shield size={20} />
                  Thanh toán ngay
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
