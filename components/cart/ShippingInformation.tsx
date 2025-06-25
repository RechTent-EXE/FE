"use client";

import { useProfile } from "@/hooks/useProfile";
import { MapPin, User, Phone, Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function ShippingInformation() {
  const { isAuthenticated } = useAuth();
  const { profile, isLoading } = useProfile();
  const router = useRouter();

  if (!isAuthenticated) {
    return (
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <MapPin size={20} className="text-blue-600" />
          Thông tin giao hàng
        </h3>
        <div className="text-center py-4">
          <p className="text-gray-600 mb-4">
            Vui lòng đăng nhập để xem thông tin giao hàng
          </p>
          <button
            onClick={() => router.push("/auth/login")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Đăng nhập
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <MapPin size={20} className="text-blue-600" />
          Thông tin giao hàng
        </h3>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  const hasCompleteInfo =
    profile && profile.fullname && profile.phone && profile.address;

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <MapPin size={20} className="text-blue-600" />
          Thông tin giao hàng
        </h3>
        <button
          onClick={() => router.push("/profile")}
          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          title="Chỉnh sửa thông tin"
        >
          <Edit size={16} />
        </button>
      </div>

      {hasCompleteInfo ? (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <User size={16} className="text-gray-400 flex-shrink-0" />
            <div>
              <div className="text-sm text-gray-500">Họ và tên</div>
              <div className="font-medium text-gray-900">
                {profile.fullname}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Phone size={16} className="text-gray-400 flex-shrink-0" />
            <div>
              <div className="text-sm text-gray-500">Số điện thoại</div>
              <div className="font-medium text-gray-900">{profile.phone}</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin size={16} className="text-gray-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm text-gray-500">Địa chỉ giao hàng</div>
              <div className="font-medium text-gray-900">{profile.address}</div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 text-green-700">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm font-medium">
                Thông tin giao hàng đã đầy đủ
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 text-yellow-700">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm font-medium">
                Thông tin giao hàng chưa đầy đủ
              </span>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            {!profile?.fullname && (
              <div className="text-gray-600">• Chưa có họ và tên</div>
            )}
            {!profile?.phone && (
              <div className="text-gray-600">• Chưa có số điện thoại</div>
            )}
            {!profile?.address && (
              <div className="text-gray-600">• Chưa có địa chỉ giao hàng</div>
            )}
          </div>

          <button
            onClick={() => router.push("/profile")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
          >
            Cập nhật thông tin
          </button>
        </div>
      )}
    </div>
  );
}
