import Image from "next/image";
import { Star, User } from "lucide-react";

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "Nguyễn Văn A",
      role: "Nhiếp ảnh gia",
      content:
        "RechTent giúp tôi tiết kiệm rất nhiều chi phí khi cần thiết bị chuyên nghiệp cho dự án.",
      rating: 5,
      avatar: "",
    },
    {
      name: "Trần Thị B",
      role: "Content Creator",
      content:
        "Dịch vụ tuyệt vời, thiết bị chất lượng cao và giao hàng nhanh chóng.",
      rating: 5,
      avatar: "",
    },
    {
      name: "Lê Minh C",
      role: "Doanh nhân",
      content:
        "Thuê laptop cho team làm việc từ xa, rất tiện lợi và giá cả hợp lý.",
      rating: 5,
      avatar: "",
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Khách hàng nói gì về chúng tôi
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Hàng nghìn khách hàng đã tin tưởng và sử dụng dịch vụ của RechTent
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="border-0 shadow-lg bg-white rounded-lg overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
                <div className="flex items-center">
                  {testimonial.avatar ? (
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                  )}
                  <div>
                    <div className="font-semibold text-gray-900">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
