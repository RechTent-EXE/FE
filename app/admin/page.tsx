"use client";

import { useState } from "react";
import {
  Package,
  DollarSign,
  ShoppingCart,
  Calendar,
  Filter,
  Users,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import {
  useDashboardOverview,
  useRecentOrders,
} from "@/hooks/useAdminDashboard";
import { useUserStats } from "@/hooks/useAdminUsers";
import { useProductStats } from "@/hooks/useAdminProducts";

export default function AdminDashboard() {
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  // Filter states
  const [filterType, setFilterType] = useState<"all" | "month">("all");
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toISOString().slice(0, 7)
  );

  // Use admin hooks
  const { isLoading: dashboardLoading } = useDashboardOverview();
  const { orders: allOrders, isLoading: ordersLoading } = useRecentOrders();
  const { data: userStats, isLoading: userStatsLoading } = useUserStats();
  const { data: productStats, isLoading: productStatsLoading } =
    useProductStats();

  // Filter only completed orders
  const orders = allOrders.filter((order) => order.status === "completed");

  // Calculate revenue from completed orders
  const totalRevenue = orders.reduce(
    (sum, order) => sum + (order.total - order.depositAmount),
    0
  );
  const dailyRevenue = totalRevenue > 0 ? Math.round(totalRevenue / 30) : 0; // Simple daily calculation

  // Pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

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

  const loading =
    dashboardLoading ||
    ordersLoading ||
    userStatsLoading ||
    productStatsLoading;

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
                {loading ? "..." : formatCurrency(totalRevenue)}
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
                {loading ? "..." : orders.length}
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
                {loading ? "..." : productStats?.totalProducts || 0}
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
                {loading ? "..." : formatCurrency(dailyRevenue)}
              </p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Tổng người dùng
              </p>
              <p className="text-2xl font-bold text-orange-600">
                {loading ? "..." : userStats?.totalUsers || 0}
              </p>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Sản phẩm hết hàng
              </p>
              <p className="text-2xl font-bold text-red-600">
                {loading ? "..." : productStats?.outOfStockProducts || 0}
              </p>
            </div>
            <div className="bg-red-50 p-3 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Đánh giá trung bình
              </p>
              <p className="text-2xl font-bold text-yellow-600">
                {loading
                  ? "..."
                  : (productStats?.averageRating || 0).toFixed(1)}
              </p>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-yellow-600" />
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
                  {Math.min(indexOfLastOrder, orders.length)} trong tổng số{" "}
                  {orders.length} đơn hàng
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
