"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowRight,
  Home,
  ShoppingBag,
} from "lucide-react";
import paymentService from "@/services/paymentService";
import { PaymentDetails } from "@/types/payment";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get payment ID from URL params (PayOS usually returns this)
  const paymentId = searchParams.get("paymentId") || searchParams.get("id");

  useEffect(() => {
    const fetchPaymentStatus = async () => {
      if (!paymentId) {
        setError("Không tìm thấy thông tin thanh toán");
        setLoading(false);
        return;
      }

      try {
        const details = await paymentService.getPaymentDetails(paymentId);
        setPaymentDetails(details);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Có lỗi xảy ra khi kiểm tra trạng thái thanh toán"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentStatus();
  }, [paymentId]);

  const handleGoHome = () => {
    router.push("/");
  };

  const handleViewProfile = () => {
    router.push("/profile");
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center pt-20">
        <div className="text-center bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-8">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-6"></div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Đang kiểm tra trạng thái thanh toán...
          </h2>
          <p className="text-gray-600">Vui lòng đợi trong giây lát</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !paymentDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center pt-20">
        <div className="text-center bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-8 max-w-md mx-4">
          <AlertCircle size={64} className="text-red-500 mx-auto mb-6" />
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Có lỗi xảy ra
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleGoHome}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
          >
            <Home size={20} />
            Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  // Success state
  const isCompleted = paymentDetails.status === "completed";
  const isPending = paymentDetails.status === "pending";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pt-20 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <div className="text-center bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-8 mb-8">
            {isCompleted ? (
              <CheckCircle size={80} className="text-green-500 mx-auto mb-6" />
            ) : isPending ? (
              <Clock size={80} className="text-orange-500 mx-auto mb-6" />
            ) : (
              <AlertCircle size={80} className="text-red-500 mx-auto mb-6" />
            )}

            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {isCompleted
                ? "Thanh toán thành công!"
                : isPending
                ? "Đang xử lý thanh toán"
                : "Thanh toán không thành công"}
            </h1>

            <p className="text-gray-600 mb-6">
              {isCompleted
                ? "Cảm ơn bạn đã sử dụng dịch vụ của RechTent. Đơn hàng của bạn đã được xác nhận."
                : isPending
                ? "Thanh toán của bạn đang được xử lý. Chúng tôi sẽ thông báo khi có kết quả."
                : "Đã có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại."}
            </p>

            {/* Payment Details */}
            <div className="bg-gray-50 rounded-xl p-6 text-left">
              <h3 className="font-bold text-gray-900 mb-4">
                Chi tiết thanh toán
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Mã đơn hàng:</span>
                  <span className="font-medium text-gray-900">
                    {paymentDetails.orderId}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Số tiền:</span>
                  <span className="font-medium text-gray-900">
                    {paymentDetails.amount.toLocaleString()}đ
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Loại thanh toán:</span>
                  <span className="font-medium text-gray-900">
                    {paymentDetails.paymentType === "deposit"
                      ? "Tiền cọc"
                      : "Thanh toán toàn bộ"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phương thức:</span>
                  <span className="font-medium text-gray-900">
                    {paymentDetails.paymentMethod === "credit_card"
                      ? "Thẻ tín dụng"
                      : paymentDetails.paymentMethod === "bank_transfer"
                      ? "Chuyển khoản"
                      : "Ví điện tử"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Trạng thái:</span>
                  <span
                    className={`font-medium ${
                      isCompleted
                        ? "text-green-600"
                        : isPending
                        ? "text-orange-600"
                        : "text-red-600"
                    }`}
                  >
                    {isCompleted
                      ? "Hoàn thành"
                      : isPending
                      ? "Đang xử lý"
                      : "Thất bại"}
                  </span>
                </div>
                {paymentDetails.paidAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Thời gian:</span>
                    <span className="font-medium text-gray-900">
                      {new Date(paymentDetails.paidAt).toLocaleString("vi-VN")}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <button
                onClick={handleViewProfile}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-2"
              >
                <ShoppingBag size={20} />
                Xem đơn hàng
              </button>
              <button
                onClick={handleGoHome}
                className="flex-1 bg-white text-gray-700 px-6 py-3 rounded-xl font-semibold border border-gray-200 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <Home size={20} />
                Về trang chủ
              </button>
            </div>
          </div>

          {/* Next Steps */}
          {isCompleted && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
              <h3 className="font-bold text-gray-900 mb-4">
                Các bước tiếp theo
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <ArrowRight
                    size={20}
                    className="text-green-600 flex-shrink-0 mt-0.5"
                  />
                  <div>
                    <p className="font-medium text-gray-900">
                      Chuẩn bị giao hàng
                    </p>
                    <p className="text-sm text-gray-600">
                      Chúng tôi sẽ liên hệ để sắp xếp giao hàng trong 2-4 giờ
                      tới.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <ArrowRight
                    size={20}
                    className="text-green-600 flex-shrink-0 mt-0.5"
                  />
                  <div>
                    <p className="font-medium text-gray-900">
                      Kiểm tra thiết bị
                    </p>
                    <p className="text-sm text-gray-600">
                      Vui lòng kiểm tra thiết bị khi nhận hàng.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <ArrowRight
                    size={20}
                    className="text-green-600 flex-shrink-0 mt-0.5"
                  />
                  <div>
                    <p className="font-medium text-gray-900">Hỗ trợ 24/7</p>
                    <p className="text-sm text-gray-600">
                      Liên hệ hotline nếu cần hỗ trợ trong thời gian thuê.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
