"use client";

import { useState } from "react";
import { Sparkles, Send, Loader2 } from "lucide-react";
import api from "@/lib/api";

export default function AIFinderPage() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    setSuggestions([]);

    try {
      const res = await api.post("/ai/recommend", { query });

      const products = res.data;
      setSuggestions(products);
    } catch (err) {
      console.error("Recommendation failed:", err);
      alert("Đã xảy ra lỗi khi tìm kiếm. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const quickSuggestions = [
    "Tôi cần camera chụp ảnh du lịch",
    "Laptop cho sinh viên IT",
    "Flycam quay video YouTube",
    "Dashcam cho xe hơi",
  ];

  return (
    <div className="bg-white pt-20">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              AI Tìm Sản Phẩm Phù Hợp
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Mô tả nhu cầu của bạn, AI sẽ gợi ý những sản phẩm công nghệ phù
              hợp nhất từ kho hàng của chúng tôi
            </p>
          </div>

          {/* Search Input */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 mb-8">
            <div className="p-6">
              <div className="flex gap-4">
                <input
                  placeholder="Ví dụ: Tôi cần một chiếc camera để chụp ảnh du lịch, ngân sách khoảng 300k/ngày..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 text-lg py-6 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                />
                <button
                  onClick={handleSearch}
                  disabled={isLoading || !query.trim()}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-6 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Tìm kiếm
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Quick Suggestions */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Gợi ý nhanh:
            </h3>
            <div className="flex flex-wrap gap-3">
              {quickSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setQuery(suggestion)}
                  className="border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* AI Suggestions */}
          {suggestions.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Gợi ý từ AI ({suggestions.length} sản phẩm)
              </h2>

              {suggestions.map((product) => (
                <div
                  key={product.productId}
                  className="border-2 border-blue-100 hover:border-blue-200 transition-colors bg-white rounded-lg shadow-lg"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {product.name}
                          </h3>
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-medium">
                            {product.match}% phù hợp
                          </span>
                          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                            {product.category}
                          </span>
                        </div>

                        <p className="text-gray-600 mb-3">
                          {product.description}
                        </p>

                        <div className="bg-blue-50 rounded-lg p-4 mb-4">
                          <p className="text-sm text-blue-800">
                            <strong>Tại sao phù hợp:</strong> {product.reason}
                          </p>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-2xl font-bold text-blue-600">
                              {product.singleDayPrice}đ
                            </span>
                            <span className="text-gray-500 ml-1">/ ngày</span>
                          </div>
                          <div className="flex gap-3">
                            <button className="border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors">
                              Xem chi tiết
                            </button>
                            <button
                              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                              disabled={!product.isAvailable}
                            >
                              Thuê ngay
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* How AI Works */}
          <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-0">
            <div className="p-6">
              <h3 className="text-center text-2xl font-bold mb-6">
                AI hoạt động như thế nào?
              </h3>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <h4 className="font-semibold mb-2">Phân tích nhu cầu</h4>
                  <p className="text-sm text-gray-600">
                    AI phân tích mô tả của bạn để hiểu nhu cầu cụ thể
                  </p>
                </div>
                <div>
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <h4 className="font-semibold mb-2">So sánh sản phẩm</h4>
                  <p className="text-sm text-gray-600">
                    Đối chiếu với cơ sở dữ liệu sản phẩm của chúng tôi
                  </p>
                </div>
                <div>
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <h4 className="font-semibold mb-2">Gợi ý tối ưu</h4>
                  <p className="text-sm text-gray-600">
                    Đưa ra gợi ý phù hợp nhất với ngân sách và nhu cầu
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
