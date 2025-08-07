"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Star, User } from "lucide-react";
import { fetchRatings, RatingWithUser } from "@/lib/api";

function getRandomThree<T>(arr: T[]): T[] {
  return arr.sort(() => 0.5 - Math.random()).slice(0, 3);
}

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<RatingWithUser[]>([]);

  useEffect(() => {
    fetchRatings()
      .then((ratings) => setTestimonials(getRandomThree(ratings)))
      .catch((err) => {
        console.error("Failed to fetch ratings:", err);
      });
  }, []);

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
                  &ldquo;{testimonial.content || "Không có nhận xét."}&rdquo;
                </p>

                <div className="flex items-center">
                  {testimonial.user?.avtUrl ? (
                    <Image
                      src={testimonial.user.avtUrl}
                      alt={testimonial.user.fullname || "User"}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full mr-4 object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                  )}
                  <div>
                    <div className="font-semibold text-gray-900">
                      {testimonial.user?.fullname || "Ẩn danh"}
                    </div>
                    <div className="text-sm text-gray-600">Khách hàng</div>
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
