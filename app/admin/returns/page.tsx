"use client";

import { useState, useEffect } from "react";
import { Eye, Check, X, Calendar, CreditCard, User } from "lucide-react";
import { returnService, ReturnRequest } from "@/services/returnService";
import { formatCurrency } from "@/utils/formatters";

type TabType = "pending" | "approved" | "rejected";

export default function ReturnsManagementPage() {
  const [activeTab, setActiveTab] = useState<TabType>("pending");
  const [returnRequests, setReturnRequests] = useState<ReturnRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<ReturnRequest | null>(
    null
  );
  const [processingAction, setProcessingAction] = useState<string | null>(null);

  useEffect(() => {
    fetchReturnRequests();
  }, [activeTab]);

  const fetchReturnRequests = async () => {
    try {
      setLoading(true);
      let requests: ReturnRequest[] = [];

      switch (activeTab) {
        case "pending":
          requests = await returnService.getPendingReturnRequests();
          break;
        case "approved":
          requests = await returnService.getApprovedReturnRequests();
          break;
        case "rejected":
          requests = await returnService.getRejectedReturnRequests();
          break;
      }

      setReturnRequests(requests);
    } catch (error) {
      console.error("Error fetching return requests:", error);
      alert("Có lỗi xảy ra khi tải danh sách yêu cầu trả hàng");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (orderId: string) => {
    if (!confirm("Bạn có chắc chắn muốn phê duyệt yêu cầu trả hàng này?")) {
      return;
    }

    try {
      setProcessingAction(orderId);
      await returnService.approveReturnRequest(orderId);
      alert("Đã phê duyệt yêu cầu trả hàng thành công");
      fetchReturnRequests(); // Refresh the list
    } catch (error) {
      console.error("Error approving return request:", error);
      alert("Có lỗi xảy ra khi phê duyệt yêu cầu");
    } finally {
      setProcessingAction(null);
    }
  };

  const handleReject = async (orderId: string) => {
    const reason = prompt("Nhập lý do từ chối (không bắt buộc):");

    if (!confirm("Bạn có chắc chắn muốn từ chối yêu cầu trả hàng này?")) {
      return;
    }

    try {
      setProcessingAction(orderId);
      await returnService.rejectReturnRequest(orderId, reason || undefined);
      alert("Đã từ chối yêu cầu trả hàng");
      fetchReturnRequests(); // Refresh the list
    } catch (error) {
      console.error("Error rejecting return request:", error);
      alert("Có lỗi xảy ra khi từ chối yêu cầu");
    } finally {
      setProcessingAction(null);
    }
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const getTabLabel = (tab: TabType) => {
    switch (tab) {
      case "pending":
        return "Chờ xử lý";
      case "approved":
        return "Đã phê duyệt";
      case "rejected":
        return "Đã từ chối";
    }
  };

  const getStatusText = (tab: TabType) => {
    switch (tab) {
      case "pending":
        return "đang chờ xử lý";
      case "approved":
        return "đã được phê duyệt";
      case "rejected":
        return "đã bị từ chối";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý trả hàng</h1>
        <div className="text-sm text-gray-600">
          Tổng: {returnRequests.length} yêu cầu {getStatusText(activeTab)}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm p-1">
        <div className="flex space-x-1">
          {(["pending", "approved", "rejected"] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {getTabLabel(tab)}
            </button>
          ))}
        </div>
      </div>

      {returnRequests.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="text-gray-400 mb-4">
            <CreditCard className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Không có yêu cầu trả hàng nào
          </h3>
          <p className="text-gray-600">
            Hiện tại không có yêu cầu trả hàng nào {getStatusText(activeTab)}.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {returnRequests.map((request) => (
            <div
              key={request._id}
              className="bg-white rounded-lg shadow-sm border border-gray-200"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Đơn hàng #{request.orderId.slice(-8)}
                      </h3>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          activeTab === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : activeTab === "approved"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {getTabLabel(activeTab)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-2">
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>User ID: {request.userId.slice(-8)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {formatDate(request.returnRequest.submittedAt)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <CreditCard className="w-4 h-4" />
                        <span>
                          Hoàn trả: {formatCurrency(request.depositAmount)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSelectedRequest(request)}
                      className="flex items-center space-x-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Xem chi tiết</span>
                    </button>
                    {activeTab === "pending" && (
                      <>
                        <button
                          onClick={() => handleApprove(request.orderId)}
                          disabled={processingAction === request.orderId}
                          className="flex items-center space-x-1 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Check className="w-4 h-4" />
                          <span>Phê duyệt</span>
                        </button>
                        <button
                          onClick={() => handleReject(request.orderId)}
                          disabled={processingAction === request.orderId}
                          className="flex items-center space-x-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <X className="w-4 h-4" />
                          <span>Từ chối</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Bank Info Preview */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Thông tin ngân hàng
                  </h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Ngân hàng:</span>
                      <p className="font-medium">
                        {request.returnRequest.bankName}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Số tài khoản:</span>
                      <p className="font-medium">
                        {request.returnRequest.bankAccountNumber}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Chủ tài khoản:</span>
                      <p className="font-medium">
                        {request.returnRequest.bankAccountHolder}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedRequest && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <div className="bg-white rounded-lg shadow-2xl border border-gray-200 max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <h4 className="text-lg font-semibold">
                    Chi tiết yêu cầu trả hàng - Đơn #
                    {selectedRequest.orderId.slice(-8)}
                  </h4>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      activeTab === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : activeTab === "approved"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {getTabLabel(activeTab)}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedRequest(null)}
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
                          {selectedRequest.orderId}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tổng đơn hàng:</span>
                        <span className="font-medium">
                          {formatCurrency(selectedRequest.total)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Số tiền hoàn trả:</span>
                        <span className="font-medium text-red-600">
                          {formatCurrency(selectedRequest.depositAmount)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ngày tạo:</span>
                        <span className="font-medium">
                          {formatDate(selectedRequest.createdAt)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ngày yêu cầu trả:</span>
                        <span className="font-medium">
                          {formatDate(
                            selectedRequest.returnRequest.submittedAt
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-semibold text-gray-900 mb-3">
                      Thông tin ngân hàng
                    </h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ngân hàng:</span>
                        <span className="font-medium">
                          {selectedRequest.returnRequest.bankName}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Số tài khoản:</span>
                        <span className="font-medium">
                          {selectedRequest.returnRequest.bankAccountNumber}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Chủ tài khoản:</span>
                        <span className="font-medium">
                          {selectedRequest.returnRequest.bankAccountHolder}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Photos */}
                <div>
                  <h5 className="font-semibold text-gray-900 mb-3">
                    Ảnh sản phẩm trả
                  </h5>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedRequest.returnRequest.photos.map(
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
              </div>

              {/* Action Buttons */}
              {activeTab === "pending" && (
                <div className="flex space-x-3 mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => {
                      handleApprove(selectedRequest.orderId);
                      setSelectedRequest(null);
                    }}
                    disabled={processingAction === selectedRequest.orderId}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Check className="w-4 h-4" />
                    <span>Phê duyệt yêu cầu</span>
                  </button>
                  <button
                    onClick={() => {
                      handleReject(selectedRequest.orderId);
                      setSelectedRequest(null);
                    }}
                    disabled={processingAction === selectedRequest.orderId}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <X className="w-4 h-4" />
                    <span>Từ chối yêu cầu</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
