import { Search, ShoppingCart, Truck } from "lucide-react";

export default function HowItWorks() {
  return (
    <section className="py-16 bg-gradient-to-r from-blue-50 to-purple-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Cách thức hoạt động
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Chỉ với 3 bước đơn giản, bạn đã có thể thuê được sản phẩm công nghệ
            mong muốn
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              1. Tìm kiếm
            </h3>
            <p className="text-gray-600">
              Tìm kiếm sản phẩm công nghệ bạn cần trong kho hàng phong phú của
              chúng tôi
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              2. Đặt thuê
            </h3>
            <p className="text-gray-600">
              Chọn thời gian thuê phù hợp và hoàn tất đơn hàng một cách nhanh
              chóng
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              3. Nhận hàng
            </h3>
            <p className="text-gray-600">
              Nhận sản phẩm tại nhà hoặc đến cửa hàng để lấy hàng và bắt đầu sử
              dụng
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
