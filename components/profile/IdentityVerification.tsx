import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Upload,
  X,
  AlertCircle,
  CheckCircle,
  FileText,
  Edit3,
} from "lucide-react";
import {
  UserProfile,
  IdentityFormData,
  ProfileValidation,
} from "../../types/user";
import { ExtractFaceFromImage } from "./ExtractFaceFromImage";
import { CameraVideoIdentify } from "./CameraVideoIdentify";

interface IdentityVerificationProps {
  profile: UserProfile;
  identityData: IdentityFormData;
  isSaving: boolean;
  validation: ProfileValidation;
  onDocumentUpload: (
    type:
      | "identity_front"
      | "identity_back"
      | "driver_license_front"
      | "driver_license_back"
      | "passport_front",
    file: File
  ) => Promise<boolean>;
  onDeleteImage: (field: string) => Promise<boolean>;
  onFaceVerification: (videoBlob: Blob) => Promise<boolean>;
  onSubmitVerification: () => Promise<boolean>;
}

// Document types configuration
const DOCUMENT_TYPES = {
  NATIONAL_ID: "national_id",
  DRIVER_LICENSE: "driver_license",
  PASSPORT: "passport",
} as const;

type DocumentType = (typeof DOCUMENT_TYPES)[keyof typeof DOCUMENT_TYPES];

export const IdentityVerification = ({
  profile,
  identityData,
  isSaving,
  validation,
  onDocumentUpload,
  onDeleteImage,
  onFaceVerification,
  onSubmitVerification,
}: IdentityVerificationProps) => {
  const [currentStep, setCurrentStep] = useState<
    "documents" | "extract" | "verify"
  >("documents");
  const [showCamera, setShowCamera] = useState<string | null>(null);
  const [idImageDescriptor, setIdImageDescriptor] =
    useState<Float32Array | null>(null);
  const [faceExtractionError, setFaceExtractionError] = useState<string | null>(
    null
  );
  const [verificationComplete, setVerificationComplete] = useState(false);

  // State for document selection - khôi phục từ localStorage
  const [selectedDocuments, setSelectedDocuments] = useState<Set<DocumentType>>(
    new Set([DOCUMENT_TYPES.NATIONAL_ID]) // National ID is always selected by default
  );

  // Khôi phục trạng thái từ localStorage khi component mount
  useEffect(() => {
    const savedStep = localStorage.getItem("identity-verification-step");
    const savedSelectedDocs = localStorage.getItem(
      "identity-selected-documents"
    );

    if (savedStep && ["documents", "extract", "verify"].includes(savedStep)) {
      setCurrentStep(savedStep as "documents" | "extract" | "verify");
    }

    if (savedSelectedDocs) {
      try {
        const docArray = JSON.parse(savedSelectedDocs);
        setSelectedDocuments(new Set(docArray));
      } catch {
        // Error parsing saved documents - ignore and use default
      }
    }
  }, []);

  // Lưu trạng thái khi thay đổi
  useEffect(() => {
    localStorage.setItem("identity-verification-step", currentStep);
  }, [currentStep]);

  useEffect(() => {
    localStorage.setItem(
      "identity-selected-documents",
      JSON.stringify(Array.from(selectedDocuments))
    );
  }, [selectedDocuments]);

  // Theo dõi sự thay đổi profile để đóng modal khi cần
  useEffect(() => {
    // Kiểm tra xem có modal nào nên được đóng sau khi xóa ảnh không
    const shouldCloseIdentityModal =
      !profile.identityFrontImage && !profile.identityBackImage;
    const shouldCloseDriverLicenseModal =
      !profile.drivingLicenseFrontImageUrl &&
      !profile.drivingLicenseBackImageUrl;
    const shouldClosePassportModal = !profile.passportFrontImageUrl;

    // Nếu đang ở step documents và tất cả ảnh trong một loại giấy tờ đã bị xóa
    if (currentStep === "documents") {
      if (
        shouldCloseIdentityModal &&
        shouldCloseDriverLicenseModal &&
        shouldClosePassportModal
      ) {
        // Nếu tất cả ảnh đều bị xóa, quay về step documents
        localStorage.removeItem("identity-verification-step");
      }
    }
  }, [profile, currentStep]);

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type:
      | "identity_front"
      | "identity_back"
      | "driver_license_front"
      | "driver_license_back"
      | "passport_front"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      // Lưu trạng thái trước khi upload
      localStorage.setItem("identity-verification-step", "documents");
      await onDocumentUpload(type, file);
    }
  };

  // Mapping từ upload type sang field name trong database
  const getFieldNameFromUploadType = (uploadType: string): string => {
    const mapping: { [key: string]: string } = {
      identity_front: "identityFrontImage",
      identity_back: "identityBackImage",
      driver_license_front: "drivingLicenseFrontImageUrl",
      driver_license_back: "drivingLicenseBackImageUrl",
      passport_front: "passportFrontImageUrl",
    };
    return mapping[uploadType] || uploadType;
  };

  const removeImage = async (uploadType: string) => {
    const fieldName = getFieldNameFromUploadType(uploadType);
    const success = await onDeleteImage(fieldName);
    if (success) {
      // Logic để kiểm tra xem có nên đóng modal không sẽ được xử lý
      // thông qua effect khi profile được cập nhật
    }
  };

  const getUploadedDocumentsCount = () => {
    let count = 0;
    // CCCD phải đủ cả 2 mặt
    if (profile.identityFrontImage && profile.identityBackImage) count++;
    // Bằng lái xe phải đủ cả 2 mặt
    if (
      profile.drivingLicenseFrontImageUrl &&
      profile.drivingLicenseBackImageUrl
    )
      count++;
    // Hộ chiếu chỉ cần 1 mặt
    if (profile.passportFrontImageUrl) count++;
    return count;
  };

  const getRequiredDocumentsCount = () => {
    return selectedDocuments.size;
  };

  const hasEnoughDocuments = () => {
    let uploadedCount = 0;

    // Check National ID (mandatory) - phải đủ cả 2 mặt
    if (profile.identityFrontImage && profile.identityBackImage) {
      uploadedCount++;
    }

    // Check additional documents
    if (selectedDocuments.has(DOCUMENT_TYPES.DRIVER_LICENSE)) {
      // Bằng lái xe phải đủ cả 2 mặt
      if (
        profile.drivingLicenseFrontImageUrl &&
        profile.drivingLicenseBackImageUrl
      ) {
        uploadedCount++;
      }
    }

    if (selectedDocuments.has(DOCUMENT_TYPES.PASSPORT)) {
      // Hộ chiếu chỉ cần 1 mặt
      if (profile.passportFrontImageUrl) {
        uploadedCount++;
      }
    }

    return uploadedCount >= 2; // At least National ID + 1 more
  };

  const handleDocumentTypeChange = (
    docType: DocumentType,
    isSelected: boolean
  ) => {
    if (docType === DOCUMENT_TYPES.NATIONAL_ID) {
      // National ID cannot be deselected
      return;
    }

    const newSelection = new Set(selectedDocuments);
    if (isSelected) {
      newSelection.add(docType);
    } else {
      newSelection.delete(docType);
    }

    // Ensure National ID is always selected and at least one additional document
    if (newSelection.size < 2) {
      newSelection.add(DOCUMENT_TYPES.NATIONAL_ID);
    }

    setSelectedDocuments(newSelection);
  };

  const startCamera = async (type: string) => {
    setShowCamera(type);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: type === "faceVerification" ? "user" : "environment",
        },
      });
      // Handle camera stream
    } catch {
      alert(
        "Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập camera của trình duyệt."
      );
    }
  };

  const captureImage = () => {
    // Implementation for capturing image from camera
  };

  const cancelCamera = () => {
    setShowCamera(null);
  };

  const handleFaceExtracted = (descriptor: Float32Array) => {
    setIdImageDescriptor(descriptor);
    setFaceExtractionError(null);
    setCurrentStep("verify");
  };

  const handleExtractionError = (error: string) => {
    setFaceExtractionError(error);
  };

  const handleVerificationComplete = (success: boolean) => {
    setVerificationComplete(success);
    if (success) {
      // Clear saved state when verification is complete
      localStorage.removeItem("identity-verification-step");
      localStorage.removeItem("identity-selected-documents");
      localStorage.removeItem("profile-active-tab");
    }
  };

  const handleVerificationError = (_error: string) => {
    // Handle verification error
    void _error; // Acknowledge parameter to avoid linter warning
  };

  const renderDocumentUploadSection = (
    title: string,
    isRequired: boolean,
    frontImage: string | null,
    backImage: string | null,
    frontUploadType:
      | "identity_front"
      | "driver_license_front"
      | "passport_front",
    backUploadType?: "identity_back" | "driver_license_back",
    hasBackSide: boolean = true
  ) => (
    <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
      <h5 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
        <CheckCircle
          size={20}
          className={
            // Kiểm tra logic hoàn thành cho từng loại giấy tờ
            (() => {
              if (hasBackSide) {
                // Giấy tờ có 2 mặt (CCCD, bằng lái xe) - cần đủ cả 2 mặt
                return frontImage && backImage
                  ? "text-green-600"
                  : "text-gray-400";
              } else {
                // Giấy tờ 1 mặt (hộ chiếu) - chỉ cần mặt trước
                return frontImage ? "text-green-600" : "text-gray-400";
              }
            })()
          }
        />
        {title}
        {isRequired && <span className="text-red-500 text-sm">(Bắt buộc)</span>}
      </h5>

      <div
        className={`grid grid-cols-1 ${
          hasBackSide ? "md:grid-cols-2" : ""
        } gap-6`}
      >
        {/* Front Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mặt trước {isRequired && "*"}
          </label>
          {frontImage ? (
            <div className="relative">
              <Image
                src={frontImage}
                alt={`${title} Front`}
                width={300}
                height={200}
                className="w-full h-48 object-contain rounded-lg border"
              />
              <div className="absolute top-2 right-2 flex gap-1">
                <button
                  onClick={() => removeImage(frontUploadType)}
                  className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  title="Xóa ảnh"
                >
                  <X size={16} />
                </button>
                <label
                  htmlFor={`${frontUploadType}-replace`}
                  className="bg-blue-500 text-white rounded-full p-1 hover:bg-blue-600 transition-colors cursor-pointer"
                  title="Thay đổi ảnh"
                >
                  <Edit3 size={16} />
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, frontUploadType)}
                  className="hidden"
                  id={`${frontUploadType}-replace`}
                />
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, frontUploadType)}
                className="hidden"
                id={frontUploadType}
              />
              <label
                htmlFor={frontUploadType}
                className="cursor-pointer flex flex-col items-center"
              >
                <Upload className="text-gray-400 mb-2" size={32} />
                <span className="text-sm text-gray-600">
                  Tải lên ảnh mặt trước
                </span>
              </label>
              <button
                onClick={() => startCamera(frontUploadType)}
                className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Hoặc chụp ảnh
              </button>
            </div>
          )}
        </div>

        {/* Back Image (if applicable) */}
        {hasBackSide && backUploadType && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mặt sau
            </label>
            {backImage ? (
              <div className="relative">
                <Image
                  src={backImage}
                  alt={`${title} Back`}
                  width={300}
                  height={200}
                  className="w-full h-48 object-contain rounded-lg border"
                />
                <div className="absolute top-2 right-2 flex gap-1">
                  <button
                    onClick={() => removeImage(backUploadType)}
                    className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    title="Xóa ảnh"
                  >
                    <X size={16} />
                  </button>
                  <label
                    htmlFor={`${backUploadType}-replace`}
                    className="bg-blue-500 text-white rounded-full p-1 hover:bg-blue-600 transition-colors cursor-pointer"
                    title="Thay đổi ảnh"
                  >
                    <Edit3 size={16} />
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, backUploadType)}
                    className="hidden"
                    id={`${backUploadType}-replace`}
                  />
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, backUploadType)}
                  className="hidden"
                  id={backUploadType}
                />
                <label
                  htmlFor={backUploadType}
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Upload className="text-gray-400 mb-2" size={32} />
                  <span className="text-sm text-gray-600">
                    Tải lên ảnh mặt sau
                  </span>
                </label>
                <button
                  onClick={() => startCamera(backUploadType)}
                  className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Hoặc chụp ảnh
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Step Navigation */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        <div
          className={`flex items-center ${
            currentStep === "documents" ? "text-blue-600" : "text-gray-400"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep === "documents"
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
          >
            1
          </div>
          <span className="ml-2 font-medium">Tải lên giấy tờ</span>
        </div>

        <div className="w-8 h-px bg-gray-300"></div>

        <div
          className={`flex items-center ${
            currentStep === "extract" ? "text-blue-600" : "text-gray-400"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep === "extract"
                ? "bg-blue-600 text-white"
                : idImageDescriptor
                ? "bg-green-600 text-white"
                : "bg-gray-200"
            }`}
          >
            {idImageDescriptor ? "✓" : "2"}
          </div>
          <span className="ml-2 font-medium">Trích xuất khuôn mặt</span>
        </div>

        <div className="w-8 h-px bg-gray-300"></div>

        <div
          className={`flex items-center ${
            currentStep === "verify" ? "text-blue-600" : "text-gray-400"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep === "verify"
                ? "bg-blue-600 text-white"
                : verificationComplete
                ? "bg-green-600 text-white"
                : "bg-gray-200"
            }`}
          >
            {verificationComplete ? "✓" : "3"}
          </div>
          <span className="ml-2 font-medium">Xác minh khuôn mặt</span>
        </div>
      </div>

      {/* Step 1: Document Upload */}
      {currentStep === "documents" && (
        <div className="space-y-8">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
            <h4 className="text-xl font-bold text-gray-900 mb-4">
              Bước 1: Tải lên giấy tờ tùy thân
            </h4>
            <p className="text-gray-600 mb-6">
              Vui lòng chọn và tải lên các loại giấy tờ để xác minh danh tính.
              <span className="font-semibold text-red-600">
                {" "}
                Căn cước công dân là bắt buộc
              </span>{" "}
              và
              <span className="font-semibold">
                {" "}
                thêm ít nhất 1 loại giấy tờ khác
              </span>
              .
            </p>

            {/* Document Type Selection */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
              <h5 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText size={20} className="text-blue-600" />
                Chọn loại giấy tờ cần tải lên
              </h5>

              <div className="space-y-3">
                {/* National ID - Always selected and required */}
                <label className="flex items-center space-x-3 p-3 border rounded-lg bg-blue-50 border-blue-200">
                  <input
                    type="checkbox"
                    checked={true}
                    disabled={true}
                    className="w-4 h-4 text-blue-600"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      Căn cước công dân / CMND
                    </div>
                    <div className="text-sm text-red-600">Bắt buộc</div>
                  </div>
                </label>

                {/* Driver License */}
                <label className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedDocuments.has(
                      DOCUMENT_TYPES.DRIVER_LICENSE
                    )}
                    onChange={(e) =>
                      handleDocumentTypeChange(
                        DOCUMENT_TYPES.DRIVER_LICENSE,
                        e.target.checked
                      )
                    }
                    className="w-4 h-4 text-blue-600"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Bằng lái xe</div>
                    <div className="text-sm text-gray-600">Tùy chọn</div>
                  </div>
                </label>

                {/* Passport */}
                <label className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedDocuments.has(DOCUMENT_TYPES.PASSPORT)}
                    onChange={(e) =>
                      handleDocumentTypeChange(
                        DOCUMENT_TYPES.PASSPORT,
                        e.target.checked
                      )
                    }
                    className="w-4 h-4 text-blue-600"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Hộ chiều</div>
                    <div className="text-sm text-gray-600">Tùy chọn</div>
                  </div>
                </label>
              </div>
            </div>

            {/* National ID Section - Always shown */}
            {renderDocumentUploadSection(
              "Căn cước công dân / CMND",
              true,
              profile.identityFrontImage,
              profile.identityBackImage,
              "identity_front",
              "identity_back",
              true
            )}

            {/* Driver License Section - Only shown if selected */}
            {selectedDocuments.has(DOCUMENT_TYPES.DRIVER_LICENSE) &&
              renderDocumentUploadSection(
                "Bằng lái xe",
                false,
                profile.drivingLicenseFrontImageUrl,
                profile.drivingLicenseBackImageUrl,
                "driver_license_front",
                "driver_license_back",
                true
              )}

            {/* Passport Section - Only shown if selected */}
            {selectedDocuments.has(DOCUMENT_TYPES.PASSPORT) &&
              renderDocumentUploadSection(
                "Hộ chiều",
                false,
                profile.passportFrontImageUrl,
                null,
                "passport_front",
                undefined,
                false
              )}

            {/* Progress and Next Button */}
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                Đã tải lên: {getUploadedDocumentsCount()}/
                {getRequiredDocumentsCount()} loại giấy tờ được chọn
              </p>

              {validation.hasCompletePersonalInfo && hasEnoughDocuments() ? (
                <button
                  onClick={() => setCurrentStep("extract")}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 rounded-xl font-semibold transition-all"
                >
                  Tiếp tục trích xuất khuôn mặt
                </button>
              ) : (
                <div className="mt-4">
                  <p className="text-amber-600 font-medium mb-2">
                    {!validation.hasCompletePersonalInfo &&
                      "Vui lòng hoàn thiện thông tin cá nhân"}
                    {validation.hasCompletePersonalInfo &&
                      !hasEnoughDocuments() &&
                      "Vui lòng tải lên đầy đủ giấy tờ đã chọn (ít nhất Căn cước công dân + 1 loại khác)"}
                  </p>
                  <button
                    disabled
                    className="bg-gray-400 text-white px-8 py-4 rounded-xl font-semibold cursor-not-allowed"
                  >
                    Tiếp tục trích xuất khuôn mặt
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Face Extraction */}
      {currentStep === "extract" && (
        <div className="space-y-6">
          <ExtractFaceFromImage
            profile={profile}
            onFaceExtracted={handleFaceExtracted}
            onError={handleExtractionError}
          />

          <div className="text-center">
            <button
              onClick={() => setCurrentStep("documents")}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Quay lại bước 1
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Face Verification */}
      {currentStep === "verify" && idImageDescriptor && (
        <div className="space-y-6">
          <CameraVideoIdentify
            profile={profile}
            idImageDescriptor={idImageDescriptor}
            onVerificationComplete={handleVerificationComplete}
            onError={handleVerificationError}
          />

          {verificationComplete && (
            <div className="text-center">
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
                <CheckCircle
                  className="mx-auto text-green-600 mb-4"
                  size={48}
                />
                <h3 className="text-xl font-bold text-green-800 mb-2">
                  Xác minh thành công!
                </h3>
                <p className="text-green-600 mb-4">
                  Khuôn mặt của bạn đã được xác minh thành công
                </p>
                <button
                  onClick={onSubmitVerification}
                  disabled={isSaving}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 text-white px-8 py-4 rounded-xl font-semibold transition-all"
                >
                  {isSaving ? "Đang gửi..." : "Hoàn tất xác minh"}
                </button>
              </div>
            </div>
          )}

          <div className="text-center">
            <button
              onClick={() => setCurrentStep("extract")}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Quay lại bước 2
            </button>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 flex items-start gap-4">
        <AlertCircle size={24} className="text-blue-500 flex-shrink-0 mt-1" />
        <div className="text-sm text-blue-800">
          <p className="font-semibold mb-2">Lưu ý quan trọng về bảo mật</p>
          <ul className="space-y-1">
            <li>• Tất cả thông tin được mã hóa và bảo mật tuyệt đối</li>
            <li>
              • Chúng tôi sử dụng AI để xác minh danh tính, không lưu trữ video
            </li>
            <li>• Quá trình xác minh có thể mất 1-2 ngày làm việc</li>
            <li>• Liên hệ hỗ trợ nếu gặp khó khăn trong quá trình xác minh</li>
          </ul>
        </div>
      </div>

      {/* Camera Modal for Document Capture */}
      {showCamera && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold">Chụp ảnh giấy tờ</h3>
              <p className="text-sm text-gray-600">
                Đặt giấy tờ trong khung hình và nhấn chụp
              </p>
            </div>

            <div className="relative mb-4">
              <video
                autoPlay
                playsInline
                muted
                className="w-full h-64 object-cover rounded-xl bg-gray-100"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={cancelCamera}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-xl font-medium transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={captureImage}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-medium transition-colors"
              >
                Chụp ảnh
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
