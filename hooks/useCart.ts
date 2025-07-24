"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import {
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

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  // Product details populated from API
  name?: string;
  rating?: number;
  brandId?: string;
  description?: string;
  detailDescription?: string;
  techSpec?: string;
  features?: string;
  includes?: string;
  highlights?: string;
  isVerified?: boolean;
  isAvailable?: boolean;
  actualPrice?: number;
  singleDayPrice?: number;
  typeId?: string;
  images?: ProductImage[];
  durations?: Duration[];
  productDetail?: Product | null;
}

export interface Cart {
  _id: string;
  cartId: string; // UUID field from backend
  userId: string;
  createdAt: string;
  updatedAt: string;
  status?: string;
}

export interface AddToCartData {
  productId: string;
  quantity: number;
  startDate: string;
  endDate: string;
}

export interface UpdateCartItemData {
  productId: string;
  quantity: number;
  startDate: string;
  endDate: string;
}

export const useCart = () => {
  const { user, isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartId, setCartId] = useState<string | null>(null);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Clear cartId from memory
  const clearCartId = () => {
    setCartId(null);
  };

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

  // Initialize cart on mount
  useEffect(() => {
    const initializeCart = async () => {
      await fetchCartItems();
    };

    if (isAuthenticated && user?.id) {
      initializeCart();
    } else {
      setIsLoading(false);
      clearCartId(); // Clear cart when user logs out
    }
  }, [isAuthenticated, user?.id]);

  // Get or create cart
  // Reusable function to get or create cart (memory-based, no localStorage)
  const getOrCreateCart = async (): Promise<string | null> => {
    if (!user?.id || !isAuthenticated) {
      throw new Error("Vui lòng đăng nhập để sử dụng giỏ hàng");
    }

    try {
      // Step 0: If we already have a cartId in memory, validate it first
      if (cartId) {
        try {
          await api.get(`/carts/${cartId}`);
          return cartId;
        } catch (error: unknown) {
          // Cart doesn't exist on backend, clear memory
          const errorResponse = (error as { response?: { status?: number } })
            ?.response;
          if (errorResponse?.status === 404) {
            clearCartId();
          } else {
            clearCartId();
          }
          // Continue to check user carts or create new one
        }
      }

      // Step 1: GET /carts/user/{userId} - Check if user has existing cart
      const cartsResponse = await api.get(`/carts/user/${user.id}`);

      if (cartsResponse.data && cartsResponse.data.length > 0) {
        // User has existing cart(s), get the most recent active one
        const carts: Cart[] = cartsResponse.data;
        const activeCart =
          carts.find((cart) => cart.status === "active") ||
          carts.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )[0];

        setCartId(activeCart.cartId);
        return activeCart.cartId;
      } else {
        // Step 2: No cart exists, create new one using POST /carts
        const newCartResponse = await api.post("/carts", {
          userId: user.id,
        });

        const newCartId =
          newCartResponse.data.cartId ||
          newCartResponse.data._id ||
          newCartResponse.data.id;
        setCartId(newCartId);
        return newCartId;
      }
    } catch (error) {
      // Clear cart ID from memory if there's an error
      clearCartId();
      throw error;
    }
  };

  // Fetch cart items with detailed product info
  const fetchCartItems = async () => {
    if (!user?.id || !isAuthenticated) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Use new flow to get or create cart
      const currentCartId = await getOrCreateCart();
      if (!currentCartId) {
        setCartItems([]);
        setIsLoading(false);
        return;
      }

      // Get cart items
      let cartItemsResponse;
      try {
        cartItemsResponse = await api.get(
          `/cart-items/SearchByCart/${currentCartId}`
        );
      } catch (error: unknown) {
        // If cart doesn't exist, use the new flow to get/create cart again
        const errorResponse = (error as { response?: { status?: number } })
          ?.response;
        if (errorResponse?.status === 404) {
          clearCartId();
          const newCartId = await getOrCreateCart();
          if (newCartId) {
            // Try fetching items from the new cart
            try {
              cartItemsResponse = await api.get(
                `/cart-items/SearchByCart/${newCartId}`
              );
            } catch {
              // New cart is empty, return empty items
              setCartItems([]);
              setIsLoading(false);
              return;
            }
          } else {
            setCartItems([]);
            setIsLoading(false);
            return;
          }
        } else {
          throw error;
        }
      }

      const rawCartItems: CartItem[] = cartItemsResponse.data || [];

      if (rawCartItems.length === 0) {
        setCartItems([]);
        setIsLoading(false);
        return;
      }

      // Fetch detailed product info for each cart item
      const detailedCartItems = await Promise.all(
        rawCartItems.map(async (item: CartItem) => {
          try {
            const productData = await fetchProductDetail(item.productId);

            if (productData) {
              return {
                ...item,
                ...productData.product,
                images: productData.images || [],
                durations: productData.durations || [],
                productDetail: productData.product,
              };
            } else {
              throw new Error("No product data returned");
            }
          } catch {
            return {
              ...item,
              images: [],
              durations: [],
              productDetail: null,
            };
          }
        })
      );
      setCartItems(detailedCartItems);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : (error as { response?: { data?: { message?: string } } })?.response
              ?.data?.message || "Không thể tải giỏ hàng";
      setError(errorMessage);
      setCartItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Add item to cart
  const addToCart = async (data: AddToCartData) => {
    if (!user?.id || !isAuthenticated) {
      throw new Error("Vui lòng đăng nhập để thêm vào giỏ hàng");
    }

    try {
      // Get or create cart
      const currentCartId = await getOrCreateCart();
      if (!currentCartId) {
        throw new Error("Không thể tạo giỏ hàng");
      }

      // Check if product already exists in cart
      let existingItem = null;
      try {
        const existingItems = await api.get(
          `/cart-items/SearchByCart/${currentCartId}`
        );
        existingItem = existingItems.data?.find(
          (item: CartItem) => item.productId === data.productId
        );
      } catch (error: unknown) {
        // If cart doesn't exist, get/create cart again with new flow
        const errorResponse = (error as { response?: { status?: number } })
          ?.response;
        if (errorResponse?.status === 404) {
          clearCartId();
          const newCartId = await getOrCreateCart();
          if (!newCartId) {
            throw new Error("Không thể tạo giỏ hàng mới");
          }
          // Use the new cart ID and continue with adding new item
          await api.post("/cart-items", {
            cartId: newCartId,
            productId: data.productId,
            quantity: data.quantity,
            startDate: data.startDate,
            endDate: data.endDate,
          });
          await fetchCartItems();
          return true;
        } else {
          throw error;
        }
      }

      if (existingItem) {
        // Update existing item - increase quantity instead of replacing
        const newQuantity = existingItem.quantity + data.quantity;
        await api.patch(`/cart-items/${existingItem.id}`, {
          productId: data.productId,
          quantity: newQuantity,
          startDate: data.startDate,
          endDate: data.endDate,
        });

        // Update local state immediately for existing items
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.id === existingItem.id
              ? {
                  ...item,
                  quantity: newQuantity,
                  startDate: data.startDate,
                  endDate: data.endDate,
                }
              : item
          )
        );
      } else {
        // Add new item
        await api.post("/cart-items", {
          cartId: currentCartId,
          productId: data.productId,
          quantity: data.quantity,
          startDate: data.startDate,
          endDate: data.endDate,
        });
      }

      // For new items, refetch to get complete product details
      // For existing items that were updated, the state is already updated optimistically
      if (!existingItem) {
        await fetchCartItems();
      }
      return true;
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Không thể thêm vào giỏ hàng";
      throw new Error(errorMessage);
    }
  };

  // Update cart item
  const updateCartItem = async (itemId: string, data: UpdateCartItemData) => {
    if (!user?.id || !isAuthenticated) {
      throw new Error("Vui lòng đăng nhập");
    }

    try {
      await api.patch(`/cart-items/${itemId}`, data);

      // Update local state immediately
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === itemId ? { ...item, ...data } : item
        )
      );
      return true;
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Không thể cập nhật giỏ hàng";
      throw new Error(errorMessage);
    }
  };

  // Remove item from cart
  const removeFromCart = async (itemId: string) => {
    if (!user?.id || !isAuthenticated) {
      throw new Error("Vui lòng đăng nhập");
    }

    try {
      await api.delete(`/cart-items/${itemId}`);

      // Remove from local state immediately for better UX
      setCartItems((prev) => prev.filter((item) => item.id !== itemId));
      return true;
    } catch (error: unknown) {
      // Refetch in case of error to sync state
      await fetchCartItems();
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Không thể xóa khỏi giỏ hàng";
      throw new Error(errorMessage);
    }
  };

  // Update quantity only
  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    const item = cartItems.find((item) => item.id === itemId);
    if (!item) return;

    await updateCartItem(itemId, {
      productId: item.productId,
      quantity: newQuantity,
      startDate: item.startDate,
      endDate: item.endDate,
    });
  };

  // Update dates only
  const updateDates = async (
    itemId: string,
    startDate: string,
    endDate: string
  ) => {
    const item = cartItems.find((item) => item.id === itemId);
    if (!item) return;

    await updateCartItem(itemId, {
      productId: item.productId,
      quantity: item.quantity,
      startDate,
      endDate,
    });
  };

  // Clear entire cart
  const clearCart = () => {
    clearCartId();
    setCartItems([]);
  };

  // Reload cart after payment success
  const reloadCart = async () => {
    await fetchCartItems();
  };

  // Get cart count
  const getCartCount = (): number => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Calculate totals
  const calculateItemTotal = (item: CartItem): number => {
    if (!item.singleDayPrice) return 0;
    const days = calculateRentalDays(item.startDate, item.endDate);
    return item.singleDayPrice * days * item.quantity;
  };

  const calculateRentalDays = (startDate: string, endDate: string): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const calculateSubtotal = (): number => {
    return cartItems.reduce(
      (total, item) => total + calculateItemTotal(item),
      0
    );
  };

  const calculateDeposit = (): number => {
    return cartItems.reduce((total, item) => {
      if (!item.actualPrice) return total;
      return total + item.actualPrice * 0.3 * item.quantity;
    }, 0);
  };

  // Get brands and types helper functions (similar to useFavourites)
  const getBrandName = (brandId: string): string => {
    if (!brands || brands.length === 0) {
      return "Unknown Brand";
    }

    const brand = brands.find((b) => b.brandId === brandId);
    return brand?.name || "Unknown Brand";
  };

  const getTypeName = (typeId: string): string => {
    const type = productTypes.find((t) => t.productTypeId === typeId);
    return type?.name || "Unknown Category";
  };

  return {
    // State
    cartItems,
    cartId,
    brands,
    productTypes,
    isLoading,
    error,

    // Actions
    addToCart,
    updateCartItem,
    removeFromCart,
    updateQuantity,
    updateDates,
    fetchCartItems,
    clearCart,
    reloadCart,

    // Utilities
    getCartCount,
    calculateItemTotal,
    calculateRentalDays,
    calculateSubtotal,
    calculateDeposit,
    getBrandName,
    getTypeName,
  };
};
