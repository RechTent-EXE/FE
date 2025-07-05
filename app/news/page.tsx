export default function RechTentNews() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-white to-slate-100 pt-24 pb-20 px-6 md:px-12 lg:px-24">
      {/* Decorative background shapes */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 animate-pulse"></div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-8 leading-tight">
          Giới thiệu về <span className="text-primary">RechTent</span>
        </h1>

        <p className="text-xl text-gray-700 mb-6">
          Thuê Laptop, Máy Ảnh, Dashcam, Flycam tại Việt Nam – Dễ dàng, nhanh
          chóng, uy tín.
        </p>

        <p className="text-lg text-gray-700 mb-4">
          RechTent là nền tảng cho thuê thiết bị điện tử hàng đầu tại Việt Nam,
          giúp bạn dễ dàng thuê laptop, máy ảnh, dashcam và flycam với giá cả
          hợp lý, chất lượng đảm bảo, và thủ tục nhanh chóng.
        </p>
        <p className="text-lg text-gray-700 mb-4">
          Chúng tôi hiểu rằng nhu cầu sử dụng thiết bị công nghệ cao thường mang
          tính ngắn hạn – có thể là cho chuyến công tác, dự án ngắn ngày, kỳ
          nghỉ, hay thử nghiệm sản phẩm trước khi mua. RechTent ra đời để giải
          quyết vấn đề này, cung cấp dịch vụ thuê mướn tiện lợi, minh bạch, và
          chuyên nghiệp.
        </p>
        <p className="text-lg text-gray-700 mb-4">
          Dù bạn cần laptop mạnh mẽ cho công việc, máy ảnh chuyên nghiệp để ghi
          lại khoảnh khắc, dashcam để đảm bảo an toàn khi di chuyển, hay flycam
          để quay phim, chụp ảnh từ trên cao – RechTent đều có sẵn nhiều lựa
          chọn phù hợp với nhu cầu của bạn.
        </p>
        <p className="text-lg text-gray-700 mb-8">
          Hãy khám phá kho thiết bị đa dạng của chúng tôi ngay hôm nay, và trải
          nghiệm dịch vụ thuê thiết bị dễ dàng, uy tín từ RechTent!
        </p>

        <a
          href="/"
          className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-full shadow-lg hover:scale-105 hover:bg-primary/90 transition-transform duration-300"
        >
          Quay về Trang Chủ
        </a>
      </div>
    </div>
  );
}
