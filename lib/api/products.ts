import {
  ProductType,
  Brand,
  RentedProduct,
  ProductDetailResponse,
  ProductRating,
  CreateProductRating,
  UserProfile,
} from "@/types/product";
import { getAccessToken } from "../api";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

// Fetch product types (categories)
export const fetchProductTypes = async (): Promise<ProductType[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/product-types`);
    if (!response.ok) {
      throw new Error("Failed to fetch product types");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching product types:", error);
    throw error;
  }
};

// Fetch brands
export const fetchBrands = async (): Promise<Brand[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/brands`);
    if (!response.ok) {
      throw new Error("Failed to fetch brands");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching brands:", error);
    throw error;
  }
};

// Fetch brands by product type ID
export const fetchBrandsByType = async (
  productTypeId: string
): Promise<Brand[]> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/type-brands/by-type/${productTypeId}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch brands by type");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching brands by type:", error);
    throw error;
  }
};

// Fetch rented products (all products - deprecated, use fetchRentedProductsByType instead)
export const fetchRentedProducts = async (): Promise<RentedProduct[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/rented-products`);
    if (!response.ok) {
      throw new Error("Failed to fetch rented products");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching rented products:", error);
    throw error;
  }
};

// Fetch rented products by product type ID (NEW API)
export const fetchRentedProductsByType = async (
  productTypeId: string
): Promise<RentedProduct[]> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/rented-products/GetByProductType/${productTypeId}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch rented products by type");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching rented products by type:", error);
    throw error;
  }
};

// Fetch product detail by ID
export const fetchProductDetail = async (
  productId: string
): Promise<ProductDetailResponse> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/rented-products/${productId}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch product detail");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching product detail:", error);
    throw error;
  }
};

// Fetch product ratings by product ID
export const fetchProductRatings = async (
  productId: string
): Promise<ProductRating[]> => {
  try {
    console.log(`Debug - Fetching ratings for productId: ${productId}`);
    console.log(
      `Debug - API URL: ${API_BASE_URL}/product-ratings/${productId}`
    );

    const response = await fetch(
      `${API_BASE_URL}/product-ratings/${productId}`
    );

    console.log(`Debug - Response status: ${response.status}`);

    // If the endpoint doesn't exist or returns 404, try alternative endpoint
    if (!response.ok) {
      if (response.status === 404) {
        console.log(
          `No ratings found for product ${productId}, trying alternative endpoint`
        );

        // Try alternative endpoint without productId filter
        try {
          const altResponse = await fetch(`${API_BASE_URL}/product-ratings`);
          if (altResponse.ok) {
            const allRatings = await altResponse.json();
            console.log(`Debug - All ratings:`, allRatings);

            // Filter by productId manually
            if (Array.isArray(allRatings)) {
              const filteredRatings = allRatings.filter(
                (rating: ProductRating) => rating.productId === productId
              );
              console.log(
                `Debug - Filtered ratings for ${productId}:`,
                filteredRatings
              );
              return filteredRatings;
            }
          }
        } catch (altError) {
          console.log("Alternative endpoint also failed:", altError);
        }

        return [];
      }
      throw new Error(`Failed to fetch product ratings: ${response.status}`);
    }

    const data = await response.json();
    console.log(`Debug - Ratings data:`, data);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching product ratings:", error);
    // Return empty array instead of throwing error
    return [];
  }
};

// Create a new product rating
export const createProductRating = async (
  rating: CreateProductRating
): Promise<ProductRating> => {
  try {
    const token = getAccessToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/product-ratings`, {
      method: "POST",
      headers,
      body: JSON.stringify(rating),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to create product rating: ${response.status} - ${errorText}`
      );
    }
    return await response.json();
  } catch (error) {
    console.error("Error creating product rating:", error);
    throw error;
  }
};

// Mock user profile function - replace with actual API call
export const fetchUserProfile = async (): Promise<UserProfile> => {
  // In a real application, this would be an actual API call
  // For now, returning mock data
  return {
    id: "user123",
    email: "user@example.com",
    fullName: "John Doe",
    dateOfBirth: null,
    identityType: null,
    identityNumber: "",
    identityFrontImage: "",
    identityBackImage: "",
    identityVerified: false, // Set to true to test verified user deposit
  };
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
  } catch (error) {
    console.error("Error filtering products:", error);
    throw error;
  }
};

export async function fetchProductRating(
  productId: number
): Promise<ProductRating | null> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/product-rating/${productId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Handle 404 as normal case (no rating exists yet)
    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    // Only log error if it's not a 404 (product not found)
    if (error instanceof Error && !error.message.includes("404")) {
      console.error("Error fetching product rating:", error);
    }
    return null;
  }
}
