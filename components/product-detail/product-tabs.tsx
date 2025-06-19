"use client";

import { useState, useEffect } from "react";
import { Star, MessageSquare, Info, User, List } from "lucide-react";
import { ProductRating, CreateProductRating } from "@/types/product";
import { calculateAverageRating } from "@/utils/productUtils";
import { getFullNameFromToken, getUserIdFromToken } from "@/lib/auth-utils";
import ProductRatingForm from "./product-rating-form";

interface ProductTabsProps {
  description: string;
  specifications: string;
  ratings: ProductRating[];
  userId?: string;
  productId: string;
  onSubmitRating: (rating: CreateProductRating) => Promise<void>;
  isSubmittingRating?: boolean;
}

export default function ProductTabs({
  description,
  specifications,
  ratings,
  userId,
  productId,
  onSubmitRating,
  isSubmittingRating = false,
}: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState("description");
  const [currentUserFullName, setCurrentUserFullName] = useState<string | null>(
    null
  );
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [showAllReviews, setShowAllReviews] = useState(false);

  const averageRating = calculateAverageRating(ratings);
  const reviewCount = ratings.length;

  // Limit displayed reviews to 3 initially
  const displayedReviews = showAllReviews ? ratings : ratings.slice(0, 3);
  const hasMoreReviews = ratings.length > 3;

  // Get current user info from token
  useEffect(() => {
    const fullName = getFullNameFromToken();
    const userId = getUserIdFromToken();
    setCurrentUserFullName(fullName);
    setCurrentUserId(userId);
  }, []);

  // Calculate rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => {
    const count = ratings.filter((rating) => rating.rating === star).length;
    const percentage =
      reviewCount > 0 ? Math.round((count / reviewCount) * 100) : 0;
    return { star, count, percentage };
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      {/* Tab Headers */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab("description")}
          className={`flex items-center gap-2 px-6 py-4 font-medium text-sm transition-colors ${
            activeTab === "description"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <Info size={18} />
          Mô tả chi tiết
        </button>
        <button
          onClick={() => setActiveTab("specifications")}
          className={`flex items-center gap-2 px-6 py-4 font-medium text-sm transition-colors ${
            activeTab === "specifications"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <List size={18} />
          Thông số kỹ thuật
        </button>
        <button
          onClick={() => setActiveTab("reviews")}
          className={`flex items-center gap-2 px-6 py-4 font-medium text-sm transition-colors ${
            activeTab === "reviews"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <MessageSquare size={18} />
          Đánh giá
          <span className="bg-gray-100 text-gray-700 rounded-full px-2 py-0.5 text-xs">
            {reviewCount}
          </span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === "description" && (
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: description }}
          ></div>
        )}

        {activeTab === "specifications" && (
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: specifications }}
          ></div>
        )}

        {activeTab === "reviews" && (
          <div className="space-y-8">
            {/* Rating Summary */}
            {reviewCount > 0 ? (
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-5xl font-bold text-gray-900">
                    {averageRating.toFixed(1)}
                  </div>
                  <div className="flex justify-center mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={
                          i < Math.floor(averageRating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {reviewCount} đánh giá
                  </div>
                </div>

                <div className="flex-1 space-y-2">
                  {ratingDistribution.map(({ star, count, percentage }) => (
                    <div key={star} className="flex items-center gap-2">
                      <div className="flex items-center gap-1 w-12">
                        <span className="text-sm">{star}</span>
                        <Star
                          size={12}
                          className="fill-yellow-400 text-yellow-400"
                        />
                      </div>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-400 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <div className="w-12 text-xs text-gray-500 text-right">
                        {count} ({percentage}%)
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-4">
                  <MessageSquare size={48} className="mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Chưa có đánh giá
                </h3>
                <p className="text-gray-600 mb-1">
                  Sản phẩm này chưa có đánh giá từ khách hàng.
                </p>
                <p className="text-sm text-gray-500">
                  Hãy là người đầu tiên chia sẻ trải nghiệm của bạn!
                </p>
              </div>
            )}

            {/* Rating Form */}
            {userId && (
              <div className="border-t pt-6">
                <ProductRatingForm
                  productId={productId}
                  userId={userId}
                  onSubmit={onSubmitRating}
                  isSubmitting={isSubmittingRating}
                />
              </div>
            )}

            {/* Reviews List */}
            {ratings.length > 0 && (
              <div className="space-y-6 border-t pt-6">
                <h4 className="text-lg font-semibold text-gray-900">
                  Đánh giá từ khách hàng
                </h4>

                {displayedReviews.map((rating) => (
                  <div
                    key={rating._id}
                    className="border-b border-gray-100 pb-6"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User size={20} className="text-blue-600" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium text-gray-900">
                            {rating.userId === currentUserId &&
                            currentUserFullName
                              ? currentUserFullName
                              : `User ${rating.userId.slice(0, 20)}...`}
                          </div>
                          <div className="text-gray-500 text-sm">
                            {rating.createdAt && formatDate(rating.createdAt)}
                          </div>
                        </div>

                        <div className="flex mb-3">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={
                                i < rating.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }
                            />
                          ))}
                        </div>

                        <p className="text-gray-700 leading-relaxed">
                          {rating.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Show More/Less Reviews Button */}
                {hasMoreReviews && (
                  <div className="text-center">
                    <button
                      onClick={() => setShowAllReviews(!showAllReviews)}
                      className="inline-flex items-center gap-2 border border-gray-300 rounded-lg py-3 px-6 text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                    >
                      {showAllReviews ? (
                        <>Thu gọn đánh giá</>
                      ) : (
                        <>Xem thêm {ratings.length - 3} đánh giá</>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
