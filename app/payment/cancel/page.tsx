"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { XCircle, ArrowLeft, ShoppingCart } from "lucide-react";
import Link from "next/link";
import paymentService from "@/services/paymentService";

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

export default function PaymentCancelPage() {
  const searchParams = useSearchParams();
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
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

    console.log("PayOS Cancel Callback - All Parameters:", allParams);

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

    console.log("PayOS Cancel Data:", payosData);
    setPaymentInfo(payosData);

    // Also log the raw query string for debugging
    console.log("PayOS Cancel - Raw Query String:", window.location.search);

    // Confirm payment status (cancel) if orderCode is available
    if (payosData.orderCode) {
      confirmPaymentStatus(payosData.orderCode);
    }

    // Clean up pending cart since payment was cancelled
    cleanupPendingCart();
  }, [searchParams]);

  const confirmPaymentStatus = async (orderCode: string) => {
    setIsConfirming(true);
    try {
      console.log("Confirming payment cancellation for orderCode:", orderCode);
      const result = await paymentService.confirmPayment(orderCode);
      setConfirmationResult(result);
      console.log("Payment cancellation confirmation successful:", result);
    } catch (error) {
      console.error("Failed to confirm payment cancellation:", error);
      setConfirmationResult({
        error: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsConfirming(false);
    }
  };

  const cleanupPendingCart = () => {
    // Remove pendingCartId from localStorage since payment was cancelled
    // We don't want to clear cart items in this case
    const pendingCartId = localStorage.getItem("pendingCartId");
    if (pendingCartId) {
      localStorage.removeItem("pendingCartId");
      console.log(
        "Removed pendingCartId from localStorage due to payment cancellation:",
        pendingCartId
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl border border-red-200 p-8 text-center">
          {/* Cancel Icon */}
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>

          {/* Cancel Message */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Thanh toán bị hủy
          </h1>

          <p className="text-gray-600 mb-6">
            Giao dịch thanh toán đã bị hủy. Bạn có thể quay lại giỏ hàng để thử
            lại.
          </p>

          {/* Confirmation Status */}
          {isConfirming && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <p className="text-blue-800 text-sm">
                Đang xác nhận trạng thái hủy thanh toán...
              </p>
            </div>
          )}

          {confirmationResult && (
            <div
              className={`border rounded-xl p-4 mb-6 ${
                confirmationResult.error
                  ? "bg-red-50 border-red-200"
                  : "bg-yellow-50 border-yellow-200"
              }`}
            >
              <h3 className="font-medium text-gray-900 mb-2">
                Kết quả xác nhận:
              </h3>
              <p
                className={`text-sm ${
                  confirmationResult.error ? "text-red-800" : "text-yellow-800"
                }`}
              >
                {confirmationResult.error ||
                  confirmationResult.message ||
                  "Hủy thanh toán đã được xác nhận!"}
              </p>
            </div>
          )}

          {/* Payment Details */}
          {paymentInfo && (
            <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
              <h3 className="font-medium text-gray-900 mb-3">
                Thông tin giao dịch:
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
                    <span className="font-medium text-red-600">
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
                {paymentInfo.cancel && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Lý do hủy:</span>
                    <span className="font-medium text-red-600">
                      {paymentInfo.cancel}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link
              href="/cart"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingCart size={20} />
              Quay lại giỏ hàng
            </Link>

            <Link
              href="/"
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft size={16} />
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
