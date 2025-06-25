"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import {
  ProductCardData,
  ProductImage,
  Duration,
  Product,
  Brand,
  ProductType,
} from "@/types/product";
import {
  fetchProductDetail,
  fetchBrands,
  fetchProductTypes,
} from "@/lib/api/products";

export interface FavouriteProduct {
  _id: string;
  productId: string;
  name: string;
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
  typeId: string;
  // Additional fields from API calls
  images?: ProductImage[];
  durations?: Duration[];
  productDetail?: Product;
}

export const useFavourites = () => {
  const { user, isAuthenticated } = useAuth();
  const [favourites, setFavourites] = useState<FavouriteProduct[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch brands and product types on mount
  useEffect(() => {
    const fetchReferenceData = async () => {
      try {
        const [brandsData, typesData] = await Promise.all([
          fetchBrands(),
          fetchProductTypes(),
        ]);
        setBrands(brandsData);
        setProductTypes(typesData);
      } catch (error) {
        console.error("Error fetching reference data:", error);
      }
    };

    fetchReferenceData();
  }, []);

  // Fetch favourites with detailed product info
  const fetchFavourites = async () => {
    if (!user?.id || !isAuthenticated) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // First try to get favourites list
      const favouritesResponse = await api.get(`/users/${user.id}/favorites`);
      const favouritesList = favouritesResponse.data || [];

      // Fetch detailed info for each product using rented-products endpoint
      const detailedFavourites = await Promise.all(
        favouritesList.map(async (item: FavouriteProduct) => {
          try {
            // Use the same function as product page: fetchProductDetail
            const productData = await fetchProductDetail(item.productId);

            // The response should have structure: { product: {...}, images: [...], durations: [...] }
            if (productData) {
              return {
                ...item,
                ...productData.product, // Merge product details
                images: productData.images || [],
                durations: productData.durations || [],
                productDetail: productData.product,
              };
            } else {
              throw new Error("No product data returned");
            }
          } catch {
            // Final fallback - return original item
            return {
              ...item,
              images: [],
              durations: [],
              productDetail: null,
            };
          }
        })
      );

      setFavourites(detailedFavourites);
    } catch (error: unknown) {
      console.error("Error fetching favourites:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : (error as { response?: { data?: { message?: string } } })?.response
              ?.data?.message || "Không thể tải danh sách yêu thích";
      setError(errorMessage);
      setFavourites([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Add to favourites
  const addToFavourites = async (productId: string) => {
    if (!user?.id || !isAuthenticated) {
      throw new Error("Vui lòng đăng nhập để thêm vào yêu thích");
    }

    try {
      await api.post(`/users/${user.id}/favorites/${productId}`);

      // Optimistic update: try to get product details and add to local state
      try {
        const productData = await fetchProductDetail(productId);
        if (productData) {
          const newFavourite: FavouriteProduct = {
            ...productData.product,
            _id: `temp_${Date.now()}`, // Temporary ID
            productId: productId,
            images: productData.images || [],
            durations: productData.durations || [],
            productDetail: productData.product,
            __v: 0,
          };

          setFavourites((prev) => [...prev, newFavourite]);
        } else {
          // Fallback to refetch if product details fail
          await fetchFavourites();
        }
      } catch {
        await fetchFavourites();
      }

      return true;
    } catch (error: unknown) {
      console.error("Error adding to favourites:", error);
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Không thể thêm vào yêu thích";
      throw new Error(errorMessage);
    }
  };

  // Remove from favourites
  const removeFromFavourites = async (productId: string) => {
    if (!user?.id || !isAuthenticated) {
      throw new Error("Vui lòng đăng nhập");
    }

    try {
      await api.delete(`/users/${user.id}/favorites/${productId}`);
      // Remove from local state immediately for better UX
      setFavourites((prev) =>
        prev.filter((item) => item.productId !== productId)
      );
      return true;
    } catch (error: unknown) {
      console.error("Error removing from favourites:", error);
      // Refetch in case of error to sync state
      await fetchFavourites();
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Không thể xóa khỏi yêu thích";
      throw new Error(errorMessage);
    }
  };

  // Check if product is in favourites
  const isFavourite = (productId: string): boolean => {
    return favourites.some((item) => item.productId === productId);
  };

  // Toggle favourite status
  const toggleFavourite = async (productId: string) => {
    if (isFavourite(productId)) {
      await removeFromFavourites(productId);
    } else {
      await addToFavourites(productId);
    }
  };

  // Convert to ProductCardData format for compatibility with ProductCard component
  const getProductCardData = (): ProductCardData[] => {
    return favourites.map((item) => {
      // Get the first image URL
      const imageUrl =
        item.images && item.images.length > 0 ? item.images[0].imageUrl : "";

      // Convert durations to the format expected by ProductCard
      const formattedDurations = item.durations?.map((duration) => ({
        duration: duration.duration,
        price: duration.price,
        discount: 0, // Calculate discount if needed
      })) || [
        {
          duration: "1 day",
          price: item.singleDayPrice,
          discount: 0,
        },
      ];

      // Find brand name from brands array
      const brand = brands.find((b) => b.brandId === item.brandId);

      // Find product type name from productTypes array
      const productType = productTypes.find(
        (pt) => pt.productTypeId === item.typeId
      );

      const productCardData = {
        id: item.productId,
        name: item.name,
        type: productType?.name || "Unknown Category",
        rating: item.rating,
        brand: brand?.name || "Unknown Brand",
        description: item.description,
        isVerified: item.isVerified,
        isAvailable: item.isAvailable,
        actualPrice: item.actualPrice,
        singleDayPrice: item.singleDayPrice,
        image: imageUrl,
        durations: formattedDurations,
      };

      return productCardData;
    });
  };

  // Get favourites count
  const getFavouritesCount = (): number => {
    return favourites.length;
  };

  useEffect(() => {
    fetchFavourites();
  }, [user?.id, isAuthenticated]);

  return {
    favourites,
    isLoading,
    error,
    addToFavourites,
    removeFromFavourites,
    isFavourite,
    toggleFavourite,
    fetchFavourites,
    getProductCardData,
    getFavouritesCount,
  };
};
