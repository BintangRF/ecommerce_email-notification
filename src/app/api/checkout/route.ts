import { NextResponse } from "next/server";
import midtransClient from "midtrans-client";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import Papa from "papaparse";

type ProductProps = {
  id: string;
  name: string;
  price: number;
  quantity?: number; // tambahkan quantity untuk validasi stok
};

export async function POST(req: Request) {
  try {
    const link = process.env.NEXT_PUBLIC_BASE_URL;
    const body = await req.json();

    // ambil data produk yang tersedia
    const linkProducts = `${
      process.env.NEXT_PUBLIC_SPREADSHEET_URL
    }&t=${Date.now()}`;

    const res = await axios.get(linkProducts!);
    const parsed = Papa.parse(res.data, { header: true });
    const products: ProductProps[] = (parsed.data as ProductProps[])
      .filter((row: ProductProps) => row.id && row.name && row.price)
      .map((row: ProductProps) => ({
        id: String(row.id),
        name: String(row.name),
        price: Number(row.price),
        quantity: row.quantity ? Number(row.quantity) : 0, // ambil stok
      }));

    let gross_amount = 0;

    // mapping item_details dengan validasi stok
    const item_details = body.items.map(
      (cartItem: { id: number; quantity: number }) => {
        const product = products.find(
          (p: ProductProps) => p.id === String(cartItem.id)
        );

        if (!product) {
          throw new Error(`Product dengan id ${cartItem.id} tidak ada`);
        }

        if (!product.quantity || product.quantity <= 0) {
          throw new Error(
            `Maaf, produk "${product.name}" stoknya habis. Anda tidak bisa melakukan transaksi.`
          );
        }

        if (cartItem.quantity > product.quantity) {
          throw new Error(
            `Maaf, jumlah pesanan untuk produk "${product.name}" melebihi stok tersedia (${product.quantity}).`
          );
        }

        const price = Math.round(product.price);
        const subTotal = price * cartItem.quantity;
        gross_amount += Math.round(subTotal);

        return {
          id: String(product.id),
          price,
          quantity: cartItem.quantity,
          name: product.name.substring(0, 50),
        };
      }
    );

    const snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY,
    });

    const order_id = "Order-" + uuidv4();

    const parameter = {
      transaction_details: {
        order_id,
        gross_amount,
      },
      item_details,
      credit_card: { secure: true },
      customer_details: {
        first_name: body.username,
        email: body.email,
        shipping_address: {
          first_name: body.username,
          email: body.email,
          address: body.address,
        },
      },
      callbacks: {
        finish: `${link}/payment-notification`,
        error: `${link}/payment-notification`,
        pending: `${link}/payment-notification`,
      },
      finish_redirect_url: `${link}/payment-notification`,
      metadata: {
        username: body.username,
        email: body.email,
        address: body.address,
        products: item_details,
      },
    };

    const transaction = await snap.createTransaction(parameter);

    return NextResponse.json({
      snapToken: transaction.token,
      orderId: order_id,
      total: Math.round(gross_amount),
    });
  } catch (error: any) {
    console.error("Checkout error: ", error);
    return NextResponse.json(
      { error: error?.message ?? "Unknown Error" },
      { status: 400 }
    );
  }
}
