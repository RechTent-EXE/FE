import React, { useRef, useState } from "react";
import * as faceapi from "face-api.js";
import { UserProfile } from "../../types/user";
import { Camera, CheckCircle, RefreshCw, X } from "lucide-react";
import { getAccessToken } from "../../lib/api";
import api from "../../lib/api";

interface CameraVideoIdentifyProps {
  profile: UserProfile;
  idImageDescriptor: Float32Array;
  onVerificationComplete: (success: boolean) => void;
  onError: (error: string) => void;
}

export const CameraVideoIdentify = ({
  profile,
  idImageDescriptor,
  onVerificationComplete,
  onError,
}: CameraVideoIdentifyProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isRecordingRef = useRef(false);

  const [showCamera, setShowCamera] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<
    "idle" | "processing" | "success" | "failed"
  >("idle");
  const [verificationError, setVerificationError] = useState<string | null>(
    null
  );

  const updateVerificationStatus = async (isVerified: boolean) => {
    try {
      const token = getAccessToken();
      const userId = profile._id;

      if (!token || !userId) {
        throw new Error("Authentication required");
      }

      const formData = new FormData();

      // Add profile fields
      formData.append("fullname", profile.fullname || "");
      formData.append("phone", profile.phone || "");
      formData.append("address", profile.address || "");

      // Set verification status
      formData.append("isVerified", isVerified.toString());

      // Add image fields as empty strings
      formData.append("avtUrl", "");
      formData.append("identityFrontImage", "");
      formData.append("identityBackImage", "");
      formData.append("drivingLicenseFrontImageUrl", "");
      formData.append("drivingLicenseBackImageUrl", "");
      formData.append("passportFrontImageUrl", "");

      await api.put(`/users/${userId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (error) {
      throw error;
    }
  };

  const startCamera = async () => {
    setShowCamera(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      alert(
        "Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập camera của trình duyệt."
      );
    }
  };

  const startRecording = async () => {
    if (!videoRef.current) {
      return;
    }

    setIsRecording(true);
    isRecordingRef.current = true;
    setVerificationStatus("idle");
    setVerificationError(null);

    // Auto-stop recording after 3 seconds for better UX
    setTimeout(async () => {
      if (isRecordingRef.current) {
        await stopRecording();
      }
    }, 3000);
  };

  const stopRecording = async () => {
    if (!isRecordingRef.current) {
      return;
    }

    setIsRecording(false);
    isRecordingRef.current = false;
    setVerificationStatus("processing");

    try {
      const success = await performFaceVerification();

      if (success) {
        setVerificationStatus("success");
        onVerificationComplete(true);
        // Close camera after successful verification
        setTimeout(() => {
          cancelCamera();
        }, 2000);
      } else {
        setVerificationStatus("failed");
        onVerificationComplete(false);
      }
    } catch {
      setVerificationStatus("failed");
      onVerificationComplete(false);
    }
  };

  const performFaceVerification = async () => {
    if (!idImageDescriptor || !videoRef.current) {
      const error = "Không đủ dữ liệu để thực hiện xác minh";
      setVerificationError(error);
      onError(error);
      return false;
    }

    try {
      // Detect face from webcam
      const detection = await faceapi
        .detectSingleFace(videoRef.current)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) {
        const error =
          "Không thể phát hiện khuôn mặt từ camera. Vui lòng đảm bảo ánh sáng đủ và khuôn mặt rõ ràng.";
        setVerificationError(error);
        onError(error);
        return false;
      }

      // Calculate distance between ID face and webcam face
      const distance = faceapi.euclideanDistance(
        idImageDescriptor,
        detection.descriptor
      );

      // Threshold for face match (lower = more strict)
      const threshold = 0.6;
      const isMatch = distance < threshold;

      if (isMatch) {
        // Update verification status in database
        await updateVerificationStatus(true);
        return true;
      } else {
        const error = `Khuôn mặt không khớp với giấy tờ tùy thân. Khoảng cách: ${distance.toFixed(
          3
        )}`;
        setVerificationError(error);
        onError(error);
        return false;
      }
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Lỗi khi xác minh khuôn mặt";
      setVerificationError(errorMsg);
      onError(errorMsg);
      return false;
    }
  };

  const cancelCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
    }
    setShowCamera(false);
    setIsRecording(false);
    isRecordingRef.current = false;
    setVerificationStatus("idle");
    setVerificationError(null);
  };

  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
      <h4 className="text-xl font-bold text-gray-900 mb-4">
        Bước 2: Xác minh khuôn mặt qua camera
      </h4>

      <div className="space-y-4">
        {/* Status Display */}
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          {verificationStatus === "idle" && !showCamera && (
            <div className="flex items-center gap-3 text-blue-600">
              <Camera size={20} />
              <span>Sẵn sàng để xác minh khuôn mặt qua camera</span>
            </div>
          )}

          {verificationStatus === "processing" && (
            <div className="flex items-center gap-3 text-blue-600">
              <RefreshCw className="animate-spin" size={20} />
              <span>Đang xử lý và so sánh khuôn mặt...</span>
            </div>
          )}

          {verificationStatus === "success" && (
            <div className="flex items-center gap-3 text-green-600">
              <CheckCircle size={20} />
              <span>✅ Xác minh khuôn mặt thành công!</span>
            </div>
          )}

          {verificationStatus === "failed" && verificationError && (
            <div className="flex items-start gap-3 text-red-600">
              <X size={20} className="flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Xác minh thất bại</p>
                <p className="text-sm mt-1">{verificationError}</p>
              </div>
            </div>
          )}
        </div>

        {!showCamera ? (
          // Start Camera Button
          <button
            onClick={startCamera}
            disabled={verificationStatus === "success"}
            className={`w-full py-3 px-6 rounded-xl font-medium transition-all ${
              verificationStatus === "success"
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700 active:bg-green-800"
            }`}
          >
            {verificationStatus === "success" ? (
              "✅ Đã xác minh thành công"
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Camera size={16} />
                <span>Bắt đầu xác minh khuôn mặt</span>
              </div>
            )}
          </button>
        ) : (
          // Camera Interface
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-64 object-contain rounded-xl bg-gray-100"
              />
              <canvas ref={canvasRef} className="hidden" />

              {/* Camera Controls */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3">
                {!isRecording && verificationStatus !== "processing" && (
                  <button
                    onClick={startRecording}
                    disabled={verificationStatus === "success"}
                    className={`px-6 py-2 rounded-lg font-medium transition-all ${
                      verificationStatus === "success"
                        ? "bg-gray-400 text-white cursor-not-allowed"
                        : "bg-green-600 text-white hover:bg-green-700"
                    }`}
                  >
                    Bắt đầu xác minh
                  </button>
                )}

                {isRecording && (
                  <div className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium flex items-center gap-2">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <span>Đang ghi hình...</span>
                  </div>
                )}

                {verificationStatus === "processing" && (
                  <div className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium flex items-center gap-2">
                    <RefreshCw className="animate-spin" size={16} />
                    <span>Đang xử lý...</span>
                  </div>
                )}

                <button
                  onClick={cancelCamera}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Instructions */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Hướng dẫn:</strong>
              </p>
              <ul className="text-sm text-blue-600 mt-1 space-y-1">
                <li>• Đặt khuôn mặt vào giữa khung hình</li>
                <li>• Đảm bảo ánh sáng đủ và rõ ràng</li>
                <li>• Nhìn thẳng vào camera</li>
                <li>• Hệ thống sẽ tự động ghi hình trong 3 giây</li>
              </ul>
            </div>
          </div>
        )}

        {verificationStatus === "success" && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle size={16} />
              <span className="font-medium">Xác minh thành công!</span>
            </div>
            <p className="text-sm text-green-600 mt-1">
              Khuôn mặt của bạn đã được xác minh thành công. Tài khoản của bạn
              đã được cập nhật trạng thái xác minh.
            </p>
          </div>
        )}

        {verificationStatus === "failed" && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center gap-2 text-red-700">
              <X size={16} />
              <span className="font-medium">Xác minh thất bại!</span>
            </div>
            <p className="text-sm text-red-600 mt-1">
              {verificationError ||
                "Không thể xác minh khuôn mặt. Vui lòng thử lại."}
            </p>
            <button
              onClick={() => setVerificationStatus("idle")}
              className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
            >
              Thử lại
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
