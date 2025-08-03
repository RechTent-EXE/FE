"use client";

import { useState, useEffect } from "react";
import {
  Package,
  DollarSign,
  ShoppingCart,
  Calendar,
  Filter,
} from "lucide-react";
import { fetchRentedProducts } from "@/lib/api/products";

interface Order {
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

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  dailyRevenue: number;
}

export default function AdminDashboard() {
  const [products, setProducts] = useState<unknown[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    dailyRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  // Filter states
  const [filterType, setFilterType] = useState<"all" | "month">("all");
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toISOString().slice(0, 7)
  );

  // Filter orders based on selected criteria
  const filterOrders = () => {
    let filtered = orders;

    if (filterType === "month") {
      filtered = orders.filter((order) => {
        const orderDate = new Date(order.createdAt);
        const selectedDate = new Date(selectedMonth);
        return (
          orderDate.getMonth() === selectedDate.getMonth() &&
          orderDate.getFullYear() === selectedDate.getFullYear()
        );
      });
    }

    setFilteredOrders(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Calculate stats based on filtered orders
  const calculateStats = (ordersToCalculate: Order[]) => {
    const totalRevenue = ordersToCalculate.reduce(
      (sum: number, order: Order) => {
        return sum + (order.total - order.depositAmount);
      },
      0
    );

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const monthlyOrders = ordersToCalculate.filter((order: Order) => {
      const orderDate = new Date(order.createdAt);
      return (
        orderDate.getMonth() === currentMonth &&
        orderDate.getFullYear() === currentYear
      );
    });

    const monthlyRevenue = monthlyOrders.reduce((sum: number, order: Order) => {
      return sum + (order.total - order.depositAmount);
    }, 0);

    const dailyRevenue =
      monthlyRevenue / new Date(currentYear, currentMonth + 1, 0).getDate();

    return {
      totalRevenue,
      totalOrders: ordersToCalculate.length,
      totalProducts: products.length,
      dailyRevenue: Math.round(dailyRevenue),
    };
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Load products
        const productsData = await fetchRentedProducts();
        setProducts(productsData);

        // Load orders
        const ordersResponse = await fetch("/api/orders", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        if (ordersResponse.ok) {
          const ordersData = await ordersResponse.json();
          const completedOrders = ordersData.filter(
            (order: Order) => order.status === "completed"
          );
          setOrders(completedOrders);
          setFilteredOrders(completedOrders);
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Update stats when filtered orders change
  useEffect(() => {
    if (filteredOrders.length > 0 || orders.length > 0) {
      const newStats = calculateStats(filteredOrders);
      setStats(newStats);
    }
  }, [filteredOrders, orders, products.length]);

  // Apply filter when filter criteria change
  useEffect(() => {
    filterOrders();
  }, [filterType, selectedMonth, orders]);

  // Pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600">
          Quản lý sản phẩm và theo dõi hiệu suất của RechTent
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Doanh thu</p>
              <p className="text-3xl font-bold text-green-600">
                {loading ? "..." : formatCurrency(stats.totalRevenue)}
              </p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng đơn hàng</p>
              <p className="text-3xl font-bold text-blue-600">
                {loading ? "..." : stats.totalOrders}
              </p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng sản phẩm</p>
              <p className="text-3xl font-bold text-indigo-600">
                {loading ? "..." : stats.totalProducts}
              </p>
            </div>
            <div className="bg-indigo-50 p-3 rounded-lg">
              <Package className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Doanh thu/ngày
              </p>
              <p className="text-3xl font-bold text-purple-600">
                {loading ? "..." : formatCurrency(stats.dailyRevenue)}
              </p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Đơn hàng gần đây</h2>
          <div className="flex items-center space-x-4">
            {/* Filter Controls */}
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-600" />
              <select
                value={filterType}
                onChange={(e) =>
                  setFilterType(e.target.value as "all" | "month")
                }
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Tất cả</option>
                <option value="month">Theo tháng</option>
              </select>
            </div>

            {filterType === "month" && (
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            )}

            <a
              href="/admin/orders"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Xem tất cả
            </a>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="animate-pulse flex space-x-4 p-4 border border-gray-200 rounded-lg"
              >
                <div className="w-16 h-16 bg-gray-300 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {currentOrders.map((order) => (
                <div
                  key={order._id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <ShoppingCart className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {order.orderId}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(order.total - order.depositAmount)}
                    </p>
                    <p className="text-sm text-gray-600">
                      Tiền thuê: {formatCurrency(order.total)} | Cọc:{" "}
                      {formatCurrency(order.depositAmount)}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 text-xs bg-green-100 text-green-800 rounded-full font-medium">
                      {order.status === "completed"
                        ? "Đã hoàn thành"
                        : order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-700">
                  Hiển thị {indexOfFirstOrder + 1} đến{" "}
                  {Math.min(indexOfLastOrder, filteredOrders.length)} trong tổng
                  số {filteredOrders.length} đơn hàng
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Trước
                  </button>
                  <span className="px-3 py-2 text-sm text-gray-700">
                    Trang {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Sau
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
