import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const {
    order_id,
    transaction_status,
    gross_amount,
    payment_type,
    custom_field1,
    custom_field2,
    custom_field3,
    va_numbers,
    bill_key,
    biller_code,
    store,
    payment_code,
    actions,
  } = body;

  let item_details: any[] = [];
  try {
    if (custom_field3) {
      item_details = JSON.parse(custom_field3);
    }
  } catch (err) {
    console.error("Failed to parse custom_field3:", err);
  }

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
        (item: any) =>
          `- ${item.name} x ${item.quantity} @ Rp ${item.price} = Rp ${
            item.price * item.quantity
          }`
      )
      .join("\n");

    let paymentInfo = "";

    if (transaction_status === "pending") {
      if (payment_type === "bank_transfer") {
        paymentInfo =
          "Silahkan transfer ke Virtual Account berikut: \n" +
          (va_numbers || [])
            .map((va: any) => `Bank ${va.bank.toUpperCase()}: ${va.va_number}`)
            .join("\n");
      } else if (payment_type === "echannel") {
        paymentInfo = `Kode Bill: ${bill_key} \nKode Company: ${biller_code}`;
      } else if (payment_type === "gopay" || payment_type === "shopeepay") {
        const deeplink = (actions || []).find(
          (a: any) => a.name === "deeplink-redirect"
        );
        paymentInfo = `Lanjutkan pembayaran melalui link berikut:\n${deeplink?.url}`;
      } else if (payment_type === "cstore") {
        paymentInfo = `Kode pembayaran di ${store}: ${payment_code}`;
      }
    }

    // email ke penjual
    await transporter.sendMail({
      from: custom_field1,
      to: process.env.GMAIL_ACCOUNT,
      replyTo: custom_field1,
      subject: `Pesanan Baru #${order_id}`,
      text: `Ada Pesanan baru. \n\ndari: ${custom_field1} \n\nStatus: ${transaction_status}\nTotal: Rp ${gross_amount}\n\nDaftar Item:\n${itemText}`,
    });

    let buyerMessage = `Halo ${custom_field2},\n\n`;
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
      to: custom_field1,
      subject: `Status Pesanan #${order_id}`,
      text:
        buyerMessage +
        `\n\nDaftar Item:\n${itemText}\n\nTerima kasih sudah belanja!`,
    });

    // POST KE SPREADSHEET - TETAP JALANKAN
    const scriptUrl = process.env.NEXT_PUBLIC_SPREADSHEET_SCRIPT_URL;

    if (scriptUrl) {
      try {
        const postBody = {
          order_id: (order_id ?? "").toString().trim(),
          username: (custom_field2 ?? "").trim(),
          email: (custom_field1 ?? "").trim(),
          products: JSON.stringify(item_details),
          gross_amount: (gross_amount ?? "").toString(),
          payment_type: payment_type ?? "",
          status: transaction_status ?? "",
        };

        // Kirim sebagai FormData
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
