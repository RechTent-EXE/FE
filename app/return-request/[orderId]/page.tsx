"use client";

import { useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { Camera, Upload, ArrowLeft } from "lucide-react";
import { returnService } from "@/services/returnService";
import { useAuth } from "@/contexts/AuthContext";

interface ReturnRequestData {
  photos: string[];
  bankName: string;
  bankAccountNumber: string;
  bankAccountHolder: string;
}

export default function ReturnRequestPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const orderId = params.orderId as string;

  const [formData, setFormData] = useState<ReturnRequestData>({
    photos: [],
    bankName: "",
    bankAccountNumber: "",
    bankAccountHolder: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [uploadMethod, setUploadMethod] = useState<"file" | "camera">("file");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleInputChange = (
    field: keyof Omit<ReturnRequestData, "photos">,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const compressImage = (
    file: File,
    maxWidth: number = 800,
    quality: number = 0.7
  ): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        const { width, height } = img;
        const ratio = Math.min(maxWidth / width, maxWidth / height);

        canvas.width = width * ratio;
        canvas.height = height * ratio;

        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        const compressedBase64 = canvas.toDataURL("image/jpeg", quality);
        resolve(compressedBase64);
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const compressedImage = await compressImage(file);
        setFormData((prev) => ({
          ...prev,
          photos: [compressedImage],
        }));
      } catch (error) {
        console.error("Error compressing image:", error);
        alert("Có lỗi xảy ra khi xử lý ảnh. Vui lòng thử lại.");
      }
    }
  };

  const startCamera = async () => {
    try {
      setShowCamera(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập.");
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext("2d");

      // Compress captured image
      const maxWidth = 800;
      const { videoWidth, videoHeight } = video;
      const ratio = Math.min(maxWidth / videoWidth, maxWidth / videoHeight);

      canvas.width = videoWidth * ratio;
      canvas.height = videoHeight * ratio;

      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const base64String = canvas.toDataURL("image/jpeg", 0.7);
        setFormData((prev) => ({
          ...prev,
          photos: [base64String],
        }));
        stopCamera();
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
    }
    setShowCamera(false);
  };

  const removePhoto = () => {
    setFormData((prev) => ({
      ...prev,
      photos: [],
    }));
  };

  const handleSubmit = async () => {
    if (!user) {
      alert("Vui lòng đăng nhập để tiếp tục");
      return;
    }

    if (formData.photos.length === 0) {
      alert("Vui lòng tải lên ít nhất 1 ảnh sản phẩm");
      return;
    }

    if (
      !formData.bankName ||
      !formData.bankAccountNumber ||
      !formData.bankAccountHolder
    ) {
      alert("Vui lòng điền đầy đủ thông tin ngân hàng");
      return;
    }

    setIsSubmitting(true);
    try {
      await returnService.submitReturnRequest(orderId, formData);
      alert("Yêu cầu trả hàng đã được gửi thành công!");
      router.push("/profile");
    } catch (error) {
      console.error("Error submitting return request:", error);
      alert("Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 mt-20">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <button
              onClick={() => router.back()}
              className="text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              Yêu cầu trả hàng
            </h1>
          </div>
          <p className="text-gray-600">
            Mã đơn hàng: <span className="font-semibold">{orderId}</span>
          </p>
        </div>

        {/* Photo Upload Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Ảnh sản phẩm trả</h2>

          {/* Upload Method Toggle */}
          <div className="flex space-x-4 mb-4">
            <button
              onClick={() => setUploadMethod("file")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${
                uploadMethod === "file"
                  ? "bg-blue-50 border-blue-500 text-blue-700"
                  : "bg-gray-50 border-gray-300 text-gray-700"
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>Tải từ máy</span>
            </button>
            <button
              onClick={() => setUploadMethod("camera")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${
                uploadMethod === "camera"
                  ? "bg-blue-50 border-blue-500 text-blue-700"
                  : "bg-gray-50 border-gray-300 text-gray-700"
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>Chụp ảnh</span>
            </button>
          </div>

          {/* File Upload */}
          {uploadMethod === "file" && (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors"
              >
                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-gray-600">Click để chọn ảnh</p>
              </button>
            </div>
          )}

          {/* Camera Section */}
          {uploadMethod === "camera" && (
            <div>
              {!showCamera ? (
                <button
                  onClick={startCamera}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Camera className="w-5 h-5" />
                  <span>Mở camera</span>
                </button>
              ) : (
                <div className="space-y-4">
                  <video
                    ref={videoRef}
                    autoPlay
                    className="w-full rounded-lg"
                  />
                  <div className="flex space-x-4">
                    <button
                      onClick={capturePhoto}
                      className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Chụp ảnh
                    </button>
                    <button
                      onClick={stopCamera}
                      className="flex-1 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Photo Preview */}
          {formData.photos.length > 0 && (
            <div className="mt-4">
              <div className="relative inline-block">
                <img
                  src={formData.photos[0]}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg border"
                />
                <button
                  onClick={removePhoto}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Bank Information Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Thông tin ngân hàng</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên ngân hàng *
              </label>
              <input
                type="text"
                value={formData.bankName}
                onChange={(e) => handleInputChange("bankName", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ví dụ: Vietcombank"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số tài khoản *
              </label>
              <input
                type="text"
                value={formData.bankAccountNumber}
                onChange={(e) =>
                  handleInputChange("bankAccountNumber", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nhập số tài khoản"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên chủ tài khoản *
              </label>
              <input
                type="text"
                value={formData.bankAccountHolder}
                onChange={(e) =>
                  handleInputChange("bankAccountHolder", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nhập tên chủ tài khoản"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Đang gửi yêu cầu...</span>
              </>
            ) : (
              <span>Gửi yêu cầu trả hàng</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
