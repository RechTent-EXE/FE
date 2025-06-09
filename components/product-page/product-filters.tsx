"use client";

import { useState } from "react";
import { Filter, X, ChevronDown } from "lucide-react";

interface ProductFiltersProps {
  category: string;
}

export default function ProductFilters({ category }: ProductFiltersProps) {
  const [priceRange, setPriceRange] = useState([0, 2000000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    brands: true,
    features: true,
  });

  const getBrands = (category: string) => {
    switch (category) {
      case "camera":
        return ["Canon", "Nikon", "Sony", "Fujifilm", "Panasonic", "Olympus"];
      case "laptop":
        return ["Apple", "Dell", "HP", "Lenovo", "ASUS", "MSI", "Acer"];
      case "dashcam":
        return ["Xiaomi", "Viofo", "Garmin", "BlackVue", "Thinkware", "70mai"];
      case "flycam":
        return ["DJI", "Autel", "Parrot", "Skydio", "Holy Stone", "Hubsan"];
      default:
        return [];
    }
  };

  const getFeatures = (category: string) => {
    switch (category) {
      case "camera":
        return [
          "4K Video",
          "WiFi",
          "Touchscreen",
          "Weather Sealed",
          "Full Frame",
          "Image Stabilization",
        ];
      case "laptop":
        return [
          "Gaming",
          "Ultrabook",
          "Touchscreen",
          "SSD",
          "Dedicated GPU",
          "Backlit Keyboard",
        ];
      case "dashcam":
        return [
          "4K Recording",
          "Night Vision",
          "GPS",
          "WiFi",
          "Parking Mode",
          "G-Sensor",
        ];
      case "flycam":
        return [
          "4K Camera",
          "Gimbal",
          "GPS",
          "Follow Me",
          "Obstacle Avoidance",
          "Return to Home",
        ];
      default:
        return [];
    }
  };

  const brands = getBrands(category);
  const features = getFeatures(category);

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const toggleFeature = (feature: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(feature)
        ? prev.filter((f) => f !== feature)
        : [...prev, feature]
    );
  };

  const clearFilters = () => {
    setPriceRange([0, 2000000]);
    setSelectedBrands([]);
    setSelectedFeatures([]);
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Price Range */}
      <div>
        <button
          onClick={() => toggleSection("price")}
          className="flex items-center justify-between w-full font-semibold text-gray-900 mb-4"
        >
          Khoảng giá (VNĐ/ngày)
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              expandedSections.price ? "rotate-180" : ""
            }`}
          />
        </button>
        {expandedSections.price && (
          <div className="px-2">
            <input
              type="range"
              min="0"
              max="2000000"
              step="50000"
              value={priceRange[1]}
              onChange={(e) =>
                setPriceRange([0, Number.parseInt(e.target.value)])
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mb-4 slider"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>{priceRange[0].toLocaleString()}đ</span>
              <span>{priceRange[1].toLocaleString()}đ</span>
            </div>
          </div>
        )}
      </div>

      {/* Brands */}
      <div>
        <button
          onClick={() => toggleSection("brands")}
          className="flex items-center justify-between w-full font-semibold text-gray-900 mb-4"
        >
          Thương hiệu
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              expandedSections.brands ? "rotate-180" : ""
            }`}
          />
        </button>
        {expandedSections.brands && (
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {brands.map((brand) => (
              <div key={brand} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={brand}
                  checked={selectedBrands.includes(brand)}
                  onChange={() => toggleBrand(brand)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor={brand}
                  className="text-sm text-gray-700 cursor-pointer"
                >
                  {brand}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Features */}
      <div>
        <button
          onClick={() => toggleSection("features")}
          className="flex items-center justify-between w-full font-semibold text-gray-900 mb-4"
        >
          Tính năng
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              expandedSections.features ? "rotate-180" : ""
            }`}
          />
        </button>
        {expandedSections.features && (
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {features.map((feature) => (
              <div key={feature} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={feature}
                  checked={selectedFeatures.includes(feature)}
                  onChange={() => toggleFeature(feature)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor={feature}
                  className="text-sm text-gray-700 cursor-pointer"
                >
                  {feature}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Clear Filters */}
      <button
        onClick={clearFilters}
        className="w-full border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        <X className="w-4 h-4" />
        Xóa bộ lọc
      </button>
    </div>
  );

  return (
    <>
      {/* Desktop Filters */}
      <div className="hidden lg:block bg-white rounded-lg shadow-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="flex items-center gap-2 font-semibold text-lg">
            <Filter className="w-5 h-5" />
            Bộ lọc
          </h3>
        </div>
        <div className="p-4">
          <FilterContent />
        </div>
      </div>

      {/* Mobile Filters */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="w-full border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Filter className="w-4 h-4" />
          Bộ lọc
          {(selectedBrands.length > 0 || selectedFeatures.length > 0) && (
            <span className="ml-2 bg-blue-500 text-white px-2 py-1 rounded text-xs">
              {selectedBrands.length + selectedFeatures.length}
            </span>
          )}
        </button>

        {isFilterOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
            <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-xl">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="font-semibold text-lg">Bộ lọc sản phẩm</h3>
                <button onClick={() => setIsFilterOpen(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-4 overflow-y-auto h-full pb-20">
                <FilterContent />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Active Filters */}
      {(selectedBrands.length > 0 || selectedFeatures.length > 0) && (
        <div className="flex flex-wrap gap-2 mt-4">
          {selectedBrands.map((brand) => (
            <span
              key={brand}
              className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm flex items-center gap-1"
            >
              {brand}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => toggleBrand(brand)}
              />
            </span>
          ))}
          {selectedFeatures.map((feature) => (
            <span
              key={feature}
              className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm flex items-center gap-1"
            >
              {feature}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => toggleFeature(feature)}
              />
            </span>
          ))}
        </div>
      )}
    </>
  );
}
