"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import paymentService from "../../services/paymentService";
import { fetchProductDetail } from "../../lib/api/products";
import { PaymentHistory, OrderDetail } from "../../types/payment";
import { RentedProduct } from "../../types/product";

interface OrderHistoryProps {
  reloadTrigger?: number;
}

type TabType = "paid" | "cancelled" | "returned";

const OrderHistory: React.FC<OrderHistoryProps> = ({ reloadTrigger }) => {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("paid");
  const [payments, setPayments] = useState<PaymentHistory[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([]);
  const [orderProducts, setOrderProducts] = useState<
    Record<string, RentedProduct>
  >({});
  const [loading, setLoading] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // Fetch payment history
  const fetchPaymentHistory = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const data = await paymentService.getUserPaymentHistory(user.id);
      setPayments(data);
    } catch (error) {
      console.error("Failed to fetch payment history:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch order details and products
  const fetchOrderDetails = async (orderId: string) => {
    setDetailsLoading(true);
    try {
      const details = await paymentService.getOrderDetails(orderId);
      setOrderDetails(details);

      // Fetch product details for each order item
      const products: Record<string, RentedProduct> = {};
      for (const detail of details) {
        try {
          const product = await fetchProductDetail(detail.productId);
          products[detail.productId] = product;
        } catch (error) {
          console.error(`Failed to fetch product ${detail.productId}:`, error);
        }
      }
      setOrderProducts(products);
      setSelectedOrder(orderId);
    } catch (error) {
      console.error("Failed to fetch order details:", error);
    } finally {
      setDetailsLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentHistory();
  }, [user?.id, reloadTrigger]);

  // Filter payments by status
  const getPaidPayments = () => payments.filter((p) => p.status === "paid");
  const getCancelledPayments = () =>
    payments.filter((p) => p.status === "cancelled");
  const getReturnedPayments = () => []; // Tạm thời empty, sẽ có logic sau

  const getCurrentPayments = () => {
    switch (activeTab) {
      case "paid":
        return getPaidPayments();
      case "cancelled":
        return getCancelledPayments();
      case "returned":
        return getReturnedPayments();
      default:
        return [];
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleReturnOrder = (orderId: string) => {
    router.push(`/return-request/${orderId}`);
  };

  const tabs = [
    {
      key: "paid" as TabType,
      label: "Đã thanh toán",
      count: getPaidPayments().length,
    },
    {
      key: "cancelled" as TabType,
      label: "Đã hủy",
      count: getCancelledPayments().length,
    },
    {
      key: "returned" as TabType,
      label: "Đã trả",
      count: getReturnedPayments().length,
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Lịch sử đơn hàng
        </h3>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === tab.key
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : getCurrentPayments().length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Không có đơn hàng nào trong mục này</p>
          </div>
        ) : (
          <div className="space-y-4">
            {getCurrentPayments().map((payment) => (
              <div
                key={payment._id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-semibold text-gray-900">
                      Đơn hàng #{payment.orderCode}
                    </p>
                    <p className="text-sm text-gray-600">
                      {formatDate(payment.paidAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg text-gray-900">
                      {formatCurrency(payment.amount)}
                    </p>
                    <span
                      className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                        payment.status === "paid"
                          ? "bg-green-100 text-green-800"
                          : payment.status === "cancelled"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {payment.status === "paid"
                        ? "Đã thanh toán"
                        : payment.status === "cancelled"
                        ? "Đã hủy"
                        : "Chờ xử lý"}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <button
                    onClick={() => fetchOrderDetails(payment.orderId)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Xem chi tiết
                  </button>

                  {activeTab === "paid" && (
                    <button
                      onClick={() => handleReturnOrder(payment.orderId)}
                      className="px-3 py-1 text-sm bg-orange-100 text-orange-700 rounded-md hover:bg-orange-200 transition-colors"
                    >
                      Trả hàng
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <div className="bg-white rounded-lg shadow-2xl border border-gray-200 max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-semibold">Chi tiết đơn hàng</h4>
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
              {detailsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : orderDetails.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  Không có chi tiết sản phẩm
                </p>
              ) : (
                <div className="space-y-4">
                  {orderDetails.map((detail) => {
                    const product = orderProducts[detail.productId];
                    return (
                      <div
                        key={detail._id}
                        className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                      >
                        <div className="flex items-start space-x-4">
                          {/* Product Image */}
                          {product?.images && product.images[0] && (
                            <img
                              src={product.images[0].imageUrl}
                              alt={product.images[0].altText}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                          )}

                          {/* Product Info */}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 truncate">
                              {product?.product.name ||
                                `Sản phẩm ID: ${detail.productId}`}
                            </h4>
                            <div className="flex items-center justify-between mt-2">
                              <p className="text-sm text-gray-600">
                                Số lượng: {detail.quantity}
                              </p>
                              <p className="font-semibold text-lg">
                                {formatCurrency(detail.totalPrice)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
