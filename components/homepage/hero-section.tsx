import Link from "next/link";
import {
  Play,
  ArrowRight,
  Camera,
  Video,
  Laptop,
  Smartphone,
  Sparkles,
  Zap,
  Star,
  TrendingUp,
} from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-pink-400/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 animate-bounce delay-1000">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg rotate-45"></div>
        </div>
        <div className="absolute top-1/3 right-1/4 animate-bounce delay-2000">
          <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
        </div>
        <div className="absolute bottom-1/3 left-1/5 animate-bounce delay-3000">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg rotate-12"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-full px-4 py-2 text-sm font-medium text-blue-700 shadow-lg">
              <Zap className="w-4 h-4" />
              <span>🎉 Giảm giá 30% cho khách hàng mới</span>
              <Star className="w-4 h-4 text-yellow-500" />
            </div>

            {/* Main Heading */}
            <div className="space-y-6">
              <h1 className="text-6xl lg:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse">
                  RechTent
                </span>
                <br />
                <span className="text-gray-900">Cho thuê</span>
                <br />
                <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                  Công nghệ
                </span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                🚀 Nơi giúp bạn thuê những sản phẩm công nghệ
                <span className="font-semibold text-blue-600">
                  {" "}
                  chất lượng cao
                </span>{" "}
                với
                <span className="font-semibold text-purple-600">
                  {" "}
                  giá cả hợp lý
                </span>
                . Có được thứ bạn muốn, vào lúc bạn cần! ⚡
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="group relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative flex items-center justify-center gap-3">
                  <Play className="w-6 h-6" />
                  Thuê ngay
                  <TrendingUp className="w-5 h-5" />
                </div>
              </button>

              <Link href="/ai-finder">
                <button className="group relative border-2 border-gray-300 hover:border-purple-400 bg-white/80 backdrop-blur-sm hover:bg-white text-gray-700 hover:text-purple-600 text-lg px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl">
                  <div className="flex items-center justify-center gap-3">
                    <Sparkles className="w-6 h-6 group-hover:text-purple-500" />
                    AI tìm sản phẩm
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-8 pt-6">
              <div className="text-center group">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform">
                  1000+
                </div>
                <div className="text-sm text-gray-600">Sản phẩm</div>
              </div>
              <div className="text-center group">
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform">
                  5000+
                </div>
                <div className="text-sm text-gray-600">Khách hàng</div>
              </div>
              <div className="text-center group">
                <div className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent group-hover:scale-110 transition-transform">
                  4.9★
                </div>
                <div className="text-sm text-gray-600">Đánh giá</div>
              </div>
            </div>
          </div>

          {/* Right Side - Product Cards */}
          <div className="relative animate-slide-up">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="group bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl p-8 transform rotate-3 hover:rotate-6 transition-all duration-300 hover:scale-105 cursor-pointer shadow-2xl">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Camera className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-white font-bold text-xl mb-2">Camera</h3>
                  <p className="text-white/90 text-sm">Chuyên nghiệp 📸</p>
                  <div className="mt-4 text-white/80 text-xs">50+ sản phẩm</div>
                </div>

                <div className="group bg-gradient-to-br from-green-400 to-blue-500 rounded-3xl p-8 transform -rotate-2 hover:-rotate-6 transition-all duration-300 hover:scale-105 cursor-pointer shadow-2xl">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Video className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-white font-bold text-xl mb-2">Flycam</h3>
                  <p className="text-white/90 text-sm">4K Ultra HD 🚁</p>
                  <div className="mt-4 text-white/80 text-xs">25+ sản phẩm</div>
                </div>
              </div>

              <div className="space-y-6 pt-12">
                <div className="group bg-gradient-to-br from-purple-400 to-pink-500 rounded-3xl p-8 transform rotate-2 hover:rotate-6 transition-all duration-300 hover:scale-105 cursor-pointer shadow-2xl">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Laptop className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-white font-bold text-xl mb-2">Laptop</h3>
                  <p className="text-white/90 text-sm">Hiệu năng cao 💻</p>
                  <div className="mt-4 text-white/80 text-xs">30+ sản phẩm</div>
                </div>

                <div className="group bg-gradient-to-br from-red-400 to-yellow-500 rounded-3xl p-8 transform -rotate-3 hover:-rotate-6 transition-all duration-300 hover:scale-105 cursor-pointer shadow-2xl">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Smartphone className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-white font-bold text-xl mb-2">Dashcam</h3>
                  <p className="text-white/90 text-sm">An toàn lái xe 🚗</p>
                  <div className="mt-4 text-white/80 text-xs">40+ sản phẩm</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}
