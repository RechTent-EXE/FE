"use client";

import { useState, useEffect } from "react";
import { format, isBefore, isAfter, isSameDay } from "date-fns";
import { vi } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

interface RentalDatePickerProps {
  onDateChange: (startDate: Date | null, endDate: Date | null) => void;
}

export default function RentalDatePicker({
  onDateChange,
}: RentalDatePickerProps) {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  useEffect(() => {
    onDateChange(startDate, endDate);
  }, [startDate, endDate, onDateChange]);

  const handleDateClick = (date: Date) => {
    if (!startDate || (startDate && endDate)) {
      // Start new selection
      setStartDate(date);
      setEndDate(null);
    } else {
      // Complete selection
      if (isBefore(date, startDate)) {
        setEndDate(startDate);
        setStartDate(date);
      } else {
        setEndDate(date);
      }
    }
  };

  const handleMouseEnter = (date: Date) => {
    if (startDate && !endDate) {
      setHoverDate(date);
    }
  };

  const handleMouseLeave = () => {
    setHoverDate(null);
  };

  const isDateInRange = (date: Date) => {
    if (startDate && endDate) {
      return (
        (isAfter(date, startDate) && isBefore(date, endDate)) ||
        isSameDay(date, startDate) ||
        isSameDay(date, endDate)
      );
    }
    if (startDate && hoverDate) {
      if (isBefore(hoverDate, startDate)) {
        return (
          (isAfter(date, hoverDate) && isBefore(date, startDate)) ||
          isSameDay(date, startDate) ||
          isSameDay(date, hoverDate)
        );
      } else {
        return (
          (isAfter(date, startDate) && isBefore(date, hoverDate)) ||
          isSameDay(date, startDate) ||
          isSameDay(date, hoverDate)
        );
      }
    }
    return false;
  };

  const isStartDate = (date: Date) => startDate && isSameDay(date, startDate);
  const isEndDate = (date: Date) => endDate && isSameDay(date, endDate);

  const renderCalendar = () => {
    const today = new Date();
    const firstDayOfMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1
    );
    const lastDayOfMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      0
    );

    // Get day of week of first day (0 = Sunday, 1 = Monday, etc.)
    let firstDayOfWeek = firstDayOfMonth.getDay();
    // Adjust for Monday as first day of week
    firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

    const daysInMonth = lastDayOfMonth.getDate();
    const weeks = [];

    let days = [];

    // Add empty cells for days before first day of month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 w-10"></div>);
    }

    // Add days of month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        day
      );
      const isToday = isSameDay(date, today);
      const isSelected = isDateInRange(date);
      const isStart = isStartDate(date);
      const isEnd = isEndDate(date);
      const isPast = isBefore(date, today) && !isSameDay(date, today);

      days.push(
        <button
          key={day}
          onClick={() => !isPast && handleDateClick(date)}
          onMouseEnter={() => handleMouseEnter(date)}
          onMouseLeave={handleMouseLeave}
          disabled={isPast}
          className={`h-10 w-10 rounded-full flex items-center justify-center text-sm relative ${
            isPast
              ? "text-gray-300 cursor-not-allowed"
              : isSelected
              ? "bg-blue-100"
              : "hover:bg-gray-100"
          } ${isToday ? "font-bold" : ""} ${
            isStart
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : isEnd
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : ""
          }`}
        >
          {day}
        </button>
      );

      // Start new row every 7 days
      if ((firstDayOfWeek + day) % 7 === 0 || day === daysInMonth) {
        weeks.push(
          <div key={`week-${weeks.length}`} className="grid grid-cols-7 gap-1">
            {days}
          </div>
        );
        days = [];
      }
    }

    return weeks;
  };

  const prevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  return (
    <div className="relative">
      <div
        className="border border-gray-300 rounded-lg p-3 flex items-center justify-between cursor-pointer hover:border-gray-400"
        onClick={() => setIsCalendarOpen(!isCalendarOpen)}
      >
        <div>
          {startDate && endDate ? (
            <div className="text-gray-900">
              {format(startDate, "dd/MM/yyyy")} -{" "}
              {format(endDate, "dd/MM/yyyy")}
              <div className="text-xs text-gray-500">
                {Math.ceil(
                  (endDate.getTime() - startDate.getTime()) /
                    (1000 * 60 * 60 * 24)
                ) + 1}{" "}
                ngày
              </div>
            </div>
          ) : (
            <span className="text-gray-500">Chọn ngày thuê</span>
          )}
        </div>
        <CalendarIcon size={20} className="text-gray-500" />
      </div>

      {isCalendarOpen && (
        <div className="absolute z-10 mt-2 p-4 bg-white rounded-lg shadow-lg border border-gray-200 w-[340px]">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={prevMonth}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronLeftIcon />
            </button>
            <h3 className="font-medium">
              {format(currentMonth, "MMMM yyyy", { locale: vi })}
            </h3>
            <button
              onClick={nextMonth}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronRightIcon />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((day) => (
              <div
                key={day}
                className="h-8 flex items-center justify-center text-xs font-medium text-gray-500"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="space-y-1">{renderCalendar()}</div>

          <div className="mt-4 flex justify-between">
            <button
              onClick={() => {
                setStartDate(null);
                setEndDate(null);
              }}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Xóa
            </button>
            <button
              onClick={() => setIsCalendarOpen(false)}
              className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
            >
              Áp dụng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ChevronLeftIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
