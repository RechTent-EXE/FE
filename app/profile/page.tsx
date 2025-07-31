"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Shield, ArrowLeft, Package } from "lucide-react";
import { useProfile } from "../../hooks/useProfile";
import { ProfileHeader } from "../../components/profile/ProfileHeader";
import { ProfileForm } from "../../components/profile/ProfileForm";
import { IdentityVerification } from "../../components/profile/IdentityVerification";
import OrderHistory from "../../components/profile/OrderHistory";

import { UpdateProfileData, PasswordChangeData } from "../../types/user";

export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"profile" | "identity" | "orders">(
    "profile"
  );
  const [isEditing, setIsEditing] = useState(false);

  // Khôi phục trạng thái modal từ localStorage
  useEffect(() => {
    const savedTab = localStorage.getItem("profile-active-tab");
    if (savedTab === "identity" || savedTab === "orders") {
      setActiveTab(savedTab as "profile" | "identity" | "orders");
    }
  }, []);

  // Lưu trạng thái tab khi thay đổi
  const handleTabChange = (tab: "profile" | "identity" | "orders") => {
    setActiveTab(tab);
    localStorage.setItem("profile-active-tab", tab);
  };

  const {
    profile,
    isLoading,
    isSaving,
    error,
    identityData,
    updateProfile,
    changePassword,
    uploadAvatar,
    uploadIdentityDocument,
    verifyFace,
    deleteImage,
    validateProfile,
  } = useProfile();

  // Get validation results
  const validation = validateProfile();

  const handleProfileUpdate = async (data: UpdateProfileData) => {
    const success = await updateProfile(data);
    if (success) {
      alert("Cập nhật thông tin thành công!");
    } else {
      alert("Có lỗi xảy ra khi cập nhật thông tin");
    }
    return success;
  };

  const handlePasswordChange = async (data: PasswordChangeData) => {
    const success = await changePassword(data);
    if (success) {
      alert("Đổi mật khẩu thành công!");
    } else {
      alert("Có lỗi xảy ra khi đổi mật khẩu");
    }
    return success;
  };

  const handleAvatarUpload = async (file: File) => {
    const success = await uploadAvatar(file);
    if (!success) {
      alert("Có lỗi xảy ra khi tải lên ảnh đại diện");
    }
  };

  const handleDocumentUpload = async (
    type:
      | "identity_front"
      | "identity_back"
      | "driver_license_front"
      | "driver_license_back"
      | "passport_front",
    file: File
  ) => {
    // Lưu trạng thái identity tab trước khi upload
    localStorage.setItem("profile-active-tab", "identity");

    const success = await uploadIdentityDocument(type, file);
    if (!success) {
      alert("Có lỗi xảy ra khi tải lên giấy tờ");
    }
    return success;
  };

  const handleFaceVerification = async (videoBlob: Blob) => {
    const success = await verifyFace(videoBlob);
    if (!success) {
      alert("Có lỗi xảy ra khi xác minh khuôn mặt");
    }
    return success;
  };

  const handleDeleteImage = async (field: string) => {
    const success = await deleteImage(field);
    if (!success) {
      alert("Có lỗi xảy ra khi xóa ảnh");
    }
    return success;
  };

  const handleSubmitVerification = async () => {
    // This would submit the verification request to admin
    // For now, we'll just show a success message
    alert(
      "Gửi yêu cầu xác minh thành công! Chúng tôi sẽ xem xét trong vòng 1-2 ngày làm việc."
    );
    // Clear saved tab state after successful verification
    localStorage.removeItem("profile-active-tab");
    return true;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin tài khoản...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {error || "Không thể tải thông tin tài khoản"}
          </h1>
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mx-auto bg-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            <ArrowLeft size={20} />
            Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pt-20 pb-16 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors group"
            >
              <ArrowLeft
                size={18}
                className="group-hover:-translate-x-1 transition-transform"
              />
              <span>Về trang chủ</span>
            </button>

            {/* Profile Header */}
            <ProfileHeader
              profile={profile}
              onAvatarUpload={handleAvatarUpload}
              isLoading={isSaving}
            />
          </div>

          {/* Tabs */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 overflow-hidden">
            <div className="flex border-b border-gray-200/50">
              <button
                onClick={() => handleTabChange("profile")}
                className={`flex items-center gap-3 px-6 lg:px-8 py-4 lg:py-6 font-medium transition-all ${
                  activeTab === "profile"
                    ? "border-b-2 border-blue-600 text-blue-600 bg-gradient-to-r from-blue-50 to-indigo-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <User size={20} />
                <span className="hidden sm:inline">Thông tin cá nhân</span>
                <span className="sm:hidden">Hồ sơ</span>
              </button>
              <button
                onClick={() => handleTabChange("identity")}
                className={`flex items-center gap-3 px-6 lg:px-8 py-4 lg:py-6 font-medium transition-all ${
                  activeTab === "identity"
                    ? "border-b-2 border-blue-600 text-blue-600 bg-gradient-to-r from-blue-50 to-indigo-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <Shield size={20} />
                <span className="hidden sm:inline">Xác minh danh tính</span>
                <span className="sm:hidden">Xác minh</span>
                {!profile.isVerified && (
                  <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs font-medium">
                    <span className="hidden sm:inline">Chưa xác minh</span>
                    <span className="sm:hidden">!</span>
                  </span>
                )}
              </button>
              <button
                onClick={() => handleTabChange("orders")}
                className={`flex items-center gap-3 px-6 lg:px-8 py-4 lg:py-6 font-medium transition-all ${
                  activeTab === "orders"
                    ? "border-b-2 border-blue-600 text-blue-600 bg-gradient-to-r from-blue-50 to-indigo-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <Package size={20} />
                <span className="hidden sm:inline">Lịch sử đơn hàng</span>
                <span className="sm:hidden">Đơn hàng</span>
              </button>
            </div>

            {/* Profile Tab */}
            {activeTab === "profile" && (
              <ProfileForm
                profile={profile}
                isEditing={isEditing}
                isSaving={isSaving}
                onEditToggle={() => setIsEditing(!isEditing)}
                onProfileUpdate={handleProfileUpdate}
                onPasswordChange={handlePasswordChange}
              />
            )}

            {/* Identity Verification Tab */}
            {activeTab === "identity" && (
              <div className="p-6 lg:p-8">
                <div className="max-w-4xl mx-auto">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                      Xác minh danh tính
                    </h3>
                    <p className="text-gray-600 text-lg">
                      Để đảm bảo an toàn cho quá trình thuê thiết bị, vui lòng
                      hoàn thành các bước xác minh danh tính.
                    </p>
                  </div>

                  <IdentityVerification
                    profile={profile}
                    identityData={identityData}
                    isSaving={isSaving}
                    validation={validation}
                    onDocumentUpload={handleDocumentUpload}
                    onDeleteImage={handleDeleteImage}
                    onFaceVerification={handleFaceVerification}
                    onSubmitVerification={handleSubmitVerification}
                  />
                </div>
              </div>
            )}

            {/* Order History Tab */}
            {activeTab === "orders" && (
              <div className="p-6 lg:p-8">
                <div className="max-w-6xl mx-auto">
                  <OrderHistory />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
