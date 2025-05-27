"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, Heart, ShoppingCart } from "lucide-react";
import RentalDurationSelector from "./rental-duration-selector";

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    description: string;
    basePrice: number;
    originalPrice: number;
    rating: number;
    reviews: number;
    image: string;
    category: string;
    badge?: string;
    brand: string;
    features: string[];
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const [currentPrice, setCurrentPrice] = useState(product.basePrice);
  const [selectedDuration, setSelectedDuration] = useState("1 ngày");
  const [isLiked, setIsLiked] = useState(false);

  const handlePriceChange = (price: number, duration: string) => {
    setCurrentPrice(price);
    setSelectedDuration(duration);
  };

  return (
    <div className="group hover:shadow-xl transition-all duration-300 border-0 overflow-hidden bg-white rounded-lg shadow-lg">
      <div className="relative">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          width={400}
          height={300}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.badge && (
          <span className="absolute top-3 left-3 bg-white text-gray-900 px-2 py-1 rounded text-sm font-medium">
            {product.badge}
          </span>
        )}
        <button
          className={`absolute top-3 right-3 p-2 rounded-lg transition-colors ${
            isLiked
              ? "bg-red-100 text-red-600 hover:bg-red-200"
              : "bg-white/80 hover:bg-white"
          }`}
          onClick={() => setIsLiked(!isLiked)}
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
              <span className="text-sm text-gray-400">({product.reviews})</span>
            </div>
          </div>

          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
            {product.name}
          </h3>
          <p className="text-sm text-gray-600 mb-2 line-clamp-1">
            {product.description}
          </p>

          {/* Features */}
          <div className="flex flex-wrap gap-1 mb-3">
            {product.features.slice(0, 2).map((feature, index) => (
              <span
                key={index}
                className="border border-gray-300 text-gray-700 px-2 py-1 rounded text-xs"
              >
                {feature}
              </span>
            ))}
            {product.features.length > 2 && (
              <span className="border border-gray-300 text-gray-700 px-2 py-1 rounded text-xs">
                +{product.features.length - 2}
              </span>
            )}
          </div>
        </div>

        {/* Rental Duration Selector */}
        <RentalDurationSelector
          basePrice={product.basePrice}
          onPriceChange={handlePriceChange}
        />

        {/* Price and Actions */}
        <div className="space-y-3 pt-2 border-t">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-bold text-blue-600">
                {currentPrice.toLocaleString()}đ
              </span>
              <div className="text-xs text-gray-500">
                cho {selectedDuration}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400 line-through">
                {product.originalPrice.toLocaleString()}đ
              </div>
              <div className="text-xs text-green-600">
                Tiết kiệm{" "}
                {Math.round(
                  ((product.originalPrice - currentPrice) /
                    product.originalPrice) *
                    100
                )}
                %
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button className="flex-1 border border-gray-300 hover:bg-gray-50 px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-center gap-1">
              <ShoppingCart className="w-4 h-4" />
              Thêm vào giỏ
            </button>
            <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm transition-colors">
              Thuê ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
