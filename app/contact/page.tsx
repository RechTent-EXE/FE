export default function ContactPage() {
  return (
    <div className="bg-white py-16 px-6 md:px-12 lg:px-24 pt-28">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-900">
        Liên Hệ RechTent
      </h1>
      <p className="text-lg text-gray-700 mb-6 text-center max-w-2xl mx-auto">
        Chúng tôi rất vui khi nhận được phản hồi, câu hỏi hoặc yêu cầu của bạn.
        Hãy liên hệ qua thông tin dưới đây hoặc gửi tin nhắn trực tiếp cho chúng
        tôi.
      </p>
      <div className="flex flex-col md:flex-row justify-center items-start gap-12 text-gray-700 max-w-4xl mx-auto">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">🏢 Địa chỉ</h2>
          <p>123 Đường Công Nghệ, Quận 1, TP.HCM</p>
        </div>
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">📞 Điện thoại</h2>
          <p>0909 123 456</p>
        </div>
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">✉️ Email</h2>
          <p>support@rechent.vn</p>
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
