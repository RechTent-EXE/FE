"use client";

import { ProductType, Brand } from "@/types/product";

interface ProductFiltersProps {
  productTypes: ProductType[];
  brands: Brand[];
  selectedType: string;
  selectedBrand: string;
  onTypeChange: (typeId: string) => void;
  onBrandChange: (brandId: string) => void;
}

export default function ProductFilters({
  productTypes,
  brands,
  selectedType,
  selectedBrand,
  onTypeChange,
  onBrandChange,
}: ProductFiltersProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Product Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Loại sản phẩm
          </label>
          <select
            value={selectedType}
            onChange={(e) => onTypeChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Tất cả loại</option>
            {productTypes.map((type) => (
              <option key={type._id} value={type.productTypeId}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        {/* Brand Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Thương hiệu
          </label>
          <select
            value={selectedBrand}
            onChange={(e) => onBrandChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Tất cả thương hiệu</option>
            {brands.map((brand) => (
              <option key={brand._id} value={brand.brandId}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Reset Filters */}
      {(selectedType !== "all" || selectedBrand !== "all") && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={() => {
              onTypeChange("all");
              onBrandChange("all");
            }}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Xóa bộ lọc
          </button>
        </div>
      )}
    </div>
  );
}
