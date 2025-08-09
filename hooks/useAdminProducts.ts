import useSWR from "swr";
import api from "@/lib/api";

// Types for admin products
export interface ProductStats {
  totalProducts: number;
  activeProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  totalCategories: number;
  avgRating: number;
  totalReviews: number;
}

export interface TopRatedProduct {
  _id: string;
  name: string;
  rating: number;
  reviewCount: number;
  category: string;
  price: number;
  imageUrl: string;
  stock: number;
  isActive: boolean;
}

export interface LowStockProduct {
  _id: string;
  name: string;
  stock: number;
  category: string;
  price: number;
  imageUrl: string;
  minStock: number;
  isActive: boolean;
}

// Hook để lấy product stats
export function useProductStats() {
  const { data, error, isLoading, mutate } = useSWR<ProductStats>(
    "/admin/products/stats",
    () => api.get("/admin/products/stats").then((res) => res.data)
  );

  return {
    data,
    isLoading,
    isError: !!error,
    error,
    refresh: mutate,
  };
}

// Hook để lấy top rated products
export function useTopRatedProducts() {
  const { data, error, isLoading, mutate } = useSWR<TopRatedProduct[]>(
    "/admin/products/top-rated",
    () => api.get("/admin/products/top-rated").then((res) => res.data)
  );

  return {
    products: data || [],
    isLoading,
    isError: !!error,
    error,
    refresh: mutate,
  };
}

// Hook để lấy low stock products
export function useLowStockProducts() {
  const { data, error, isLoading, mutate } = useSWR<LowStockProduct[]>(
    "/admin/products/low-stock",
    () => api.get("/admin/products/low-stock").then((res) => res.data)
  );

  return {
    products: data || [],
    isLoading,
    isError: !!error,
    error,
    refresh: mutate,
  };
}
