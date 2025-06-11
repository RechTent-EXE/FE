"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, Heart, Eye } from "lucide-react";
import RentalDurationSelector from "./rental-duration-selector";
import { useRouter } from "next/navigation";
import { ProductCardData } from "@/types/product";

interface ProductCardProps {
  product: ProductCardData;
  viewMode?: "grid" | "list";
}

export default function ProductCard({
  product,
  viewMode = "grid",
}: ProductCardProps) {
  const [currentPrice, setCurrentPrice] = useState(product.singleDayPrice);
  const [selectedDuration, setSelectedDuration] = useState("1 day");
  const [isLiked, setIsLiked] = useState(false);
  const router = useRouter();

  const handlePriceChange = (price: number, duration: string) => {
    setCurrentPrice(price);
    setSelectedDuration(duration);
  };

  const handleProductClick = () => {
    router.push(`/products/${product.type.toLowerCase()}/${product.id}`);
  };

  if (viewMode === "list") {
    return (
      <div
        className="group hover:shadow-xl transition-all duration-300 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden cursor-pointer"
        onClick={handleProductClick}
      >
        <div className="flex">
          <div className="relative w-64 h-48 flex-shrink-0">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {product.isVerified && (
              <span className="absolute top-3 left-3 bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-medium">
                Đã xác minh
              </span>
            )}
            <button
              className={`absolute top-3 right-3 p-2 rounded-lg transition-colors ${
                isLiked
                  ? "bg-red-100 text-red-600 hover:bg-red-200"
                  : "bg-white/80 hover:bg-white"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                setIsLiked(!isLiked);
              }}
            >
              <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
            </button>
          </div>

          <div className="flex-1 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                  {product.brand}
                </span>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm text-gray-600">
                    {product.rating}
                  </span>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    product.isAvailable
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {product.isAvailable ? "Còn hàng" : "Hết hàng"}
                </span>
              </div>

              <h3 className="font-semibold text-gray-900 mb-2 text-lg">
                {product.name}
              </h3>
              <p className="text-gray-600 mb-3">{product.description}</p>

              {/* Product Price */}
              <div className="mb-3">
                <div className="text-sm text-gray-500">Giá sản phẩm:</div>
                <div className="text-lg font-bold text-gray-900">
                  {product.actualPrice.toLocaleString()}đ
                </div>
              </div>
            </div>

            <div className="flex items-end justify-between">
              <div>
                <span className="text-2xl font-bold text-blue-600">
                  {currentPrice.toLocaleString()}đ
                </span>
                <div className="text-sm text-gray-500">
                  cho {selectedDuration}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  className="border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Eye className="w-4 h-4" />
                  Xem chi tiết
                </button>
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                  onClick={(e) => e.stopPropagation()}
                  disabled={!product.isAvailable}
                >
                  Thuê ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="group hover:shadow-xl transition-all duration-300 border-0 overflow-hidden bg-white rounded-lg shadow-lg cursor-pointer"
      onClick={handleProductClick}
    >
      <div className="relative">
        <Image
          src={product.image}
          alt={product.name}
          width={400}
          height={300}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.isVerified && (
          <span className="absolute top-3 left-3 bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-medium">
            Đã xác minh
          </span>
        )}
        <button
          className={`absolute top-3 right-3 p-2 rounded-lg transition-colors ${
            isLiked
              ? "bg-red-100 text-red-600 hover:bg-red-200"
              : "bg-white/80 hover:bg-white"
          }`}
          onClick={(e) => {
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
        >
          <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Product Info */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
              {product.brand}
            </span>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm text-gray-600">{product.rating}</span>
            </div>
            <span
              className={`px-2 py-1 rounded text-xs ${
                product.isAvailable
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {product.isAvailable ? "Còn hàng" : "Hết hàng"}
            </span>
          </div>

          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
            {product.name}
          </h3>
          <p className="text-sm text-gray-600 mb-2 line-clamp-1">
            {product.description}
          </p>

          {/* Product Price */}
          <div className="mb-3">
            <div className="text-xs text-gray-500">Giá sản phẩm:</div>
            <div className="text-sm font-bold text-gray-900">
              {product.actualPrice.toLocaleString()}đ
            </div>
          </div>
        </div>

        {/* Rental Duration Selector */}
        <RentalDurationSelector
          singleDayPrice={product.singleDayPrice}
          durations={product.durations}
          onPriceChange={handlePriceChange}
        />

        {/* Price and Actions */}
        <div className="flex items-center justify-between pt-2">
          <div>
            <span className="text-xl font-bold text-blue-600">
              {currentPrice.toLocaleString()}đ
            </span>
            <div className="text-xs text-gray-500">cho {selectedDuration}</div>
          </div>

          <div className="flex gap-2">
            <button
              className="border border-gray-300 hover:bg-gray-50 p-2 rounded-lg transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <Heart className="w-4 h-4" />
            </button>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm transition-colors"
              onClick={(e) => e.stopPropagation()}
              disabled={!product.isAvailable}
            >
              Thuê ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
