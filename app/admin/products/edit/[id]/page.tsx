"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import {
  fetchProductDetail,
  fetchProductTypes,
  fetchBrands,
  updateProduct,
} from "@/lib/api/products";
import {
  ProductType,
  Brand,
  UpdateProductData,
  ProductDetailResponse,
} from "@/types/product";
import ProductForm from "@/components/admin/ProductForm";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [productDetail, setProductDetail] =
    useState<ProductDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productData, typesData, brandsData] = await Promise.all([
          fetchProductDetail(productId),
          fetchProductTypes(),
          fetchBrands(),
        ]);

        setProductDetail(productData);
        setProductTypes(typesData);
        setBrands(brandsData);
      } catch (error) {
        console.error("Error loading data:", error);
        alert("Có lỗi xảy ra khi tải dữ liệu sản phẩm.");
        router.push("/admin/products");
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      loadData();
    }
  }, [productId, router]);

  const handleSubmit = async (formData: UpdateProductData) => {
    setSaving(true);
    try {
      await updateProduct(productId, formData);
      router.push("/admin/products");
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Có lỗi xảy ra khi cập nhật sản phẩm. Vui lòng thử lại.");
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

  if (!productDetail) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Không tìm thấy sản phẩm
          </h1>
          <p className="text-gray-600 mb-4">
            Sản phẩm với ID "{productId}" không tồn tại.
          </p>
          <button
            onClick={handleCancel}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  // Convert ProductDetailResponse to form data
  const initialData: UpdateProductData = {
    name: productDetail.product.name,
    typeId: productDetail.product.typeId,
    actualPrice: productDetail.product.actualPrice,
    brandId: productDetail.product.brandId,
    description: productDetail.product.description,
    detailDescription: productDetail.product.detailDescription,
    techSpec: productDetail.product.techSpec,
    features: productDetail.product.features,
    includes: productDetail.product.includes,
    highlights: productDetail.product.highlights,
    isVerified: productDetail.product.isVerified,
    isAvailable: productDetail.product.isAvailable,
    altText: productDetail.images[0]?.altText || "",
    singleDayPrice: productDetail.product.singleDayPrice,
    images: productDetail.images.map((img) => img.imageUrl),
  };

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
              Chỉnh sửa sản phẩm
            </h1>
            <p className="text-gray-600">
              Cập nhật thông tin cho "{productDetail.product.name}"
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <ProductForm
          productTypes={productTypes}
          brands={brands}
          initialData={initialData}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={saving}
          submitButtonText="Cập nhật sản phẩm"
        />
      </div>
    </div>
  );
}
