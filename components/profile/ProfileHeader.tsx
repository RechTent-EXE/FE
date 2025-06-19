import Image from "next/image";
import { Camera, Star, Shield, Clock } from "lucide-react";
import { UserProfile } from "../../types/user";

interface ProfileHeaderProps {
  profile: UserProfile;
  onAvatarUpload: (file: File) => void;
  isLoading?: boolean;
}

export const ProfileHeader = ({
  profile,
  onAvatarUpload,
  isLoading = false,
}: ProfileHeaderProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Kích thước file không được vượt quá 5MB");
        return;
      }
      onAvatarUpload(file);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8 mb-8">
      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6">
        <div className="relative">
          <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
            <Image
              src={profile.avtUrl || "/placeholder.svg?height=128&width=128"}
              alt="Avatar"
              width={128}
              height={128}
              className="w-full h-full object-cover"
            />
          </div>
          <label className="absolute bottom-0 right-0 w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full flex items-center justify-center hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg transform hover:scale-110 cursor-pointer">
            <Camera size={16} className="lg:w-5 lg:h-5" />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              disabled={isLoading}
            />
          </label>
          {isLoading && (
            <div className="absolute inset-0 bg-black/20 rounded-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
            </div>
          )}
        </div>

        <div className="flex-1 text-center lg:text-left">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            {profile.fullname || "Chưa cập nhật tên"}
          </h1>
          <p className="text-gray-600 mb-4">{profile.email}</p>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
            <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-100 to-orange-100 px-4 py-2 rounded-full">
              <Star size={18} className="fill-yellow-500 text-yellow-500" />
              <span className="font-semibold text-yellow-700">
                {profile.rentalPoint || 0} điểm
              </span>
            </div>

            {profile.isVerified ? (
              <div className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                <Shield size={16} />
                Đã xác minh
              </div>
            ) : (
              <div className="bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-700 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                <Clock size={16} />
                Chưa xác minh
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
