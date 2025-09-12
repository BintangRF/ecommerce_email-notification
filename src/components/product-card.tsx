"use client";

import React from "react";
import { useStore } from "@/store/useStore";

type ProductCardProps = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  quantity,
}) => {
  const addCart = useStore((s) => s.addToCart);

  const handleClick = () => {
    if (quantity > 0) {
      addCart({ id, name, price, quantity: 1 });
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`
        border border-custom-gray-light rounded-xl
        shadow-lg hover:shadow-xl
        w-60 p-5
        bg-custom-light
        transition-shadow duration-300
        flex flex-col justify-between mx-auto
        ${quantity === 0 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      `}
    >
      <div className="mb-4">
        <h2 className="text-lg font-bold text-custom-gray-darkest mb-2">
          {name}
        </h2>
        <p className="text-custom-gray-medium text-sm mb-2">
          Rp {price.toLocaleString()}
        </p>
        {quantity > 0 ? (
          <p className="text-custom-gray-lightest text-sm">Stok: {quantity}</p>
        ) : (
          <p className="text-custom-gray-lightest text-sm font-semibold">
            Stok habis
          </p>
        )}
      </div>
    </div>
  );
};
