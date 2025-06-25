"use client";

import { ArrowLeft, Heart } from "lucide-react";
import { useRouter } from "next/navigation";

interface FavouritesHeaderProps {
  itemCount: number;
}

export default function FavouritesHeader({ itemCount }: FavouritesHeaderProps) {
  const router = useRouter();

  return (
    <div className="mb-8">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors group"
      >
        <ArrowLeft
          size={18}
          className="group-hover:-translate-x-1 transition-transform"
        />
        <span>Quay lại</span>
      </button>

      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl flex items-center justify-center">
          <Heart size={24} className="text-white fill-current" />
        </div>
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
            Danh sách yêu thích
          </h1>
          <p className="text-gray-600">{itemCount} sản phẩm yêu thích</p>
        </div>
      </div>
    </div>
  );
}
