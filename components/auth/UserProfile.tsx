"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UserProfile() {
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch {
      // Silent error handling
    }
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

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

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
        title="Tài khoản"
      >
        <User size={16} className="text-white" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 min-w-[14rem] max-w-xs bg-white rounded-lg shadow-lg border z-50 p-3 break-words">
          <div className="text-sm text-gray-700 font-medium mb-2">
            {user.email}
          </div>
          <button
            onClick={() => {
              router.push("/profile");
              setOpen(false);
            }}
            className="w-full text-left flex items-center gap-2 px-2 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition"
          >
            <User size={16} />
            <span>Hồ sơ</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full text-left flex items-center gap-2 px-2 py-2 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded-md transition"
          >
            <LogOut size={16} />
            <span>Đăng xuất</span>
          </button>
        </div>
      )}
    </div>
  );
}
