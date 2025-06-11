"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Heart, ArrowRight } from "lucide-react";
import {
  fetchProductTypes,
  fetchRentedProductsByType,
} from "@/lib/api/products";
import { transformProductData } from "@/utils/productUtils";
import { RentedProduct, ProductType, Brand } from "@/types/product";

export default function FeaturedProducts() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);

        // Get all product types
        const productTypes = await fetchProductTypes();

        // Get some products from each category (limited)
        const allProducts: any[] = [];

        for (const type of productTypes.slice(0, 4)) {
          // Take first 4 categories
          try {
            const products = await fetchRentedProductsByType(
              type.productTypeId
            );
            if (products.length > 0) {
              // Transform first product from each category
              const transformedProduct = transformProductData(
                products[0],
                [],
                productTypes
              );
              allProducts.push({
                ...transformedProduct,
                category: type.name,
                badge: getBadgeForCategory(type.name),
                originalPrice: Math.round(transformedProduct.actualPrice * 1.3), // Mock original price
              });
            }
          } catch (error) {
            console.log(`No products found for ${type.name}`);
          }
        }

        setFeaturedProducts(allProducts.slice(0, 4)); // Take only 4 products
      } catch (error) {
        console.error("Error fetching featured products:", error);
        // Fallback to empty array
        setFeaturedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const getBadgeForCategory = (category: string): string => {
    const badges: Record<string, string> = {
      Camera: "Phổ biến",
      Laptop: "Hot",
      Dashcam: "Mới nhất",
      Flycam: "Cao cấp",
    };
    return badges[category] || "Nổi bật";
  };

  if (loading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Sản phẩm nổi bật
              </h2>
              <p className="text-gray-600">
                Những sản phẩm được thuê nhiều nhất
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <div className="animate-pulse bg-gray-200 h-48 w-full"></div>
                <div className="p-6 space-y-3">
                  <div className="animate-pulse bg-gray-200 h-4 w-3/4 rounded"></div>
                  <div className="animate-pulse bg-gray-200 h-4 w-1/2 rounded"></div>
                  <div className="animate-pulse bg-gray-200 h-6 w-1/3 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

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
          <Link
            href="/products/camera"
            className="hidden md:flex items-center gap-2 border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors"
          >
            Xem tất cả
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.type.toLowerCase()}/${product.id}`}
              className="group hover:shadow-xl transition-all duration-300 border-0 overflow-hidden bg-white rounded-lg block"
            >
              <div className="relative">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={300}
                    height={300}
                    priority={true}
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
                <span className="absolute top-3 left-3 bg-white text-gray-900 px-2 py-1 rounded text-xs font-medium">
                  {product.badge}
                </span>
                {product.isVerified && (
                  <span className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                    Đã xác minh
                  </span>
                )}
              </div>

              <div className="p-6">
                <div className="flex items-center mb-2">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                    {product.category}
                  </span>
                </div>

                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {product.description}
                </p>

                <div className="flex items-center mb-3">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 ml-2">
                    {product.rating} đánh giá
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold text-blue-600">
                      {product.singleDayPrice.toLocaleString()}đ
                    </span>
                    <div className="text-xs text-gray-500">/ ngày</div>
                    <span className="text-sm text-gray-500 line-through">
                      {product.originalPrice.toLocaleString()}đ
                    </span>
                  </div>
                  <button
                    onClick={(e) => e.preventDefault()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                  >
                    Thuê ngay
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {featuredProducts.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <div className="text-4xl mb-2">📦</div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Không có sản phẩm nổi bật
            </h3>
            <p className="text-gray-600">
              Hiện tại chưa có sản phẩm nào để hiển thị.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
