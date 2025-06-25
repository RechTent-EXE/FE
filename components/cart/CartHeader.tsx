"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, ShoppingCart } from "lucide-react";

interface CartHeaderProps {
  itemCount: number;
}

export default function CartHeader({ itemCount }: CartHeaderProps) {
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
        <span>Tiếp tục mua sắm</span>
      </button>

      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center">
          <ShoppingCart size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
            Giỏ hàng
          </h1>
          <p className="text-gray-600">{itemCount} sản phẩm trong giỏ hàng</p>
        </div>
      </div>
    </div>
  );
}
