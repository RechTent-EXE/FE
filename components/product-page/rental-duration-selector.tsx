"use client";

import { useState, useEffect } from "react";

interface Duration {
  duration: string;
  price: number;
  discount: number;
}

interface RentalDurationSelectorProps {
  singleDayPrice: number;
  durations?: Duration[];
  onPriceChange: (price: number, duration: string) => void;
}

export default function RentalDurationSelector({
  singleDayPrice,
  durations = [],
  onPriceChange,
}: RentalDurationSelectorProps) {
  const [selectedDuration, setSelectedDuration] = useState("");

  // Default durations if none provided
  const defaultDurations: Duration[] = [
    { duration: "1 day", price: singleDayPrice, discount: 0 },
    { duration: "7 days", price: singleDayPrice * 7 * 0.85, discount: 15 },
    { duration: "15 days", price: singleDayPrice * 15 * 0.75, discount: 25 },
    { duration: "30 days", price: singleDayPrice * 30 * 0.65, discount: 35 },
  ];

  const activeDurations = durations.length > 0 ? durations : defaultDurations;

  // Set initial selection
  useEffect(() => {
    if (activeDurations.length > 0 && !selectedDuration) {
      const firstDuration = activeDurations[0];
      setSelectedDuration(firstDuration.duration);
      onPriceChange(firstDuration.price, firstDuration.duration);
    }
  }, [activeDurations, selectedDuration, onPriceChange]);

  const handleDurationChange = (duration: Duration) => {
    setSelectedDuration(duration.duration);
    onPriceChange(duration.price, duration.duration);
  };

  return (
    <div className="space-y-3">
      <h4 className="font-medium text-gray-900">Thời gian thuê:</h4>
      <div className="grid grid-cols-2 gap-2">
        {activeDurations.map((duration) => {
          const isSelected = selectedDuration === duration.duration;

          return (
            <button
              key={duration.duration}
              className={`p-3 h-auto flex flex-col items-center transition-all duration-200 rounded-lg border ${
                isSelected
                  ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                  : "hover:bg-gray-50 border-gray-300 text-gray-700"
              }`}
              onClick={() => handleDurationChange(duration)}
            >
              <span className="font-medium">{duration.duration}</span>
              <span
                className={`text-sm ${
                  isSelected ? "text-blue-100" : "text-gray-600"
                }`}
              >
                {Math.round(duration.price).toLocaleString()}đ
              </span>
              {duration.discount > 0 && (
                <span
                  className={`text-xs ${
                    isSelected ? "text-blue-200" : "text-green-600"
                  }`}
                >
                  Tiết kiệm {duration.discount}%
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
