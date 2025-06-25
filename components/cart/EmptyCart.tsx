"use client";

import { useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";

export default function EmptyCart() {
  const router = useRouter();

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-12 text-center">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <ShoppingCart size={40} className="text-gray-400" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Giỏ hàng trống</h2>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá các sản phẩm tuyệt
        vời của chúng tôi!
      </p>
      <button
        onClick={() => router.push("/products/camera")}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-semibold transition-all"
      >
        Khám phá sản phẩm
      </button>
    </div>
  );
}
