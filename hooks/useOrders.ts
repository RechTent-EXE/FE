import useSWR from "swr";
import { Order } from "@/types/payment";

// Service function để gọi API orders
const fetchOrders = async (): Promise<Order[]> => {
  const response = await fetch("/api/orders", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch orders");
  }

  const data = await response.json();
  return data;
};

// Hook để lấy danh sách orders
export function useOrders() {
  const {
    data: orders,
    error,
    isLoading,
    mutate,
  } = useSWR<Order[]>("/api/orders", fetchOrders, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 5000, // Cache trong 5 giây
  });

  return {
    orders: orders || [],
    isLoading,
    isError: !!error,
    error,
    refresh: mutate,
  };
}

// Hook để lấy orders theo status
export function useOrdersByStatus(status: string) {
  const {
    data: orders,
    error,
    isLoading,
    mutate,
  } = useSWR<Order[]>(
    `/api/orders?status=${status}`,
    () =>
      fetchOrders().then((orders) =>
        orders.filter((order) => order.status === status)
      ),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 5000,
    }
  );

  return {
    orders: orders || [],
    isLoading,
    isError: !!error,
    error,
    refresh: mutate,
  };
}

// Hook để lấy completed orders
export function useCompletedOrders() {
  return useOrdersByStatus("completed");
}

// Hook để lấy order theo ID
export function useOrder(id: string | null) {
  const {
    data: order,
    error,
    isLoading,
    mutate,
  } = useSWR<Order | null>(
    id ? `/api/orders/${id}` : null,
    id
      ? async () => {
          const response = await fetch(`/api/orders/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          });

          if (!response.ok) {
            throw new Error("Failed to fetch order");
          }

          return response.json();
        }
      : null,
    {
      revalidateOnFocus: false,
      dedupingInterval: 10000, // Cache trong 10 giây
    }
  );

  return {
    order,
    isLoading,
    isError: !!error,
    error,
    refresh: mutate,
  };
}

// Hook để lấy orders theo tháng
export function useOrdersByMonth(month: string) {
  const {
    data: orders,
    error,
    isLoading,
    mutate,
  } = useSWR<Order[]>(
    `/api/orders?month=${month}`,
    () =>
      fetchOrders().then((orders) => {
        const selectedDate = new Date(month);
        return orders.filter((order) => {
          const orderDate = new Date(order.createdAt);
          return (
            orderDate.getMonth() === selectedDate.getMonth() &&
            orderDate.getFullYear() === selectedDate.getFullYear()
          );
        });
      }),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 5000,
    }
  );

  return {
    orders: orders || [],
    isLoading,
    isError: !!error,
    error,
    refresh: mutate,
  };
}

// Hook để tính toán thống kê từ orders
export function useOrdersStats(orders: Order[]) {
  const totalRevenue = orders.reduce(
    (sum, order) => sum + (order.total - order.depositAmount),
    0
  );

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyOrders = orders.filter((order) => {
    const orderDate = new Date(order.createdAt);
    return (
      orderDate.getMonth() === currentMonth &&
      orderDate.getFullYear() === currentYear
    );
  });

  const monthlyRevenue = monthlyOrders.reduce(
    (sum, order) => sum + (order.total - order.depositAmount),
    0
  );

  const dailyRevenue =
    monthlyRevenue / new Date(currentYear, currentMonth + 1, 0).getDate();

  return {
    totalRevenue,
    totalOrders: orders.length,
    monthlyRevenue,
    dailyRevenue: Math.round(dailyRevenue),
    monthlyOrders: monthlyOrders.length,
  };
}
