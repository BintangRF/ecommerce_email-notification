"use client";

import { usePayment } from "@/hooks/usePayment";
import React from "react";
import { FormWrapper } from "../FormComponents/FormWrapper";
import { FormInputs } from "../FormComponents/FormInputs";

type Props = {
  total: number;
};

export const CartSummary = ({ total }: Props) => {
  const { handleCheckout, isPending } = usePayment();

  const onSubmit = (data: any) => {
    // Kirim data username, email, dan total ke handleCheckout
    handleCheckout({
      ...data,
    });
  };

  return (
    <FormWrapper onSubmit={onSubmit} className="space-y-4 w-full">
      {/* Username */}
      <FormInputs
        name="username"
        label="Username"
        rules={{ required: "Username is required" }}
        placeholder="Enter your username"
      />

      {/* Email */}
      <FormInputs
        name="email"
        type="email"
        label="Email"
        rules={{
          required: "Email is required",
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Invalid email format",
          },
        }}
        placeholder="Enter your email"
      />

      {/* Total */}
      <div className="flex items-center justify-between border-t border-white/10 pt-4">
        <span className="text-lg">Total</span>
        <span className="text-xl font-semibold">Rp. {total.toFixed(2)}</span>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className={`w-full md:w-auto px-5 py-2 rounded-xl text-white ${
          isPending
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-emerald-600 hover:bg-emerald-500"
        }`}
      >
        {isPending ? "Processing..." : "Checkout with Midtrans"}
      </button>
    </FormWrapper>
  );
};
