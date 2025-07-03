"use client";

import { useState } from "react";
import { Edit, Trash2, Eye, CheckCircle, XCircle } from "lucide-react";
import { AdminProductRow } from "@/types/product";
import { deleteProduct } from "@/lib/api/products";

interface ProductTableProps {
  products: AdminProductRow[];
  onEdit: (productId: string) => void;
  onDelete: (productId: string) => void;
}

export default function ProductTable({
  products,
  onEdit,
  onDelete,
}: ProductTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (productId: string, productName: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${productName}"?`)) {
      return;
    }

    setDeletingId(productId);
    try {
      await deleteProduct(productId);
      onDelete(productId);
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Có lỗi xảy ra khi xóa sản phẩm. Vui lòng thử lại.");
    } finally {
      setDeletingId(null);
    }
  };

  if (products.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <Eye className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Không có sản phẩm nào
        </h3>
        <p className="text-gray-600">
          Chưa có sản phẩm nào được tạo hoặc không có sản phẩm nào phù hợp với
          bộ lọc.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
              Sản phẩm
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
              Loại
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
              Thương hiệu
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
              Giá thuê/ngày
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
              Giá thực tế
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
              Trạng thái
            </th>
            <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">
                      {product.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      ID: {product.id.slice(-8)}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {product.type}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {product.brand}
              </td>
              <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                {product.singleDayPrice.toLocaleString()}đ
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {product.actualPrice.toLocaleString()}đ
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center space-x-1">
                    {product.isVerified ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                    <span
                      className={`text-xs font-medium ${
                        product.isVerified ? "text-green-700" : "text-red-700"
                      }`}
                    >
                      {product.isVerified ? "Đã xác minh" : "Chưa xác minh"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {product.isAvailable ? (
                      <CheckCircle className="w-4 h-4 text-blue-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-gray-500" />
                    )}
                    <span
                      className={`text-xs font-medium ${
                        product.isAvailable ? "text-blue-700" : "text-gray-700"
                      }`}
                    >
                      {product.isAvailable ? "Có sẵn" : "Không có sẵn"}
                    </span>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end space-x-2">
                  <button
                    onClick={() => onEdit(product.id)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Chỉnh sửa"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id, product.name)}
                    disabled={deletingId === product.id}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    title="Xóa"
                  >
                    {deletingId === product.id ? (
                      <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Trash2 size={16} />
                    )}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
