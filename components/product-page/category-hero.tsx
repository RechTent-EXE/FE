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
      productImage: "/images/category-hero-images/camera.jpg",
    },
    laptop: {
      title: "Laptop",
      description: "Laptop hiệu năng cao cho công việc, học tập và giải trí",
      gradient: "from-purple-500 to-pink-600",
      productImage: "/images/category-hero-images/laptop.jpg",
    },
    dashcam: {
      title: "Dashcam",
      description: "Camera hành trình đảm bảo an toàn khi lái xe",
      gradient: "from-orange-500 to-red-600",
      productImage: "/images/category-hero-images/dashcam.jpg",
    },
    flycam: {
      title: "Flycam",
      description: "Flycam chuyên nghiệp cho quay phim và chụp ảnh từ trên cao",
      gradient: "from-green-500 to-emerald-600",
      productImage: "/images/category-hero-images/flycam.jpg",
    },
  };

  const data = categoryData[category as keyof typeof categoryData];

  if (!data) {
    return null;
  }

  return (
    <section className="relative w-full h-[300px] overflow-hidden">
      {/* Image chiếm toàn bộ section */}
      <Image
        src={data.productImage}
        alt={`${data.title} product`}
        fill
        className="object-cover"
        priority
      />

      {/* Overlay (tuỳ chọn nếu muốn làm tối ảnh để dễ đọc text) */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Nội dung text in đè lên ảnh */}
      <div className="absolute inset-0 flex items-center justify-center px-4">
        <div className="text-center text-white max-w-2xl">
          <h1 className="text-5xl font-bold mb-4">{data.title}</h1>
          <p className="text-xl text-white/90">{data.description}</p>
        </div>
      </div>
    </section>
  );
};

export default CategoryHero;
