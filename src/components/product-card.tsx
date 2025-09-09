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
      onClick={() => addCart({ id: id, name: name, price: price, quantity: 1 })}
      className="border p-4 rounded-md shadow-md w-60 bg-custom-light"
    >
      <h2 className="text-lg font-semibold">{name}</h2>
      <p className="text-gray-600">Rp {price.toLocaleString()}</p>
    </div>
  );
};
