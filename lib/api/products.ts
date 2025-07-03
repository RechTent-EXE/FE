import {
  ProductType,
  Brand,
  RentedProduct,
  ProductDetailResponse,
  ProductRating,
  CreateProductRating,
  UserProfile,
  Product,
} from "@/types/product";
import api from "../api";
import { getUserIdFromToken } from "../auth-utils";

// Fetch product types (categories)
export const fetchProductTypes = async (): Promise<ProductType[]> => {
  try {
    const response = await api.get("/product-types");
    return response.data;
  } catch {
    throw new Error("Failed to fetch product types");
  }
};

// Fetch brands
export const fetchBrands = async (): Promise<Brand[]> => {
  try {
    console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);
    const response = await api.get("/brands");
    return response.data;
  } catch {
    throw new Error("Failed to fetch brands");
  }
};

// Fetch brands by product type ID
export const fetchBrandsByType = async (
  productTypeId: string
): Promise<Brand[]> => {
  try {
    const response = await api.get(`/type-brands/by-type/${productTypeId}`);
    return response.data;
  } catch {
    throw new Error("Failed to fetch brands by type");
  }
};

// Fetch rented products (all products - deprecated, use fetchRentedProductsByType instead)
export const fetchRentedProducts = async (): Promise<RentedProduct[]> => {
  try {
    const response = await api.get("/rented-products");
    return response.data;
  } catch {
    throw new Error("Failed to fetch rented products");
  }
};

// Fetch rented products by product type ID (NEW API)
export const fetchRentedProductsByType = async (
  productTypeId: string
): Promise<RentedProduct[]> => {
  try {
    const response = await api.get(
      `/rented-products/GetByProductType/${productTypeId}`
    );
    return response.data;
  } catch {
    throw new Error("Failed to fetch rented products by type");
  }
};

// Fetch product detail by ID
export const fetchProductDetail = async (
  productId: string
): Promise<ProductDetailResponse> => {
  try {
    const response = await api.get(`/rented-products/${productId}`);
    return response.data;
  } catch {
    throw new Error("Failed to fetch product detail");
  }
};

// Fetch product ratings by product ID
export const fetchProductRatings = async (
  productId: string
): Promise<ProductRating[]> => {
  try {
    const response = await api.get(`/product-ratings/${productId}`);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error: unknown) {
    // If the endpoint doesn't exist or returns 404, try alternative endpoint
    if (
      (error as { response?: { status?: number } }).response?.status === 404
    ) {
      try {
        const altResponse = await api.get("/product-ratings");
        const allRatings = altResponse.data;

        // Filter by productId manually
        if (Array.isArray(allRatings)) {
          const filteredRatings = allRatings.filter(
            (rating: ProductRating) => rating.productId === productId
          );
          return filteredRatings;
        }
      } catch {
        // Alternative endpoint failed
      }
      return [];
    }
    // Return empty array instead of throwing error
    return [];
  }
};

// Create a new product rating
export const createProductRating = async (
  rating: CreateProductRating
): Promise<ProductRating> => {
  try {
    const response = await api.post("/product-ratings", rating);
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };
    const errorMessage =
      axiosError.response?.data?.message ||
      axiosError.message ||
      "Failed to create product rating";
    throw new Error(errorMessage);
  }
};

// Fetch products by filters (now only for price filtering since category is handled by API)
export const fetchProductsWithFilters = async (
  products: RentedProduct[],
  filters?: {
    brand?: string[];
    priceRange?: [number, number];
  }
): Promise<RentedProduct[]> => {
  try {
    if (!filters) return products;

    return products.filter((item) => {
      const { product } = item;

      // Filter by price range (using singleDayPrice)
      if (filters.priceRange && product?.singleDayPrice) {
        const [min, max] = filters.priceRange;
        if (product.singleDayPrice < min || product.singleDayPrice > max) {
          return false;
        }
      }

      return true;
    });
  } catch {
    throw new Error("Failed to filter products");
  }
};

export async function fetchProductRating(
  productId: number
): Promise<ProductRating | null> {
  try {
    const response = await api.get(`/product-rating/${productId}`);
    return response.data;
  } catch (error: unknown) {
    // Handle 404 as normal case (no rating exists yet)
    if (
      (error as { response?: { status?: number } }).response?.status === 404
    ) {
      return null;
    }
    return null;
  }
}

// Fetch user profile
export const fetchUserProfile = async (): Promise<UserProfile | null> => {
  try {
    const userId = getUserIdFromToken();
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch {
    return null;
  }
};

// ========== ADMIN APIs ==========

// Admin: Create new product
export const createProduct = async (productData: {
  name: string;
  typeId: string;
  actualPrice: number;
  brandId: string;
  description: string;
  detailDescription: string;
  techSpec: string;
  features: string;
  includes: string;
  highlights: string;
  isVerified: boolean;
  isAvailable: boolean;
  altText: string;
  singleDayPrice: number;
  images: string[];
}): Promise<Product> => {
  try {
    const response = await api.post("/rented-products", productData);
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };
    const errorMessage =
      axiosError.response?.data?.message ||
      axiosError.message ||
      "Failed to create product";
    throw new Error(errorMessage);
  }
};

// Admin: Update product
export const updateProduct = async (
  productId: string,
  productData: {
    name: string;
    typeId: string;
    actualPrice: number;
    brandId: string;
    description: string;
    detailDescription: string;
    techSpec: string;
    features: string;
    includes: string;
    highlights: string;
    isVerified: boolean;
    isAvailable: boolean;
    altText: string;
    singleDayPrice: number;
    images: string[];
  }
): Promise<Product> => {
  try {
    const response = await api.patch(
      `/rented-products/${productId}`,
      productData
    );
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };
    const errorMessage =
      axiosError.response?.data?.message ||
      axiosError.message ||
      "Failed to update product";
    throw new Error(errorMessage);
  }
};

// Admin: Delete product
export const deleteProduct = async (productId: string): Promise<void> => {
  try {
    await api.delete(`/rented-products/${productId}`);
  } catch (error: unknown) {
    const axiosError = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };
    const errorMessage =
      axiosError.response?.data?.message ||
      axiosError.message ||
      "Failed to delete product";
    throw new Error(errorMessage);
  }
};

// Admin: Fetch products by brand
export const fetchProductsByBrand = async (
  brandId: string
): Promise<RentedProduct[]> => {
  try {
    const response = await api.get(`/rented-products/GetByBrand/${brandId}`);
    return response.data;
  } catch {
    throw new Error("Failed to fetch products by brand");
  }
};
