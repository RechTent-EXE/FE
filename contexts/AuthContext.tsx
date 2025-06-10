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

interface User {
  id: string;
  email: string;
  fullname?: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
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
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterFormData) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
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

// Helper function to decode JWT token (simple implementation)
const decodeToken = (token: string): User | null => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return {
      id: payload.sub || payload.id,
      email: payload.email,
      // Note: fullname, phone, address, dateOfBirth are not in JWT payload
      // They should be fetched from user profile API if needed
    };
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mounted, setMounted] = useState(false);

  const checkAuth = async () => {
    // Only check auth on client side to avoid hydration mismatch
    if (typeof window === "undefined" || !mounted) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const accessToken = getAccessToken();
      if (accessToken) {
        const decodedUser = decodeToken(accessToken);
        if (decodedUser) {
          setUser(decodedUser);
          setIsAuthenticated(true);
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
              }
            } catch (refreshError) {
              console.error("Token refresh failed:", refreshError);
              clearTokens();
              setUser(null);
              setIsAuthenticated(false);
            }
          }
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await authAPI.login({ email, password });

      // Store tokens
      setAccessToken(response.access_token);
      setRefreshToken(response.refresh_token);

      // Decode and set user
      const decodedUser = decodeToken(response.access_token);
      if (decodedUser) {
        setUser(decodedUser);
        setIsAuthenticated(true);
      }
    } catch (error: unknown) {
      console.error("Login failed:", error);
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
      console.error("Registration failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await authAPI.logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
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
    login,
    register,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
