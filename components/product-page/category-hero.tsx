import type React from "react";
import Image from "next/image";

interface CategoryHeroProps {
  category: string;
}

const CategoryHero: React.FC<CategoryHeroProps> = ({ category }) => {
  const categoryData = {
    camera: {
      title: "Camera",
      description:
        "Thuê camera chuyên nghiệp cho mọi nhu cầu chụp ảnh và quay video",
      gradient: "from-blue-500 to-purple-600",
      productImage: "/placeholder.svg?height=400&width=800",
      emoji: "📷",
    },
    laptop: {
      title: "Laptop",
      description: "Laptop hiệu năng cao cho công việc, học tập và giải trí",
      gradient: "from-purple-500 to-pink-600",
      productImage: "/placeholder.svg?height=400&width=800",
      emoji: "💻",
    },
    dashcam: {
      title: "Dashcam",
      description: "Camera hành trình đảm bảo an toàn khi lái xe",
      gradient: "from-orange-500 to-red-600",
      productImage: "/placeholder.svg?height=400&width=800",
      emoji: "🚗",
    },
    flycam: {
      title: "Flycam",
      description: "Flycam chuyên nghiệp cho quay phim và chụp ảnh từ trên cao",
      gradient: "from-green-500 to-emerald-600",
      productImage: "/placeholder.svg?height=400&width=800",
      emoji: "🚁",
    },
  };

  const data = categoryData[category as keyof typeof categoryData];

  if (!data) {
    return null;
  }

  return (
    <section className="relative w-full h-[400px] overflow-hidden">
      {/* Background Image */}
      <Image
        src={data.productImage || "/placeholder.svg"}
        alt={`${data.title} category`}
        fill
        className="object-cover"
        priority
      />

      {/* Gradient Overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-r ${data.gradient} opacity-80`}
      ></div>

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center px-4">
        <div className="text-center text-white max-w-4xl">
          <div className="text-6xl mb-4">{data.emoji}</div>
          <h1 className="text-5xl lg:text-6xl font-bold mb-6">{data.title}</h1>
          <p className="text-xl lg:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            {data.description}
          </p>
          <div className="mt-8 flex items-center justify-center gap-4 text-white/80">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-white rounded-full"></span>
              <span>Chất lượng cao</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-white rounded-full"></span>
              <span>Giá cả hợp lý</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-white rounded-full"></span>
              <span>Giao hàng nhanh</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
    </section>
  );
};

export default CategoryHero;
