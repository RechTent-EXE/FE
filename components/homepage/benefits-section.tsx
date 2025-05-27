import { CheckCircle, Shield, Clock } from "lucide-react";

export default function BenefitsSection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Tại sao chọn RechTent?
            </h2>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Tiết kiệm chi phí
                  </h3>
                  <p className="text-gray-600">
                    Thuê thay vì mua giúp bạn tiết kiệm đến 70% chi phí, đặc
                    biệt với các thiết bị đắt tiền
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Bảo hành toàn diện
                  </h3>
                  <p className="text-gray-600">
                    Tất cả sản phẩm đều được bảo hành và hỗ trợ kỹ thuật 24/7
                    trong suốt thời gian thuê
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Giao hàng nhanh
                  </h3>
                  <p className="text-gray-600">
                    Giao hàng trong vòng 2 giờ tại TP.HCM và Hà Nội, 24 giờ tại
                    các tỉnh thành khác
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Ưu đãi đặc biệt</h3>
              <p className="mb-6">
                Đăng ký ngay hôm nay để nhận voucher giảm giá 30% cho lần thuê
                đầu tiên
              </p>
              <div className="space-y-4">
                <input
                  placeholder="Nhập email của bạn"
                  className="w-full bg-white/20 border border-white/30 text-white placeholder:text-white/70 px-4 py-3 rounded-lg outline-none"
                />
                <button className="w-full bg-white text-blue-600 hover:bg-gray-100 px-4 py-3 rounded-lg font-medium transition-colors">
                  Nhận ưu đãi ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
