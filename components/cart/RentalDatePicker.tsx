"use client";

import { useState } from "react";
import { Calendar, Clock, ChevronDown, ChevronUp } from "lucide-react";

interface RentalDatePickerProps {
  startDate: string;
  endDate: string;
  onDateChange: (startDate: string, endDate: string) => void;
  isCollapsed?: boolean;
}

export default function RentalDatePicker({
  startDate,
  endDate,
  onDateChange,
  isCollapsed = true,
}: RentalDatePickerProps) {
  const [isExpanded, setIsExpanded] = useState(!isCollapsed);
  const [tempStartDate, setTempStartDate] = useState(startDate);
  const [tempEndDate, setTempEndDate] = useState(endDate);

  const handleApplyDates = () => {
    if (tempStartDate && tempEndDate && tempStartDate <= tempEndDate) {
      onDateChange(tempStartDate, tempEndDate);
      setIsExpanded(false);
    } else {
      alert("Ngày bắt đầu phải trước ngày kết thúc");
    }
  };

  const handleCancel = () => {
    setTempStartDate(startDate);
    setTempEndDate(endDate);
    setIsExpanded(false);
  };

  const calculateRentalDays = () => {
    const start = new Date(tempStartDate);
    const end = new Date(tempEndDate);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  // Get tomorrow as minimum date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  return (
    <div className="bg-blue-50 rounded-xl p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-blue-600" />
          <span className="font-medium text-gray-900">Thời gian thuê</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-600">
            {calculateRentalDays()} ngày
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-blue-100 rounded transition-colors"
          >
            {isExpanded ? (
              <ChevronUp size={16} className="text-blue-600" />
            ) : (
              <ChevronDown size={16} className="text-blue-600" />
            )}
          </button>
        </div>
      </div>

      {!isExpanded && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mt-2">
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-blue-600" />
            <div>
              <div className="font-medium text-gray-900">Từ ngày</div>
              <div className="text-gray-600">{formatDate(startDate)}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-blue-600" />
            <div>
              <div className="font-medium text-gray-900">Đến ngày</div>
              <div className="text-gray-600">{formatDate(endDate)}</div>
            </div>
          </div>
        </div>
      )}

      {isExpanded && (
        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngày bắt đầu
              </label>
              <input
                type="date"
                value={tempStartDate}
                onChange={(e) => setTempStartDate(e.target.value)}
                min={minDate}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngày kết thúc
              </label>
              <input
                type="date"
                value={tempEndDate}
                onChange={(e) => setTempEndDate(e.target.value)}
                min={tempStartDate || minDate}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="bg-blue-100 rounded-lg p-3">
            <div className="text-sm text-blue-800">
              <div className="font-medium">Tóm tắt:</div>
              <div>
                Từ {formatDate(tempStartDate)} đến {formatDate(tempEndDate)} (
                {calculateRentalDays()} ngày)
              </div>
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleApplyDates}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Áp dụng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
