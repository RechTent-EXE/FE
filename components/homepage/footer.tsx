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
                  <path d="M16.5 3c.4 1.7 1.7 3.1 3.3 3.6v3.1c-1.2-.1-2.4-.4-3.5-1v6.4c0 4.2-3.4 7.6-7.6 7.6S1 19.4 1 15.2 4.4 7.6 8.6 7.6c.8 0 1.5.1 2.2.4v3.2c-.6-.2-1.3-.3-2-.3-2.5 0-4.6 2.1-4.6 4.6S6.3 20 8.8 20s4.6-2.1 4.6-4.6V3h3.1z" />
                </svg>
              </button>
              <button className="text-gray-400 hover:text-white p-2 transition-colors hover:scale-110 transform">
                <Link href="https://www.facebook.com/profile.php?id=61555532805575">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 5 3.66 9.13 8.44 9.88v-6.99H7.9v-2.89h2.54V9.89c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.45h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.89h-2.34v6.99C18.34 21.13 22 17 22 12z" />
                  </svg>
                </Link>
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
                <span>📍</span> 123 Đường Công Nghệ, Quận 1, TP.HCM
              </p>
              <p className="flex items-center gap-2">
                <span>📞</span> 0909 123 456
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
