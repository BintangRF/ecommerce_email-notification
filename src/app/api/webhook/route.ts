import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const {
    order_id,
    transaction_status,
    gross_amount,
    payment_type,
    metadata,
    va_numbers,
  } = body;

  const { email, username, address, products } = metadata ?? {};

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_ACCOUNT,
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    // --- Email ke ADMIN (selalu terkirim agar admin tahu ada transaksi baru) ---
    await transporter.sendMail({
      from: email,
      to: process.env.GMAIL_ACCOUNT,
      replyTo: email,
      subject: `Pesanan Baru #${order_id}`,
      text: `Ada pesanan baru dari: ${username} (${email}),\n\nAlamat: ${address},\n\nStatus: ${transaction_status}\nTotal: Rp ${gross_amount}`,
    });

    // --- Email ke PEMBELI (hanya ketika settlement) ---
    if (transaction_status === "settlement") {
      const buyerMessage =
        `Halo ${username},\n\n` +
        `Terima kasih! Pembayaran kamu untuk pesanan #${order_id} sudah **BERHASIL** kami terima ✅.\n\n` +
        `Total: Rp${gross_amount}\n\n` +
        `Pesananmu segera kami proses. Mohon ditunggu ya 🙏\n\n` +
        `Salam hangat,\nTim Toko`;

      await transporter.sendMail({
        from: process.env.GMAIL_ACCOUNT,
        to: email,
        subject: `Pembayaran Berhasil - Pesanan #${order_id}`,
        text: buyerMessage,
      });
    }

    // --- POST ke Google Spreadsheet ---
    const scriptUrl = process.env.NEXT_PUBLIC_SPREADSHEET_SCRIPT_URL;

    if (scriptUrl) {
      try {
        const postBody = {
          order_id: (order_id ?? "").toString().trim(),
          username: (username ?? "").trim(),
          email: (email ?? "").trim(),
          address: (address ?? "").trim(),
          products: JSON.stringify(products ?? []),
          gross_amount: (gross_amount ?? "").toString(),
          payment_type: payment_type ?? "",
          bank: va_numbers?.[0]?.bank ?? "",
          va_number: va_numbers?.[0]?.va_number ?? "",
          status: transaction_status ?? "",
        };

        const formData = new FormData();
        Object.entries(postBody).forEach(([key, value]) => {
          formData.append(key, value.toString());
        });

        const response = await fetch(scriptUrl, {
          method: "POST",
          body: formData,
        });

        const result = await response.text();
        console.log("Spreadsheet response:", result);
      } catch (spreadsheetError) {
        console.error("Error sending to spreadsheet:", spreadsheetError);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in webhook:", error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
