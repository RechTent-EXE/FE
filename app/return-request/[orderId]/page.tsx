"use client";

import { useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { Upload, ArrowLeft } from "lucide-react";
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
    photos: ["", "", "", "", "", ""], // 6 photos: 5 required + 1 optional for accessories
    bankName: "",
    bankAccountNumber: "",
    bankAccountHolder: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    return new Promise((resolve, reject) => {
      // Check file size (10MB = 10 * 1024 * 1024 bytes)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        reject(new Error("File size exceeds 10MB limit"));
        return;
      }

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

      img.onerror = () => {
        reject(new Error("Failed to load image"));
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileUpload =
    (photoIndex: number) =>
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        try {
          const compressedImage = await compressImage(file);
          setFormData((prev) => ({
            ...prev,
            photos: prev.photos.map((photo, index) =>
              index === photoIndex ? compressedImage : photo
            ),
          }));
        } catch (error) {
          console.error("Error compressing image:", error);
          if (error instanceof Error && error.message.includes("10MB")) {
            alert("Kích thước file vượt quá 10MB. Vui lòng chọn file nhỏ hơn.");
          } else {
            alert("Có lỗi xảy ra khi xử lý ảnh. Vui lòng thử lại.");
          }
        }
      }
    };

  const removePhoto = (photoIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.map((photo, index) =>
        index === photoIndex ? "" : photo
      ),
    }));
  };

  const handleSubmit = async () => {
    if (!user) {
      alert("Vui lòng đăng nhập để tiếp tục");
      return;
    }

    // Check if at least 5 required photos are uploaded (excluding the optional accessories photo)
    const requiredPhotos = formData.photos
      .slice(0, 5)
      .filter((photo) => photo !== "");
    if (requiredPhotos.length < 5) {
      alert(
        "Vui lòng tải lên đầy đủ 5 ảnh bắt buộc: toàn bộ sản phẩm, mặt trước, mặt sau, bên trái, bên phải"
      );
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
      // Filter out empty photos and create submission data
      const submissionData = {
        ...formData,
        photos: formData.photos.filter((photo) => photo !== ""),
      };

      await returnService.submitReturnRequest(orderId, submissionData);
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
          <h2 className="text-lg font-semibold mb-4">
            Ảnh sản phẩm trả (Tối đa 10MB mỗi ảnh)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-6">
            {[
              { index: 0, title: "Ảnh toàn bộ sản phẩm", required: true },
              { index: 1, title: "Ảnh mặt trước", required: true },
              { index: 2, title: "Ảnh mặt sau", required: true },
              { index: 3, title: "Ảnh bên trái", required: true },
              { index: 4, title: "Ảnh bên phải", required: true },
              { index: 5, title: "Ảnh dụng cụ đi kèm", required: false },
            ].map(({ index, title, required }) => (
              <div
                key={index}
                className={`border-2 border-dashed border-gray-300 rounded-lg p-4 ${
                  index === 5 ? "md:col-span-2 lg:col-span-2" : ""
                }`}
              >
                <h3 className="text-sm font-medium text-gray-700 mb-2 text-center">
                  {title}{" "}
                  {required ? (
                    <span className="text-red-500">*</span>
                  ) : (
                    <span className="text-gray-400">(Tùy chọn)</span>
                  )}
                </h3>

                {formData.photos[index] ? (
                  <div className="relative">
                    <img
                      src={formData.photos[index]}
                      alt={title}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removePhoto(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload(index)}
                      className="hidden"
                      id={`photo-${index}`}
                    />
                    <label
                      htmlFor={`photo-${index}`}
                      className="cursor-pointer block w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-blue-400 transition-colors"
                    >
                      <div className="text-center">
                        <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-xs text-gray-600">
                          Click để chọn ảnh
                        </p>
                      </div>
                    </label>
                  </div>
                )}
              </div>
            ))}
          </div>

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
