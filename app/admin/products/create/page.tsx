"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import {
  fetchProductTypes,
  fetchBrands,
  createProduct,
} from "@/lib/api/products";
import { ProductType, Brand, CreateProductData } from "@/types/product";
import ProductForm from "@/components/admin/ProductForm";

export default function CreateProductPage() {
  const router = useRouter();
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [typesData, brandsData] = await Promise.all([
          fetchProductTypes(),
          fetchBrands(),
        ]);

        setProductTypes(typesData);
        setBrands(brandsData);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSubmit = async (formData: CreateProductData) => {
    setSaving(true);
    try {
      await createProduct(formData);
      router.push("/admin/products");
    } catch (error) {
      console.error("Error creating product:", error);
      alert("Có lỗi xảy ra khi tạo sản phẩm. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push("/admin/products");
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-300 rounded w-1/4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="animate-pulse space-y-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                <div className="h-10 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleCancel}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Quay lại</span>
          </button>
          <div className="h-6 w-px bg-gray-300"></div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Thêm sản phẩm mới
            </h1>
            <p className="text-gray-600">
              Điền thông tin chi tiết để thêm sản phẩm vào hệ thống
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <ProductForm
          productTypes={productTypes}
          brands={brands}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={saving}
          submitButtonText="Tạo sản phẩm"
        />
      </div>
    </div>
  );
}
