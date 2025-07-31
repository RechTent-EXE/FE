"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Package,
  Home,
  Users,
  BarChart3,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  RotateCcw,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface MenuItem {
  label: string;
  href?: string;
  icon: React.ReactNode;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: <Home size={20} />,
  },
  {
    label: "Quản lý sản phẩm",
    icon: <Package size={20} />,
    children: [
      {
        label: "Tất cả sản phẩm",
        href: "/admin/products",
        icon: <Package size={16} />,
      },
      {
        label: "Thêm sản phẩm",
        href: "/admin/products/create",
        icon: <Package size={16} />,
      },
    ],
  },
  {
    label: "Quản lý người dùng",
    href: "/admin/users",
    icon: <Users size={20} />,
  },
  {
    label: "Quản lý trả hàng",
    href: "/admin/returns",
    icon: <RotateCcw size={20} />,
  },
  {
    label: "Báo cáo",
    href: "/admin/reports",
    icon: <BarChart3 size={20} />,
  },
  {
    label: "Cài đặt",
    href: "/admin/settings",
    icon: <Settings size={20} />,
  },
  {
    label: "Test Admin",
    href: "/admin/test",
    icon: <BarChart3 size={20} />,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [expandedItems, setExpandedItems] = useState<string[]>([
    "Quản lý sản phẩm",
  ]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const toggleExpanded = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === href;
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  const isParentActive = (item: MenuItem) => {
    if (item.href && isActive(item.href)) {
      return true;
    }
    if (item.children) {
      return item.children.some((child) => child.href && isActive(child.href));
    }
    return false;
  };

  const renderMenuItem = (item: MenuItem, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.label);
    const active = hasChildren
      ? isParentActive(item)
      : item.href
      ? isActive(item.href)
      : false;

    return (
      <div key={item.label}>
        <button
          onClick={() => {
            if (hasChildren) {
              toggleExpanded(item.label);
            } else if (item.href) {
              router.push(item.href);
            }
          }}
          className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${
            active
              ? "bg-blue-600 text-white"
              : "text-gray-700 hover:bg-gray-100"
          } ${depth > 0 ? "pl-8" : ""}`}
        >
          <div className="flex items-center space-x-3">
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </div>
          {hasChildren &&
            (isExpanded ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            ))}
        </button>

        {hasChildren && isExpanded && (
          <div className="bg-gray-50">
            {item.children!.map((child) => renderMenuItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Package className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">RechTent</h1>
            <p className="text-sm text-gray-600">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-4 overflow-y-auto">
        <nav className="space-y-1">
          {menuItems.map((item) => renderMenuItem(item))}
        </nav>
      </div>

      {/* User Info & Logout */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold text-gray-700">
              {user?.email?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">
              {user?.email || "Admin"}
            </p>
            <p className="text-xs text-gray-600">Quản trị viên</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut size={16} />
          <span className="text-sm font-medium">Đăng xuất</span>
        </button>
      </div>
    </div>
  );
}
