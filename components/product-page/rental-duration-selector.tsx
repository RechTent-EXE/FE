"use client";

import { useState } from "react";

interface RentalDurationSelectorProps {
  basePrice: number;
  onPriceChange: (price: number, duration: string) => void;
}

export default function RentalDurationSelector({
  basePrice,
  onPriceChange,
}: RentalDurationSelectorProps) {
  const [selectedDuration, setSelectedDuration] = useState("1-day");

  const durations = [
    { id: "1-day", label: "1 ngày", multiplier: 1, discount: 0 },
    { id: "7-days", label: "7 ngày", multiplier: 7, discount: 0.15 },
    { id: "15-days", label: "15 ngày", multiplier: 15, discount: 0.25 },
    { id: "30-days", label: "30 ngày", multiplier: 30, discount: 0.35 },
  ];

  const calculatePrice = (multiplier: number, discount: number) => {
    const totalPrice = basePrice * multiplier;
    const discountedPrice = totalPrice * (1 - discount);
    return Math.round(discountedPrice);
  };

  const handleDurationChange = (duration: (typeof durations)[0]) => {
    setSelectedDuration(duration.id);
    const finalPrice = calculatePrice(duration.multiplier, duration.discount);
    onPriceChange(finalPrice, duration.label);
  };

  return (
    <div className="space-y-3">
      <h4 className="font-medium text-gray-900">Thời gian thuê:</h4>
      <div className="grid grid-cols-2 gap-2">
        {durations.map((duration) => {
          const finalPrice = calculatePrice(
            duration.multiplier,
            duration.discount
          );
          const isSelected = selectedDuration === duration.id;

          return (
            <button
              key={duration.id}
              className={`p-3 h-auto flex flex-col items-center transition-all duration-200 rounded-lg border ${
                isSelected
                  ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                  : "hover:bg-gray-50 border-gray-300 text-gray-700"
              }`}
              onClick={() => handleDurationChange(duration)}
            >
              <span className="font-medium">{duration.label}</span>
              <span
                className={`text-sm ${
                  isSelected ? "text-blue-100" : "text-gray-600"
                }`}
              >
                {finalPrice.toLocaleString()}đ
              </span>
              {duration.discount > 0 && (
                <span
                  className={`text-xs ${
                    isSelected ? "text-blue-200" : "text-green-600"
                  }`}
                >
                  Tiết kiệm {Math.round(duration.discount * 100)}%
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
