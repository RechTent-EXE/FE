import axios, { AxiosInstance, AxiosResponse } from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Token management
let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
  if (token) {
    localStorage.setItem("accessToken", token);
  } else {
    localStorage.removeItem("accessToken");
  }
};

export const getAccessToken = (): string | null => {
  if (accessToken) return accessToken;

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    if (token) {
      accessToken = token;
      return token;
    }
  }
  return null;
};

export const getRefreshToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("refreshToken");
  }
  return null;
};

export const setRefreshToken = (token: string | null) => {
  if (typeof window !== "undefined") {
    if (token) {
      localStorage.setItem("refreshToken", token);
    } else {
      localStorage.removeItem("refreshToken");
    }
  }
};

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshAccessToken();
        if (newAccessToken) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        clearTokens();
        if (typeof window !== "undefined") {
          window.location.href = "/auth/login";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API functions
export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  fullname: string;
  phone: string;
  address: string;
  dateOfBirth: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user?: {
    id: string;
    email: string;
    fullname: string;
    phone: string;
    address: string;
    dateOfBirth: string;
  };
}

export const authAPI = {
  login: async (data: LoginData): Promise<AuthResponse> => {
    console.log("Login API call - URL:", `${API_BASE_URL}/auth/login`);
    console.log("Login API call - Data:", data);
    const response = await api.post("/auth/login", data);
    console.log("Login API response:", response.data);
    return response.data;
  },

  register: async (data: RegisterData): Promise<{ message: string }> => {
    const response = await api.post("/auth/register", data);
    return response.data;
  },

  refreshToken: async (
    refreshToken: string
  ): Promise<{ access_token: string }> => {
    const response = await api.post("/auth/refresh-token", { refreshToken });
    return response.data;
  },

  logout: async (): Promise<void> => {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      try {
        await api.post("/auth/logout", { refreshToken });
      } catch (error) {
        console.error("Logout error:", error);
      }
    }
    clearTokens();
  },
};

// Refresh access token function
export const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await authAPI.refreshToken(refreshToken);
    const newAccessToken = response.access_token;

    setAccessToken(newAccessToken);
    return newAccessToken;
  } catch (error) {
    console.error("Token refresh failed:", error);
    clearTokens();
    return null;
  }
};

// Clear all tokens
export const clearTokens = () => {
  setAccessToken(null);
  setRefreshToken(null);
  accessToken = null;
};

export default api;
