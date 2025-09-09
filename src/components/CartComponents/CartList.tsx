"use client";

import React from "react";
import { useStore } from "@/store/useStore";
import { CartItem } from "./CartItem";

export const CartList = () => {
  const { cart } = useStore();

  if (!cart.length) {
    return <p>Your cart is empty. Add products from the landing page.</p>;
  }

  return (
    <ul className="space-y-3">
      {cart.map((i) => (
        <CartItem key={i.id} {...i} />
      ))}
    </ul>
  );
};
