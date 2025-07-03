"use client";

import { useState, useEffect } from "react";
import { X, Plus, Upload, Link } from "lucide-react";
import { ProductType, Brand, CreateProductData } from "@/types/product";

interface ProductFormProps {
  productTypes: ProductType[];
  brands: Brand[];
  initialData?: Partial<CreateProductData>;
  onSubmit: (data: CreateProductData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  submitButtonText?: string;
}

const sampleData = {
  detailDescription:
    "<p><strong>Canon EOS C200</strong> là máy quay phim chuyên nghiệp với cảm biến Super 35mm, hỗ trợ quay video 4K và tích hợp công nghệ Dual Pixel CMOS AF.</p><p>Thiết kế nhỏ gọn, dễ dàng di chuyển và sử dụng trong nhiều môi trường quay khác nhau.</p>",
  techSpec:
    "<ul><li>Cảm biến Super 35mm</li><li>Quay video 4K</li><li>Hỗ trợ Dual Pixel CMOS AF</li><li>Định dạng Cinema RAW Light</li><li>Đầu ra HDMI 12-bit 4:4:4</li></ul>",
  features:
    "<ul><li>Quay video 4K với chất lượng cao</li><li>Hệ thống lấy nét tự động Dual Pixel CMOS AF</li><li>Đầu ra HDMI 12-bit 4:4:4 cho chất lượng hình ảnh tuyệt vời</li><li>Thiết kế nhỏ gọn, dễ dàng di chuyển</li></ul>",
  includes:
    "<ul><li>01 x Canon EOS C200</li><li>01 x Pin</li><li>01 x Thẻ CFast</li><li>01 x Sạc</li></ul>",
  highlights:
    "<ul><li>Máy quay chuyên nghiệp với chất lượng hình ảnh 4K</li><li>Hệ thống lấy nét tự động Dual Pixel CMOS AF</li><li>Đầu ra HDMI 12-bit 4:4:4 cho chất lượng hình ảnh tuyệt vời</li></ul>",
};

export default function ProductForm({
  productTypes,
  brands,
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  submitButtonText = "Lưu sản phẩm",
}: ProductFormProps) {
  const [formData, setFormData] = useState<CreateProductData>({
    name: "",
    typeId: "",
    actualPrice: 0,
    brandId: "",
    description: "",
    detailDescription: "",
    techSpec: "",
    features: "",
    includes: "",
    highlights: "",
    isVerified: false,
    isAvailable: true,
    altText: "",
    singleDayPrice: 0,
    images: [],
    ...initialData,
  });

  const [imageUrls, setImageUrls] = useState<string[]>(
    initialData?.images || ["", "", ""]
  );
  const [imageMode, setImageMode] = useState<("url" | "file")[]>([
    "url",
    "url",
    "url",
  ]);

  // Sync images when imageUrls change
  useEffect(() => {
    const validImages = imageUrls.filter((url) => url.trim() !== "");
    setFormData((prev) => ({ ...prev, images: validImages }));
  }, [imageUrls]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const { checked } = e.target as HTMLInputElement;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "number") {
      setFormData((prev) => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUrlChange = (index: number, url: string) => {
    const newImageUrls = [...imageUrls];
    newImageUrls[index] = url;
    setImageUrls(newImageUrls);
  };

  const handleImageFileChange = (index: number, file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        const newImageUrls = [...imageUrls];
        newImageUrls[index] = result;
        setImageUrls(newImageUrls);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleImageMode = (index: number) => {
    const newImageMode = [...imageMode];
    newImageMode[index] = newImageMode[index] === "url" ? "file" : "url";
    setImageMode(newImageMode);

    // Clear the current image when switching modes
    const newImageUrls = [...imageUrls];
    newImageUrls[index] = "";
    setImageUrls(newImageUrls);
  };

  const addImageField = () => {
    if (imageUrls.length < 3) {
      setImageUrls([...imageUrls, ""]);
      setImageMode([...imageMode, "url"]);
    }
  };

  const removeImageField = (index: number) => {
    const newImageUrls = imageUrls.filter((_, i) => i !== index);
    const newImageMode = imageMode.filter((_, i) => i !== index);
    setImageUrls(newImageUrls);
    setImageMode(newImageMode);
  };

  const fillSampleData = (field: keyof typeof sampleData) => {
    setFormData((prev) => ({ ...prev, [field]: sampleData[field] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      alert("Vui lòng nhập tên sản phẩm");
      return;
    }
    if (!formData.typeId) {
      alert("Vui lòng chọn loại sản phẩm");
      return;
    }
    if (!formData.brandId) {
      alert("Vui lòng chọn thương hiệu");
      return;
    }
    if (formData.actualPrice <= 0) {
      alert("Vui lòng nhập giá thực tế hợp lệ");
      return;
    }
    if (formData.singleDayPrice <= 0) {
      alert("Vui lòng nhập giá thuê/ngày hợp lệ");
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Thông tin cơ bản
          </h3>

          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên sản phẩm *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ví dụ: Canon EOS C200"
            />
          </div>

          {/* Product Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loại sản phẩm *
            </label>
            <select
              name="typeId"
              value={formData.typeId}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Chọn loại sản phẩm</option>
              {productTypes.map((type) => (
                <option key={type._id} value={type.productTypeId}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          {/* Brand */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thương hiệu *
            </label>
            <select
              name="brandId"
              value={formData.brandId}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Chọn thương hiệu</option>
              {brands.map((brand) => (
                <option key={brand._id} value={brand.brandId}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>

          {/* Prices */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giá thực tế (VNĐ) *
              </label>
              <input
                type="number"
                name="actualPrice"
                value={formData.actualPrice}
                onChange={handleInputChange}
                required
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="50000000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giá thuê/ngày (VNĐ) *
              </label>
              <input
                type="number"
                name="singleDayPrice"
                value={formData.singleDayPrice}
                onChange={handleInputChange}
                required
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="500000"
              />
            </div>
          </div>

          {/* Status */}
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isAvailable"
                checked={formData.isAvailable}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-700">
                Sản phẩm có sẵn
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isVerified"
                checked={formData.isVerified}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-700">Đã xác minh</label>
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Hình ảnh (tối đa 3)
          </h3>

          {imageUrls.map((url, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => toggleImageMode(index)}
                  className="flex items-center space-x-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  {imageMode[index] === "url" ? (
                    <>
                      <Link size={16} />
                      <span>URL</span>
                    </>
                  ) : (
                    <>
                      <Upload size={16} />
                      <span>File</span>
                    </>
                  )}
                </button>

                {imageMode[index] === "url" ? (
                  <input
                    type="url"
                    value={url}
                    onChange={(e) =>
                      handleImageUrlChange(index, e.target.value)
                    }
                    placeholder={`URL hình ảnh ${index + 1}`}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleImageFileChange(index, e.target.files?.[0] || null)
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                )}

                {imageUrls.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeImageField(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Image Preview */}
              {url && (
                <div className="mt-2">
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>
          ))}

          {imageUrls.length < 3 && (
            <button
              type="button"
              onClick={addImageField}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
            >
              <Plus size={16} />
              <span>Thêm hình ảnh</span>
            </button>
          )}

          {/* Alt Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mô tả hình ảnh (Alt Text)
            </label>
            <input
              type="text"
              name="altText"
              value={formData.altText}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Mô tả ngắn gọn về hình ảnh"
            />
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Mô tả ngắn
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Mô tả ngắn gọn về sản phẩm..."
        />
      </div>

      {/* HTML Fields with Sample Data */}
      {[
        { name: "detailDescription", label: "Mô tả chi tiết" },
        { name: "techSpec", label: "Thông số kỹ thuật" },
        { name: "features", label: "Tính năng" },
        { name: "includes", label: "Bao gồm" },
        { name: "highlights", label: "Điểm nổi bật" },
      ].map((field) => (
        <div key={field.name}>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
            </label>
            <button
              type="button"
              onClick={() =>
                fillSampleData(field.name as keyof typeof sampleData)
              }
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              Điền dữ liệu mẫu
            </button>
          </div>
          <textarea
            name={field.name}
            value={formData[field.name as keyof CreateProductData] as string}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
            placeholder={`Nhập ${field.label.toLowerCase()} (HTML format với <ul><li>)`}
          />
        </div>
      ))}

      {/* Submit Buttons */}
      <div className="flex justify-end space-x-4 pt-6 border-t">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
        >
          Hủy
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
        >
          {isLoading && (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          )}
          <span>{submitButtonText}</span>
        </button>
      </div>
    </form>
  );
}
