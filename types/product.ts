// Product type definitions matching API response

export interface ProductType {
  _id: string;
  productTypeId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Brand {
  _id: string;
  brandId: string;
  name: string;
  __v: number;
}

export interface ProductImage {
  _id: string;
  id: string;
  productId: string;
  imageUrl: string;
  altText: string;
  __v: number;
}

export interface Duration {
  _id: string;
  durationId: string;
  productId: string;
  duration: string;
  price: number;
  __v: number;
}

export interface Product {
  _id: string;
  productId: string;
  name: string;
  typeId: string;
  rating: number;
  brandId: string;
  description: string;
  detailDescription: string;
  techSpec: string;
  features: string;
  includes: string;
  highlights: string;
  isVerified: boolean;
  isAvailable: boolean;
  __v: number;
  actualPrice: number;
  singleDayPrice: number;
}

export interface RentedProduct {
  product: Product;
  images: ProductImage[];
  durations: Duration[];
}

// Product Detail API Response
export interface ProductDetailResponse {
  product: Product;
  images: ProductImage[];
  durations: Duration[];
}

// Product Rating types
export interface ProductRating {
  _id?: string;
  userId: string;
  productId: string;
  rating: number;
  content: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface CreateProductRating {
  userId: string;
  productId: string;
  rating: number;
  content: string;
}

// User Profile types
export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  dateOfBirth: string | null;
  identityType: string | null;
  identityNumber: string;
  identityFrontImage: string;
  identityBackImage: string;
  identityVerified: boolean;
}

export interface ProductFilters {
  brand?: string[];
  priceRange?: [number, number];
}

// UI specific types
export interface ProductCardData {
  id: string;
  name: string;
  type: string;
  rating: number;
  brand: string;
  description: string;
  isVerified: boolean;
  isAvailable: boolean;
  actualPrice: number;
  singleDayPrice: number;
  image: string;
  durations: {
    duration: string;
    price: number;
    discount: number;
  }[];
}

// Discount calculation result
export interface DiscountInfo {
  totalPrice: number;
  discountPercentage: number;
  discountAmount: number;
  finalPrice: number;
  totalPayment: number; // finalPrice + deposit
}
