"use client";

import { useProducts } from "@/hooks/useProducts";
import ProductFilters from "@/components/product-page/product-filters";
import ProductGrid from "@/components/product-page/product-grid";
import {
  filterProductsByBrand,
  filterProductsByPrice,
} from "@/utils/productUtils";
import { useMemo } from "react";

interface ProductPageClientProps {
  category: string;
}

export default function ProductPageClient({
  category,
}: ProductPageClientProps) {
  const {
    products,
    brands,
    productTypes,
    loading,
    brandsLoading,
    error,
    filters,
    updateFilters,
    clearFilters,
  } = useProducts(category);

  // Filter products based on current filters (only brand and price, category handled by API)
  const filteredProducts = useMemo(() => {
    let result = products;

    // Filter by brand
    if (filters.brand && filters.brand.length > 0) {
      result = filterProductsByBrand(result, filters.brand, brands);
    }

    // Filter by price range
    if (filters.priceRange) {
      result = filterProductsByPrice(result, filters.priceRange);
    }

    return result;
  }, [products, filters, brands]);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-2">Có lỗi xảy ra</div>
          <div className="text-gray-600">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <ProductFilters
            filters={filters}
            brands={brands}
            brandsLoading={brandsLoading}
            onFiltersChange={updateFilters}
            onClearFilters={clearFilters}
          />
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          <ProductGrid
            products={filteredProducts}
            brands={brands}
            productTypes={productTypes}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}
