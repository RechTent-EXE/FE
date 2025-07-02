"use client";

import { useRouter } from "next/navigation";
import {
  XCircle,
  ArrowLeft,
  Home,
  ShoppingCart,
  RefreshCw,
} from "lucide-react";

export default function PaymentCancelPage() {
  const router = useRouter();

  const handleGoHome = () => {
    router.push("/");
  };

  const handleGoToCart = () => {
    router.push("/cart");
  };

  const handleTryAgain = () => {
    router.push("/checkout");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pt-20 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Cancel Header */}
          <div className="text-center bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-8 mb-8">
            <XCircle size={80} className="text-red-500 mx-auto mb-6" />

            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Thanh toán bị hủy
            </h1>

            <p className="text-gray-600 mb-6">
              Bạn đã hủy quá trình thanh toán. Đơn hàng của bạn vẫn được giữ
              trong giỏ hàng.
            </p>

            {/* Information Box */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-left mb-6">
              <h3 className="font-bold text-red-900 mb-3">
                Tại sao thanh toán bị hủy?
              </h3>
              <ul className="space-y-2 text-sm text-red-800">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-red-400 rounded-full flex-shrink-0 mt-1.5"></span>
                  <span>
                    Bạn đã nhấn nút &quot;Hủy&quot; hoặc &quot;Quay lại&quot;
                    trên trang thanh toán
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-red-400 rounded-full flex-shrink-0 mt-1.5"></span>
                  <span>Đóng tab trình duyệt trong quá trình thanh toán</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-red-400 rounded-full flex-shrink-0 mt-1.5"></span>
                  <span>Thời gian thanh toán bị hết hạn</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-red-400 rounded-full flex-shrink-0 mt-1.5"></span>
                  <span>Có lỗi kỹ thuật từ cổng thanh toán</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              {/* Primary Action */}
              <button
                onClick={handleTryAgain}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw size={20} />
                Thử thanh toán lại
              </button>

              {/* Secondary Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={handleGoToCart}
                  className="bg-white text-gray-700 px-6 py-3 rounded-xl font-semibold border border-gray-200 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={20} />
                  Quay về giỏ hàng
                </button>
                <button
                  onClick={handleGoHome}
                  className="bg-white text-gray-700 px-6 py-3 rounded-xl font-semibold border border-gray-200 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <Home size={20} />
                  Về trang chủ
                </button>
              </div>
            </div>
          </div>

          {/* Help Section */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
            <h3 className="font-bold text-gray-900 mb-4">Cần hỗ trợ?</h3>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex items-start gap-3">
                <ArrowLeft
                  size={20}
                  className="text-blue-600 flex-shrink-0 mt-0.5"
                />
                <div>
                  <p className="font-medium">Liên hệ hỗ trợ khách hàng</p>
                  <p>
                    Hotline: <span className="font-medium">1900-1234</span>{" "}
                    (8:00 - 22:00)
                  </p>
                  <p>
                    Email:{" "}
                    <span className="font-medium">support@rechtent.com</span>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ArrowLeft
                  size={20}
                  className="text-blue-600 flex-shrink-0 mt-0.5"
                />
                <div>
                  <p className="font-medium">Phương thức thanh toán khác</p>
                  <p>
                    Hỗ trợ: Thẻ tín dụng, Chuyển khoản ngân hàng, Ví điện tử
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ArrowLeft
                  size={20}
                  className="text-blue-600 flex-shrink-0 mt-0.5"
                />
                <div>
                  <p className="font-medium">Kiểm tra kết nối mạng</p>
                  <p>Đảm bảo kết nối internet ổn định khi thanh toán</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tips Section */}
          <div className="mt-6 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6">
            <h3 className="font-bold text-gray-900 mb-4">
              💡 Mẹo thanh toán thành công
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
              <div className="space-y-2">
                <p className="font-medium">Chuẩn bị trước:</p>
                <ul className="space-y-1 ml-4">
                  <li>• Thông tin thẻ ngân hàng</li>
                  <li>• Mã OTP từ ngân hàng</li>
                  <li>• Kết nối mạng ổn định</li>
                </ul>
              </div>
              <div className="space-y-2">
                <p className="font-medium">Trong quá trình thanh toán:</p>
                <ul className="space-y-1 ml-4">
                  <li>• Không đóng tab trình duyệt</li>
                  <li>• Không nhấn nút back</li>
                  <li>• Hoàn thành trong 15 phút</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
