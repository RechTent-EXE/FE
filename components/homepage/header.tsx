"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  Search,
  Heart,
  ShoppingCart,
  ChevronDown,
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import UserProfile from "@/components/auth/UserProfile";
import { useCart } from "@/hooks/useCart";
import { useFavourites } from "@/hooks/useFavourites";
import { ProductCardData } from "@/types/product";
import { fetchRentedProductsByName } from "@/lib/api/products";
import { useAdmin } from "@/hooks/useAdmin";

export default function Header() {
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { cartItems } = useCart();
  const { favourites } = useFavourites();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<ProductCardData[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { isAdmin } = useAdmin();

  // Force re-render when cartItems or favourites change
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const favouritesCount = favourites.length;

  useEffect(() => {
    // console.log("Client-side API URL:", process.env.NEXT_PUBLIC_API_URL); //check if .env.local is loaded
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await fetchRentedProductsByName(searchTerm);

        // Map API shape (RentedProduct) → ProductCardData
        const mapped: ProductCardData[] = results.map((item) => ({
          id: item.product.productId,
          name: item.product.name,
          type: item.product.typeId,
          rating: item.product.rating,
          brand: item.product.brandId,
          description: item.product.description,
          isVerified: item.product.isVerified,
          isAvailable: item.product.isAvailable,
          actualPrice: item.product.actualPrice,
          singleDayPrice: item.product.singleDayPrice,
          image: item.images[0]?.imageUrl || "",
          durations: item.durations.map((d) => ({
            duration: d.duration,
            price: d.price,
            discount: 0,
          })),
        }));

        console.log(mapped);
        setSearchResults(mapped);

        // setSearchResults(results);
      } catch (error) {
        console.error("Search failed", error);
      } finally {
        setIsSearching(false);
      }
    }, 300); // debounce 300ms

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  useEffect(() => {
    if (!mounted) return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mounted]);

  const categories = [
    {
      name: "Camera",
      href: "/products/camera",
      icon: "📷",
      color: "from-blue-500 to-cyan-500",
    },
    {
      name: "Laptop",
      href: "/products/laptop",
      icon: "💻",
      color: "from-purple-500 to-pink-500",
    },
    {
      name: "Dashcam",
      href: "/products/dashcam",
      icon: "🚗",
      color: "from-orange-500 to-red-500",
    },
    {
      name: "Flycam",
      href: "/products/flycam",
      icon: "🚁",
      color: "from-green-500 to-emerald-500",
    },
  ];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 backdrop-blur-xl border-b border-gray-200/50 shadow-lg"
          : "bg-white/95 backdrop-blur-sm border-b border-gray-100"
      }`}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              {/* Soft glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white to-pink-200 rounded-2xl blur-sm opacity-60 group-hover:opacity-80 transition-opacity"></div>

              {/* Logo container with white to pink gradient */}
              <div className="relative w-12 h-12 bg-gradient-to-br from-white via-pink-50 to-pink-200 rounded-2xl flex items-center justify-center transform group-hover:scale-105 transition-all duration-300 shadow-lg border border-pink-100/50">
                <Image
                  src="/images/logo.png"
                  alt="RechTent Logo"
                  width={28}
                  height={28}
                  className="w-7 h-7 object-contain"
                  priority
                />
              </div>
            </div>

            <div className="hidden sm:block">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                RechTent
              </span>
              <div className="text-xs text-gray-500 -mt-1">Tech Rental</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <div className="relative group">
              <button
                onClick={() => setIsShopOpen(!isShopOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-gray-700 hover:text-blue-600 font-medium transition-all duration-200 hover:bg-blue-50 group"
              >
                <span className="relative">
                  Cửa hàng
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
                </span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isShopOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isShopOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white/95 backdrop-blur-xl border border-gray-200/50 rounded-2xl shadow-2xl z-50 animate-slide-down overflow-hidden">
                  <div className="p-2">
                    {categories.map((category) => (
                      <Link
                        key={category.name}
                        href={category.href}
                        className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition-all duration-200 rounded-xl group"
                        onClick={() => setIsShopOpen(false)}
                      >
                        <div
                          className={`w-10 h-10 bg-gradient-to-r ${category.color} rounded-lg flex items-center justify-center text-white text-lg group-hover:scale-110 transition-transform`}
                        >
                          {category.icon}
                        </div>
                        <div>
                          <span className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                            {category.name}
                          </span>
                          <div className="text-xs text-gray-500">
                            Xem tất cả
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/news"
              className="relative px-4 py-2 rounded-full text-gray-700 hover:text-blue-600 font-medium transition-all duration-200 hover:bg-blue-50 group"
            >
              <span className="relative">
                Tin tức
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
              </span>
            </Link>

            {/* Admin Tab - only for admins */}
            {isAdmin && (
              <Link
                href="/admin"
                className="relative px-4 py-2 rounded-full text-gray-700 hover:text-green-600 font-medium transition-all duration-200 hover:bg-green-50 group"
              >
                <span className="relative">
                  Admin
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-green-600 to-emerald-600 group-hover:w-full transition-all duration-300"></span>
                </span>
              </Link>
            )}

            <Link
              href="/ai-finder"
              className="relative px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:shadow-lg hover:scale-105 transition-all duration-200 group"
            >
              <Sparkles className="w-4 h-4 inline mr-2" />
              AI Tư vấn
            </Link>
          </nav>

          {/* Search & Actions */}
          <div className="flex items-center space-x-3">
            {/* Search */}
            <div className="relative hidden md:flex items-center space-x-2 bg-gray-100/80 backdrop-blur-sm rounded-full px-4 py-2 max-w-sm hover:bg-gray-100 transition-colors group">
              <Search className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm sản phẩm..."
                className="border-0 bg-transparent outline-none flex-1 placeholder:text-gray-500"
              />

              {/* Dropdown */}
              {(searchResults.length > 0 ||
                (!isSearching && searchTerm.trim())) && (
                <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-50 animate-fadeIn">
                  <ul className="max-h-64 overflow-y-auto divide-y divide-gray-100">
                    {searchResults.length > 0 ? (
                      searchResults.map((product) => (
                        <li key={product.id}>
                          <Link
                            href={`/products/${product.type.toLowerCase()}/${
                              product.id
                            }`}
                            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors duration-150"
                            onClick={() => {
                              setSearchTerm("");
                              setSearchResults([]);
                            }}
                          >
                            <div className="flex-shrink-0 w-10 h-10 rounded-lg overflow-hidden border border-gray-200">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <span className="text-gray-700 font-medium truncate">
                              {product.name}
                            </span>
                          </Link>
                        </li>
                      ))
                    ) : (
                      <li className="px-4 py-3 text-gray-500 text-sm text-center">
                        Không tìm thấy sản phẩm
                      </li>
                    )}
                  </ul>
                </div>
              )}

              {/* Loading state */}
              {isSearching && (
                <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-50 p-4 text-sm text-gray-500">
                  Đang tìm kiếm...
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <Link href="/favourites">
              <button className="relative p-2.5 hover:bg-gray-100 rounded-full transition-all duration-200 group">
                <Heart className="w-5 h-5 text-gray-600 group-hover:text-red-500 transition-colors" />
                {favouritesCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                    {favouritesCount}
                  </span>
                )}
              </button>
            </Link>

            <Link href="/cart">
              <button className="relative p-2.5 hover:bg-gray-100 rounded-full transition-all duration-200 group">
                <ShoppingCart className="w-5 h-5 text-gray-600 group-hover:text-blue-500 transition-colors" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                    {cartCount}
                  </span>
                )}
              </button>
            </Link>

            {/* User Profile - replaced with UserProfile component */}
            <UserProfile />

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 p-4 bg-white/95 backdrop-blur-xl rounded-2xl border border-gray-200/50 animate-slide-down">
            <div className="space-y-3">
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-500 px-3">
                  Danh mục
                </div>
                {categories.map((category) => (
                  <Link
                    key={category.name}
                    href={category.href}
                    className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="text-lg">{category.icon}</span>
                    <span className="font-medium">{category.name}</span>
                  </Link>
                ))}
              </div>

              <div className="border-t pt-3 space-y-2">
                <Link
                  href="/news"
                  className="block px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                >
                  Tin tức
                </Link>

                {/* Admin Tab - only for admins */}
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="relative px-4 py-2 rounded-full text-gray-700 hover:text-green-600 font-medium transition-all duration-200 hover:bg-green-50 group"
                  >
                    <span className="relative">
                      Admin
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-green-600 to-emerald-600 group-hover:w-full transition-all duration-300"></span>
                    </span>
                  </Link>
                )}

                <Link
                  href="/ai-finder"
                  className="block px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium"
                >
                  <Sparkles className="w-4 h-4 inline mr-2" />
                  AI Tư vấn
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
