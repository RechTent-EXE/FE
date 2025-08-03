"use client";

import { useState } from "react";
import {
  Eye,
  Calendar,
  User,
  Mail,
  Phone,
  Shield,
  Ban,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  useLatestUsers,
  useUserStats,
  useUserById,
} from "@/hooks/useAdminUsers";
import { AdminUser } from "@/hooks/useAdminUsers";

export default function UsersManagementPage() {
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // Use hooks for users
  const {
    users,
    isLoading: usersLoading,
    isError: usersError,
  } = useLatestUsers();
  const { user: userDetail, isLoading: userDetailLoading } =
    useUserById(selectedUserId);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const getStatusBadge = (user: AdminUser) => {
    if (user.isBanned) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <Ban className="w-3 h-3 mr-1" />
          Bị cấm
        </span>
      );
    }
    if (user.isVerified) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Đã xác thực
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        <XCircle className="w-3 h-3 mr-1" />
        Chưa xác thực
      </span>
    );
  };

  const handleViewUser = (user: AdminUser) => {
    setSelectedUser(user);
    setSelectedUserId(user.userId);
  };

  const loading = usersLoading;

  if (usersError) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            Có lỗi xảy ra khi tải danh sách người dùng
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý người dùng</h1>
      </div>

      {/* Users List */}
      {users.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="text-gray-400 mb-4">
            <User className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Không có người dùng nào
          </h3>
          <p className="text-gray-600">
            Hiện tại không có người dùng nào trong hệ thống.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {users.map((user) => (
            <div
              key={user._id}
              className="bg-white rounded-lg shadow-sm border border-gray-200"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {user.fullname}
                      </h3>
                      {getStatusBadge(user)}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-2">
                      <div className="flex items-center space-x-1">
                        <Mail className="w-4 h-4" />
                        <span>{user.email}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Phone className="w-4 h-4" />
                        <span>{user.phone}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>Sinh: {formatDate(user.dateOfBirth)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewUser(user)}
                      className="flex items-center space-x-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Xem chi tiết</span>
                    </button>
                  </div>
                </div>

                {/* User Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">User ID:</span>
                      <p className="font-medium">{user.userId.slice(-8)}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Điểm thuê:</span>
                      <p className="font-medium">{user.rentalPoint}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Loại giấy tờ:</span>
                      <p className="font-medium">{user.identityType}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Xác thực khuôn mặt:</span>
                      <p className="font-medium">
                        {user.isFaceVerified ? "Đã xác thực" : "Chưa xác thực"}
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
      {selectedUser && userDetail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl border border-gray-200 max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <h4 className="text-lg font-semibold">
                    Chi tiết người dùng - {userDetail.fullname}
                  </h4>
                  {getStatusBadge(userDetail)}
                </div>
                <button
                  onClick={() => {
                    setSelectedUser(null);
                    setSelectedUserId(null);
                  }}
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
                {/* User Information */}
                <div className="space-y-4">
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-3">
                      Thông tin cá nhân
                    </h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Họ tên:</span>
                        <span className="font-medium">
                          {userDetail.fullname}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium">{userDetail.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Số điện thoại:</span>
                        <span className="font-medium">{userDetail.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Địa chỉ:</span>
                        <span className="font-medium">
                          {userDetail.address}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ngày sinh:</span>
                        <span className="font-medium">
                          {formatDate(userDetail.dateOfBirth)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Điểm thuê:</span>
                        <span className="font-medium">
                          {userDetail.rentalPoint}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Identity Information */}
                <div>
                  <h5 className="font-semibold text-gray-900 mb-3">
                    Thông tin giấy tờ
                  </h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Loại giấy tờ:</span>
                      <span className="font-medium">
                        {userDetail.identityType}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Số giấy tờ:</span>
                      <span className="font-medium">
                        {userDetail.identityNumber || "Chưa cập nhật"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Xác thực khuôn mặt:</span>
                      <span className="font-medium">
                        {userDetail.isFaceVerified
                          ? "Đã xác thực"
                          : "Chưa xác thực"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Trạng thái xác thực:
                      </span>
                      <span className="font-medium">
                        {userDetail.isVerified
                          ? "Đã xác thực"
                          : "Chưa xác thực"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Trạng thái tài khoản:
                      </span>
                      <span className="font-medium">
                        {userDetail.isBanned ? "Bị cấm" : "Hoạt động"}
                      </span>
                    </div>
                  </div>

                  {/* Identity Images */}
                  {(userDetail.identityFrontImage ||
                    userDetail.identityBackImage) && (
                    <div className="mt-4">
                      <h6 className="font-medium text-gray-900 mb-2">
                        Ảnh giấy tờ
                      </h6>
                      <div className="grid grid-cols-2 gap-3">
                        {userDetail.identityFrontImage && (
                          <div className="relative">
                            <img
                              src={userDetail.identityFrontImage}
                              alt="Mặt trước giấy tờ"
                              className="w-full h-32 object-cover rounded-lg border"
                            />
                            <p className="text-xs text-gray-600 mt-1">
                              Mặt trước
                            </p>
                          </div>
                        )}
                        {userDetail.identityBackImage && (
                          <div className="relative">
                            <img
                              src={userDetail.identityBackImage}
                              alt="Mặt sau giấy tờ"
                              className="w-full h-32 object-cover rounded-lg border"
                            />
                            <p className="text-xs text-gray-600 mt-1">
                              Mặt sau
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
