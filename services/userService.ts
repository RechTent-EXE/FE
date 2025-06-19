import apiClient from "./api";
import {
  UserProfile,
  UpdateProfileData,
  PasswordChangeData,
} from "../types/user";

// Định nghĩa types
export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

export interface CreateUserData {
  name: string;
  username: string;
  email: string;
  phone?: string;
  website?: string;
}

// Service class for User operations
class UserService {
  // Lấy danh sách users
  async getUsers(): Promise<User[]> {
    const response = await apiClient.get("/users");
    return response.data;
  }

  // Lấy user theo ID
  async getUserById(userId: string): Promise<UserProfile> {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  }

  // Tạo user mới
  async createUser(userData: CreateUserData): Promise<User> {
    const response = await apiClient.post("/users", userData);
    return response.data;
  }

  // Cập nhật user
  async updateUser(
    id: number,
    userData: Partial<CreateUserData>
  ): Promise<User> {
    const response = await apiClient.put(`/users/${id}`, userData);
    return response.data;
  }

  // Xóa user
  async deleteUser(id: number): Promise<void> {
    await apiClient.delete(`/users/${id}`);
  }

  // Tìm kiếm users
  async searchUsers(query: string): Promise<User[]> {
    const response = await apiClient.get(
      `/users?q=${encodeURIComponent(query)}`
    );
    return response.data;
  }

  // Update user profile (using FormData as backend expects)
  async updateProfile(
    userId: string,
    userData: UpdateProfileData
  ): Promise<UserProfile> {
    const formData = new FormData();

    // Add profile fields
    formData.append("fullname", userData.fullname || "");
    formData.append("phone", userData.phone || "");
    formData.append("address", userData.address || "");

    // Add image fields as empty strings (backend expects these)
    formData.append("avtUrl", "");
    formData.append("identityFrontImage", "");
    formData.append("identityBackImage", "");
    formData.append("drivingLicenseFrontImageUrl", "");
    formData.append("drivingLicenseBackImageUrl", "");
    formData.append("passportFrontImageUrl", "");

    const response = await apiClient.put(`/users/${userId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  }

  // Change password
  async changePassword(
    userId: string,
    passwordData: PasswordChangeData
  ): Promise<void> {
    await apiClient.put(`/users/${userId}/password`, {
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    });
  }

  // Upload avatar (using same endpoint as profile update)
  async uploadAvatar(userId: string, file: File): Promise<UserProfile> {
    const formData = new FormData();

    // Get current user data first
    const currentUser = await this.getUserById(userId);

    // Add current profile fields
    formData.append("fullname", currentUser.fullname || "");
    formData.append("phone", currentUser.phone || "");
    formData.append("address", currentUser.address || "");

    // Add the avatar file
    formData.append("avatar", file);

    // Add other image fields - preserve existing values
    formData.append("identityFrontImage", currentUser.identityFrontImage || "");
    formData.append("identityBackImage", currentUser.identityBackImage || "");
    formData.append(
      "drivingLicenseFrontImageUrl",
      currentUser.drivingLicenseFrontImageUrl || ""
    );
    formData.append(
      "drivingLicenseBackImageUrl",
      currentUser.drivingLicenseBackImageUrl || ""
    );
    formData.append(
      "passportFrontImageUrl",
      currentUser.passportFrontImageUrl || ""
    );

    const response = await apiClient.put(`/users/${userId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }

  // Upload identity document (using same endpoint as profile update)
  async uploadIdentityDocument(
    userId: string,
    type:
      | "identity_front"
      | "identity_back"
      | "driver_license_front"
      | "driver_license_back"
      | "passport_front",
    file: File
  ): Promise<UserProfile> {
    const formData = new FormData();

    // Get current user data first
    const currentUser = await this.getUserById(userId);

    // Add current profile fields
    formData.append("fullname", currentUser.fullname || "");
    formData.append("phone", currentUser.phone || "");
    formData.append("address", currentUser.address || "");

    // Add avatar as empty string if no current avatar
    formData.append("avtUrl", "");

    // Add document files - preserve existing images, only update the new one
    switch (type) {
      case "identity_front":
        formData.append("identityFrontImage", file);
        formData.append(
          "identityBackImage",
          currentUser.identityBackImage || ""
        );
        break;
      case "identity_back":
        formData.append(
          "identityFrontImage",
          currentUser.identityFrontImage || ""
        );
        formData.append("identityBackImage", file);
        break;
      case "driver_license_front":
        formData.append("drivingLicenseFrontImageUrl", file);
        formData.append(
          "drivingLicenseBackImageUrl",
          currentUser.drivingLicenseBackImageUrl || ""
        );
        break;
      case "driver_license_back":
        formData.append(
          "drivingLicenseFrontImageUrl",
          currentUser.drivingLicenseFrontImageUrl || ""
        );
        formData.append("drivingLicenseBackImageUrl", file);
        break;
      case "passport_front":
        formData.append("passportFrontImageUrl", file);
        break;
    }

    // Add remaining fields - preserve existing values
    if (!["identity_front", "identity_back"].includes(type)) {
      formData.append(
        "identityFrontImage",
        currentUser.identityFrontImage || ""
      );
      formData.append("identityBackImage", currentUser.identityBackImage || "");
    }
    if (!["driver_license_front", "driver_license_back"].includes(type)) {
      formData.append(
        "drivingLicenseFrontImageUrl",
        currentUser.drivingLicenseFrontImageUrl || ""
      );
      formData.append(
        "drivingLicenseBackImageUrl",
        currentUser.drivingLicenseBackImageUrl || ""
      );
    }
    if (type !== "passport_front") {
      formData.append(
        "passportFrontImageUrl",
        currentUser.passportFrontImageUrl || ""
      );
    }

    const response = await apiClient.put(`/users/${userId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }

  // Submit face verification
  async verifyFace(userId: string, videoBlob: Blob): Promise<void> {
    const formData = new FormData();
    formData.append("faceVideo", videoBlob);

    await apiClient.post(`/users/${userId}/verify-face`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  // Delete specific image field
  async deleteImage(userId: string, field: string): Promise<UserProfile> {
    const response = await apiClient.delete(`/users/${userId}/image/${field}`);
    return response.data;
  }

  // Simple test function to try different approaches
  async testSimpleUpdate(userId: string): Promise<void> {
    const testData = {
      fullname: "Test User",
      phone: "123456789",
      address: "Test Address",
    };

    // Test 1: Basic PATCH
    try {
      await apiClient.patch(`/users/${userId}`, testData);
    } catch {
      // PATCH failed
    }

    // Test 2: PUT with all fields
    try {
      const fullData = {
        ...testData,
        avtUrl: "",
        identityFrontImage: "",
        identityBackImage: "",
        drivingLicenseFrontImageUrl: "",
        drivingLicenseBackImageUrl: "",
        passportFrontImageUrl: "",
      };
      await apiClient.put(`/users/${userId}`, fullData);
    } catch {
      // PUT with all fields failed
    }

    // Test 3: Profile specific endpoint
    try {
      await apiClient.put(`/users/${userId}/profile`, testData);
    } catch {
      // Profile endpoint failed
    }
  }
}

// Export instance singleton
export const userService = new UserService();
export default userService;
