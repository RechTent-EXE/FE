"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, Heart, Eye, Plus } from "lucide-react";
import RentalDurationSelector from "./rental-duration-selector";
import { useRouter } from "next/navigation";
import { ProductCardData } from "@/types/product";
import { useFavourites } from "@/hooks/useFavourites";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/contexts/AuthContext";

interface ProductCardProps {
  product: ProductCardData;
  viewMode?: "grid" | "list";
  showFavouriteButton?: boolean;
  showAddToCartButton?: boolean;
}

export default function ProductCard({
  product,
  viewMode = "grid",
  showFavouriteButton = true,
  showAddToCartButton = true,
}: ProductCardProps) {
  const [currentPrice, setCurrentPrice] = useState(product.singleDayPrice);
  const [selectedDuration, setSelectedDuration] = useState("1 day");
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { isFavourite, toggleFavourite } = useFavourites();
  const { addToCart } = useCart();

  const isLiked = isFavourite(product.id);
  const [isToggling, setIsToggling] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handlePriceChange = (price: number, duration: string) => {
    setCurrentPrice(price);
    setSelectedDuration(duration);
  };

  const handleProductClick = () => {
    router.push(`/products/${product.type.toLowerCase()}/${product.id}`);
  };

  const handleDurationSelect = (days: number, discount: number) => {
    // Store selected duration data that can be passed to product detail
    const duration = { days, discount, price: currentPrice };
    sessionStorage.setItem("selectedDuration", JSON.stringify(duration));
  };

  const handleToggleFavourite = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      alert("Vui lòng đăng nhập để thêm vào yêu thích");
      return;
    }

    if (isToggling) return;

    try {
      setIsToggling(true);
      await toggleFavourite(product.id);
    } catch (error) {
      console.error("Error toggling favourite:", error);
      alert("Có lỗi xảy ra khi cập nhật yêu thích");
    } finally {
      setIsToggling(false);
    }
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      alert("Vui lòng đăng nhập để thêm vào giỏ hàng");
      return;
    }

    if (isAddingToCart) return;

    try {
      setIsAddingToCart(true);

      // For demo purposes, using default dates. In real app, user would select dates
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + 1); // Tomorrow
      const endDate = new Date(startDate);

      // Parse selected duration to get number of days
      const durationDays = parseInt(selectedDuration.split(" ")[0]) || 1;
      endDate.setDate(startDate.getDate() + durationDays);

      await addToCart({
        productId: product.id,
        quantity: 1,
        startDate: startDate.toISOString().split("T")[0],
        endDate: endDate.toISOString().split("T")[0],
      });

      alert("Đã thêm sản phẩm vào giỏ hàng!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Có lỗi xảy ra khi thêm vào giỏ hàng");
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (viewMode === "list") {
    return (
      <div
        className="group hover:shadow-xl transition-all duration-300 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden cursor-pointer"
        onClick={handleProductClick}
      >
        <div className="flex">
          <div className="relative w-64 h-48 flex-shrink-0">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-100 text-gray-400">
                <div className="text-center">
                  <div className="text-3xl mb-2">📷</div>
                  <div className="text-sm">Không có ảnh</div>
                </div>
              </div>
            )}
            {product.isVerified && (
              <span className="absolute top-3 left-3 bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-medium">
                Đã xác minh
              </span>
            )}
            {showFavouriteButton && (
              <button
                className={`absolute top-3 right-3 p-2 rounded-lg transition-colors ${
                  isLiked
                    ? "bg-red-100 text-red-600 hover:bg-red-200"
                    : "bg-white/80 hover:bg-white"
                }`}
                onClick={handleToggleFavourite}
                disabled={isToggling}
              >
                {isToggling ? (
                  <div className="w-4 h-4 border border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Heart
                    className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`}
                  />
                )}
              </button>
            )}
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
                {showAddToCartButton && (
                  <button
                    className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-1 disabled:opacity-50"
                    onClick={handleAddToCart}
                    disabled={isAddingToCart || !product.isAvailable}
                  >
                    {isAddingToCart ? (
                      <div className="w-4 h-4 border border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                    Giỏ hàng
                  </button>
                )}
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
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            width={400}
            height={300}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <div className="text-3xl mb-2">📷</div>
              <div className="text-sm">Không có ảnh</div>
            </div>
          </div>
        )}
        {product.isVerified && (
          <span className="absolute top-3 left-3 bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-medium">
            Đã xác minh
          </span>
        )}
        {showFavouriteButton && (
          <button
            className={`absolute top-3 right-3 p-2 rounded-lg transition-colors ${
              isLiked
                ? "bg-red-100 text-red-600 hover:bg-red-200"
                : "bg-white/80 hover:bg-white"
            }`}
            onClick={handleToggleFavourite}
            disabled={isToggling}
          >
            {isToggling ? (
              <div className="w-4 h-4 border border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
            )}
          </button>
        )}
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
          onDurationSelect={handleDurationSelect}
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
            {showAddToCartButton && (
              <button
                className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-1 disabled:opacity-50"
                onClick={handleAddToCart}
                disabled={isAddingToCart || !product.isAvailable}
                title="Thêm vào giỏ hàng"
              >
                {isAddingToCart ? (
                  <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Plus className="w-3 h-3" />
                )}
              </button>
            )}
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
