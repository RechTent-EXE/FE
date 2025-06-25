"use client";

import { useState } from "react";
import { Gift, CheckCircle } from "lucide-react";

interface PromoCodeSectionProps {
  onApplyPromo: (code: string) => Promise<void>;
  promoDiscount: number;
}

export default function PromoCodeSection({
  onApplyPromo,
  promoDiscount,
}: PromoCodeSectionProps) {
  const [promoCode, setPromoCode] = useState("");
  const [isApplying, setIsApplying] = useState(false);

  const handleApplyPromo = async () => {
    if (!promoCode || isApplying) return;

    try {
      setIsApplying(true);
      await onApplyPromo(promoCode);
    } catch (error) {
      console.error("Error applying promo code:", error);
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Gift size={20} className="text-purple-600" />
        Mã giảm giá
      </h3>
      <div className="space-y-3">
        <input
          type="text"
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value)}
          placeholder="Nhập mã giảm giá"
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          onClick={handleApplyPromo}
          disabled={!promoCode || isApplying}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white py-3 rounded-xl font-medium transition-colors"
        >
          {isApplying ? "Đang áp dụng..." : "Áp dụng"}
        </button>
      </div>
      {promoDiscount > 0 && (
        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 text-green-700">
            <CheckCircle size={16} />
            <span className="text-sm font-medium">
              Giảm {promoDiscount}% đã được áp dụng
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
