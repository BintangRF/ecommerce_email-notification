"use client";

import React from "react";
import { useStore } from "@/store/useStore";

type Props = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

export const CartItem = ({ id, name, price, quantity }: Props) => {
  const { removeFromCart, updateQty } = useStore();

  const minQty = () => {
    if (quantity === 1) {
      removeFromCart(id);
      return;
    }
    updateQty(id, Math.max(1, quantity - 1));
  };

  const plusQty = () => {
    updateQty(id, quantity + 1);
  };

  return (
    <li
      className="
        flex items-center justify-between gap-3
        p-4 rounded-xl border border-custom-gray-light
        hover:shadow-lg transition-shadow duration-300
      "
    >
      {/* Info Produk */}
      <div className="flex-1">
        <p className="text-custom-gray-darkest font-medium line-clamp-1">
          {name}
        </p>
        <p className="text-custom-gray-medium text-sm">
          Rp {price.toLocaleString()}
        </p>
      </div>

      {/* Quantity Control */}
      <div className="flex items-center gap-2">
        <button
          onClick={minQty}
          className="px-3 py-1 bg-custom-accent-light rounded-md hover:bg-custom-accent-medium transition-colors duration-200"
        >
          -
        </button>
        <span className="w-6 text-center font-medium">{quantity}</span>
        <button
          onClick={plusQty}
          className="px-3 py-1 bg-custom-accent-light rounded-md hover:bg-custom-accent-medium transition-colors duration-200"
        >
          +
        </button>
      </div>

      {/* Remove Button */}
      <button
        onClick={() => removeFromCart(id)}
        className="px-3 py-1 bg-rose-600 rounded-xl text-custom-gray-lightest hover:bg-rose-500 transition-colors duration-200"
      >
        Remove
      </button>
    </li>
  );
};
