export default function HelpPage() {
  return (
    <div className="bg-white py-16 px-6 md:px-12 lg:px-24 pt-28">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-900">
        Trung Tâm Hỗ Trợ – RechTent
      </h1>
      <p className="text-lg text-gray-700 mb-6">
        Chúng tôi luôn sẵn sàng hỗ trợ bạn trong quá trình thuê thiết bị tại
        RechTent. Dưới đây là một số câu hỏi thường gặp:
      </p>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            📦 Làm thế nào để đặt thuê thiết bị?
          </h2>
          <p className="text-gray-600">
            Chỉ cần tìm sản phẩm bạn cần, chọn thời gian thuê, điền thông tin và
            hoàn tất thanh toán online.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            🚚 RechTent giao hàng như thế nào?
          </h2>
          <p className="text-gray-600">
            Chúng tôi giao hàng tận nơi trên toàn quốc qua các đối tác vận
            chuyển uy tín, hoặc bạn có thể nhận tại cửa hàng.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            💰 Tôi có phải đặt cọc không?
          </h2>
          <p className="text-gray-600">
            Tùy sản phẩm và giá trị, một số thiết bị có thể yêu cầu đặt cọc.
            Thông tin chi tiết sẽ được hiển thị khi bạn đặt thuê.
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
