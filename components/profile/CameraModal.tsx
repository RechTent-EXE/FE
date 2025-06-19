import { useRef } from "react";
import { RefreshCw, CheckCircle, Play, Square } from "lucide-react";

interface CameraModalProps {
  showCamera: string | null;
  isRecording: boolean;
  verificationStatus: "idle" | "processing" | "success" | "failed";
  onCapture: () => void;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onCancel: () => void;
}

export const CameraModal = ({
  showCamera,
  isRecording,
  verificationStatus,
  onCapture,
  onStartRecording,
  onStopRecording,
  onCancel,
}: CameraModalProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  if (!showCamera) return null;

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold">
            {showCamera === "faceVerification"
              ? "Xác minh khuôn mặt"
              : "Chụp ảnh giấy tờ"}
          </h3>
          <p className="text-sm text-gray-600">
            {showCamera === "faceVerification"
              ? "Nhìn thẳng vào camera và giữ nguyên trong 3 giây"
              : "Đặt giấy tờ trong khung hình và nhấn chụp"}
          </p>
        </div>

        <div className="relative mb-4">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-64 object-cover rounded-xl bg-gray-100"
          />

          {showCamera === "faceVerification" && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-48 h-48 border-4 border-white rounded-full opacity-50"></div>
            </div>
          )}

          {verificationStatus === "processing" && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-xl">
              <div className="text-white text-center">
                <RefreshCw className="animate-spin mx-auto mb-2" size={32} />
                <p>Đang xác minh...</p>
              </div>
            </div>
          )}

          {verificationStatus === "success" && (
            <div className="absolute inset-0 bg-green-500/80 flex items-center justify-center rounded-xl">
              <div className="text-white text-center">
                <CheckCircle className="mx-auto mb-2" size={32} />
                <p>Xác minh thành công!</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 border border-gray-300 rounded-xl py-3 text-gray-700 hover:bg-gray-50 font-medium"
          >
            Hủy
          </button>
          {showCamera === "faceVerification" ? (
            <button
              onClick={isRecording ? onStopRecording : onStartRecording}
              disabled={verificationStatus === "processing"}
              className={`flex-1 rounded-xl py-3 font-medium flex items-center justify-center gap-2 ${
                isRecording
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {isRecording ? <Square size={16} /> : <Play size={16} />}
              {isRecording ? "Dừng" : "Bắt đầu"}
            </button>
          ) : (
            <button
              onClick={onCapture}
              className="flex-1 bg-blue-600 text-white rounded-xl py-3 hover:bg-blue-700 font-medium"
            >
              Chụp ảnh
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
