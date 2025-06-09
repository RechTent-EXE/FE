"use client";

import { useState } from "react";
import { Grid, List, SlidersHorizontal } from "lucide-react";
import ProductCard from "./product-card";

interface ProductGridProps {
  category: string;
}

// Updated to match database schema
interface Product {
  id: string;
  name: string;
  type: string;
  rating: number;
  brandId: string;
  description: string;
  detailDescription: string;
  techSpec: string;
  isVerified: boolean;
  isAvailable: boolean;
  altText: string;
  price: number; // Added price attribute
  singleDayPrice: number;
  images: string[];
}

// Duration interface matching the API response
interface Duration {
  id: string;
  jd: string;
  length: string;
  discount: number;
  __v: number;
}

export default function ProductGrid({ category }: ProductGridProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("popular");

  // Mock data matching database schema
  const getProductsByCategory = (category: string): Product[] => {
    const baseProducts = {
      camera: [
        {
          id: "683f9b4b1cf36ace6311c5be",
          name: "Canon EOS 700D Camera",
          type: "DSLR",
          rating: 5,
          brandId: "canon",
          description: "Với ống kính 18-55mm, phù hợp cho người mới bắt đầu",
          detailDescription:
            "Canon EOS 700D là máy ảnh DSLR entry-level hoàn hảo cho người mới bắt đầu...",
          techSpec: "Cảm biến APS-C 18MP, ISO 100-12800, Video Full HD",
          isVerified: true,
          isAvailable: true,
          altText: "Canon EOS 700D Camera with 18-55mm lens",
          price: 25000000, // 25 million VND
          singleDayPrice: 299000, // 299k per day
          images: [
            "/placeholder.svg?height=300&width=300",
            "/placeholder.svg?height=300&width=300",
            "/placeholder.svg?height=300&width=300",
          ],
        },
        {
          id: "683f9b4b1cf36ace6311c5bf",
          name: "Canon EOS 550D 18MP DSLR",
          type: "DSLR",
          rating: 5,
          brandId: "canon",
          description:
            "Máy ảnh chuyên nghiệp với chất lượng hình ảnh tuyệt vời",
          detailDescription:
            "Canon EOS 550D với cảm biến 18MP mang lại chất lượng hình ảnh xuất sắc...",
          techSpec: "Cảm biến APS-C 18MP, ISO 100-6400, Video Full HD",
          isVerified: true,
          isAvailable: true,
          altText: "Canon EOS 550D DSLR Camera",
          price: 35000000, // 35 million VND
          singleDayPrice: 399000, // 399k per day
          images: [
            "/placeholder.svg?height=300&width=300",
            "/placeholder.svg?height=300&width=300",
          ],
        },
        {
          id: "683f9b4b1cf36ace6311c5c0",
          name: "Sony Alpha A7 III",
          type: "Mirrorless",
          rating: 5,
          brandId: "sony",
          description: "Mirrorless full-frame với hiệu năng vượt trội",
          detailDescription:
            "Sony A7 III là máy ảnh mirrorless full-frame với nhiều tính năng tiên tiến...",
          techSpec: "Cảm biến Full-frame 24MP, ISO 100-51200, Video 4K",
          isVerified: true,
          isAvailable: true,
          altText: "Sony Alpha A7 III Mirrorless Camera",
          price: 55000000, // 55 million VND
          singleDayPrice: 899000, // 899k per day
          images: [
            "/placeholder.svg?height=300&width=300",
            "/placeholder.svg?height=300&width=300",
            "/placeholder.svg?height=300&width=300",
            "/placeholder.svg?height=300&width=300",
          ],
        },
        {
          id: "683f9b4b1cf36ace6311c5c1",
          name: "Nikon D850",
          type: "DSLR",
          rating: 5,
          brandId: "nikon",
          description: "DSLR chuyên nghiệp với độ phân giải cao",
          detailDescription:
            "Nikon D850 là máy ảnh DSLR chuyên nghiệp với cảm biến 45MP...",
          techSpec: "Cảm biến Full-frame 45MP, ISO 64-25600, Video 4K",
          isVerified: true,
          isAvailable: true,
          altText: "Nikon D850 DSLR Camera",
          price: 85000000, // 85 million VND
          singleDayPrice: 1299000, // 1.299M per day
          images: ["/placeholder.svg?height=300&width=300"],
        },
      ],
      laptop: [
        {
          id: "683f9b4b1cf36ace6311c5c2",
          name: "MacBook Pro M3",
          type: "Laptop",
          rating: 5,
          brandId: "apple",
          description: "Laptop hiệu năng cao cho công việc chuyên nghiệp",
          detailDescription:
            "MacBook Pro M3 với chip Apple Silicon mới nhất...",
          techSpec: "Chip M3, 16GB RAM, 512GB SSD, Màn hình Retina 14 inch",
          isVerified: true,
          isAvailable: true,
          altText: "MacBook Pro M3 14-inch",
          price: 65000000, // 65 million VND
          singleDayPrice: 1299000, // 1.299M per day
          images: [
            "/placeholder.svg?height=300&width=300",
            "/placeholder.svg?height=300&width=300",
          ],
        },
        {
          id: "683f9b4b1cf36ace6311c5c3",
          name: "Dell XPS 13",
          type: "Ultrabook",
          rating: 4,
          brandId: "dell",
          description: "Ultrabook mỏng nhẹ với hiệu năng mạnh mẽ",
          detailDescription:
            "Dell XPS 13 với thiết kế premium và hiệu năng mạnh mẽ...",
          techSpec: "Intel Core i7, 16GB RAM, 512GB SSD, Màn hình 4K",
          isVerified: true,
          isAvailable: true,
          altText: "Dell XPS 13 Ultrabook",
          price: 45000000, // 45 million VND
          singleDayPrice: 899000, // 899k per day
          images: ["/placeholder.svg?height=300&width=300"],
        },
      ],
      dashcam: [
        {
          id: "683f9b4b1cf36ace6311c5c4",
          name: "Xiaomi 70mai Pro Plus+",
          type: "Dashcam",
          rating: 4,
          brandId: "xiaomi",
          description: "Camera hành trình 4K với GPS tích hợp",
          detailDescription:
            "Xiaomi 70mai Pro Plus+ với khả năng quay 4K và GPS...",
          techSpec: "Quay 4K, GPS tích hợp, Wifi, Cảm biến G",
          isVerified: true,
          isAvailable: true,
          altText: "Xiaomi 70mai Pro Plus+ Dashcam",
          price: 8000000, // 8 million VND
          singleDayPrice: 199000, // 199k per day
          images: [
            "/placeholder.svg?height=300&width=300",
            "/placeholder.svg?height=300&width=300",
          ],
        },
      ],
      flycam: [
        {
          id: "683f9b4b1cf36ace6311c5c5",
          name: "DJI Mavic 3 Pro",
          type: "Drone",
          rating: 5,
          brandId: "dji",
          description: "Flycam chuyên nghiệp với camera 4K",
          detailDescription:
            "DJI Mavic 3 Pro với camera Hasselblad và khả năng bay 46 phút...",
          techSpec:
            "Camera 4K Hasselblad, Bay 46 phút, Tầm xa 15km, Chống gió cấp 12",
          isVerified: true,
          isAvailable: true,
          altText: "DJI Mavic 3 Pro Drone",
          price: 120000000, // 120 million VND
          singleDayPrice: 1599000, // 1.599M per day
          images: [
            "/placeholder.svg?height=300&width=300",
            "/placeholder.svg?height=300&width=300",
            "/placeholder.svg?height=300&width=300",
          ],
        },
      ],
    };

    return baseProducts[category as keyof typeof baseProducts] || [];
  };

  const products = getProductsByCategory(category);

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-200">
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
      {products.length > 0 ? (
        <div
          className={`grid gap-6 ${
            viewMode === "grid"
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1"
          }`}
        >
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              viewMode={viewMode}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Chưa có sản phẩm
          </h3>
          <p className="text-gray-600">
            Danh mục này đang được cập nhật. Vui lòng quay lại sau!
          </p>
        </div>
      )}

      {/* Load More */}
      {products.length > 0 && (
        <div className="text-center pt-8">
          <button className="border border-gray-300 hover:bg-gray-50 px-6 py-3 rounded-lg text-lg transition-colors">
            Xem thêm sản phẩm
          </button>
        </div>
      )}
    </div>
  );
}
