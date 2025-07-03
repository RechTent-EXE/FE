"use client";

import { useState, useEffect } from "react";
import {
  Package,
  Users,
  TrendingUp,
  DollarSign,
  Eye,
  Star,
} from "lucide-react";
import { fetchRentedProducts } from "@/lib/api/products";
import { RentedProduct } from "@/types/product";

export default function AdminDashboard() {
  const [products, setProducts] = useState<RentedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchRentedProducts();
        setProducts(data);
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const stats = {
    totalProducts: products.length,
    verifiedProducts: products.filter((p) => p.product.isVerified).length,
    availableProducts: products.filter((p) => p.product.isAvailable).length,
    totalRevenue: products.reduce(
      (sum, p) => sum + p.product.singleDayPrice,
      0
    ),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600">
          Quản lý sản phẩm và theo dõi hiệu suất của RechTent
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng sản phẩm</p>
              <p className="text-3xl font-bold text-gray-900">
                {loading ? "..." : stats.totalProducts}
              </p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Đã xác minh</p>
              <p className="text-3xl font-bold text-green-600">
                {loading ? "..." : stats.verifiedProducts}
              </p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <Star className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Có sẵn</p>
              <p className="text-3xl font-bold text-indigo-600">
                {loading ? "..." : stats.availableProducts}
              </p>
            </div>
            <div className="bg-indigo-50 p-3 rounded-lg">
              <Eye className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Doanh thu/ngày
              </p>
              <p className="text-3xl font-bold text-purple-600">
                {loading ? "..." : `${stats.totalRevenue.toLocaleString()}đ`}
              </p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Thao tác nhanh</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/admin/products"
            className="block p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Package className="w-8 h-8 text-blue-600 mb-2" />
            <h3 className="font-semibold text-gray-900">Quản lý sản phẩm</h3>
            <p className="text-sm text-gray-600">
              Thêm, sửa, xóa sản phẩm trong hệ thống
            </p>
          </a>

          <div className="block p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <Users className="w-8 h-8 text-gray-400 mb-2" />
            <h3 className="font-semibold text-gray-900">Quản lý người dùng</h3>
            <p className="text-sm text-gray-600">
              Sắp ra mắt - Quản lý tài khoản người dùng
            </p>
          </div>

          <div className="block p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <TrendingUp className="w-8 h-8 text-gray-400 mb-2" />
            <h3 className="font-semibold text-gray-900">Báo cáo</h3>
            <p className="text-sm text-gray-600">
              Sắp ra mắt - Xem báo cáo và thống kê
            </p>
          </div>
        </div>
      </div>

      {/* Recent Products */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Sản phẩm gần đây
        </h2>
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="animate-pulse flex space-x-4 p-4 border border-gray-200 rounded-lg"
              >
                <div className="w-16 h-16 bg-gray-300 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {products.slice(0, 5).map((item) => (
              <div
                key={item.product._id}
                className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <img
                  src={item.images[0]?.imageUrl || "/placeholder.jpg"}
                  alt={item.product.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {item.product.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {item.product.singleDayPrice.toLocaleString()}đ/ngày
                  </p>
                </div>
                <div className="flex space-x-2">
                  {item.product.isVerified && (
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                      Đã xác minh
                    </span>
                  )}
                  {item.product.isAvailable && (
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                      Có sẵn
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
