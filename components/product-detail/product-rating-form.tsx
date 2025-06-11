"use client";

import { useState } from "react";
import { Star, Send, User } from "lucide-react";
import { CreateProductRating } from "@/types/product";
import { useAuth } from "@/contexts/AuthContext";

interface ProductRatingFormProps {
  productId: string;
  userId?: string;
  onSubmit: (rating: CreateProductRating) => Promise<void>;
  isSubmitting?: boolean;
}

export default function ProductRatingForm({
  productId,
  userId,
  onSubmit,
  isSubmitting = false,
}: ProductRatingFormProps) {
  const { isAuthenticated } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [content, setContent] = useState("");

  // Show login message if user is not authenticated
  if (!isAuthenticated || !userId) {
    return (
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
        <div className="text-center">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Đăng nhập để đánh giá
          </h3>
          <p className="text-gray-600 mb-4">
            Bạn cần đăng nhập để có thể đánh giá sản phẩm này.
          </p>
          <button
            onClick={() => (window.location.href = "/auth/login")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Đăng nhập ngay
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0 || content.trim() === "") return;

    // Validate required fields
    if (!productId || !userId) {
      alert("Thiếu thông tin cần thiết để gửi đánh giá. Vui lòng thử lại.");
      console.error("Missing productId or userId:", { productId, userId });
      return;
    }

    const newRating: CreateProductRating = {
      userId: userId,
      productId: productId,
      rating,
      content: content.trim(),
    };

    try {
      await onSubmit(newRating);
      // Reset form
      setRating(0);
      setContent("");
      alert("Đánh giá của bạn đã được gửi thành công!");
    } catch (error) {
      console.error("Error submitting rating:", error);
      // Let the parent component handle the error display
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        Đánh giá sản phẩm
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Star Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Đánh giá của bạn
          </label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="p-1 transition-colors"
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setRating(star)}
              >
                <Star
                  size={32}
                  className={`transition-colors ${
                    star <= (hoveredRating || rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300 hover:text-yellow-300"
                  }`}
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-sm text-gray-600 mt-1">
              {rating === 1 && "Rất tệ"}
              {rating === 2 && "Tệ"}
              {rating === 3 && "Bình thường"}
              {rating === 4 && "Tốt"}
              {rating === 5 && "Rất tốt"}
            </p>
          )}
        </div>

        {/* Comment */}
        <div>
          <label
            htmlFor="rating-content"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Nhận xét
          </label>
          <textarea
            id="rating-content"
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            {content.length}/500 ký tự
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={rating === 0 || content.trim() === "" || isSubmitting}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 text-white py-3 px-6 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              Đang gửi...
            </>
          ) : (
            <>
              <Send size={20} />
              Gửi đánh giá
            </>
          )}
        </button>
      </form>
    </div>
  );
}
