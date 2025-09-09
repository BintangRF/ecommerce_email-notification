import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type CartItemProps = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

export type TxStatus = "pending" | "settlement" | "cancel" | "failed";

export type TransactionProps = {
  id: string;
  orderId: string;
  items: CartItemProps[];
  total: number;
  status: TxStatus;
  createdAt: number;
  snapToken?: string;
};

type StoreProps = {
  cart: CartItemProps[];
  currentPayment: TransactionProps | null;
  addToCart: (item: CartItemProps) => void;
  removeFromCart: (id: number) => void;
  updateQty: (id: number, qty: number) => void;
  clearCart: () => void;
  setCurrentPayment: (tx: TransactionProps | null) => void;
};

export const useStore = create<StoreProps>()(
  persist(
    (set, get) => ({
      user: null,
      cart: [],
      transactions: [],
      currentPayment: null,
      addToCart: (item) =>
        set((state) => {
          const idx = state.cart.findIndex((i) => i.id === item.id);

          if (idx !== -1) {
            const updated = [...state.cart];
            updated[idx] = {
              ...updated[idx],
              quantity: updated[idx].quantity + item.quantity,
            };
            return { cart: updated };
          }

          return { cart: [...state.cart, item] };
        }),
      removeFromCart: (id) =>
        set((s) => ({ cart: s.cart.filter((i) => i.id !== id) })),
      updateQty: (id, quantity) =>
        set((s) => ({
          cart: s.cart.map((i) => (i.id === id ? { ...i, quantity } : i)),
        })),
      clearCart: () => set({ cart: [] }),
      setCurrentPayment: (tx) => set({ currentPayment: tx }),
    }),
    {
      name: "ecom-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        cart: state.cart,
        currentPayment: state.currentPayment,
      }),
    }
  )
);
