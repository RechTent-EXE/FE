// User type definitions matching API response

export interface UserProfile {
  identityNumber: string;
  identityFrontImage: string;
  identityBackImage: string;
  drivingLicenseFrontImageUrl: string;
  drivingLicenseBackImageUrl: string;
  passportFrontImageUrl: string;
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
  rentalPoint: number;
  isVerified: boolean;
  isBanned: boolean;
  __v: number;
}

export interface UpdateProfileData {
  fullname?: string;
  phone?: string;
  address?: string;
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface IdentityFormData {
  cccdFront: string | null;
  cccdBack: string | null;
  driverLicenseFront: string | null;
  driverLicenseBack: string | null;
  passportFront: string | null;
  faceVerificationCompleted: boolean;
}

export interface IdentityDocumentUpload {
  type:
    | "cccd_front"
    | "cccd_back"
    | "driver_license_front"
    | "driver_license_back"
    | "passport_front";
  file: File;
}

export interface ProfileValidation {
  hasCompletePersonalInfo: boolean;
  hasEnoughDocuments: boolean;
  canProceedToFaceVerification: boolean;
  missingFields: string[];
}
