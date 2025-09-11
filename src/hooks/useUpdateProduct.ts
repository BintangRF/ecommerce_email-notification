import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export function useUpdateProduct() {
  return useMutation({
    mutationFn: async (payload: { order_id: string; products: any[] }) => {
      const res = await axios.post("/api/update-products", payload);
      return res.data;
    },
  });
}
