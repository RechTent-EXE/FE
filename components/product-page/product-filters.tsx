"use client";

import { useState } from "react";
import { Filter, X, ChevronDown } from "lucide-react";
import { Brand, ProductFilters as IProductFilters } from "@/types/product";

interface ProductFiltersProps {
  filters: IProductFilters;
  brands: Brand[];
  brandsLoading?: boolean;
  onFiltersChange: (filters: Partial<IProductFilters>) => void;
  onClearFilters: () => void;
}

export default function ProductFilters({
  filters,
  brands,
  brandsLoading = false,
  onFiltersChange,
  onClearFilters,
}: ProductFiltersProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    brands: true,
  });

  const handlePriceRangeChange = (value: number) => {
    onFiltersChange({
      priceRange: [filters.priceRange?.[0] || 0, value],
    });
  };

  const toggleBrand = (brandName: string) => {
    const currentBrands = filters.brand || [];
    const newBrands = currentBrands.includes(brandName)
      ? currentBrands.filter((b) => b !== brandName)
      : [...currentBrands, brandName];

    onFiltersChange({ brand: newBrands });
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Price Range */}
      <div>
        <button
          onClick={() => toggleSection("price")}
          className="flex items-center justify-between w-full font-semibold text-gray-900 mb-4"
        >
          Khoảng giá (VNĐ/ngày)
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              expandedSections.price ? "rotate-180" : ""
            }`}
          />
        </button>
        {expandedSections.price && (
          <div className="px-2">
            <input
              type="range"
              min="0"
              max="2000000"
              step="50000"
              value={filters.priceRange?.[1] || 2000000}
              onChange={(e) =>
                handlePriceRangeChange(Number.parseInt(e.target.value))
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mb-4 slider"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>{(filters.priceRange?.[0] || 0).toLocaleString()}đ</span>
              <span>
                {(filters.priceRange?.[1] || 2000000).toLocaleString()}đ
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Brands */}
      <div>
        <button
          onClick={() => toggleSection("brands")}
          className="flex items-center justify-between w-full font-semibold text-gray-900 mb-4"
        >
          Thương hiệu
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              expandedSections.brands ? "rotate-180" : ""
            }`}
          />
        </button>
        {expandedSections.brands && (
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {brandsLoading ? (
              <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="animate-pulse bg-gray-200 h-6 rounded"
                  ></div>
                ))}
              </div>
            ) : brands.length === 0 ? (
              <div className="text-sm text-gray-500">
                Không có thương hiệu nào
              </div>
            ) : (
              brands.map((brand) => (
                <div
                  key={brand.brandId}
                  className="flex items-center space-x-2"
                >
                  <input
                    type="checkbox"
                    id={brand.brandId}
                    checked={(filters.brand || []).includes(brand.name)}
                    onChange={() => toggleBrand(brand.name)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor={brand.brandId}
                    className="text-sm text-gray-700 cursor-pointer"
                  >
                    {brand.name}
                  </label>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Clear Filters */}
      <button
        onClick={onClearFilters}
        className="w-full border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        <X className="w-4 h-4" />
        Xóa bộ lọc
      </button>
    </div>
  );

  return (
    <>
      {/* Desktop Filters */}
      <div className="hidden lg:block bg-white rounded-lg shadow-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="flex items-center gap-2 font-semibold text-lg">
            <Filter className="w-5 h-5" />
            Bộ lọc
          </h3>
        </div>
        <div className="p-4">
          <FilterContent />
        </div>
      </div>

      {/* Mobile Filters */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="w-full border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Filter className="w-4 h-4" />
          Bộ lọc
        </button>

        {isFilterOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
            <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-lg max-h-[70vh] overflow-y-auto">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="flex items-center gap-2 font-semibold text-lg">
                  <Filter className="w-5 h-5" />
                  Bộ lọc
                </h3>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4">
                <FilterContent />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
