"use client";

import { useState, useEffect, useMemo } from "react";
import { Grid, List, ArrowUpDown, Check } from "lucide-react";
import ProductCard from "./product-card";
import { RentedProduct, Brand, ProductType } from "@/types/product";
import { transformProductData, sortProducts } from "@/utils/productUtils";

interface ProductGridProps {
  products: RentedProduct[];
  brands: Brand[];
  productTypes?: ProductType[];
  loading: boolean;
}

export default function ProductGrid({
  products,
  brands,
  productTypes = [],
  loading,
}: ProductGridProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("popular");
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  // Sort products
  const sortedProducts = useMemo(() => {
    return sortProducts(products, sortBy);
  }, [products, sortBy]);

  // Transform products for display
  const transformedProducts = useMemo(() => {
    return sortedProducts.map((product) =>
      transformProductData(product, brands, productTypes)
    );
  }, [sortedProducts, brands, productTypes]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".sort-dropdown")) {
        setSortDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const sortOptions = [
    { value: "popular", label: "Phổ biến nhất" },
    { value: "price-low", label: "Giá thấp đến cao" },
    { value: "price-high", label: "Giá cao đến thấp" },
    { value: "rating", label: "Đánh giá cao nhất" },
    { value: "name", label: "Tên A-Z" },
  ];

  const currentSort = sortOptions.find((option) => option.value === sortBy);

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Toolbar Skeleton */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="animate-pulse bg-gray-200 h-6 w-24 rounded"></div>
            <div className="flex items-center gap-4">
              <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
              <div className="animate-pulse bg-gray-200 h-8 w-32 rounded"></div>
            </div>
          </div>
        </div>

        {/* Products Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
            >
              <div className="animate-pulse bg-gray-200 h-48 w-full"></div>
              <div className="p-4 space-y-3">
                <div className="animate-pulse bg-gray-200 h-4 w-3/4 rounded"></div>
                <div className="animate-pulse bg-gray-200 h-4 w-1/2 rounded"></div>
                <div className="animate-pulse bg-gray-200 h-6 w-1/3 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">
              {transformedProducts.length} sản phẩm
            </span>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                className={`h-8 px-3 rounded-md transition-all duration-200 ${
                  viewMode === "grid"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
                onClick={() => setViewMode("grid")}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                className={`h-8 px-3 rounded-md transition-all duration-200 ${
                  viewMode === "list"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Sort Dropdown */}
          <div className="relative sort-dropdown">
            <button
              onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
            >
              <ArrowUpDown className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">
                {currentSort?.label}
              </span>
              <div
                className={`transform transition-transform duration-200 ${
                  sortDropdownOpen ? "rotate-180" : ""
                }`}
              >
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </button>

            {/* Dropdown Menu */}
            {sortDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="p-1">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSortBy(option.value);
                        setSortDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-md transition-colors ${
                        sortBy === option.value
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <span className="text-lg">{option.icon}</span>
                      <span className="flex-1 text-sm font-medium">
                        {option.label}
                      </span>
                      {sortBy === option.value && (
                        <Check className="w-4 h-4 text-blue-600" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Products */}
      {transformedProducts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <div className="text-6xl mb-4">📦</div>
          <div className="text-gray-500 text-lg mb-2">
            Không tìm thấy sản phẩm nào
          </div>
          <div className="text-gray-400 text-sm">
            Thử thay đổi bộ lọc để xem thêm sản phẩm
          </div>
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }
        >
          {transformedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              viewMode={viewMode}
            />
          ))}
        </div>
      )}
    </div>
  );
}
