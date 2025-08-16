"use client";

import {
  Eye,
  Calendar,
  CreditCard,
  User,
  Package,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import { useOrders } from "@/hooks/useAdminDashboard";
import { RecentOrder } from "@/hooks/useAdminDashboard";
import { useUserById } from "@/hooks/useAdminUsers";
import paymentService from "@/services/paymentService";
import { fetchProductDetail } from "@/lib/api/products";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Product, ProductImage } from "@/types/product";

const ORDERS_PER_PAGE = 5;

export default function OrdersManagementPage() {
  const [selectedOrder, setSelectedOrder] = useState<RecentOrder | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState("all");

  // Use hook for orders
  const { orders: allOrders, isLoading: loading, isError } = useOrders();

  const sortedOrders = [...allOrders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // ✅ Filter orders by status
  const filteredOrders =
    filterStatus === "all"
      ? sortedOrders
      : sortedOrders.filter((order) => order.status === filterStatus);

  // Pagination calculations
  const totalOrdersCount = filteredOrders.length;
  const totalPages = Math.ceil(totalOrdersCount / ORDERS_PER_PAGE);

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ORDERS_PER_PAGE,
    currentPage * ORDERS_PER_PAGE
  );

  const completedOrders = allOrders.filter(
    (order) => order.status === "completed"
  );

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
      case "deposit_paid":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <CreditCard className="w-3 h-3 mr-1" />
            Đã trả tiền
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Đã hủy
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Đang chờ
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

  // Pagination controls
  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý đơn hàng</h1>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            Tổng: {completedOrders.length}/{allOrders.length} đơn hàng hoàn
            thành
          </div>
          {/* ✅ Status filter dropdown */}
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1); // Reset to first page when filter changes
            }}
            className="border rounded-lg px-3 py-1 text-sm"
          >
            <option value="all">Tất cả</option>
            <option value="completed">Hoàn thành</option>
            <option value="deposit_paid">Đã trả tiền</option>
            <option value="pending">Đang chờ</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>
      </div>

      {totalOrdersCount === 0 ? (
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
          {paginatedOrders.map((order) => (
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
                  <div
                    className={`mt-4 rounded-lg p-4 ${
                      order.returnRequest.verified
                        ? "bg-green-50 border border-green-300"
                        : "bg-yellow-50 border border-yellow-300"
                    }`}
                  >
                    <h4
                      className={`font-medium mb-2 ${
                        order.returnRequest.verified
                          ? "text-green-900"
                          : "text-yellow-900"
                      }`}
                    >
                      Yêu cầu trả hàng
                    </h4>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span
                          className={`${
                            order.returnRequest.verified
                              ? "text-green-700"
                              : "text-yellow-700"
                          }`}
                        >
                          Ngân hàng:
                        </span>
                        <p className="font-medium">
                          {order.returnRequest.bankName}
                        </p>
                      </div>
                      <div>
                        <span
                          className={`${
                            order.returnRequest.verified
                              ? "text-green-700"
                              : "text-yellow-700"
                          }`}
                        >
                          Số tài khoản:
                        </span>
                        <p className="font-medium">
                          {order.returnRequest.bankAccountNumber}
                        </p>
                      </div>
                      <div>
                        <span
                          className={`${
                            order.returnRequest.verified
                              ? "text-green-700"
                              : "text-yellow-700"
                          }`}
                        >
                          Trạng thái:
                        </span>
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

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-3 mt-6">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded border ${
              currentPage === 1
                ? "cursor-not-allowed border-gray-300 text-gray-400"
                : "border-blue-600 text-blue-600 hover:bg-blue-100"
            }`}
          >
            Previous
          </button>

          {/* Show page numbers */}
          {[...Array(totalPages)].map((_, idx) => {
            const pageNum = idx + 1;
            return (
              <button
                key={pageNum}
                onClick={() => goToPage(pageNum)}
                className={`px-3 py-1 rounded border ${
                  currentPage === pageNum
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded border ${
              currentPage === totalPages
                ? "cursor-not-allowed border-gray-300 text-gray-400"
                : "border-blue-600 text-blue-600 hover:bg-blue-100"
            }`}
          >
            Next
          </button>
        </div>
      )}

      {/* Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}

function OrderDetailModal({
  order,
  onClose,
}: {
  order: RecentOrder;
  onClose: () => void;
}) {
  const { user, isLoading: userLoading } = useUserById(order.userId);
  const [products, setProducts] = useState<
    {
      productId: string;
      quantity: number;
      totalPrice: number;
      product: Product | null;
      images: ProductImage[];
    }[]
  >([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoadingProducts(true);
    paymentService
      .getOrderDetails(order.orderId)
      .then(
        async (
          details: { productId: string; quantity: number; totalPrice: number }[]
        ) => {
          if (!isMounted) return;
          // Fetch all product details in parallel
          const productPromises = details.map(async (item) => {
            try {
              const productData = await fetchProductDetail(item.productId);
              return {
                ...item,
                product: productData.product,
                images: productData.images || [],
              };
            } catch {
              return { ...item, product: null, images: [] };
            }
          });
          const prods = await Promise.all(productPromises);
          if (isMounted) setProducts(prods);
        }
      )
      .finally(() => {
        if (isMounted) setLoadingProducts(false);
      });
    return () => {
      isMounted = false;
    };
  }, [order.orderId]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 max-w-4xl w-full max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <h4 className="text-lg font-semibold">
                Chi tiết đơn hàng - #{order.orderId.slice(-8)}
              </h4>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Close modal"
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
                    <span className="font-medium">{order.orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tên khách hàng:</span>
                    <span className="font-medium">
                      {userLoading
                        ? "Đang tải..."
                        : user?.fullname || order.userId}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cart ID:</span>
                    <span className="font-medium">{order.cartId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tổng đơn hàng:</span>
                    <span className="font-medium">
                      {formatCurrency(order.total)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tiền cọc:</span>
                    <span className="font-medium">
                      {formatCurrency(order.depositAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ngày tạo:</span>
                    <span className="font-medium">
                      {new Date(order.createdAt).toLocaleString("vi-VN")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ngày thanh toán cọc:</span>
                    <span className="font-medium">
                      {order.depositPaidAt
                        ? new Date(order.depositPaidAt).toLocaleString("vi-VN")
                        : "N/A"}
                    </span>
                  </div>
                  {order.finalPaidAt && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Ngày thanh toán cuối:
                      </span>
                      <span className="font-medium">
                        {new Date(order.finalPaidAt).toLocaleString("vi-VN")}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              {/* Sản phẩm đã thuê */}
              <div>
                <h5 className="font-semibold text-gray-900 mb-3">
                  Sản phẩm đã thuê
                </h5>
                {loadingProducts ? (
                  <div>Đang tải sản phẩm...</div>
                ) : (
                  <div className="space-y-3">
                    {products.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 border rounded p-2"
                      >
                        <Image
                          src={item.images[0]?.imageUrl || "/images/logo.png"}
                          alt={item.product?.name || "product"}
                          width={64}
                          height={64}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div>
                          <div className="font-medium">
                            {item.product?.name || "(Không rõ tên)"}
                          </div>
                          <div className="text-sm text-gray-600">
                            Số lượng: {item.quantity}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {/* Return Request Information (giữ nguyên) */}
            {order.returnRequest && (
              <div>
                <h5 className="font-semibold text-gray-900 mb-3">
                  Thông tin yêu cầu trả hàng
                </h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ngân hàng:</span>
                    <span className="font-medium">
                      {order.returnRequest.bankName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Số tài khoản:</span>
                    <span className="font-medium">
                      {order.returnRequest.bankAccountNumber}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Chủ tài khoản:</span>
                    <span className="font-medium">
                      {order.returnRequest.bankAccountHolder}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ngày yêu cầu:</span>
                    <span className="font-medium">
                      {new Date(order.returnRequest.submittedAt).toLocaleString(
                        "vi-VN"
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Trạng thái:</span>
                    <span className="font-medium">
                      {order.returnRequest.verified
                        ? "Đã phê duyệt"
                        : "Chờ xử lý"}
                    </span>
                  </div>
                </div>
                {/* Return Photos */}
                {order.returnRequest.photos &&
                  order.returnRequest.photos.length > 0 && (
                    <div className="mt-4">
                      <h6 className="font-medium text-gray-900 mb-2">
                        Ảnh sản phẩm trả
                      </h6>
                      <div className="grid grid-cols-2 gap-3">
                        {order.returnRequest.photos.map((photo, index) => (
                          <div key={index} className="relative">
                            <Image
                              src={photo}
                              alt={`Return photo ${index + 1}`}
                              width={256}
                              height={128}
                              className="w-full h-32 object-cover rounded-lg border"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
