"use client";

import { BarChart3, TrendingUp, DollarSign, Download } from "lucide-react";

export default function AdminReportsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Báo cáo & Thống kê
            </h1>
            <p className="text-gray-600">
              Tính năng này sẽ sớm được phát triển
            </p>
          </div>
          <button
            disabled
            className="flex items-center space-x-2 bg-gray-400 text-white px-4 py-2 rounded-lg cursor-not-allowed"
          >
            <Download size={20} />
            <span>Xuất báo cáo</span>
          </button>
        </div>
      </div>

      {/* Coming Soon */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12 text-center">
        <BarChart3 size={64} className="mx-auto text-gray-400 mb-6" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Báo cáo & Thống kê - Sắp ra mắt
        </h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Hệ thống báo cáo chi tiết và phân tích dữ liệu đang được phát triển.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="p-4 bg-blue-50 rounded-lg">
            <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900">Phân tích doanh thu</h3>
            <p className="text-sm text-gray-600">
              Theo dõi xu hướng và tăng trưởng
            </p>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <BarChart3 className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900">Thống kê sản phẩm</h3>
            <p className="text-sm text-gray-600">
              Sản phẩm được thuê nhiều nhất
            </p>
          </div>

          <div className="p-4 bg-purple-50 rounded-lg">
            <DollarSign className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-900">Báo cáo tài chính</h3>
            <p className="text-sm text-gray-600">Doanh thu theo thời gian</p>
          </div>
        </div>
      </div>
    </div>
  );
}
