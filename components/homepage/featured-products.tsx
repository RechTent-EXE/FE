import Image from "next/image";
import { Star, Heart, ArrowRight } from "lucide-react";

export default function FeaturedProducts() {
  const featuredProducts = [
    {
      id: 1,
      name: "Canon EOS 700D Camera",
      description: "Với ống kính 18-55mm",
      price: "299,000",
      originalPrice: "450,000",
      rating: 4.8,
      reviews: 124,
      image: "/placeholder.svg?height=300&width=300",
      category: "Camera",
      badge: "Phổ biến",
    },
    {
      id: 2,
      name: "Canon EOS 550D 18MP DSLR",
      description: "Máy ảnh chuyên nghiệp",
      price: "399,000",
      originalPrice: "600,000",
      rating: 4.9,
      reviews: 89,
      image: "/placeholder.svg?height=300&width=300",
      category: "Camera",
      badge: "Mới nhất",
    },
    {
      id: 3,
      name: "DJI Mavic 3 Pro Drone",
      description: "Flycam 4K chuyên nghiệp",
      price: "899,000",
      originalPrice: "1,200,000",
      rating: 4.7,
      reviews: 156,
      image: "/placeholder.svg?height=300&width=300",
      category: "Flycam",
      badge: "Cao cấp",
    },
    {
      id: 4,
      name: "MacBook Pro M3",
      description: "Laptop hiệu năng cao",
      price: "1,299,000",
      originalPrice: "1,800,000",
      rating: 4.9,
      reviews: 203,
      image: "/placeholder.svg?height=300&width=300",
      category: "Laptop",
      badge: "Hot",
    },
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Sản phẩm nổi bật
            </h2>
            <p className="text-gray-600">Những sản phẩm được thuê nhiều nhất</p>
          </div>
          <button className="hidden md:flex items-center gap-2 border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors">
            Xem tất cả
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              className="group hover:shadow-xl transition-all duration-300 border-0 overflow-hidden bg-white rounded-lg"
            >
              <div className="relative">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  width={300}
                  height={300}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 bg-white text-gray-900 px-2 py-1 rounded text-xs font-medium">
                  {product.badge}
                </span>
                <button className="absolute top-3 right-3 bg-white/80 hover:bg-white p-2 rounded-lg transition-colors">
                  <Heart className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                    {product.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-gray-600">
                      {product.rating}
                    </span>
                    <span className="text-sm text-gray-400">
                      ({product.reviews})
                    </span>
                  </div>
                </div>

                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-1">
                  {product.description}
                </p>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold text-blue-600">
                      {product.price}đ
                    </span>
                    <span className="text-sm text-gray-400 line-through ml-2">
                      {product.originalPrice}đ
                    </span>
                    <div className="text-xs text-gray-500">/ ngày</div>
                  </div>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    Thuê ngay
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
