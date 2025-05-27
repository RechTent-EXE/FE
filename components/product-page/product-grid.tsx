"use client";

import { useState } from "react";
import { Grid, List, SlidersHorizontal } from "lucide-react";
import ProductCard from "./product-card";

interface ProductGridProps {
  category: string;
}

export default function ProductGrid({ category }: ProductGridProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("popular");

  // Mock data - replace with real data
  const products = [
    {
      id: 1,
      name: "Canon EOS 700D Camera",
      description: "Với ống kính 18-55mm, phù hợp cho người mới bắt đầu",
      basePrice: 299000,
      originalPrice: 450000,
      rating: 4.8,
      reviews: 124,
      image: "/images/category-hero-images/camera.jpg",
      category: "Camera",
      badge: "Phổ biến",
      brand: "Canon",
      features: ["18MP", "Full HD Video", "WiFi", "Touchscreen"],
    },
    {
      id: 2,
      name: "Canon EOS 550D 18MP DSLR",
      description: "Máy ảnh chuyên nghiệp với chất lượng hình ảnh tuyệt vời",
      basePrice: 399000,
      originalPrice: 600000,
      rating: 4.9,
      reviews: 89,
      image: "/images/category-hero-images/camera.jpg",
      category: "Camera",
      badge: "Mới nhất",
      brand: "Canon",
      features: ["18MP", "4K Video", "Weather Sealed", "Dual Pixel AF"],
    },
    {
      id: 3,
      name: "Sony Alpha A7 III",
      description: "Mirrorless full-frame với hiệu năng vượt trội",
      basePrice: 899000,
      originalPrice: 1200000,
      rating: 4.7,
      reviews: 156,
      image: "/images/category-hero-images/camera.jpg",
      category: "Camera",
      badge: "Cao cấp",
      brand: "Sony",
      features: ["24MP", "4K Video", "5-axis Stabilization", "Silent Shooting"],
    },
    {
      id: 4,
      name: "Nikon D850",
      description: "DSLR chuyên nghiệp với độ phân giải cao",
      basePrice: 1299000,
      originalPrice: 1800000,
      rating: 4.9,
      reviews: 203,
      image: "/images/category-hero-images/camera.jpg",
      category: "Camera",
      badge: "Pro",
      brand: "Nikon",
      features: ["45MP", "4K Video", "Weather Sealed", "Tilting Screen"],
    },
    {
      id: 5,
      name: "Fujifilm X-T4",
      description: "Mirrorless với thiết kế retro và chất lượng tuyệt vời",
      basePrice: 799000,
      originalPrice: 1100000,
      rating: 4.6,
      reviews: 98,
      image: "/images/category-hero-images/camera.jpg",
      category: "Camera",
      brand: "Fujifilm",
      features: [
        "26MP",
        "4K Video",
        "In-body Stabilization",
        "Film Simulation",
      ],
    },
    {
      id: 6,
      name: "Panasonic GH5",
      description: "Chuyên dụng cho quay video chuyên nghiệp",
      basePrice: 699000,
      originalPrice: 950000,
      rating: 4.5,
      reviews: 76,
      image: "/images/category-hero-images/camera.jpg",
      category: "Camera",
      brand: "Panasonic",
      features: ["20MP", "4K 60p", "V-Log", "Dual Card Slots"],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            {products.length} sản phẩm
          </span>

          {/* View Mode Toggle */}
          <div className="flex items-center border rounded-lg p-1">
            <button
              className={`h-8 px-3 rounded transition-colors ${
                viewMode === "grid"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => setViewMode("grid")}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              className={`h-8 px-3 rounded transition-colors ${
                viewMode === "list"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => setViewMode("list")}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-gray-500" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-48 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="popular">Phổ biến nhất</option>
            <option value="price-low">Giá thấp đến cao</option>
            <option value="price-high">Giá cao đến thấp</option>
            <option value="rating">Đánh giá cao nhất</option>
            <option value="newest">Mới nhất</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      <div
        className={`grid gap-6 ${
          viewMode === "grid"
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            : "grid-cols-1"
        }`}
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Load More */}
      <div className="text-center pt-8">
        <button className="border border-gray-300 hover:bg-gray-50 px-6 py-3 rounded-lg text-lg transition-colors">
          Xem thêm sản phẩm
        </button>
      </div>
    </div>
  );
}
