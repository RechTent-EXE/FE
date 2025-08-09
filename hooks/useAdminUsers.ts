import useSWR from "swr";
import api from "@/lib/api";

// Types for admin users
export interface AdminUser {
  isFaceVerified: boolean;
  favorites: string[];
  _id: string;
  userId: string;
  email: string;
  password: string;
  role: number;
  fullname: string;
  dateOfBirth: string;
  avtUrl: string;
  phone: string;
  address: string;
  identityType: string;
  identityNumber: string;
  identityFrontImage: string;
  identityBackImage: string;
  drivingLicenseFrontImageUrl: string;
  drivingLicenseBackImageUrl: string;
  passportFrontImageUrl: string;
  rentalPoint: number;
  isVerified: boolean;
  isBanned: boolean;
  __v: number;
}

// Hook để lấy latest users
export function useLatestUsers() {
  const { data, error, isLoading, mutate } = useSWR<AdminUser[]>(
    "/admin/users/latest",
    () => api.get("/admin/users/latest").then((res) => res.data)
  );

  return {
    users: data || [],
    isLoading,
    isError: !!error,
    error,
    refresh: mutate,
  };
}

// Hook để lấy user stats
export function useUserStats() {
  const { data, error, isLoading, mutate } = useSWR<{
    totalActiveUsers: number;
    totalInactiveUsers: number;
    usersWithActiveCarts: number;
  }>("/admin/users/stats", () =>
    api.get("/admin/users/stats").then((res) => res.data)
  );

  return {
    data,
    isLoading,
    isError: !!error,
    error,
    refresh: mutate,
  };
}

// Hook để lấy user theo ID
export function useUserById(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR<AdminUser>(
    id ? `/users/${id}` : null,
    id ? () => api.get(`/users/${id}`).then((res) => res.data) : null
  );

  return {
    user: data,
    isLoading,
    isError: !!error,
    error,
    refresh: mutate,
  };
}

// Hook để update user status
export function useUpdateUserStatus() {
  const updateUserStatus = async (
    userId: string,
    status: "ban" | "unban" | "verify" | "unverify"
  ) => {
    try {
      const response = await api.patch(`/admin/users/${userId}/status`, {
        status,
      });
      return { data: response.data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  return { updateUserStatus };
}
