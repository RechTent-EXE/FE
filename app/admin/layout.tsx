"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AdminSidebar from "@/components/admin/Sidebar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isAdmin, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log("🔍 [ADMIN LAYOUT DEBUG] Auth state:", {
      isLoading,
      isAuthenticated,
      isAdmin,
      userRole: user?.role,
      userEmail: user?.email,
    });

    // Wait for auth check to complete
    if (isLoading) {
      console.log("🔍 [ADMIN LAYOUT DEBUG] Still loading...");
      return;
    }

    // Check if user is authenticated
    if (!isAuthenticated) {
      console.log(
        "🔍 [ADMIN LAYOUT DEBUG] Not authenticated, redirecting to login"
      );
      router.push("/auth/login");
      return;
    }

    // Check if user has admin role (role = 0)
    if (!isAdmin) {
      console.log("🔍 [ADMIN LAYOUT DEBUG] Not admin, denying access");
      alert("Bạn không có quyền truy cập trang quản trị!");
      router.push("/");
      return;
    }

    console.log("🔍 [ADMIN LAYOUT DEBUG] Access granted - user is admin");
  }, [isAuthenticated, isAdmin, isLoading, router, user]);

  if (isLoading || !isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-8">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {isLoading
              ? "Đang kiểm tra quyền truy cập..."
              : !isAuthenticated
              ? "Đang chuyển hướng đến trang đăng nhập..."
              : "Kiểm tra quyền admin..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex admin-page relative z-10">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen relative z-10">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              Quản trị hệ thống
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Xin chào, {user?.email}
              </span>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-white">
                  {user?.email?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>

      {/* Toast Container for admin */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}
