import {
  RentedProduct,
  ProductCardData,
  Brand,
  ProductType,
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
    image: images[0]?.imageUrl || "/placeholder.svg",
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

// Extract number of days from duration string
export const extractDaysFromDuration = (duration: string): number => {
  const match = duration.match(/(\d+)\s*(day|days)/i);
  return match ? parseInt(match[1]) : 1;
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
