import {
  ProductType,
  Brand,
  RentedProduct,
  ProductDetailResponse,
  ProductRating,
  CreateProductRating,
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
  } catch {
    throw new Error("Failed to fetch product types");
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
  } catch {
    throw new Error("Failed to fetch brands");
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
  } catch {
    throw new Error("Failed to fetch brands by type");
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
  } catch {
    throw new Error("Failed to fetch rented products");
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
  } catch {
    throw new Error("Failed to fetch rented products by type");
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
  } catch {
    throw new Error("Failed to fetch product detail");
  }
};

// Fetch product ratings by product ID
export const fetchProductRatings = async (
  productId: string
): Promise<ProductRating[]> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/product-ratings/${productId}`
    );

    // If the endpoint doesn't exist or returns 404, try alternative endpoint
    if (!response.ok) {
      if (response.status === 404) {
        // Try alternative endpoint without productId filter
        try {
          const altResponse = await fetch(`${API_BASE_URL}/product-ratings`);
          if (altResponse.ok) {
            const allRatings = await altResponse.json();

            // Filter by productId manually
            if (Array.isArray(allRatings)) {
              const filteredRatings = allRatings.filter(
                (rating: ProductRating) => rating.productId === productId
              );
              return filteredRatings;
            }
          }
        } catch {
          // Alternative endpoint failed
        }

        return [];
      }
      throw new Error(`Failed to fetch product ratings: ${response.status}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch {
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
    throw error;
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
  } catch {
    return null;
  }
}
