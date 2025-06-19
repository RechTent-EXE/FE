import { useState, useEffect } from "react";
import {
  UserProfile,
  UpdateProfileData,
  PasswordChangeData,
  IdentityFormData,
  ProfileValidation,
} from "../types/user";
import { userService } from "../services/userService";

// Function to decode JWT token and extract user ID
const getUserIdFromToken = (): string | null => {
  if (typeof window === "undefined") return null;

  const token =
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("accessToken");
  if (!token) return null;

  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    const decodedToken = JSON.parse(jsonPayload);
    return decodedToken.userId || decodedToken.id || decodedToken.sub;
  } catch {
    return null;
  }
};

export const useProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [identityData, setIdentityData] = useState<IdentityFormData>({
    cccdFront: null,
    cccdBack: null,
    driverLicenseFront: null,
    driverLicenseBack: null,
    passportFront: null,
    faceVerificationCompleted: false,
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const userId = getUserIdFromToken();
      if (!userId) {
        throw new Error("User not authenticated");
      }

      const data = await userService.getUserById(userId);
      setProfile(data);

      // Initialize identity data from profile
      setIdentityData({
        cccdFront: data.identityFrontImage || null,
        cccdBack: data.identityBackImage || null,
        driverLicenseFront: data.drivingLicenseFrontImageUrl || null,
        driverLicenseBack: data.drivingLicenseBackImageUrl || null,
        passportFront: data.passportFrontImageUrl || null,
        faceVerificationCompleted: false,
      });
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch profile";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: UpdateProfileData): Promise<boolean> => {
    try {
      setIsSaving(true);
      setError(null);

      const userId = getUserIdFromToken();
      if (!userId) {
        throw new Error("User not authenticated");
      }

      const updatedProfile = await userService.updateProfile(userId, data);
      setProfile(updatedProfile);
      return true;
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update profile";
      setError(errorMessage);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const changePassword = async (data: PasswordChangeData): Promise<boolean> => {
    try {
      setIsSaving(true);
      setError(null);

      const userId = getUserIdFromToken();
      if (!userId) {
        throw new Error("User not authenticated");
      }

      await userService.changePassword(userId, data);
      return true;
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to change password";
      setError(errorMessage);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const uploadAvatar = async (file: File): Promise<boolean> => {
    try {
      setIsSaving(true);
      setError(null);

      const userId = getUserIdFromToken();
      if (!userId) {
        throw new Error("User not authenticated");
      }

      const updatedProfile = await userService.uploadAvatar(userId, file);
      setProfile(updatedProfile);
      return true;
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to upload avatar";
      setError(errorMessage);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const uploadIdentityDocument = async (
    type:
      | "identity_front"
      | "identity_back"
      | "driver_license_front"
      | "driver_license_back"
      | "passport_front",
    file: File
  ): Promise<boolean> => {
    try {
      setIsSaving(true);
      setError(null);

      const userId = getUserIdFromToken();
      if (!userId) {
        throw new Error("User not authenticated");
      }

      const updatedProfile = await userService.uploadIdentityDocument(
        userId,
        type,
        file
      );
      setProfile(updatedProfile);

      // Update identity data state without fetching the entire profile
      setIdentityData((prev) => ({
        ...prev,
        cccdFront: updatedProfile.identityFrontImage || prev.cccdFront,
        cccdBack: updatedProfile.identityBackImage || prev.cccdBack,
        driverLicenseFront:
          updatedProfile.drivingLicenseFrontImageUrl || prev.driverLicenseFront,
        driverLicenseBack:
          updatedProfile.drivingLicenseBackImageUrl || prev.driverLicenseBack,
        passportFront:
          updatedProfile.passportFrontImageUrl || prev.passportFront,
      }));

      return true;
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to upload document";
      setError(errorMessage);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const verifyFace = async (videoBlob: Blob): Promise<boolean> => {
    try {
      setIsSaving(true);
      setError(null);

      const userId = getUserIdFromToken();
      if (!userId) {
        throw new Error("User not authenticated");
      }

      await userService.verifyFace(userId, videoBlob);
      setIdentityData((prev) => ({ ...prev, faceVerificationCompleted: true }));
      return true;
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to verify face";
      setError(errorMessage);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const deleteImage = async (field: string): Promise<boolean> => {
    try {
      setIsSaving(true);
      setError(null);

      const userId = getUserIdFromToken();
      if (!userId) {
        throw new Error("User not authenticated");
      }

      const updatedProfile = await userService.deleteImage(userId, field);
      setProfile(updatedProfile);

      // Update identity data state
      setIdentityData((prev) => ({
        ...prev,
        cccdFront: updatedProfile.identityFrontImage || null,
        cccdBack: updatedProfile.identityBackImage || null,
        driverLicenseFront: updatedProfile.drivingLicenseFrontImageUrl || null,
        driverLicenseBack: updatedProfile.drivingLicenseBackImageUrl || null,
        passportFront: updatedProfile.passportFrontImageUrl || null,
      }));

      return true;
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete image";
      setError(errorMessage);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const validateProfile = (): ProfileValidation => {
    if (!profile) {
      return {
        hasCompletePersonalInfo: false,
        hasEnoughDocuments: false,
        canProceedToFaceVerification: false,
        missingFields: ["Profile not loaded"],
      };
    }

    const missingFields: string[] = [];

    // Check personal information completeness
    if (!profile.fullname?.trim()) missingFields.push("Họ và tên");
    if (!profile.phone?.trim()) missingFields.push("Số điện thoại");
    if (!profile.address?.trim()) missingFields.push("Địa chỉ");
    if (!profile.dateOfBirth) missingFields.push("Ngày sinh");

    const hasCompletePersonalInfo = missingFields.length === 0;

    // Check uploaded documents - phải đủ cả 2 mặt cho CCCD và bằng lái xe
    const uploadedDocuments = [
      identityData.cccdFront && identityData.cccdBack, // CCCD phải đủ cả 2 mặt
      identityData.driverLicenseFront && identityData.driverLicenseBack, // Bằng lái xe phải đủ cả 2 mặt
      identityData.passportFront, // Hộ chiếu chỉ cần 1 mặt
    ].filter(Boolean).length;

    const hasEnoughDocuments = uploadedDocuments >= 2;

    if (uploadedDocuments < 2) {
      missingFields.push(
        "Ít nhất 2 loại giấy tờ tùy thân (CCCD và bằng lái xe phải đủ cả 2 mặt)"
      );
    }

    return {
      hasCompletePersonalInfo,
      hasEnoughDocuments,
      canProceedToFaceVerification:
        hasCompletePersonalInfo && hasEnoughDocuments,
      missingFields,
    };
  };

  const getUploadedDocumentsCount = (): number => {
    return [
      identityData.cccdFront && identityData.cccdBack, // CCCD phải đủ cả 2 mặt
      identityData.driverLicenseFront && identityData.driverLicenseBack, // Bằng lái xe phải đủ cả 2 mặt
      identityData.passportFront, // Hộ chiếu chỉ cần 1 mặt
    ].filter(Boolean).length;
  };

  return {
    profile,
    isLoading,
    isSaving,
    error,
    identityData,
    setIdentityData,
    updateProfile,
    changePassword,
    uploadAvatar,
    uploadIdentityDocument,
    verifyFace,
    deleteImage,
    validateProfile,
    getUploadedDocumentsCount,
    refetchProfile: fetchProfile,
  };
};
