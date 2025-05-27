import Link from "next/link";
import {
  Camera,
  Laptop,
  Video,
  Smartphone,
  ArrowRight,
  Zap,
} from "lucide-react";

export default function CategoriesSection() {
  const categories = [
    {
      name: "Camera",
      icon: Camera,
      count: "50+ sản phẩm",
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-50 to-cyan-50",
      description: "Máy ảnh chuyên nghiệp",
      href: "/products/camera",
    },
    {
      name: "Laptop",
      icon: Laptop,
      count: "30+ sản phẩm",
      color: "from-purple-500 to-pink-500",
      bgColor: "from-purple-50 to-pink-50",
      description: "Laptop hiệu năng cao",
      href: "/products/laptop",
    },
    {
      name: "Flycam",
      icon: Video,
      count: "25+ sản phẩm",
      color: "from-green-500 to-emerald-500",
      bgColor: "from-green-50 to-emerald-50",
      description: "Drone quay phim 4K",
      href: "/products/flycam",
    },
    {
      name: "Dashcam",
      icon: Smartphone,
      count: "40+ sản phẩm",
      color: "from-orange-500 to-red-500",
      bgColor: "from-orange-50 to-red-50",
      description: "Camera hành trình",
      href: "/products/dashcam",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 right-20 w-64 h-64 bg-blue-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full px-4 py-2 text-sm font-medium text-blue-700 mb-6">
            <Zap className="w-4 h-4" />
            Danh mục hot nhất
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Khám phá
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}
              danh mục{" "}
            </span>
            sản phẩm
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            🎯 Tìm kiếm thiết bị công nghệ phù hợp với nhu cầu của bạn từ các
            danh mục đa dạng và chất lượng cao
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <Link key={index} href={category.href}>
                <div
                  className={`group relative bg-gradient-to-br ${category.bgColor} hover:shadow-2xl transition-all duration-500 cursor-pointer border-0 rounded-3xl overflow-hidden hover:scale-105`}
                >
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  <div className="relative p-8 text-center">
                    {/* Icon Container */}
                    <div className="relative mb-6">
                      <div
                        className={`w-20 h-20 bg-gradient-to-r ${category.color} rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}
                      >
                        <IconComponent className="w-10 h-10 text-white" />
                      </div>
                      {/* Floating Badge */}
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold animate-pulse">
                        🔥
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">
                      {category.description}
                    </p>
                    <div className="flex items-center justify-center gap-2 text-blue-600 font-medium group-hover:gap-3 transition-all">
                      <span>{category.count}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>

                    {/* Bottom Decoration */}
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <Link href="/products">
            <button className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <span className="flex items-center gap-3">
                Xem tất cả sản phẩm
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
