"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function PaymentNotification() {
  const searchParams = useSearchParams();
  const status = searchParams.get("transaction_status");
  const orderId = searchParams.get("order_id");

  let title = "Pembayaran Diproses";
  let message =
    "Transaksi sedang diproses. Silakan cek email (Gmail) Anda untuk detail lebih lanjut.";
  let color = "text-gray-700";

  switch (status) {
    case "settlement":
      title = "Pembayaran Berhasil 🎉";
      message = `Transaksi dengan ID ${orderId} berhasil diproses. Silakan periksa Gmail Anda untuk konfirmasi pembayaran.`;
      color = "text-green-600";
      break;
    case "pending":
      title = "Pembayaran Pending ⏳";
      message = `Transaksi dengan ID ${orderId} masih menunggu pembayaran. Silakan cek Gmail Anda untuk instruksi pembayaran.`;
      color = "text-yellow-600";
      break;
    case "deny":
    case "cancel":
    case "expire":
    case "failure":
      title = "Pembayaran Gagal ❌";
      message = `Transaksi dengan ID ${orderId} gagal diproses. Silakan cek Gmail Anda untuk informasi lebih lanjut.`;
      color = "text-red-600";
      break;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className={`text-2xl font-bold mb-4 ${color}`}>{title}</h1>
      <p className="mb-6">{message}</p>
      <Link href="/" className="px-4 py-2 bg-blue-600 text-white rounded">
        Kembali ke Beranda
      </Link>
    </div>
  );
}
