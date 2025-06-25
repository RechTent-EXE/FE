"use client";

import { useState, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useFavourites } from "@/hooks/useFavourites";
import FavouritesHeader from "@/components/favourites/FavouritesHeader";
import FavouritesFilters from "@/components/favourites/FavouritesFilters";
import FavouritesGrid from "@/components/favourites/FavouritesGrid";
import EmptyFavourites from "@/components/favourites/EmptyFavourites";

interface Category {
  id: string;
  name: string;
  count: number;
}

export default function FavouritesPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const {
    favourites,
    isLoading: favouritesLoading,
    error,
    removeFromFavourites,
    fetchFavourites,
    getProductCardData,
  } = useFavourites();

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Convert favourites to ProductCardData format
  const productCardData = useMemo(() => getProductCardData(), [favourites]);

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    const filtered = productCardData.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" ||
        product.type.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          // For favourites, we don't have addedDate, so keep original order
          return 0;
        case "oldest":
          return 0;
        case "price-low":
          return a.singleDayPrice - b.singleDayPrice;
        case "price-high":
          return b.singleDayPrice - a.singleDayPrice;
        case "rating":
          return b.rating - a.rating;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [productCardData, searchQuery, selectedCategory, sortBy]);

  // Generate categories based on available products
  const categories = useMemo((): Category[] => {
    const categoryMap = new Map<string, number>();

    productCardData.forEach((product) => {
      const type = product.type || "Other";
      categoryMap.set(type, (categoryMap.get(type) || 0) + 1);
    });

    const categoriesArray: Category[] = [
      { id: "all", name: "Tất cả", count: productCardData.length },
    ];

    categoryMap.forEach((count, type) => {
      categoriesArray.push({
        id: type.toLowerCase(),
        name: type,
        count,
      });
    });

    return categoriesArray;
  }, [productCardData]);

  const handleRemoveProduct = async (productId: string) => {
    try {
      await removeFromFavourites(productId);
    } catch (error) {
      console.error("Error removing product:", error);
      alert("Không thể xóa sản phẩm khỏi danh sách yêu thích");
    }
  };

  // Show loading state
  if (authLoading || favouritesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pt-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải danh sách yêu thích...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pt-20">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Có lỗi xảy ra
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchFavourites}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pt-20">
        <div className="text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-yellow-600 text-2xl">🔒</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Vui lòng đăng nhập
          </h2>
          <p className="text-gray-600 mb-4">
            Bạn cần đăng nhập để xem danh sách yêu thích
          </p>
          <button
            onClick={() => (window.location.href = "/auth/login")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Đăng nhập
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pt-20 pb-16 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <FavouritesHeader itemCount={productCardData.length} />

          {productCardData.length === 0 ? (
            <EmptyFavourites type="empty" />
          ) : (
            <>
              <FavouritesFilters
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                sortBy={sortBy}
                setSortBy={setSortBy}
                viewMode={viewMode}
                setViewMode={setViewMode}
                categories={categories}
                totalItems={productCardData.length}
                filteredItems={filteredAndSortedProducts.length}
              />

              {filteredAndSortedProducts.length === 0 ? (
                <EmptyFavourites type="no-results" />
              ) : (
                <FavouritesGrid
                  products={filteredAndSortedProducts}
                  viewMode={viewMode}
                  onRemoveProduct={handleRemoveProduct}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
