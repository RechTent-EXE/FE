"use client";

import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UserProfile() {
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-600"></div>
        <span className="text-gray-600">Đang tải...</span>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/auth/login")}
          className="text-gray-600 hover:text-blue-600 transition-colors"
        >
          Đăng nhập
        </button>
        <button
          onClick={() => router.push("/auth/register")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Đăng ký
        </button>
      </div>
    );
  }

  const displayName = user.fullname || user.email;

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
          <User size={16} className="text-white" />
        </div>
        <span className="text-gray-700 font-medium" title={user.email}>
          {displayName}
        </span>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors px-3 py-2 rounded-lg hover:bg-gray-100"
        title="Đăng xuất"
      >
        <LogOut size={16} />
        <span className="hidden sm:inline">Đăng xuất</span>
      </button>
    </div>
  );
}
