"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, ArrowRight, ShoppingBag } from "lucide-react";
import Link from "next/link";
import paymentService from "@/services/paymentService";
import { useCart } from "@/hooks/useCart";

interface PaymentInfo {
  code?: string;
  id?: string;
  cancel?: string;
  status?: string;
  orderCode?: string;
  amount?: string;
  description?: string;
  accountNumber?: string;
  reference?: string;
  transactionDateTime?: string;
  currency?: string;
  paymentLinkId?: string;
}

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const { reloadCart } = useCart();
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<{
    success?: boolean;
    error?: string;
    message?: string;
  } | null>(null);

  useEffect(() => {
    // Log all PayOS callback parameters
    const allParams: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      allParams[key] = value;
    });

    // Extract common PayOS return parameters
    const payosData: PaymentInfo = {
      code: searchParams.get("code") || undefined,
      id: searchParams.get("id") || undefined,
      cancel: searchParams.get("cancel") || undefined,
      status: searchParams.get("status") || undefined,
      orderCode: searchParams.get("orderCode") || undefined,
      amount: searchParams.get("amount") || undefined,
      description: searchParams.get("description") || undefined,
      accountNumber: searchParams.get("accountNumber") || undefined,
      reference: searchParams.get("reference") || undefined,
      transactionDateTime: searchParams.get("transactionDateTime") || undefined,
      currency: searchParams.get("currency") || undefined,
      paymentLinkId: searchParams.get("paymentLinkId") || undefined,
    };

    setPaymentInfo(payosData);

    // Confirm payment status if orderCode is available
    if (payosData.orderCode) {
      confirmPaymentStatus(payosData.orderCode);
    }
  }, [searchParams]);

  const confirmPaymentStatus = async (orderCode: string) => {
    setIsConfirming(true);
    try {
      const result = await paymentService.confirmPayment(orderCode);
      setConfirmationResult(result);

      // If payment confirmation is successful, clear cart items
      if (result.success !== false) {
        await clearCartAfterSuccess();
      }
    } catch (error) {
      setConfirmationResult({
        error: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsConfirming(false);
    }
  };

  const clearCartAfterSuccess = async () => {
    setIsClearing(true);
    try {
      // Get cartId from localStorage (stored before payment)
      const pendingCartId = localStorage.getItem("pendingCartId");

      if (pendingCartId) {
        // Clear cart items
        await paymentService.clearCartItems(pendingCartId);

        // Remove from localStorage
        localStorage.removeItem("pendingCartId");

        // Reload cart to update UI
        if (reloadCart) {
          await reloadCart();
        }
      }
    } catch {
      // Silently handle cart clearing errors
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl border border-green-200 p-8 text-center">
          {/* Success Icon */}
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>

          {/* Success Message */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Thanh toán thành công!
          </h1>

          <p className="text-gray-600 mb-6">
            Đơn hàng của bạn đã được xác nhận. Chúng tôi sẽ liên hệ với bạn sớm
            nhất để giao hàng.
          </p>

          {/* Confirmation Status */}
          {isConfirming && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <p className="text-blue-800 text-sm">
                Đang xác nhận trạng thái thanh toán...
              </p>
            </div>
          )}

          {/* Cart Clearing Status */}
          {isClearing && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
              <p className="text-green-800 text-sm">
                Đang cập nhật giỏ hàng...
              </p>
            </div>
          )}

          {confirmationResult && (
            <div
              className={`border rounded-xl p-4 mb-6 ${
                confirmationResult.error
                  ? "bg-red-50 border-red-200"
                  : "bg-green-50 border-green-200"
              }`}
            >
              <h3 className="font-medium text-gray-900 mb-2">
                Kết quả xác nhận:
              </h3>
              <p
                className={`text-sm ${
                  confirmationResult.error ? "text-red-800" : "text-green-800"
                }`}
              >
                {confirmationResult.error ||
                  confirmationResult.message ||
                  "Thanh toán đã được xác nhận thành công!"}
              </p>
            </div>
          )}

          {/* Payment Details */}
          {paymentInfo && (
            <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
              <h3 className="font-medium text-gray-900 mb-3">
                Thông tin thanh toán:
              </h3>
              <div className="space-y-2 text-sm">
                {paymentInfo.orderCode && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mã đơn hàng:</span>
                    <span className="font-medium">{paymentInfo.orderCode}</span>
                  </div>
                )}
                {paymentInfo.amount && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Số tiền:</span>
                    <span className="font-medium text-green-600">
                      {parseInt(paymentInfo.amount).toLocaleString()}đ
                    </span>
                  </div>
                )}
                {paymentInfo.transactionDateTime && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Thời gian:</span>
                    <span className="font-medium">
                      {paymentInfo.transactionDateTime}
                    </span>
                  </div>
                )}
                {paymentInfo.reference && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mã tham chiếu:</span>
                    <span className="font-medium">{paymentInfo.reference}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link
              href="/profile"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingBag size={20} />
              Xem đơn hàng
            </Link>

            <Link
              href="/"
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
            >
              Về trang chủ
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
