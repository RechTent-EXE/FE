"use client";

import { Users, Plus, UserCheck, UserX } from "lucide-react";

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Quản lý người dùng
            </h1>
            <p className="text-gray-600">
              Tính năng này sẽ sớm được phát triển
            </p>
          </div>
          <button
            disabled
            className="flex items-center space-x-2 bg-gray-400 text-white px-4 py-2 rounded-lg cursor-not-allowed"
          >
            <Plus size={20} />
            <span>Thêm người dùng</span>
          </button>
        </div>
      </div>

      {/* Coming Soon */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12 text-center">
        <Users size={64} className="mx-auto text-gray-400 mb-6" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Quản lý người dùng - Sắp ra mắt
        </h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Tính năng quản lý người dùng đang được phát triển và sẽ sớm có mặt
          trong phiên bản tiếp theo.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="p-4 bg-blue-50 rounded-lg">
            <UserCheck className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900">Xác minh tài khoản</h3>
            <p className="text-sm text-gray-600">
              Xem và phê duyệt tài khoản người dùng
            </p>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900">
              Danh sách người dùng
            </h3>
            <p className="text-sm text-gray-600">
              Quản lý thông tin và hoạt động
            </p>
          </div>

          <div className="p-4 bg-red-50 rounded-lg">
            <UserX className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900">Khóa tài khoản</h3>
            <p className="text-sm text-gray-600">Tạm khóa hoặc xóa tài khoản</p>
          </div>
        </div>
      </div>
    </div>
  );
}
