// hooks/usePayment.ts
"use client";

import { v4 as uuidv4 } from "uuid";
import { useStore } from "@/store/useStore";
import { useCheckout } from "@/hooks/useCheckout";

export function usePayment() {
  const { clearCart, cart } = useStore();
  const { mutate, isPending } = useCheckout();

  /**
   * currentPayment = transaksi yang sedang berlangsung (sementara)
   * sebelum benar-benar masuk ke daftar transaksi (transactions).
   * isinya data: id, orderId, items, total, status sementara, snapToken.
   *
   * setCurrentPayment = setter untuk mengubah/menghapus currentPayment.
   */
  const payWithSnap = (snapToken: string, orderId: string) => {
    const currentPayment = useStore.getState().currentPayment;
    const setCurrentPayment = useStore.getState().setCurrentPayment;

    // Pastikan Snap JS tersedia

    // Buka popup Snap Payment
    window.snap.pay(snapToken, {
      // ✅ Jika pembayaran sukses
      onSuccess: () => {
        clearCart(); // kosongkan keranjang setelah berhasil
      },
      // 🕒 Jika masih menunggu pembayaran (pending)
      onPending: () => {
        if (currentPayment) {
          setCurrentPayment(null);
          clearCart();
        }
      },
      // ❌ Jika gagal/error
      onError: () => {
        setCurrentPayment(null);
      },
      // ⚠️ Jika user menutup popup tanpa bayar
      onClose: () => {
        console.log("Snap modal ditutup, token tetap ada");
        setCurrentPayment(null);
      },
    });
  };

  /**
   * handleCheckout = fungsi utama untuk memulai proses checkout
   * - validasi user login
   * - request token + orderId dari backend (mutate)
   * - simpan transaksi sementara ke currentPayment
   * - jalankan Snap popup via payWithSnap
   */
  const handleCheckout = (data: any) => {
    if (!cart.length) return;

    mutate(
      {
        items: cart.map((item) => ({
          id: item.id,
          quantity: item.quantity,
        })),
        username: data.username,
        email: data.email,
      },
      {
        onSuccess: (res) => {
          // Simpan transaksi sementara (currentPayment) dengan status "pending" agar bisa diproses
          useStore.getState().setCurrentPayment({
            id: uuidv4(),
            orderId: res.orderId,
            items: cart,
            total: res.total,
            status: "pending",
            createdAt: Date.now(),
            snapToken: res.snapToken,
          });

          // Buka Snap Payment
          payWithSnap(res.snapToken, res.orderId);
        },
        onError: (err) => {
          console.error("Checkout error:", err);
        },
      }
    );
  };

  return { handleCheckout, payWithSnap, isPending };
}
