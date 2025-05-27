"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Camera, Laptop, Video, Smartphone } from "lucide-react";

export default function CategoryTabs() {
  const pathname = usePathname();

  const categories = [
    {
      name: "Camera",
      href: "/products/camera",
      icon: Camera,
      color: "bg-blue-500",
    },
    {
      name: "Laptop",
      href: "/products/laptop",
      icon: Laptop,
      color: "bg-purple-500",
    },
    {
      name: "Dashcam",
      href: "/products/dashcam",
      icon: Smartphone,
      color: "bg-orange-500",
    },
    {
      name: "Flycam",
      href: "/products/flycam",
      icon: Video,
      color: "bg-green-500",
    },
  ];

  return (
    <div className="bg-white sticky top-[70px] z-40">
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
                      ? `${category.color} hover:opacity-90 text-white`
                      : "hover:bg-gray-50 border border-gray-200 text-gray-700"
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
