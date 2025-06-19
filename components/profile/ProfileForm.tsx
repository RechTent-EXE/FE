import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit3,
  Eye,
  Save,
  Calendar,
} from "lucide-react";
import {
  UserProfile,
  UpdateProfileData,
  PasswordChangeData,
} from "../../types/user";
import { useState } from "react";

interface ProfileFormProps {
  profile: UserProfile;
  isEditing: boolean;
  isSaving: boolean;
  onEditToggle: () => void;
  onProfileUpdate: (data: UpdateProfileData) => Promise<boolean>;
  onPasswordChange: (data: PasswordChangeData) => Promise<boolean>;
}

export const ProfileForm = ({
  profile,
  isEditing,
  isSaving,
  onEditToggle,
  onProfileUpdate,
  onPasswordChange,
}: ProfileFormProps) => {
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordData, setPasswordData] = useState<PasswordChangeData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [formData, setFormData] = useState<UpdateProfileData>({
    fullname: profile.fullname || "",
    phone: profile.phone || "",
    address: profile.address || "",
  });

  const [dateOfBirth, setDateOfBirth] = useState(
    profile.dateOfBirth ? profile.dateOfBirth.split("T")[0] : ""
  );

  const handleSubmit = async () => {
    const success = await onProfileUpdate(formData);
    if (success) {
      onEditToggle();
    }
  };

  const handlePasswordSubmit = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Mật khẩu xác nhận không khớp");
      return;
    }

    const success = await onPasswordChange(passwordData);
    if (success) {
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowPasswordChange(false);
      alert("Đổi mật khẩu thành công!");
    }
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl lg:text-2xl font-bold text-gray-900">
            Thông tin cá nhân
          </h3>
          <button
            onClick={onEditToggle}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl"
          >
            <Edit3 size={16} />
            {isEditing ? "Hủy" : "Chỉnh sửa"}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Full Name */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Họ và tên <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                value={formData.fullname}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, fullname: e.target.value }))
                }
                disabled={!isEditing}
                placeholder="Nhập họ và tên"
                className={`w-full pl-12 pr-4 py-4 border rounded-xl transition-all ${
                  isEditing
                    ? "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    : "border-gray-200 bg-gray-50 text-gray-600"
                }`}
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Email
            </label>
            <div className="relative">
              <Mail
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="email"
                value={profile.email}
                disabled
                className="w-full pl-12 pr-4 py-4 border border-gray-200 bg-gray-50 rounded-xl text-gray-500"
              />
            </div>
            <p className="text-xs text-gray-500">Email không thể thay đổi</p>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Phone
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, phone: e.target.value }))
                }
                disabled={!isEditing}
                placeholder="Nhập số điện thoại"
                className={`w-full pl-12 pr-4 py-4 border rounded-xl transition-all ${
                  isEditing
                    ? "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    : "border-gray-200 bg-gray-50 text-gray-600"
                }`}
              />
            </div>
          </div>

          {/* Date of Birth */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Ngày sinh <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Calendar
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="date"
                value={dateOfBirth}
                disabled
                className="w-full pl-12 pr-4 py-4 border border-gray-200 bg-gray-50 rounded-xl text-gray-500"
              />
            </div>
            <p className="text-xs text-gray-500">
              Ngày sinh không thể thay đổi
            </p>
          </div>

          {/* Address - spans full width */}
          <div className="space-y-2 lg:col-span-2">
            <label className="block text-sm font-semibold text-gray-700">
              Địa chỉ <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <MapPin
                className="absolute left-4 top-4 text-gray-400"
                size={18}
              />
              <textarea
                value={formData.address}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, address: e.target.value }))
                }
                disabled={!isEditing}
                rows={3}
                placeholder="Nhập địa chỉ chi tiết"
                className={`w-full pl-12 pr-4 py-4 border rounded-xl transition-all resize-none ${
                  isEditing
                    ? "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    : "border-gray-200 bg-gray-50 text-gray-600"
                }`}
              />
            </div>
          </div>
        </div>

        {/* Required fields note */}
        <div className="mt-4 text-sm text-gray-600">
          <span className="text-red-500">*</span> Thông tin bắt buộc để tiến
          hành xác minh danh tính
        </div>

        {/* Password Change */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <button
            onClick={() => setShowPasswordChange(!showPasswordChange)}
            className="flex items-center gap-3 text-blue-600 hover:text-blue-800 transition-colors bg-blue-50 hover:bg-blue-100 px-4 py-3 rounded-xl"
          >
            <Eye size={18} />
            <span className="font-medium">Đổi mật khẩu</span>
          </button>

          {showPasswordChange && (
            <div className="mt-6 space-y-6 p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border border-gray-200">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mật khẩu hiện tại
                  </label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        currentPassword: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mật khẩu mới
                  </label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        newPassword: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Xác nhận mật khẩu
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <button
                onClick={handlePasswordSubmit}
                disabled={isSaving}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 text-white px-6 py-3 rounded-xl font-medium transition-all"
              >
                {isSaving ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
              </button>
            </div>
          )}
        </div>

        {/* Save Button */}
        {isEditing && (
          <div className="flex flex-col sm:flex-row gap-3 pt-8 mt-8 border-t border-gray-200">
            <button
              onClick={handleSubmit}
              disabled={isSaving}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 text-white px-8 py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Lưu thay đổi
                </>
              )}
            </button>
            <button
              onClick={onEditToggle}
              disabled={isSaving}
              className="border border-gray-300 hover:bg-gray-50 disabled:opacity-50 px-8 py-4 rounded-xl font-semibold transition-all"
            >
              Hủy
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
