"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Filter, Search } from "lucide-react";
import {
  fetchRentedProducts,
  fetchProductTypes,
  fetchBrands,
} from "@/lib/api/products";
import {
  RentedProduct,
  ProductType,
  Brand,
  AdminProductRow,
} from "@/types/product";
import ProductTable from "@/components/admin/ProductTable";
import ProductFilters from "@/components/admin/ProductFilters";

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<RentedProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<RentedProduct[]>([]);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsData, typesData, brandsData] = await Promise.all([
          fetchRentedProducts(),
          fetchProductTypes(),
          fetchBrands(),
        ]);

        setProducts(productsData);
        setFilteredProducts(productsData);
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

  // Filter products
  useEffect(() => {
    let filtered = products;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((item) =>
        item.product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by type
    if (selectedType !== "all") {
      filtered = filtered.filter(
        (item) => item.product.typeId === selectedType
      );
    }

    // Filter by brand
    if (selectedBrand !== "all") {
      filtered = filtered.filter(
        (item) => item.product.brandId === selectedBrand
      );
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedType, selectedBrand]);

  const handleCreateProduct = () => {
    router.push("/admin/products/create");
  };

  const handleEditProduct = (productId: string) => {
    router.push(`/admin/products/edit/${productId}`);
  };

  const handleDeleteProduct = async (productId: string) => {
    // This will be handled in ProductTable component
    // Refresh products after deletion
    try {
      const updatedProducts = await fetchRentedProducts();
      setProducts(updatedProducts);
    } catch (error) {
      console.error("Error refreshing products:", error);
    }
  };

  const getTypeName = (typeId: string) => {
    const type = productTypes.find((t) => t.productTypeId === typeId);
    return type?.name || "Unknown";
  };

  const getBrandName = (brandId: string) => {
    const brand = brands.find((b) => b.brandId === brandId);
    return brand?.name || "Unknown";
  };

  // Convert RentedProduct to AdminProductRow
  const convertToTableData = (items: RentedProduct[]): AdminProductRow[] => {
    return items.map((item) => ({
      id: item.product.productId, // ✅ Sử dụng productId (UUID) thay vì _id (MongoDB ObjectId)
      name: item.product.name,
      type: getTypeName(item.product.typeId),
      brand: getBrandName(item.product.brandId),
      singleDayPrice: item.product.singleDayPrice,
      actualPrice: item.product.actualPrice,
      isVerified: item.product.isVerified,
      isAvailable: item.product.isAvailable,
      image: item.images[0]?.imageUrl || "/placeholder.jpg",
    }));
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
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-gray-300 rounded"></div>
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
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Quản lý sản phẩm
            </h1>
            <p className="text-gray-600">
              Tổng cộng {filteredProducts.length} sản phẩm
            </p>
          </div>
          <button
            onClick={handleCreateProduct}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            <span>Thêm sản phẩm</span>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="mt-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search
                size={20}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Filter size={20} />
              <span>Bộ lọc</span>
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <ProductFilters
              productTypes={productTypes}
              brands={brands}
              selectedType={selectedType}
              selectedBrand={selectedBrand}
              onTypeChange={setSelectedType}
              onBrandChange={setSelectedBrand}
            />
          )}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        <ProductTable
          products={convertToTableData(filteredProducts)}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
        />
      </div>
    </div>
  );
}
