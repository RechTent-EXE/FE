"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Camera, Laptop, Video, Smartphone } from "lucide-react";
import { useEffect, useState } from "react";
import { ProductType } from "@/types/product";
import { fetchProductTypes } from "@/lib/api/products";

export default function CategoryTabs() {
  const pathname = usePathname();
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProductTypes = async () => {
      try {
        const types = await fetchProductTypes();
        setProductTypes(types);
      } catch (error) {
        console.error("Failed to fetch product types:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProductTypes();
  }, []);

  // Icon mapping for each category
  const getIconForCategory = (categoryName: string) => {
    const lowerCaseName = categoryName.toLowerCase();
    switch (lowerCaseName) {
      case "camera":
        return Camera;
      case "laptop":
        return Laptop;
      case "dashcam":
        return Smartphone;
      case "flycam":
        return Video;
      default:
        return Camera;
    }
  };

  // Color mapping for each category
  const getColorForCategory = (categoryName: string) => {
    const lowerCaseName = categoryName.toLowerCase();
    switch (lowerCaseName) {
      case "camera":
        return "bg-blue-500";
      case "laptop":
        return "bg-purple-500";
      case "dashcam":
        return "bg-orange-500";
      case "flycam":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const categories = productTypes.map((type) => ({
    name: type.name,
    href: `/products/${type.name.toLowerCase()}`,
    icon: getIconForCategory(type.name),
    color: getColorForCategory(type.name),
  }));

  if (loading) {
    return (
      <div className="bg-white sticky top-[70px] z-40 border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-pulse bg-gray-200 h-10 w-24 rounded-lg"></div>
            <div className="animate-pulse bg-gray-200 h-10 w-24 rounded-lg"></div>
            <div className="animate-pulse bg-gray-200 h-10 w-24 rounded-lg"></div>
            <div className="animate-pulse bg-gray-200 h-10 w-24 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white sticky top-[70px] z-40 border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-center space-x-2 overflow-x-auto">
          {categories.map((category) => {
            const isActive = pathname.includes(category.href);
            const IconComponent = category.icon;

            return (
              <Link key={category.name} href={category.href}>
                <button
                  className={`flex items-center gap-2 whitespace-nowrap transition-all duration-300 px-4 py-2 rounded-lg font-medium ${
                    isActive
                      ? `${category.color} hover:opacity-90 text-white shadow-lg`
                      : "hover:bg-gray-50 border border-gray-200 text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  {category.name}
                </button>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
