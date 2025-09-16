# 🛒 Next.js E-Commerce + Email Notification

Proyek ini adalah **website e-commerce sederhana** yang dibangun dengan **Next.js**, dilengkapi dengan **fitur notifikasi email** untuk memastikan pengguna mendapat update setelah melakukan transaksi.

## 🚀 Fitur Utama

- **Produk Sederhana**: Menampilkan daftar produk dengan harga.
- **Keranjang Belanja (Cart)**: Tambah, hapus, dan hitung total belanja.
- **Checkout**: Simulasi proses pembayaran.
- **Email Notification**: Mengirimkan email otomatis setelah transaksi berhasil menggunakan **Nodemailer**.
- **API Routes Next.js**: Backend ringan langsung di dalam Next.js untuk handle order & email.

## 🛠️ Teknologi yang Digunakan

- [Next.js](https://nextjs.org/) – Framework React untuk Fullstack.
- [Nodemailer](https://nodemailer.com/) – Untuk mengirimkan email notifikasi.
- [Tailwind CSS](https://tailwindcss.com/) – Styling modern & responsif.
- [TypeScript](https://www.typescriptlang.org/) – Supaya lebih aman dan terstruktur (opsional).
- [Vercel](https://vercel.com/) – Hosting cepat dan mudah (opsional).

Oke, saya tambahkan catatan di **README** kamu dengan penjelasan singkat soal race condition + contoh kode validasi `availableStock`.

Berikut tambahan yang bisa kamu masukkan di bawah bagian `## 🛠️ Teknologi yang Digunakan`:

---

## ⚡ Catatan Penting: Race Condition & Stock

Untuk mencegah masalah **race condition** saat beberapa pengguna melakukan checkout bersamaan, sebaiknya gunakan konsep **`reserved_stock`**.

- **stock** = jumlah stok asli produk.
- **reserved_stock** = jumlah stok yang sedang "ditahan" untuk transaksi yang belum selesai.
- **availableStock** = `stock - reserved_stock`.

### Contoh Validasi saat Checkout

```ts
if (!product) {
  throw new Error(`Product dengan id ${cartItem.id} tidak ada`);
}

// hitung available stock
const reservedStock = product.reserved_stock ?? 0;
const availableStock = product.stock - reservedStock;

if (availableStock <= 0) {
  throw new Error(
    `Maaf, produk "${product.name}" stoknya habis. Anda tidak bisa melakukan transaksi.`
  );
}

if (cartItem.quantity > availableStock) {
  throw new Error(
    `Maaf, jumlah pesanan untuk produk "${product.name}" melebihi stok tersedia (${availableStock}).`
  );
}

// kalau lolos, berarti bisa reserve, bisa dilakukan penyimpanan reserved_stock ke DB
product.reserved_stock = reservedStock + cartItem.quantity;
```

Dengan cara ini, `reserved_stock` tidak akan pernah melebihi `stock`, dan mencegah kasus available stok minus.
Implementasi finalnya bisa menggunakan DB, Spreadsheet, atau cache (misalnya Redis) sesuai kebutuhan.
