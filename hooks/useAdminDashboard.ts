import useSWR from "swr";
import api from "@/lib/api";

// Types for admin dashboard data
export interface DashboardOverview {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  dailyRevenue: number;
  monthlyRevenue: number;
  monthlyOrders: number;
}

export interface RecentOrder {
  _id: string;
  orderId: string;
  userId: string;
  cartId: string;
  total: number;
  depositAmount: number;
  status: string;
  createdAt: string;
  __v: number;
  depositPaidAt?: string;
  returnRequest?: {
    photos: string[];
    bankName: string;
    bankAccountNumber: string;
    bankAccountHolder: string;
    submittedAt: string;
    verified: boolean;
    isHidden: boolean;
  };
  finalPaidAt?: string;
}

export interface TopRatedProduct {
  _id: string;
  name: string;
  rating: number;
  reviewCount: number;
  category: string;
  price: number;
  imageUrl: string;
}

export interface LowStockProduct {
  _id: string;
  name: string;
  stock: number;
  category: string;
  price: number;
  imageUrl: string;
}

export interface PaymentStats {
  totalPayments: number;
  totalAmount: number;
  monthlyPayments: number;
  monthlyAmount: number;
  pendingPayments: number;
}

export interface Notification {
  _id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "error" | "success";
  createdAt: string;
  isRead: boolean;
}

// Hook để lấy dashboard overview
export function useDashboardOverview() {
  const { data, error, isLoading, mutate } = useSWR<DashboardOverview>(
    "/admin/dashboard/overview",
    () => api.get("/admin/dashboard/overview").then((res) => res.data)
  );

  return {
    data,
    isLoading,
    isError: !!error,
    error,
    refresh: mutate,
  };
}

// Hook để lấy recent orders
export function useRecentOrders() {
  const { data, error, isLoading, mutate } = useSWR<RecentOrder[]>(
    "/admin/orders/recent",
    () => api.get("/admin/orders/recent").then((res) => res.data)
  );

  return {
    orders: data || [],
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

// Hook để lấy payment stats
export function usePaymentStats() {
  const { data, error, isLoading, mutate } = useSWR<PaymentStats>(
    "/admin/payments/stats",
    () => api.get("/admin/payments/stats").then((res) => res.data)
  );

  return {
    data,
    isLoading,
    isError: !!error,
    error,
    refresh: mutate,
  };
}

// Hook để lấy notifications
export function useNotifications() {
  const { data, error, isLoading, mutate } = useSWR<Notification[]>(
    "/admin/notifications",
    () => api.get("/admin/notifications").then((res) => res.data)
  );

  return {
    notifications: data || [],
    isLoading,
    isError: !!error,
    error,
    refresh: mutate,
  };
}
