"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Star,
  Shield,
  Calendar,
  Truck,
  ArrowLeft,
  Check,
  Info,
  Heart,
  Share2,
  Award,
  Clock,
  Phone,
  Mail,
  ChevronRight,
  Zap,
  Users,
} from "lucide-react";
import ProductImageGallery from "@/components/product-detail/product-image-gallery";
import RentalDatePicker from "@/components/product-detail/rental-date-picker";
import ProductTabs from "@/components/product-detail/product-tabs";
import RelatedProducts from "@/components/product-detail/related-products";
import {
  ProductDetailResponse,
  UserProfile,
  ProductRating,
  CreateProductRating,
  Brand,
  ProductType,
} from "@/types/product";
import {
  fetchProductDetail,
  fetchUserProfile,
  fetchProductRatings,
  createProductRating,
  fetchProductTypes,
  fetchBrandsByType,
} from "@/lib/api/products";
import { getUserIdFromToken } from "@/lib/auth-utils";
import {
  calculateRentalDiscount,
  calculateDeposit,
  parseHtmlToArray,
  formatCurrency,
} from "@/utils/productUtils";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ category: string; productId: string }>;
}) {
  const router = useRouter();
  const [resolvedParams, setResolvedParams] = useState<{
    category: string;
    productId: string;
  } | null>(null);
  const [productData, setProductData] = useState<ProductDetailResponse | null>(
    null
  );
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [ratings, setRatings] = useState<ProductRating[]>([]);
  const [brand, setBrand] = useState<Brand | null>(null);
  const [productType, setProductType] = useState<ProductType | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [rentalDays, setRentalDays] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);
  const [tokenUserId, setTokenUserId] = useState<string | null>(null);

  // Get userId from token
  useEffect(() => {
    const userId = getUserIdFromToken();
    setTokenUserId(userId);
    console.log("Debug - userId from token:", userId);
  }, []);

  // Resolve params first
  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params;
      setResolvedParams(resolved);
    };
    resolveParams();
  }, [params]);

  useEffect(() => {
    if (!resolvedParams) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch product detail, user profile, and ratings in parallel
        const [productDetail, user] = await Promise.all([
          fetchProductDetail(resolvedParams.productId),
          fetchUserProfile(),
        ]);

        setProductData(productDetail);
        setUserProfile(user);

        // Try to fetch ratings, but don't fail if no data
        try {
          console.log(
            `Debug - Fetching ratings for product: ${resolvedParams.productId}`
          );
          console.log(
            `Debug - Product detail productId: ${productDetail.product.productId}`
          );

          const productRatings = await fetchProductRatings(
            resolvedParams.productId
          );
          console.log(`Debug - Fetched ratings:`, productRatings);
          setRatings(productRatings || []);
        } catch (error) {
          console.log("No ratings data available, using empty array", error);
          setRatings([]);
        }

        // Fetch additional data based on product info
        if (productDetail.product.typeId) {
          const [productTypes, brands] = await Promise.all([
            fetchProductTypes(),
            fetchBrandsByType(productDetail.product.typeId),
          ]);

          const productType = productTypes.find(
            (pt) => pt.productTypeId === productDetail.product.typeId
          );
          const brand = brands.find(
            (b) => b.brandId === productDetail.product.brandId
          );

          setProductType(productType || null);
          setBrand(brand || null);
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [resolvedParams]);

  useEffect(() => {
    if (startDate && endDate) {
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      setRentalDays(diffDays > 0 ? diffDays : 1);
    }
  }, [startDate, endDate]);

  const handleQuantityChange = (value: number) => {
    if (value >= 1 && value <= 10) {
      setQuantity(value);
    }
  };

  const handleDateChange = (start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleSubmitRating = async (rating: CreateProductRating) => {
    try {
      setIsSubmittingRating(true);
      const newRating = await createProductRating(rating);
      setRatings((prev) => [newRating, ...prev]);
    } catch (error) {
      console.error("Error submitting rating:", error);

      // Show user-friendly error message
      if (error instanceof Error) {
        if (error.message.includes("401")) {
          alert(
            "Bạn cần đăng nhập để đánh giá sản phẩm. Vui lòng đăng nhập và thử lại."
          );
        } else if (error.message.includes("403")) {
          alert("Bạn không có quyền đánh giá sản phẩm này.");
        } else if (error.message.includes("404")) {
          alert("Không tìm thấy sản phẩm để đánh giá.");
        } else {
          alert("Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại sau.");
        }
      } else {
        alert("Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại sau.");
      }
    } finally {
      setIsSubmittingRating(false);
    }
  };

  const handleRentNow = () => {
    if (!userProfile?.identityVerified) {
      router.push(
        "/profile/verify-identity?redirect=" +
          encodeURIComponent(window.location.pathname)
      );
    } else {
      alert("Tiến hành đặt thuê sản phẩm!");
      // In a real app, you would redirect to checkout or add to cart
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin sản phẩm...</p>
        </div>
      </div>
    );
  }

  if (!productData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Không tìm thấy sản phẩm
          </h1>
          <p className="text-gray-600 mb-6">
            Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mx-auto bg-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            <ArrowLeft size={20} />
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  const { product, images } = productData;
  const discountInfo = calculateRentalDiscount(
    product.singleDayPrice,
    rentalDays,
    quantity,
    product.actualPrice,
    userProfile?.identityVerified || false
  );
  const depositAmount = calculateDeposit(
    product.actualPrice,
    userProfile?.identityVerified || false
  );

  // Parse HTML strings to arrays
  const features = parseHtmlToArray(product.features);
  const includes = parseHtmlToArray(product.includes);
  const highlights = parseHtmlToArray(product.highlights);

  // Calculate average rating - use ratings data if available, otherwise use product rating
  const averageRating =
    ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
      : product.rating || 0;

  // Use actual review count if we have ratings data, otherwise use product rating as display rating
  const displayRating = averageRating;
  const reviewCount = ratings.length;

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 pt-20 pb-16 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-[70px] z-30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center text-sm text-gray-500">
            <button
              onClick={() => router.push("/")}
              className="hover:text-blue-600 transition-colors"
            >
              Trang chủ
            </button>
            <ChevronRight size={16} className="mx-2" />
            <button
              onClick={() =>
                router.push(`/products/${resolvedParams?.category}`)
              }
              className="hover:text-blue-600 transition-colors"
            >
              {productType?.name ||
                (resolvedParams?.category
                  ? resolvedParams.category.charAt(0).toUpperCase() +
                    resolvedParams.category.slice(1)
                  : "")}
            </button>
            <ChevronRight size={16} className="mx-2" />
            <span className="text-gray-900 font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Product Images */}
          <div className="lg:sticky lg:top-32">
            <ProductImageGallery
              images={images.map((img) => img.imageUrl)}
              altText={images[0]?.altText || product.name}
            />
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {brand?.name || "Unknown Brand"}
                  </span>
                  {product.isVerified && (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                      <Shield size={14} />
                      Đã xác minh
                    </span>
                  )}
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      product.isAvailable
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {product.isAvailable ? "Còn hàng" : "Hết hàng"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsLiked(!isLiked)}
                    className={`p-3 rounded-full transition-all ${
                      isLiked
                        ? "bg-red-100 text-red-600 hover:bg-red-200"
                        : "bg-white hover:bg-gray-50 text-gray-600"
                    } shadow-md hover:shadow-lg`}
                  >
                    <Heart
                      size={20}
                      className={isLiked ? "fill-current" : ""}
                    />
                  </button>
                  <button className="p-3 rounded-full bg-white hover:bg-gray-50 text-gray-600 shadow-md hover:shadow-lg transition-all">
                    <Share2 size={20} />
                  </button>
                </div>
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                {product.name}
              </h1>

              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={20}
                        className={
                          i < Math.floor(averageRating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-lg font-semibold text-gray-900">
                    {displayRating.toFixed(1)}
                  </span>
                  <span className="text-gray-500">
                    ({reviewCount} đánh giá)
                  </span>
                </div>
              </div>

              <p className="text-xl text-gray-700 leading-relaxed mb-8">
                {product.description}
              </p>

              {/* Price Display */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">
                      Giá sản phẩm
                    </div>
                    <div className="text-3xl font-bold text-gray-900">
                      {formatCurrency(product.actualPrice)}
                    </div>
                    <div className="text-sm text-gray-500">Giá trị thực tế</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Giá thuê</div>
                    <div className="text-3xl font-bold text-blue-600">
                      {formatCurrency(product.singleDayPrice)}
                      <span className="text-lg text-gray-500">/ngày</span>
                    </div>
                    <div className="text-sm text-green-600 font-medium">
                      Tiết kiệm{" "}
                      {Math.round(
                        (1 -
                          product.singleDayPrice /
                            (product.actualPrice * 0.1)) *
                          100
                      )}
                      % so với mua mới
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Highlights */}
            {highlights.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Award className="text-yellow-500" size={24} />
                  Điểm nổi bật
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {highlights.map((highlight: string, index: number) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                      <span className="text-gray-700">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Features */}
            {features.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Zap className="text-blue-500" size={24} />
                  Tính năng nổi bật
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {features.map((feature: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <Check
                        size={18}
                        className="text-green-500 flex-shrink-0"
                      />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* What's Included */}
            {includes.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Bao gồm trong gói thuê
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {includes.map((item: string, index: number) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Rental Form - Sticky */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-40 lg:hidden">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Giá thuê</div>
                <div className="text-xl font-bold text-blue-600">
                  {formatCurrency(product.singleDayPrice)}
                  <span className="text-sm text-gray-500">/ngày</span>
                </div>
              </div>
              <button
                onClick={handleRentNow}
                disabled={!product.isAvailable}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 px-8 rounded-lg font-medium transition-colors"
              >
                Thuê ngay
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Rental Form */}
        <div className="hidden lg:block mt-12">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
              <h3 className="text-2xl font-bold mb-2">Đặt thuê thiết bị</h3>
              <p className="text-blue-100">
                Chọn thời gian và số lượng phù hợp với nhu cầu của bạn
              </p>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Quantity & Date */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Quantity Selector */}
                  <div>
                    <label className="block text-lg font-semibold text-gray-900 mb-3">
                      Số lượng
                    </label>
                    <div className="flex items-center">
                      <button
                        onClick={() => handleQuantityChange(quantity - 1)}
                        disabled={quantity <= 1}
                        className="w-12 h-12 border border-gray-300 rounded-l-xl flex items-center justify-center bg-gray-50 hover:bg-gray-100 disabled:opacity-50 transition-colors"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={quantity}
                        onChange={(e) =>
                          handleQuantityChange(parseInt(e.target.value) || 1)
                        }
                        className="w-20 h-12 border-t border-b border-gray-300 text-center text-lg font-semibold focus:outline-none"
                      />
                      <button
                        onClick={() => handleQuantityChange(quantity + 1)}
                        disabled={quantity >= 10}
                        className="w-12 h-12 border border-gray-300 rounded-r-xl flex items-center justify-center bg-gray-50 hover:bg-gray-100 disabled:opacity-50 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Date Picker */}
                  <div>
                    <label className="block text-lg font-semibold text-gray-900 mb-3">
                      Thời gian thuê
                    </label>
                    <RentalDatePicker onDateChange={handleDateChange} />
                  </div>
                </div>

                {/* Price Summary */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">
                    Tóm tắt đơn hàng
                  </h4>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Đơn giá:</span>
                      <span className="font-medium">
                        {formatCurrency(product.singleDayPrice)}/ngày
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Số ngày:</span>
                      <span className="font-medium">{rentalDays} ngày</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Số lượng:</span>
                      <span className="font-medium">{quantity}</span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between text-sm">
                        <span>Tổng tiền (chưa giảm):</span>
                        <span>{formatCurrency(discountInfo.totalPrice)}</span>
                      </div>
                      {discountInfo.discountPercentage > 0 && (
                        <>
                          <div className="flex justify-between text-sm text-green-600">
                            <span>
                              Giảm giá ({discountInfo.discountPercentage}%):
                            </span>
                            <span>
                              -{formatCurrency(discountInfo.discountAmount)}
                            </span>
                          </div>
                          <div className="flex justify-between font-semibold text-blue-600">
                            <span>Tổng tiền thuê:</span>
                            <span>
                              {formatCurrency(discountInfo.finalPrice)}
                            </span>
                          </div>
                        </>
                      )}
                      {discountInfo.discountPercentage === 0 && (
                        <div className="flex justify-between font-semibold text-blue-600">
                          <span>Tổng tiền thuê:</span>
                          <span>{formatCurrency(discountInfo.finalPrice)}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between text-lg font-bold text-orange-600">
                      <span>
                        Tiền cọc (
                        {userProfile?.identityVerified ? "30%" : "100%"}):
                      </span>
                      <span>{formatCurrency(depositAmount)}</span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between text-xl font-bold text-green-600">
                        <span>Tổng tiền phải trả:</span>
                        <span>{formatCurrency(discountInfo.totalPayment)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Info Box */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <Info
                        size={20}
                        className="text-blue-500 flex-shrink-0 mt-0.5"
                      />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium mb-1">Chính sách đặt cọc</p>
                        <p>
                          {userProfile?.identityVerified
                            ? "Tài khoản đã xác minh: Cọc 30% giá trị sản phẩm"
                            : "Tài khoản chưa xác minh: Cọc 100% giá trị sản phẩm"}
                          . Tiền cọc sẽ được hoàn trả khi bạn trả thiết bị trong
                          tình trạng tốt.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={handleRentNow}
                      disabled={!startDate || !endDate || !product.isAvailable}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all hover:shadow-lg flex items-center justify-center gap-2"
                    >
                      <Calendar size={20} />
                      Đặt thuê ngay
                    </button>
                    <button className="w-full border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50 py-4 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-2">
                      <Truck size={20} />
                      Thêm vào giỏ hàng
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="text-green-600" size={32} />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">Bảo hành toàn diện</h4>
            <p className="text-gray-600 text-sm">
              Hỗ trợ kỹ thuật 24/7 trong suốt thời gian thuê
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="text-blue-600" size={32} />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">Giao hàng nhanh</h4>
            <p className="text-gray-600 text-sm">
              Giao hàng trong 2h tại TP.HCM và Hà Nội
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="text-purple-600" size={32} />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">Tin cậy</h4>
            <p className="text-gray-600 text-sm">
              Được 5000+ khách hàng tin tưởng sử dụng
            </p>
          </div>
        </div>

        {/* Product Tabs */}
        <div className="mt-16">
          <ProductTabs
            description={product.detailDescription}
            specifications={product.techSpec}
            ratings={ratings}
            userId={tokenUserId || undefined}
            productId={resolvedParams?.productId || product.productId}
            onSubmitRating={handleSubmitRating}
            isSubmittingRating={isSubmittingRating}
          />
        </div>

        {/* Related Products */}
        {product.typeId && (
          <div className="mt-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Sản phẩm tương tự
              </h2>
              <p className="text-xl text-gray-600">
                Khám phá thêm những sản phẩm khác có thể bạn quan tâm
              </p>
            </div>
            <RelatedProducts
              typeId={product.typeId}
              currentProductId={resolvedParams?.productId || ""}
            />
          </div>
        )}

        {/* Contact Support */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">Cần hỗ trợ tư vấn?</h3>
              <p className="text-blue-100 mb-6">
                Đội ngũ chuyên gia của chúng tôi sẵn sàng hỗ trợ bạn chọn lựa
                sản phẩm phù hợp nhất.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-3">
                  <Phone size={20} />
                  <span>1900 1234</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={20} />
                  <span>support@rechtent.vn</span>
                </div>
              </div>
            </div>
            <div className="text-center lg:text-right">
              <button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold text-lg transition-colors">
                Liên hệ ngay
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
