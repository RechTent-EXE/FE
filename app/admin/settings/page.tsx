"use client";

import { Settings, Save, Shield, Bell, Globe } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Cài đặt hệ thống
            </h1>
            <p className="text-gray-600">
              Tính năng này sẽ sớm được phát triển
            </p>
          </div>
          <button
            disabled
            className="flex items-center space-x-2 bg-gray-400 text-white px-4 py-2 rounded-lg cursor-not-allowed"
          >
            <Save size={20} />
            <span>Lưu cài đặt</span>
          </button>
        </div>
      </div>

      {/* Coming Soon */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12 text-center">
        <Settings size={64} className="mx-auto text-gray-400 mb-6" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Cài đặt hệ thống - Sắp ra mắt
        </h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Trang cài đặt toàn diện cho việc quản lý hệ thống đang được phát
          triển.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="p-4 bg-blue-50 rounded-lg">
            <Shield className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900">Bảo mật</h3>
            <p className="text-sm text-gray-600">
              Cài đặt bảo mật và quyền truy cập
            </p>
          </div>

          <div className="p-4 bg-yellow-50 rounded-lg">
            <Bell className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900">Thông báo</h3>
            <p className="text-sm text-gray-600">Cấu hình email và thông báo</p>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <Globe className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900">Tổng quát</h3>
            <p className="text-sm text-gray-600">Cài đặt chung của hệ thống</p>
          </div>
        </div>
      </div>
    </div>
  );
}
