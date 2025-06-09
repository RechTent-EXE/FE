"use client";

import { useState, useEffect } from "react";

interface RentalDurationSelectorProps {
  singleDayPrice: number;
  onPriceChange: (price: number, duration: string) => void;
}

// Duration interface matching the API response structure
interface Duration {
  id: string;
  jd: string;
  length: string;
  discount: number;
  __v: number;
}

export default function RentalDurationSelector({
  singleDayPrice,
  onPriceChange,
}: RentalDurationSelectorProps) {
  const [selectedDuration, setSelectedDuration] = useState(
    "683f9b4b1cf36ace6311c5be"
  );
  const [durations, setDurations] = useState<Duration[]>([]);

  // Mock API response matching the structure from image 2
  useEffect(() => {
    // Simulate API fetch for durations
    const mockDurations: Duration[] = [
      {
        id: "683f9b4b1cf36ace6311c5be",
        jd: "432e0188-441e-4ead-b117-7c2bba3cbe28",
        length: "1 day",
        discount: 0,
        __v: 0,
      },
      {
        id: "683f9b541cf36ace6311c5c0",
        jd: "edc72edf-ce7d-4a40-9f50-f00c0dedb551",
        length: "7 days",
        discount: 15,
        __v: 0,
      },
      {
        id: "683f9b671cf36ace6311c5c2",
        jd: "ab211d47-1ea5-4b61-afd8-a859dbc7b00c",
        length: "15 days",
        discount: 25,
        __v: 0,
      },
      {
        id: "683f9b751cf36ace6311c5c4",
        jd: "324fd55f-f7bd-41be-96e0-8bef758833da",
        length: "30 days",
        discount: 35,
        __v: 0,
      },
    ];

    setDurations(mockDurations);
  }, []);

  const calculatePrice = (duration: Duration) => {
    const days = Number.parseInt(duration.length.split(" ")[0]);
    const totalPrice = singleDayPrice * days;
    const discountedPrice = totalPrice * (1 - duration.discount / 100);
    return Math.round(discountedPrice);
  };

  const handleDurationChange = (duration: Duration) => {
    setSelectedDuration(duration.id);
    const finalPrice = calculatePrice(duration);
    onPriceChange(finalPrice, duration.length);
  };

  if (durations.length === 0) {
    return <div>Loading durations...</div>;
  }

  return (
    <div className="space-y-3">
      <h4 className="font-medium text-gray-900">Thời gian thuê:</h4>
      <div className="grid grid-cols-2 gap-2">
        {durations.map((duration) => {
          const finalPrice = calculatePrice(duration);
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
              <span className="font-medium">{duration.length}</span>
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
