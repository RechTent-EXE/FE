import Link from "next/link";
import Image from "next/image";
import { Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4 group">
              <div className="relative">
                {/* Soft glow effect for footer */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-pink-200/20 rounded-2xl blur-sm opacity-60 group-hover:opacity-80 transition-opacity"></div>

                {/* Logo container with white to pink gradient for footer */}
                <div className="relative w-12 h-12 bg-gradient-to-br from-white via-pink-50 to-pink-200 rounded-2xl flex items-center justify-center transform group-hover:scale-105 transition-all duration-300 shadow-lg border border-pink-100/50">
                  <Image
                    src="/images/logo.png"
                    alt="RechTent Logo"
                    width={28}
                    height={28}
                    className="w-7 h-7 object-contain"
                  />
                  {/* Fallback icon - keeping original colors */}
                  <Sparkles className="w-6 h-6 text-pink-500 absolute opacity-0 group-hover:opacity-20 transition-opacity" />
                </div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                RechTent
              </span>
            </div>
            <p className="text-gray-400 mb-4">
              Nền tảng cho thuê công nghệ hàng đầu Việt Nam. Mang đến trải
              nghiệm công nghệ tốt nhất với chi phí hợp lý.
            </p>
            <div className="flex space-x-4">
              <button className="text-gray-400 hover:text-white p-2 transition-colors hover:scale-110 transform">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </button>
              <button className="text-gray-400 hover:text-white p-2 transition-colors hover:scale-110 transform">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                </svg>
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Sản phẩm</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link
                  href="/products/camera"
                  className="hover:text-white transition-colors hover:translate-x-1 transform inline-block"
                >
                  Camera
                </Link>
              </li>
              <li>
                <Link
                  href="/products/laptop"
                  className="hover:text-white transition-colors hover:translate-x-1 transform inline-block"
                >
                  Laptop
                </Link>
              </li>
              <li>
                <Link
                  href="/products/flycam"
                  className="hover:text-white transition-colors hover:translate-x-1 transform inline-block"
                >
                  Flycam
                </Link>
              </li>
              <li>
                <Link
                  href="/products/dashcam"
                  className="hover:text-white transition-colors hover:translate-x-1 transform inline-block"
                >
                  Dashcam
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Hỗ trợ</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link
                  href="/help"
                  className="hover:text-white transition-colors hover:translate-x-1 transform inline-block"
                >
                  🆘 Trung tâm trợ giúp
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-white transition-colors hover:translate-x-1 transform inline-block"
                >
                  📞 Liên hệ
                </Link>
              </li>
              <li>
                <Link
                  href="/warranty"
                  className="hover:text-white transition-colors hover:translate-x-1 transform inline-block"
                >
                  🛡️ Chính sách bảo hành
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Liên hệ</h3>
            <div className="space-y-2 text-gray-400">
              <p className="flex items-center gap-2">
                <span>📍</span> 123 hahaha, hahaha
              </p>
              <p className="flex items-center gap-2">
                <span>📞</span> 1900 1234
              </p>
              <p className="flex items-center gap-2">
                <span>✉️</span> support@rechtent.vn
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2024 RechTent. Tất cả quyền được bảo lưu. ✨</p>
        </div>
      </div>
    </footer>
  );
}
