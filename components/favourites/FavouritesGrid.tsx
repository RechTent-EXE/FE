"use client";

import { ProductCardData } from "@/types/product";
import ProductCard from "@/components/product-page/product-card";

interface FavouritesGridProps {
  products: ProductCardData[];
  viewMode: "grid" | "list";
  onRemoveProduct: (productId: string) => void;
}

export default function FavouritesGrid({
  products,
  viewMode,
  onRemoveProduct,
}: FavouritesGridProps) {
  return (
    <div
      className={`grid gap-6 ${
        viewMode === "grid"
          ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          : "grid-cols-1"
      }`}
    >
      {products.map((product) => (
        <div key={product.id} className="relative group">
          <ProductCard
            product={product}
            viewMode={viewMode}
            showFavouriteButton={false}
            showAddToCartButton={true}
          />

          {/* Remove from favourites button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemoveProduct(product.id);
            }}
            className="absolute top-3 right-3 w-8 h-8 bg-white/90 hover:bg-white rounded-lg flex items-center justify-center text-gray-600 hover:text-red-600 transition-colors shadow-md opacity-0 group-hover:opacity-100 z-10"
            title="Xóa khỏi yêu thích"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
