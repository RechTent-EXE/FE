"use client";

import { useState } from "react";
import {
  Eye,
  Calendar,
  CreditCard,
  User,
  Package,
  CheckCircle,
} from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import { useRecentOrders } from "@/hooks/useAdminDashboard";
import { RecentOrder } from "@/hooks/useAdminDashboard";

export default function OrdersManagementPage() {
  const [selectedOrder, setSelectedOrder] = useState<RecentOrder | null>(null);

  // Use hook for orders
  const { orders: allOrders, isLoading: loading, isError } = useRecentOrders();

  // Filter only completed orders
  const orders = allOrders.filter((order) => order.status === "completed");

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Hoàn thành
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            Có lỗi xảy ra khi tải danh sách đơn hàng
          </div>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý đơn hàng</h1>
        <div className="text-sm text-gray-600">
          Tổng: {orders.length} đơn hàng hoàn thành
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="text-gray-400 mb-4">
            <Package className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Không có đơn hàng nào
          </h3>
          <p className="text-gray-600">
            Hiện tại không có đơn hàng hoàn thành nào.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-lg shadow-sm border border-gray-200"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Đơn hàng #{order.orderId.slice(-8)}
                      </h3>
                      {getStatusBadge(order.status)}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-2">
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>User ID: {order.userId.slice(-8)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>Tạo: {formatDate(order.createdAt)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <CreditCard className="w-4 h-4" />
                        <span>Tổng: {formatCurrency(order.total)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="flex items-center space-x-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Xem chi tiết</span>
                    </button>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Tổng đơn hàng:</span>
                      <p className="font-medium">
                        {formatCurrency(order.total)}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Tiền cọc:</span>
                      <p className="font-medium">
                        {formatCurrency(order.depositAmount)}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Ngày thanh toán:</span>
                      <p className="font-medium">
                        {order.depositPaidAt
                          ? formatDate(order.depositPaidAt)
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Return Request Info */}
                {order.returnRequest && (
                  <div className="mt-4 bg-orange-50 rounded-lg p-4">
                    <h4 className="font-medium text-orange-900 mb-2">
                      Yêu cầu trả hàng
                    </h4>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-orange-700">Ngân hàng:</span>
                        <p className="font-medium">
                          {order.returnRequest.bankName}
                        </p>
                      </div>
                      <div>
                        <span className="text-orange-700">Số tài khoản:</span>
                        <p className="font-medium">
                          {order.returnRequest.bankAccountNumber}
                        </p>
                      </div>
                      <div>
                        <span className="text-orange-700">Trạng thái:</span>
                        <p className="font-medium">
                          {order.returnRequest.verified
                            ? "Đã phê duyệt"
                            : "Chờ xử lý"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl border border-gray-200 max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <h4 className="text-lg font-semibold">
                    Chi tiết đơn hàng - #{selectedOrder.orderId.slice(-8)}
                  </h4>
                  {getStatusBadge(selectedOrder.status)}
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Order Information */}
                <div className="space-y-4">
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-3">
                      Thông tin đơn hàng
                    </h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Mã đơn hàng:</span>
                        <span className="font-medium">
                          {selectedOrder.orderId}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">User ID:</span>
                        <span className="font-medium">
                          {selectedOrder.userId}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Cart ID:</span>
                        <span className="font-medium">
                          {selectedOrder.cartId}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tổng đơn hàng:</span>
                        <span className="font-medium">
                          {formatCurrency(selectedOrder.total)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tiền cọc:</span>
                        <span className="font-medium">
                          {formatCurrency(selectedOrder.depositAmount)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ngày tạo:</span>
                        <span className="font-medium">
                          {formatDate(selectedOrder.createdAt)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Ngày thanh toán cọc:
                        </span>
                        <span className="font-medium">
                          {selectedOrder.depositPaidAt
                            ? formatDate(selectedOrder.depositPaidAt)
                            : "N/A"}
                        </span>
                      </div>
                      {selectedOrder.finalPaidAt && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            Ngày thanh toán cuối:
                          </span>
                          <span className="font-medium">
                            {formatDate(selectedOrder.finalPaidAt)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Return Request Information */}
                {selectedOrder.returnRequest && (
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-3">
                      Thông tin yêu cầu trả hàng
                    </h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ngân hàng:</span>
                        <span className="font-medium">
                          {selectedOrder.returnRequest.bankName}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Số tài khoản:</span>
                        <span className="font-medium">
                          {selectedOrder.returnRequest.bankAccountNumber}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Chủ tài khoản:</span>
                        <span className="font-medium">
                          {selectedOrder.returnRequest.bankAccountHolder}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ngày yêu cầu:</span>
                        <span className="font-medium">
                          {formatDate(selectedOrder.returnRequest.submittedAt)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Trạng thái:</span>
                        <span className="font-medium">
                          {selectedOrder.returnRequest.verified
                            ? "Đã phê duyệt"
                            : "Chờ xử lý"}
                        </span>
                      </div>
                    </div>

                    {/* Return Photos */}
                    {selectedOrder.returnRequest.photos &&
                      selectedOrder.returnRequest.photos.length > 0 && (
                        <div className="mt-4">
                          <h6 className="font-medium text-gray-900 mb-2">
                            Ảnh sản phẩm trả
                          </h6>
                          <div className="grid grid-cols-2 gap-3">
                            {selectedOrder.returnRequest.photos.map(
                              (photo, index) => (
                                <div key={index} className="relative">
                                  <img
                                    src={photo}
                                    alt={`Return photo ${index + 1}`}
                                    className="w-full h-32 object-cover rounded-lg border"
                                  />
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
