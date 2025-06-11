import {
  RentedProduct,
  ProductCardData,
  Brand,
  ProductType,
  DiscountInfo,
  ProductRating,
} from "@/types/product";

// Transform API data to UI format
export const transformProductData = (
  rentedProduct: RentedProduct,
  brands: Brand[],
  productTypes: ProductType[] = []
): ProductCardData => {
  const { product, images, durations } = rentedProduct;

  // Find brand name from brandId
  const brand = brands.find((b) => b.brandId === product.brandId);

  // Find product type name from typeId
  const productType = productTypes.find(
    (pt) => pt.productTypeId === product.typeId
  );

  // Transform durations and calculate discounts
  const transformedDurations = durations.map((duration) => {
    const discount = calculateDiscount(
      product.singleDayPrice,
      duration.price,
      duration.duration
    );
    return {
      duration: duration.duration,
      price: duration.price,
      discount,
    };
  });

  return {
    id: product.productId,
    name: product.name,
    type: productType?.name || "Unknown",
    rating: product.rating,
    brand: brand?.name || "Unknown",
    description: product.description,
    isVerified: product.isVerified,
    isAvailable: product.isAvailable,
    actualPrice: product.actualPrice,
    singleDayPrice: product.singleDayPrice,
    image: images[0]?.imageUrl || "",
    durations: transformedDurations,
  };
};

// Calculate discount percentage for duration pricing
export const calculateDiscount = (
  singleDayPrice: number,
  durationPrice: number,
  duration: string
): number => {
  const days = extractDaysFromDuration(duration);
  const expectedPrice = singleDayPrice * days;

  if (expectedPrice <= durationPrice) return 0;

  return Math.round(((expectedPrice - durationPrice) / expectedPrice) * 100);
};

// Calculate rental discount based on number of days
// 1-6 ngày: không giảm, 7 ngày: giảm 15%
// 7-14 ngày: giảm 15%, 15 ngày: giảm 25%
// 15-29 ngày: giảm 25%, 30 ngày trở đi: giảm 35%
export const calculateRentalDiscount = (
  singleDayPrice: number,
  rentalDays: number,
  quantity: number = 1,
  actualPrice: number = 0,
  isUserVerified: boolean = false
): DiscountInfo => {
  const totalPrice = singleDayPrice * rentalDays * quantity;
  let discountPercentage = 0;

  if (rentalDays >= 30) {
    // 30 ngày trở đi: giảm 35%
    discountPercentage = 35;
  } else if (rentalDays >= 15) {
    // 15-29 ngày: giảm 25%
    discountPercentage = 25;
  } else if (rentalDays >= 7) {
    // 7-14 ngày: giảm 15%
    discountPercentage = 15;
  }
  // 1-6 ngày: không giảm (0%)

  const discountAmount = Math.round((totalPrice * discountPercentage) / 100);
  const finalPrice = totalPrice - discountAmount;

  // Calculate deposit
  const depositAmount = calculateDeposit(actualPrice, isUserVerified);
  const totalPayment = finalPrice + depositAmount * quantity;

  return {
    totalPrice,
    discountPercentage,
    discountAmount,
    finalPrice,
    totalPayment,
  };
};

// Calculate deposit amount based on user verification status
export const calculateDeposit = (
  actualPrice: number,
  isUserVerified: boolean
): number => {
  return isUserVerified ? actualPrice * 0.3 : actualPrice; // 30% for verified, 100% for unverified
};

// Extract number of days from duration string
export const extractDaysFromDuration = (duration: string): number => {
  const match = duration.match(/(\d+)\s*(day|days)/i);
  return match ? parseInt(match[1]) : 1;
};

// Parse HTML string content (for features, includes, highlights)
export const parseHtmlToArray = (htmlString: string): string[] => {
  if (!htmlString) return [];

  // Extract content from <li> tags
  const liMatches = htmlString.match(/<li>(.*?)<\/li>/g);
  if (liMatches) {
    return liMatches.map((match) =>
      match
        .replace(/<li>(.*?)<\/li>/, "$1")
        .replace(/<[^>]*>/g, "")
        .trim()
    );
  }

  // If no <li> tags, split by common delimiters
  return htmlString
    .replace(/<[^>]*>/g, "") // Remove HTML tags
    .split(/[,\n•]/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
};

// Filter products by price range
export const filterProductsByPrice = (
  products: RentedProduct[],
  priceRange: [number, number]
): RentedProduct[] => {
  const [min, max] = priceRange;
  return products.filter((item) => {
    const price = item.product.singleDayPrice;
    return price >= min && price <= max;
  });
};

// Filter products by brand
export const filterProductsByBrand = (
  products: RentedProduct[],
  selectedBrands: string[],
  brands: Brand[]
): RentedProduct[] => {
  if (selectedBrands.length === 0) return products;

  const selectedBrandIds = brands
    .filter((brand) => selectedBrands.includes(brand.name))
    .map((brand) => brand.brandId);

  return products.filter((item) =>
    selectedBrandIds.includes(item.product.brandId)
  );
};

// Sort products by different criteria
export const sortProducts = (
  products: RentedProduct[],
  sortBy: string
): RentedProduct[] => {
  const sorted = [...products];

  switch (sortBy) {
    case "price-low":
      return sorted.sort(
        (a, b) => a.product.singleDayPrice - b.product.singleDayPrice
      );
    case "price-high":
      return sorted.sort(
        (a, b) => b.product.singleDayPrice - a.product.singleDayPrice
      );
    case "rating":
      return sorted.sort((a, b) => b.product.rating - a.product.rating);
    case "name":
      return sorted.sort((a, b) =>
        a.product.name.localeCompare(b.product.name)
      );
    case "popular":
    default:
      return sorted.sort((a, b) => b.product.rating - a.product.rating);
  }
};

// Get price range from products
export const getPriceRange = (products: RentedProduct[]): [number, number] => {
  if (products.length === 0) return [0, 2000000];

  const prices = products.map((item) => item.product.singleDayPrice);
  return [Math.min(...prices), Math.max(...prices)];
};

// Format currency in Vietnamese format
export const formatCurrency = (amount: number): string => {
  return amount.toLocaleString("vi-VN") + "đ";
};

// Calculate average rating from ratings array
export const calculateAverageRating = (ratings: ProductRating[]): number => {
  if (!ratings || ratings.length === 0) return 0;
  const sum = ratings.reduce((acc, rating) => acc + rating.rating, 0);
  return Math.round((sum / ratings.length) * 10) / 10; // Round to 1 decimal place
};
