import { NextResponse } from "next/server";
import midtransClient from "midtrans-client";
import { v4 as uuidv4 } from "uuid";
import items from "@/data/items.json";

export async function POST(req: Request) {
  try {
    const link = process.env.NEXT_PUBLIC_BASE_URL;
    const body = await req.json();

    // hitung total
    let gross_amount = 0;
    const item_details = body.items.map(
      (cartItem: { id: number; quantity: number }) => {
        const product = items.find((p: any) => p.id === cartItem.id);

        if (!product)
          throw new Error(`Product dengan id ${cartItem.id} tidak ada`);

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
      },
      callbacks: {
        finish: `${link}/payment-notification`,
        error: `${link}/payment-notification`,
        pending: `${link}/payment-notification`,
      },
      custom_field1: body.email,
      custom_field2: body.username,
      custom_field3: JSON.stringify(item_details),
      finish_redirect_url: `${link}/payment-notification`,
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
      { status: 500 }
    );
  }
}
