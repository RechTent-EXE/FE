"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCardData } from "@/types/product";
import {
  fetchRentedProductsByType,
  fetchProductTypes,
  fetchBrandsByType,
} from "@/lib/api/products";
import { transformProductData } from "@/utils/productUtils";

interface RelatedProductsProps {
  typeId: string;
  currentProductId: string;
}

export default function RelatedProducts({
  typeId,
  currentProductId,
}: RelatedProductsProps) {
  const router = useRouter();
  const [products, setProducts] = useState<ProductCardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        setLoading(true);

        // Fetch products of the same type
        const [rentedProducts, productTypes, brands] = await Promise.all([
          fetchRentedProductsByType(typeId),
          fetchProductTypes(),
          fetchBrandsByType(typeId),
        ]);

        // Filter out current product and transform data
        const filteredProducts = rentedProducts
          .filter((item) => item.product.productId !== currentProductId)
          .slice(0, 8); // Limit to 8 related products

        const transformedProducts = filteredProducts.map((product) =>
          transformProductData(product, brands, productTypes)
        );

        setProducts(transformedProducts);
      } catch {
        // Silent error handling
      } finally {
        setLoading(false);
      }
    };

    if (typeId) {
      fetchRelatedProducts();
    }
  }, [typeId, currentProductId]);

  const scrollLeft = () => {
    const container = document.getElementById("related-products-container");
    if (container) {
      container.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    const container = document.getElementById("related-products-container");
    if (container) {
      container.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div className="relative">
        <div className="flex gap-6 overflow-x-auto pb-4 px-4 -mx-4">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-64 bg-white rounded-lg border border-gray-200 overflow-hidden animate-pulse"
            >
              <div className="h-48 w-full bg-gray-200"></div>
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Không có sản phẩm liên quan</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Scroll Buttons */}
      {products.length > 3 && (
        <>
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center border border-gray-200 hover:bg-gray-50 transition-all"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center border border-gray-200 hover:bg-gray-50 transition-all"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      {/* Products Container */}
      <div
        id="related-products-container"
        className="flex gap-6 overflow-x-auto pb-4 px-4 -mx-4 scrollbar-hide scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="flex-shrink-0 w-64 bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer transform hover:-translate-y-1"
            onClick={() =>
              router.push(
                `/products/${product.type.toLowerCase()}/${product.id}`
              )
            }
          >
            <div className="relative h-48 w-full bg-gray-100">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <div className="text-center">
                    <div className="text-2xl mb-1">📷</div>
                    <div className="text-xs">Không có ảnh</div>
                  </div>
                </div>
              )}
              {product.isVerified && (
                <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  Đã xác minh
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                  {product.brand}
                </span>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    product.isAvailable
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {product.isAvailable ? "Còn hàng" : "Hết hàng"}
                </span>
              </div>

              <h3 className="font-medium text-gray-900 mb-1 line-clamp-2 h-12">
                {product.name}
              </h3>

              <p className="text-sm text-gray-600 mb-3 line-clamp-2 h-10">
                {product.description}
              </p>

              <div className="flex items-center gap-1 mb-3">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={
                        i < Math.floor(product.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500 ml-1">
                  ({product.rating})
                </span>
              </div>

              <div className="space-y-1">
                <div className="font-bold text-blue-600">
                  {product.singleDayPrice.toLocaleString()}đ
                  <span className="text-xs text-gray-500 font-normal">
                    /ngày
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  Giá trị: {product.actualPrice.toLocaleString()}đ
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
