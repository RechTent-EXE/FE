"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  authAPI,
  setAccessToken,
  setRefreshToken,
  getAccessToken,
  getRefreshToken,
  clearTokens,
} from "../lib/api";
import {
  validateToken,
  clearAccessToken,
  getTokenPayload,
} from "../lib/auth-utils";
import userService from "../services/userService";

interface User {
  id: string;
  email: string;
  fullname?: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  role?: number;
}

interface RegisterFormData {
  email: string;
  password: string;
  fullname: string;
  phone: string;
  address: string;
  dateOfBirth: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterFormData) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
  forgotPassword: (email: string) => Promise<string>;
  resetPassword: (token: string, newPassword: string) => Promise<string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

// Helper function to decode JWT token using auth-utils
const decodeToken = (token: string): User | null => {
  try {
    if (!token || typeof token !== "string" || token.trim() === "") {
      return null;
    }

    const payload = getTokenPayload();
    if (!payload) {
      return null;
    }

    return {
      id: payload.sub || payload.id || payload.userId || "",
      email: payload.email || "",
      fullname: payload.fullname || payload.fullName,
      role: payload.role,
    };
  } catch {
    clearAccessToken();
    return null;
  }
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userIsAdmin, setUserIsAdmin] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Fetch full user profile from API
  const refreshUserProfile = async () => {
    try {
      if (!user?.id) return;

      const userProfile = await userService.getUserById(user.id);
      const updatedUser: User = {
        ...user,
        fullname: userProfile.fullname,
        phone: userProfile.phone,
        address: userProfile.address,
        dateOfBirth: userProfile.dateOfBirth,
        role: userProfile.role,
      };

      setUser(updatedUser);
      setUserIsAdmin(userProfile.role === 0);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const checkAuth = async () => {
    // Only check auth on client side to avoid hydration mismatch
    if (typeof window === "undefined" || !mounted) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const accessToken = getAccessToken();
      console.log(
        "🔍 [DEBUG] Access token:",
        accessToken ? "exists" : "missing"
      );

      if (accessToken && validateToken()) {
        const decodedUser = decodeToken(accessToken);
        console.log("🔍 [DEBUG] Decoded user:", decodedUser);

        if (decodedUser) {
          setUser(decodedUser);
          setIsAuthenticated(true);

          // Check if role is in token, if not fetch from API
          if (decodedUser.role !== undefined) {
            console.log("🔍 [DEBUG] Role from token:", decodedUser.role);
            setUserIsAdmin(decodedUser.role === 0);
          } else {
            console.log("🔍 [DEBUG] Role not in token, fetching from API...");
            // Fetch full profile to get role
            try {
              const userProfile = await userService.getUserById(decodedUser.id);
              console.log("🔍 [DEBUG] User profile from API:", userProfile);
              console.log("🔍 [DEBUG] Role from API:", userProfile.role);

              const updatedUser: User = {
                ...decodedUser,
                role: userProfile.role,
              };
              setUser(updatedUser);
              setUserIsAdmin(userProfile.role === 0);
              console.log(
                "🔍 [DEBUG] Is admin set to:",
                userProfile.role === 0
              );
            } catch (error) {
              console.error("🔍 [DEBUG] Error fetching user role:", error);
              setUserIsAdmin(false);
            }
          }
        } else {
          // Token is invalid, try to refresh
          const refreshToken = getRefreshToken();
          if (refreshToken) {
            try {
              const response = await authAPI.refreshToken(refreshToken);
              const newAccessToken = response.access_token;
              setAccessToken(newAccessToken);

              const newDecodedUser = decodeToken(newAccessToken);
              if (newDecodedUser) {
                setUser(newDecodedUser);
                setIsAuthenticated(true);
                setUserIsAdmin(newDecodedUser.role === 0);
              }
            } catch {
              clearTokens();
              setUser(null);
              setIsAuthenticated(false);
              setUserIsAdmin(false);
            }
          }
        }
      } else {
        console.log("🔍 [DEBUG] No valid token found");
        setUser(null);
        setIsAuthenticated(false);
        setUserIsAdmin(false);
      }
    } catch (error) {
      console.error("🔍 [DEBUG] Error in checkAuth:", error);
      setUser(null);
      setIsAuthenticated(false);
      setUserIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await authAPI.login({ email, password });
      console.log("🔍 [DEBUG] Login response:", response);

      // Store tokens
      setAccessToken(response.access_token);
      setRefreshToken(response.refresh_token);

      // Decode and set user
      const decodedUser = decodeToken(response.access_token);
      console.log("🔍 [DEBUG] Decoded user after login:", decodedUser);

      if (decodedUser) {
        setUser(decodedUser);
        setIsAuthenticated(true);

        // Fetch full profile to ensure we have role
        try {
          const userProfile = await userService.getUserById(decodedUser.id);
          console.log("🔍 [DEBUG] User profile after login:", userProfile);
          console.log("🔍 [DEBUG] Role from profile:", userProfile.role);

          const updatedUser: User = {
            ...decodedUser,
            role: userProfile.role,
          };
          setUser(updatedUser);
          setUserIsAdmin(userProfile.role === 0);
          console.log(
            "🔍 [DEBUG] Admin status set to:",
            userProfile.role === 0
          );
        } catch (error) {
          console.error(
            "🔍 [DEBUG] Error fetching user profile after login:",
            error
          );
          setUserIsAdmin(decodedUser.role === 0);
        }
      }
    } catch (error: unknown) {
      console.error("🔍 [DEBUG] Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      await authAPI.register(data);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await authAPI.logout();
    } catch {
      // Silent error handling
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setUserIsAdmin(false);
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email: string): Promise<string> => {
    try {
      setIsLoading(true);
      const response = await authAPI.forgotPassword(email);
      return response.message || "Vui lòng kiểm tra email của bạn";
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Yêu cầu thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (
    token: string,
    newPassword: string
  ): Promise<string> => {
    try {
      setIsLoading(true);
      const response = await authAPI.resetPassword(token, newPassword);
      return response.message || "Đặt lại mật khẩu thành công";
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Đặt lại mật khẩu thất bại"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      checkAuth();
    }
  }, [mounted]);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    isAdmin: userIsAdmin,
    login,
    register,
    logout,
    checkAuth,
    refreshUserProfile,
    forgotPassword,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
