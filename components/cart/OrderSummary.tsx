"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Shield, CreditCard, Truck, CheckCircle, Loader2 } from "lucide-react";
import { CartItem } from "@/hooks/useCart";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import paymentService from "@/services/paymentService";
import { OrderData, OrderItem } from "@/types/payment";

interface OrderSummaryProps {
  itemCount: number;
  subtotal: number;
  discount: number;
  deposit: number;
  total: number;
  hasUnavailableItems: boolean;
  cartItems: CartItem[]; // For detailed breakdown
  cartId: string | null; // Cart ID for order creation
  calculateItemTotal: (item: CartItem) => number;
  calculateRentalDays: (startDate: string, endDate: string) => number;
}

export default function OrderSummary({
  itemCount,
  subtotal,
  discount,
  deposit,
  total,
  hasUnavailableItems,
  cartItems,
  cartId,
  calculateItemTotal,
  calculateRentalDays,
}: OrderSummaryProps) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { profile } = useProfile();

  // Payment state
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const proceedToPayment = async () => {
    if (hasUnavailableItems) {
      alert(
        "Một số sản phẩm trong giỏ hàng hiện không có sẵn. Vui lòng xóa hoặc thay thế."
      );
      return;
    }

    // Check if user is authenticated
    if (!isAuthenticated || !user) {
      alert("Vui lòng đăng nhập để tiếp tục thanh toán.");
      router.push("/auth/login");
      return;
    }

    // Check if cartId is available
    if (!cartId) {
      alert("Không tìm thấy giỏ hàng. Vui lòng thử lại.");
      return;
    }

    // Check if shipping information is complete
    const hasCompleteInfo =
      profile?.fullname && profile?.phone && profile?.address;
    if (!hasCompleteInfo) {
      alert(
        "Vui lòng cập nhật đầy đủ thông tin giao hàng trong trang profile trước khi thanh toán."
      );
      router.push("/profile");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const orderResponse = await paymentService.createOrder({
        userId: user.id,
        cartId: cartId,
        discount: discount, // Amount discounted
        total: total, // Final total after discount applied (should be 6550)
        subtotal: subtotal, // Original subtotal before discount (should be 7000)
        deposit: deposit, // Deposit amount (should be 600)
      });

      // Validate orderId exists
      if (!orderResponse.orderId) {
        throw new Error("Không nhận được mã đơn hàng từ server");
      }

      const orderId = orderResponse.orderId;
      const backendTotal = orderResponse.total;

      // Prepare order data for payment
      const orderItems: OrderItem[] = cartItems.map((item) => ({
        productId: item.productId,
        productName:
          item.name || item.productDetail?.name || `Sản phẩm ${item.productId}`,
        quantity: item.quantity,
        singleDayPrice: item.singleDayPrice || 0,
        actualPrice: item.actualPrice || 0,
        startDate: item.startDate,
        endDate: item.endDate,
        totalPrice:
          (item.singleDayPrice || 0) *
          calculateRentalDays(item.startDate, item.endDate) *
          item.quantity,
        depositAmount: (item.actualPrice || 0) * 0.3 * item.quantity,
      }));

      const orderData: OrderData = {
        userId: user.id,
        cartItems: orderItems,
        subtotal,
        discount,
        deposit,
        total: backendTotal, // Use backend total (already includes discount)
        shippingInfo: {
          fullname: profile.fullname || "",
          phone: profile.phone || "",
          address: profile.address || "",
        },
        paymentMethod: "credit_card",
        paymentType: "final",
      };

      // Validate order data
      const validation = paymentService.validatePaymentData(orderData);
      if (!validation.isValid) {
        setError(validation.error || "Dữ liệu đơn hàng không hợp lệ");
        return;
      }

      const paymentData = paymentService.preparePaymentData(
        orderData,
        orderId,
        total // Use frontend total (with discount applied) for payment amount
      );

      // Create payment
      const paymentResponse = await paymentService.createPayment(paymentData);

      // Store cartId in localStorage temporarily for success callback
      // Will be cleared only if payment is successful
      if (typeof window !== "undefined") {
        localStorage.setItem("pendingCartId", cartId);
      }

      // Redirect to PayOS
      paymentService.redirectToPayOS(paymentResponse.payosUrl);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Có lỗi xảy ra khi xử lý thanh toán"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Order Summary */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">
          Tóm tắt đơn hàng
        </h3>

        <div className="space-y-4">
          {/* Detailed breakdown for each item */}
          <div className="space-y-3">
            {cartItems.map((item, index) => {
              const itemTotal = calculateItemTotal(item);
              const itemDeposit = (item.actualPrice || 0) * 0.3 * item.quantity;
              const rentalDays = calculateRentalDays(
                item.startDate,
                item.endDate
              );

              return (
                <div
                  key={item.id}
                  className="border-b border-gray-100 pb-3 last:border-b-0"
                >
                  <div className="text-sm font-medium text-gray-900 mb-1">
                    {item.name ||
                      item.productDetail?.name ||
                      `Sản phẩm ${index + 1}`}{" "}
                    (x{item.quantity})
                  </div>
                  <div className="space-y-1 text-xs text-gray-600">
                    <div className="flex justify-between">
                      <span>
                        {(item.singleDayPrice || 0).toLocaleString()}đ/ngày ×{" "}
                        {rentalDays} ngày × {item.quantity}
                      </span>
                      <span>{itemTotal.toLocaleString()}đ</span>
                    </div>
                    <div className="flex justify-between text-orange-600">
                      <span>Tiền cọc (30%)</span>
                      <span>{itemDeposit.toLocaleString()}đ</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Tổng tiền thuê ({itemCount} sản phẩm)</span>
              <span>{subtotal.toLocaleString()}đ</span>
            </div>

            <div className="flex justify-between text-orange-600 font-medium">
              <span>Tổng tiền cọc</span>
              <span>{deposit.toLocaleString()}đ</span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Giảm giá theo thời gian thuê</span>
                <span>-{discount.toLocaleString()}đ</span>
              </div>
            )}

            <div className="border-t pt-2">
              <div className="flex justify-between text-lg font-bold text-gray-900">
                <span>Tổng thanh toán</span>
                <span className="text-blue-600">{total.toLocaleString()}đ</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Info */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <h4 className="font-medium text-blue-900 mb-2">Thanh toán toàn bộ</h4>
          <p className="text-sm text-blue-800">
            Bạn sẽ thanh toán {total.toLocaleString()}đ bao gồm tiền thuê và
            tiền cọc ngay bây giờ.
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* Security Info */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex items-start gap-3">
            <Shield size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Chính sách bảo mật</p>
              <p>
                Tiền cọc sẽ được hoàn trả khi bạn trả thiết bị trong tình trạng
                tốt.
              </p>
            </div>
          </div>
        </div>

        {/* Checkout Button */}
        <button
          onClick={proceedToPayment}
          disabled={
            itemCount === 0 ||
            hasUnavailableItems ||
            !isAuthenticated ||
            !(profile?.fullname && profile?.phone && profile?.address) ||
            isProcessing
          }
          className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 text-white py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Đang xử lý...
            </>
          ) : (
            <>
              <CreditCard size={20} />
              Thanh toán {total.toLocaleString()}đ
            </>
          )}
        </button>

        {/* Shipping Info */}
        <div className="mt-4 flex items-center gap-2 text-sm text-gray-600 justify-center">
          <Truck size={16} />
          <span>Miễn phí giao hàng trong nội thành</span>
        </div>
      </div>

      {/* Benefits */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
        <h4 className="font-bold text-gray-900 mb-4">
          Ưu đãi khi thuê tại RechTent
        </h4>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-center gap-2">
            <CheckCircle size={16} className="text-green-600" />
            Bảo hành toàn diện trong thời gian thuê
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle size={16} className="text-green-600" />
            Hỗ trợ kỹ thuật 24/7
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle size={16} className="text-green-600" />
            Giao hàng nhanh trong 2 giờ
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle size={16} className="text-green-600" />
            Đổi trả miễn phí nếu có lỗi
          </li>
        </ul>
      </div>
    </div>
  );
}
