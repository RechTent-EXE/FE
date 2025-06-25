"use client";

import Image from "next/image";
import { useState } from "react";
import { Trash2, Plus, Minus, Star } from "lucide-react";
import { CartItem as CartItemType } from "@/hooks/useCart";
import RentalDatePicker from "./RentalDatePicker";

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (itemId: string, newQuantity: number) => void;
  onUpdateDates: (itemId: string, startDate: string, endDate: string) => void;
  onRemoveItem: (itemId: string) => void;
  getBrandName: (brandId: string) => string;
  calculateItemTotal: (item: CartItemType) => number;
  calculateRentalDays: (startDate: string, endDate: string) => number;
}

export default function CartItem({
  item,
  onUpdateQuantity,
  onUpdateDates,
  onRemoveItem,
  getBrandName,
  calculateItemTotal,
  calculateRentalDays,
}: CartItemProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUpdatingDates, setIsUpdatingDates] = useState(false);

  const handleUpdateQuantity = async (newQuantity: number) => {
    if (newQuantity < 1 || isUpdating) return;

    try {
      setIsUpdating(true);
      await onUpdateQuantity(item.id, newQuantity);
    } catch (error) {
      console.error("Error updating quantity:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    try {
      await onRemoveItem(item.id);
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const handleDateChange = async (startDate: string, endDate: string) => {
    try {
      setIsUpdatingDates(true);
      await onUpdateDates(item.id, startDate, endDate);
    } catch (error) {
      console.error("Error updating dates:", error);
    } finally {
      setIsUpdatingDates(false);
    }
  };

  const rentalDays = calculateRentalDays(item.startDate, item.endDate);

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6 transition-all hover:shadow-xl">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Product Image */}
        <div className="relative w-full lg:w-48 h-48 lg:h-32 flex-shrink-0">
          <Image
            src={item.images?.[0]?.imageUrl || "/placeholder.svg"}
            alt={item.name || "Product"}
            fill
            className="object-cover rounded-xl"
          />
          {!item.isAvailable && (
            <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
              <span className="text-white font-semibold bg-red-600 px-3 py-1 rounded-lg">
                Hết hàng
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1 space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                {getBrandName(item.brandId || "")}
              </span>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm text-gray-600">
                  {item.rating || 0}
                </span>
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {item.name || "Sản phẩm"}
            </h3>
            <p className="text-gray-600 text-sm">
              {item.description || "Không có mô tả"}
            </p>
          </div>

          {/* Rental Details */}
          <RentalDatePicker
            startDate={item.startDate}
            endDate={item.endDate}
            onDateChange={handleDateChange}
            isCollapsed={true}
          />

          {/* Price and Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {calculateItemTotal(item).toLocaleString()}đ
              </div>
              <div className="text-sm text-gray-500">
                {(item.singleDayPrice || 0).toLocaleString()}đ/ngày ×{" "}
                {rentalDays} ngày × {item.quantity}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Quantity Controls */}
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => handleUpdateQuantity(item.quantity - 1)}
                  className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50"
                  disabled={item.quantity <= 1 || isUpdating || isUpdatingDates}
                >
                  <Minus size={16} />
                </button>
                <span className="px-4 py-2 font-medium">{item.quantity}</span>
                <button
                  onClick={() => handleUpdateQuantity(item.quantity + 1)}
                  className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50"
                  disabled={item.quantity >= 5 || isUpdating || isUpdatingDates}
                >
                  <Plus size={16} />
                </button>
              </div>

              {/* Action Buttons */}
              <button
                onClick={handleRemove}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Xóa khỏi giỏ hàng"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
