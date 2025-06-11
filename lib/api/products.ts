import { ProductType, Brand, RentedProduct } from "@/types/product";

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
