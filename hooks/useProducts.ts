"use client";

import { useState, useEffect, useCallback } from "react";
import {
  RentedProduct,
  ProductType,
  Brand,
  ProductFilters,
} from "@/types/product";
import {
  fetchProductTypes,
  fetchBrandsByType,
  fetchRentedProductsByType,
} from "@/lib/api/products";

export const useProducts = (category: string) => {
  const [products, setProducts] = useState<RentedProduct[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [brandsLoading, setBrandsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ProductFilters>({
    brand: [],
    priceRange: [0, 2000000],
  });

  // Load data when category changes
  useEffect(() => {
    if (!category) return;

    const loadData = async () => {
      try {
        setLoading(true);
        setBrandsLoading(true);
        setError(null);

        // First, load product types
        const types = await fetchProductTypes();
        setProductTypes(types);

        // Find the type for the current category
        const currentType = types.find(
          (type) => type.name.toLowerCase() === category.toLowerCase()
        );

        if (!currentType) {
          throw new Error(`Product type not found for category: ${category}`);
        }

        // Load products by type ID instead of all products
        const [productsData, brandsData] = await Promise.all([
          fetchRentedProductsByType(currentType.productTypeId),
          fetchBrandsByType(currentType.productTypeId),
        ]);

        setProducts(productsData);
        setBrands(brandsData);
        setBrandsLoading(false);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setLoading(false);
        setBrandsLoading(false);
      }
    };

    loadData();
  }, [category]);

  const updateFilters = useCallback((newFilters: Partial<ProductFilters>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      brand: [],
      priceRange: [0, 2000000],
    });
  }, []);

  return {
    products,
    brands,
    productTypes,
    loading,
    brandsLoading,
    error,
    filters,
    updateFilters,
    clearFilters,
  };
};
