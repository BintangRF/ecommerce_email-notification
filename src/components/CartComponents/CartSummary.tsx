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
    handleCheckout({ ...data });
  };

  return (
    <FormWrapper
      onSubmit={onSubmit}
      className="
        space-y-6 w-full
      "
    >
      {/* Username */}
      <FormInputs
        name="username"
        label="Username"
        rules={{ required: "Username is required" }}
        placeholder="Enter your username"
        className="bg-custom-gray-lightest border border-custom-gray-light rounded-lg px-4 py-2 focus:ring-2 focus:ring-custom-accent-cool transition-all"
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
        className="bg-custom-gray-lightest border border-custom-gray-light rounded-lg px-4 py-2 focus:ring-2 focus:ring-custom-accent-cool transition-all"
      />

      {/* Total */}
      <div className="flex items-center justify-between border-t border-custom-gray-light pt-4">
        <span className="text-lg text-custom-gray-darkest font-medium">
          Total
        </span>
        <span className="text-xl font-semibold text-custom-gray-darkest">
          Rp {total.toLocaleString()}
        </span>
      </div>

      {/* Checkout Button */}
      <button
        type="submit"
        disabled={isPending}
        className={`
          w-full md:w-auto px-6 py-3 rounded-xl font-semibold text-custom-gray-lightest
          transition-colors duration-300
          ${
            isPending
              ? "bg-custom-gray-medium cursor-not-allowed"
              : "bg-custom-accent-dark hover:bg-custom-accent-medium"
          }
        `}
      >
        {isPending ? "Processing..." : "Checkout with Midtrans"}
      </button>
    </FormWrapper>
  );
};
