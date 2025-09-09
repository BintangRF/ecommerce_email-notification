"use client";

import axios from "axios";
import { useMutation } from "@tanstack/react-query";

type ItemProps = {
  id: string | number;
  quantity: number;
};

type CheckoutPayload = {
  items: ItemProps[];
  username: string;
  email: string;
};

type CheckoutResponse = {
  snapToken: string;
  orderId: string;
  total: number;
};

const checkoutRequest = async (
  payload: CheckoutPayload
): Promise<CheckoutResponse> => {
  const { data } = await axios.post("/api/checkout", payload);
  return data;
};

export function useCheckout() {
  return useMutation<CheckoutResponse, Error, CheckoutPayload>({
    mutationFn: checkoutRequest,
  });
}
