import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const {
    order_id,
    transaction_status,
    gross_amount,
    payment_type,
    customer_details,
    item_details,
  } = body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_ACCOUNT,
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    const itemText = item_details
      .map(
        (item: any) => `
    - ${item.name} x ${item.quantity} @ Rp ${item.price} = Rp ${
          item.price * item.quantity
        }
    `
      )
      .join("\n");

    let paymentInfo = "";

    if (transaction_status === "pending") {
      if (payment_type === "bank_transfer") {
        paymentInfo =
          "Silahkan transfer ke Virtual Account berikut: \n" +
          body.va_numbers
            .map((va: any) => `Bank ${va.bank.toUpperCase()}: ${va.va_number}`)
            .join("\n");
      } else if (payment_type === "echannel") {
        paymentInfo = `Kode Bill: ${body.bill_key} \nKode Company: ${body.biller_code}`;
      } else if (payment_type === "gopay" || payment_type === "shopeepay") {
        const deeplink = body.actions?.find(
          (a: any) => a.name === "deeplink-redirect"
        );
        paymentInfo = `Lanjutkan pembayaran melalui link berikut:\n${deeplink?.url}`;
      } else if (payment_type === "cstore") {
        paymentInfo = `Kode pembayaran di ${body.store}: ${body.payment_code}`;
      }
    }

    // email ke penjual
    await transporter.sendMail({
      from: customer_details.email,
      to: process.env.GMAIL_ACCOUNT,
      subject: `Pesanan Baru #${order_id}`,
      text: `Ada Pesanan baru. \n\nStatus: ${transaction_status}\nTotal: Rp ${gross_amount}\n\nDaftar Item:\n${itemText}`,
    });

    let buyerMessage = `Halo ${customer_details.first_name},\n\n`;
    if (transaction_status === "pending") {
      buyerMessage += `Pesanan kamu sedang menunggu pembayaran.\n${paymentInfo}\n\nTotal: Rp${gross_amount}\n`;
    } else if (transaction_status === "settlement") {
      buyerMessage += `Pembayaran kamu sudah BERHASIL diterima.\nPesanan segera diproses.\nTotal: Rp${gross_amount}\n`;
    } else if (
      transaction_status === "expire" ||
      transaction_status === "deny"
    ) {
      buyerMessage += `Maaf, pembayaran kamu gagal atau sudah kedaluwarsa.\nSilakan coba lagi.\n`;
    }

    // email ke pembeli
    await transporter.sendMail({
      from: process.env.GMAIL_ACCOUNT,
      to: customer_details.email,
      subject: `Status Pesanan #${order_id}`,
      text:
        buyerMessage +
        `\n\nDaftar Item:\n${itemText}\n\nTerima kasih sudah belanja!`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
