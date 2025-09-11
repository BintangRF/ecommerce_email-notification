// /app/api/update-products/route.ts
import { NextRequest, NextResponse } from "next/server";
import { stringify } from "querystring";

export async function POST(req: NextRequest) {
  const { order_id, products } = await req.json();
  const scriptUrl = process.env.NEXT_PUBLIC_SPREADSHEET_SCRIPT_URL;

  if (!scriptUrl) {
    return NextResponse.json(
      { error: "Spreadsheet URL not set" },
      { status: 500 }
    );
  }

  try {
    const formData = new FormData();
    Object.entries({ order_id, products: JSON.stringify(products) }).forEach(
      ([Key, value]) => {
        formData.append(Key, value.toString());
      }
    );

    const res = await fetch(scriptUrl, {
      method: "POST",
      body: formData,
    });

    const result = await res.json();
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
