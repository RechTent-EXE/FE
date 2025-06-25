"use client";

import { Heart, Search } from "lucide-react";
import { useRouter } from "next/navigation";

interface EmptyFavouritesProps {
  type: "empty" | "no-results";
}

export default function EmptyFavourites({ type }: EmptyFavouritesProps) {
  const router = useRouter();

  if (type === "no-results") {
    return (
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Search size={24} className="text-gray-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Không tìm thấy sản phẩm
        </h3>
        <p className="text-gray-600">
          Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc để tìm thấy sản phẩm bạn
          muốn.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-12 text-center">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Heart size={40} className="text-gray-400" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Chưa có sản phẩm yêu thích
      </h2>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        Hãy thêm những sản phẩm bạn quan tâm vào danh sách yêu thích để dễ dàng
        theo dõi và so sánh!
      </p>
      <button
        onClick={() => router.push("/products/camera")}
        className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-8 py-4 rounded-xl font-semibold transition-all"
      >
        Khám phá sản phẩm
      </button>
    </div>
  );
}
