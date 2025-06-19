import React, { useEffect, useState } from "react";
import * as faceapi from "face-api.js";
import { UserProfile } from "../../types/user";
import { AlertCircle, CheckCircle, RefreshCw, FileSearch } from "lucide-react";
import { toast } from "react-toastify";
import {
  ocrService,
  DocumentValidationResult,
} from "../../services/ocrService";

interface ExtractFaceFromImageProps {
  profile: UserProfile;
  onFaceExtracted: (descriptor: Float32Array) => void;
  onError: (error: string) => void;
}

export const ExtractFaceFromImage = ({
  profile,
  onFaceExtracted,
  onError,
}: ExtractFaceFromImageProps) => {
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionStatus, setExtractionStatus] = useState<
    "idle" | "loading" | "validating" | "extracting" | "success" | "failed"
  >("idle");
  const [extractionError, setExtractionError] = useState<string | null>(null);
  const [validationResult, setValidationResult] =
    useState<DocumentValidationResult | null>(null);

  // Load face-api models
  useEffect(() => {
    const loadModels = async () => {
      setExtractionStatus("loading");

      try {
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
          faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
          faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
        ]);

        setModelsLoaded(true);
        setExtractionStatus("idle");
      } catch {
        setExtractionStatus("failed");
        setExtractionError("Không thể tải models nhận diện khuôn mặt");
        onError("Không thể tải models nhận diện khuôn mặt");
      }
    };

    loadModels();
  }, [onError]);

  // Cleanup OCR worker khi component unmount
  useEffect(() => {
    return () => {
      ocrService.terminateWorker();
    };
  }, []);

  const extractFaceFromIdCard = async () => {
    if (!modelsLoaded) {
      const error = "Models chưa được tải";
      setExtractionError(error);
      onError(error);
      return;
    }

    setIsExtracting(true);
    setExtractionStatus("validating");
    setExtractionError(null);

    try {
      // Xác định loại giấy tờ và lấy ảnh tương ứng
      let idImage: string | null = null;
      let validationResult: DocumentValidationResult;

      // Bước 1: Xác minh giấy tờ bằng OCR
      setExtractionStatus("validating");

      // Kiểm tra có bằng lái xe không (ưu tiên mặt trước)
      if (
        profile.drivingLicenseFrontImageUrl ||
        profile.drivingLicenseBackImageUrl
      ) {
        idImage =
          profile.drivingLicenseFrontImageUrl ||
          profile.drivingLicenseBackImageUrl;

        if (!idImage) {
          const error = "Không tìm thấy ảnh bằng lái xe";
          setExtractionError(error);
          setExtractionStatus("failed");
          onError(error);
          return;
        }

        // Convert image URL to File object for OCR
        const response = await fetch(idImage);
        const blob = await response.blob();
        const imageFile = new File([blob], "driver-license.jpg", {
          type: blob.type,
        });

        // Debug: Log extracted text
        console.log("🔍 Starting OCR for driver license...");
        validationResult = await ocrService.validateDriverLicense(
          imageFile,
          profile.fullname || ""
        );
        console.log("🔍 OCR Result:", validationResult);
      }
      // Kiểm tra có hộ chiếu không
      else if (profile.passportFrontImageUrl) {
        idImage = profile.passportFrontImageUrl;

        // Convert image URL to File object for OCR
        const response = await fetch(idImage);
        const blob = await response.blob();
        const imageFile = new File([blob], "passport.jpg", { type: blob.type });

        console.log("🔍 Starting OCR for passport...");
        validationResult = await ocrService.validatePassport(
          imageFile,
          profile.fullname || ""
        );
        console.log("🔍 OCR Result:", validationResult);
      }
      // Mặc định kiểm tra CCCD (ưu tiên mặt trước)
      else {
        idImage = profile.identityFrontImage || profile.identityBackImage;

        if (!idImage) {
          const error = "Không tìm thấy ảnh giấy tờ tùy thân";
          setExtractionError(error);
          setExtractionStatus("failed");
          onError(error);
          return;
        }

        // Convert image URL to File object for OCR
        const response = await fetch(idImage);
        const blob = await response.blob();
        const imageFile = new File([blob], "cccd.jpg", { type: blob.type });

        console.log("🔍 Starting OCR for CCCD...");
        validationResult = await ocrService.validateCCCD(
          imageFile,
          profile.fullname || ""
        );
        console.log("🔍 OCR Result:", validationResult);
      }

      setValidationResult(validationResult);

      if (!validationResult.isValid) {
        toast.error(validationResult.errorMessage || "Giấy tờ không hợp lệ");
        setExtractionError(
          validationResult.errorMessage || "Giấy tờ không hợp lệ"
        );
        setExtractionStatus("failed");
        onError(validationResult.errorMessage || "Giấy tờ không hợp lệ");
        return;
      }

      // Hiển thị thông báo thành công với thông tin chi tiết
      const documentTypeName =
        validationResult.documentType === "cccd"
          ? "CCCD"
          : validationResult.documentType === "driver_license"
          ? "Bằng lái xe"
          : "Hộ chiếu";

      const documentTitle = validationResult.documentTitle || documentTypeName;

      toast.success(
        `✅ Xác minh ${documentTypeName} thành công!\n📄 Loại thẻ: ${documentTitle}\n👤 Họ tên: ${validationResult.extractedName}`
      );

      // Bước 2: Trích xuất khuôn mặt
      setExtractionStatus("extracting");

      // Create image element
      const img = document.createElement("img");
      img.crossOrigin = "anonymous";

      await new Promise((resolve, reject) => {
        img.onload = () => {
          resolve(null);
        };
        img.onerror = (error) => {
          reject(error);
        };
        img.src = idImage;
      });

      // Detect face and extract descriptor
      const detection = await faceapi
        .detectSingleFace(img)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) {
        const error =
          "Không thể phát hiện khuôn mặt trên giấy tờ tùy thân. Vui lòng đảm bảo ảnh rõ nét và có chứa khuôn mặt.";
        setExtractionError(error);
        setExtractionStatus("failed");
        onError(error);
        return;
      }

      setExtractionStatus("success");
      setExtractionError(null);
      toast.success("✅ Trích xuất khuôn mặt thành công!");
      onFaceExtracted(detection.descriptor);
    } catch {
      const errorMsg = "Lỗi khi xử lý ảnh giấy tờ tùy thân";
      setExtractionError(errorMsg);
      setExtractionStatus("failed");
      onError(errorMsg);
    } finally {
      setIsExtracting(false);
    }
  };

  const hasIdImages = profile.identityFrontImage || profile.identityBackImage;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
      <h4 className="text-xl font-bold text-gray-900 mb-4">
        Bước 1: Trích xuất khuôn mặt từ giấy tờ tùy thân
      </h4>

      <div className="space-y-4">
        {/* Status Display */}
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          {extractionStatus === "loading" && (
            <div className="flex items-center gap-3 text-blue-600">
              <RefreshCw className="animate-spin" size={20} />
              <span>Đang tải models nhận diện khuôn mặt...</span>
            </div>
          )}

          {extractionStatus === "idle" && modelsLoaded && (
            <div className="flex items-center gap-3 text-green-600">
              <CheckCircle size={20} />
              <span>
                Models đã sẵn sàng. Có thể bắt đầu trích xuất khuôn mặt.
              </span>
            </div>
          )}

          {extractionStatus === "validating" && (
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-blue-600">
                <FileSearch className="animate-pulse" size={20} />
                <span>Đang xác minh giấy tờ bằng OCR...</span>
              </div>
              <div className="text-sm text-gray-600 bg-blue-50 p-2 rounded-lg">
                🔍 Tesseract.js đang phân tích văn bản trong ảnh...
                <br />
                📄 Kiểm tra loại giấy tờ và so sánh tên với hồ sơ
                <br />
                ⏱️ Quá trình này có thể mất 10-30 giây
              </div>
            </div>
          )}

          {extractionStatus === "extracting" && (
            <div className="flex items-center gap-3 text-blue-600">
              <RefreshCw className="animate-spin" size={20} />
              <span>Đang trích xuất khuôn mặt từ giấy tờ tùy thân...</span>
            </div>
          )}

          {extractionStatus === "success" && (
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-green-600">
                <CheckCircle size={20} />
                <span>
                  ✅ Trích xuất khuôn mặt thành công! Có thể tiến hành xác minh.
                </span>
              </div>
              {validationResult && validationResult.isValid && (
                <div className="text-sm text-gray-600 bg-green-50 p-2 rounded-lg">
                  📄 Đã xác minh giấy tờ:{" "}
                  {validationResult.documentType === "cccd"
                    ? "CCCD"
                    : validationResult.documentType === "driver_license"
                    ? "Bằng lái xe"
                    : "Hộ chiếu"}
                  <br />
                  🏷️ Tên thẻ được phát hiện:{" "}
                  {validationResult.documentTitle || "Không phát hiện"}
                  <br />
                  👤 Tên trên giấy tờ: {validationResult.extractedName}
                  <br />
                  📊 Độ tin cậy OCR: {Math.round(validationResult.confidence)}%
                </div>
              )}
            </div>
          )}

          {extractionStatus === "failed" && extractionError && (
            <div className="flex items-start gap-3 text-red-600">
              <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Trích xuất thất bại</p>
                <p className="text-sm mt-1">{extractionError}</p>
              </div>
            </div>
          )}
        </div>

        {/* ID Images Display */}
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <h5 className="font-semibold text-gray-900 mb-3">
            Ảnh giấy tờ tùy thân
          </h5>
          <div className="grid grid-cols-2 gap-4">
            {profile.identityFrontImage && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Mặt trước</p>
                <img
                  src={profile.identityFrontImage}
                  alt="CCCD Front"
                  className="w-full h-32 object-contain rounded-lg border"
                />
              </div>
            )}
            {profile.identityBackImage && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Mặt sau</p>
                <img
                  src={profile.identityBackImage}
                  alt="CCCD Back"
                  className="w-full h-32 object-contain rounded-lg border"
                />
              </div>
            )}
          </div>

          {!hasIdImages && (
            <div className="text-center py-8 text-gray-500">
              <p>Chưa có ảnh giấy tờ tùy thân</p>
              <p className="text-sm">
                Vui lòng tải lên ảnh CCCD để tiến hành trích xuất khuôn mặt
              </p>
            </div>
          )}
        </div>

        {/* Extract Button */}
        <button
          onClick={extractFaceFromIdCard}
          disabled={
            !modelsLoaded ||
            !hasIdImages ||
            isExtracting ||
            extractionStatus === "success"
          }
          className={`w-full py-3 px-6 rounded-xl font-medium transition-all ${
            !modelsLoaded ||
            !hasIdImages ||
            isExtracting ||
            extractionStatus === "success"
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800"
          }`}
        >
          {isExtracting ? (
            <div className="flex items-center justify-center gap-2">
              <RefreshCw className="animate-spin" size={16} />
              <span>Đang trích xuất...</span>
            </div>
          ) : extractionStatus === "success" ? (
            "✅ Đã trích xuất thành công"
          ) : (
            "Trích xuất khuôn mặt từ giấy tờ"
          )}
        </button>

        {extractionStatus === "success" && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle size={16} />
              <span className="font-medium">Trích xuất thành công!</span>
            </div>
            <p className="text-sm text-green-600 mt-1">
              Dữ liệu khuôn mặt đã được trích xuất từ giấy tờ tùy thân. Bạn có
              thể tiến hành bước xác minh khuôn mặt.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
