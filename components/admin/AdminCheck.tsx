"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useAdmin } from "@/hooks/useAdmin";
import { getAccessToken, getTokenPayload } from "@/lib/auth-utils";
import { Shield, User, AlertCircle, RefreshCw } from "lucide-react";
import { useState } from "react";
import userService from "@/services/userService";

interface DebugInfo {
  localStorage: {
    hasAccessToken: boolean;
    accessTokenLength: number;
    accessTokenStart: string;
  };
  tokenPayload: unknown;
  authContext: {
    user: unknown;
    isAuthenticated: boolean;
    isAdmin: boolean;
    userRole: number | undefined;
  };
  apiResponse: unknown;
  directChecks: {
    tokenRole: number | null;
    tokenAdmin: boolean;
  };
}

export default function AdminCheck() {
  const { user, isAuthenticated, isLoading, checkAuth } = useAuth();
  const { isAdmin, userRole, canAccessAdmin, getTokenRole, checkTokenAdmin } =
    useAdmin();
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  const [testing, setTesting] = useState(false);

  const handleRefreshAuth = async () => {
    setTesting(true);
    try {
      await checkAuth();
    } finally {
      setTesting(false);
    }
  };

  const handleDetailedDebug = async () => {
    setTesting(true);
    try {
      const token = getAccessToken();
      const tokenPayload = getTokenPayload();

      let apiUserData = null;
      if (user?.id) {
        try {
          apiUserData = await userService.getUserById(user.id);
        } catch (error) {
          apiUserData = {
            error: error instanceof Error ? error.message : "Unknown error",
          };
        }
      }

      const debug = {
        localStorage: {
          hasAccessToken: !!token,
          accessTokenLength: token?.length || 0,
          accessTokenStart: token?.substring(0, 50) + "..." || "N/A",
        },
        tokenPayload: tokenPayload,
        authContext: {
          user,
          isAuthenticated,
          isAdmin,
          userRole,
        },
        apiResponse: apiUserData,
        directChecks: {
          tokenRole: getTokenRole(),
          tokenAdmin: checkTokenAdmin(),
        },
      };

      setDebugInfo(debug);
      console.log("🔍 [FULL DEBUG]", debug);
    } catch (error) {
      console.error("Debug error:", error);
    } finally {
      setTesting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gray-100 rounded-lg p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <span className="text-red-800 font-medium">Chưa đăng nhập</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Basic Info */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <User className="w-5 h-5" />
          <span>Thông tin người dùng</span>
        </h3>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Email:</span>
            <span className="font-medium">{user?.email}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">User ID:</span>
            <span className="font-medium">{user?.id}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Role (từ context):</span>
            <span className="font-medium">
              {userRole !== undefined ? userRole : "N/A"}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Role (từ token):</span>
            <span className="font-medium">
              {getTokenRole() !== null ? getTokenRole() : "N/A"}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Is Admin (context):</span>
            <span
              className={`font-medium ${
                isAdmin ? "text-green-600" : "text-red-600"
              }`}
            >
              {isAdmin ? "✓ Có" : "✗ Không"}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Is Admin (token):</span>
            <span
              className={`font-medium ${
                checkTokenAdmin() ? "text-green-600" : "text-red-600"
              }`}
            >
              {checkTokenAdmin() ? "✓ Có" : "✗ Không"}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Có thể truy cập admin:</span>
            <span
              className={`font-medium ${
                canAccessAdmin ? "text-green-600" : "text-red-600"
              }`}
            >
              {canAccessAdmin ? "✓ Có" : "✗ Không"}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button
          onClick={handleRefreshAuth}
          disabled={testing}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${testing ? "animate-spin" : ""}`} />
          <span>Refresh Auth</span>
        </button>

        <button
          onClick={handleDetailedDebug}
          disabled={testing}
          className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
        >
          <AlertCircle className="w-4 h-4" />
          <span>Debug Chi Tiết</span>
        </button>
      </div>

      {/* Debug Info */}
      {debugInfo && (
        <div className="bg-gray-900 text-gray-100 rounded-lg p-4">
          <h4 className="text-lg font-semibold mb-3 text-green-400">
            🔍 Debug Information
          </h4>
          <pre className="text-xs overflow-auto max-h-96">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>
      )}

      {/* Status Messages */}
      {isAdmin && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-green-600" />
            <span className="text-green-800 font-medium">
              Bạn có quyền truy cập Admin Panel
            </span>
          </div>
          <p className="text-green-700 text-sm mt-1">
            Role = 0 → Admin privileges granted
          </p>
        </div>
      )}

      {!isAdmin && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <span className="text-yellow-800 font-medium">
              Không có quyền admin
            </span>
          </div>
          <p className="text-yellow-700 text-sm mt-1">
            Role = {userRole} → Chỉ admin (role = 0) mới có thể truy cập Admin
            Panel
          </p>
        </div>
      )}
    </div>
  );
}
