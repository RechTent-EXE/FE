export default function WarrantyPage() {
  return (
    <div className="bg-white py-16 px-6 md:px-12 lg:px-24 pt-28">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-900">
        Chính Sách Bảo Hành – RechTent
      </h1>
      <p className="text-lg text-gray-700 mb-6">
        Tại RechTent, chúng tôi cam kết cung cấp thiết bị chất lượng cao. Tuy
        nhiên, nếu thiết bị gặp sự cố, bạn sẽ được hỗ trợ nhanh chóng:
      </p>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            🔧 Sửa chữa & thay thế
          </h2>
          <p className="text-gray-600">
            Trong thời gian thuê, nếu thiết bị lỗi do nhà sản xuất, chúng tôi sẽ
            sửa chữa hoặc thay thế miễn phí.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            ⚠️ Thiệt hại do người dùng
          </h2>
          <p className="text-gray-600">
            Nếu hư hỏng do lỗi sử dụng, khách hàng cần chịu chi phí sửa chữa
            hoặc đền bù theo thỏa thuận thuê.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            📅 Hỗ trợ nhanh chóng
          </h2>
          <p className="text-gray-600">
            Đội ngũ kỹ thuật của RechTent luôn sẵn sàng hỗ trợ bạn 24/7 để đảm
            bảo quá trình sử dụng thiết bị suôn sẻ.
          </p>
        </div>
      </div>
      <div className="mt-12 text-center">
        <a
          href="/"
          className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow hover:bg-primary/90 transition"
        >
          Quay về Trang Chủ
        </a>
      </div>
    </div>
  );
}
