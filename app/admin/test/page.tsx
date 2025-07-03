"use client";

import AdminCheck from "@/components/admin/AdminCheck";
import { Shield, TestTube } from "lucide-react";

export default function AdminTestPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center space-x-3">
          <TestTube className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Test Admin Access
            </h1>
            <p className="text-gray-600">
              Kiểm tra quyền truy cập admin và role của user hiện tại
            </p>
          </div>
        </div>
      </div>

      {/* Admin Check Component */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
          <Shield className="w-5 h-5" />
          <span>Thông tin Role & Admin</span>
        </h2>
        <AdminCheck />
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">
          Hướng dẫn test:
        </h3>
        <div className="space-y-2 text-blue-800">
          <p>
            • <strong>Admin access:</strong> User với role = 0 sẽ có quyền truy
            cập admin
          </p>
          <p>
            • <strong>User role:</strong> Role khác 0 sẽ bị từ chối truy cập
            admin
          </p>
          <p>
            • <strong>Database:</strong> Cập nhật role trong MongoDB để test
          </p>
          <p>
            • <strong>JWT Token:</strong> Role được lưu trong JWT payload (nếu
            có)
          </p>
          <p>
            • <strong>API Fallback:</strong> Nếu token không có role, sẽ fetch
            từ API
          </p>
        </div>
      </div>

      {/* Database Update Instructions */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-amber-900 mb-3">
          Cập nhật role trong MongoDB:
        </h3>
        <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm">
          <div className="space-y-2">
            <div className="text-green-400">
              // Đặt user thành admin (role = 0)
            </div>
            <div>db.users.updateOne(</div>
            <div className="ml-4">{'{ email: "your-email@example.com" },'}</div>
            <div className="ml-4">{"{ $set: { role: 0 } }"}</div>
            <div>)</div>
            <br />
            <div className="text-green-400">
              // Đặt user thành user thường (role = 1)
            </div>
            <div>db.users.updateOne(</div>
            <div className="ml-4">{'{ email: "your-email@example.com" },'}</div>
            <div className="ml-4">{"{ $set: { role: 1 } }"}</div>
            <div>)</div>
          </div>
        </div>
        <p className="text-amber-800 text-sm mt-3">
          <strong>Lưu ý:</strong> Sau khi cập nhật database, bạn cần đăng xuất
          và đăng nhập lại để JWT token được cập nhật với role mới.
        </p>
      </div>
    </div>
  );
}
