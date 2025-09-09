"use client";

import React from "react";
import { useStore } from "@/store/useStore";

type ProductCardProps = {
  id: number;
  name: string;
  price: number;
};

export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
}) => {
  const addCart = useStore((s) => s.addToCart);

  return (
    <div
      onClick={() => addCart({ id, name, price, quantity: 1 })}
      className="
        border border-custom-gray-light rounded-xl
        shadow-lg hover:shadow-xl
        w-60 p-5
        bg-custom-light
        cursor-pointer
        transition-shadow duration-300
        flex flex-col justify-between mx-auto
      "
    >
      <div className="mb-4">
        <h2 className="text-lg font-bold text-custom-gray-darkest mb-2">
          {name}
        </h2>
        <p className="text--custom-gray-medium text-sm">
          Rp {price.toLocaleString()}
        </p>
      </div>
    </div>
  );
};
