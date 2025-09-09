"use client";

import { Navbar } from "@/components/Navbar";
import { QueryProvider } from "@/lib/QueryProvider";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";

export const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  // Load Midtrans snap.js
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute(
      "data-client-key",
      process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!
    );
    document.body.appendChild(script);
  }, []);

  return (
    <QueryProvider>
      <div className="bg-custom-light min-h-screen">
        {pathname !== "/payment-notification" && <Navbar />}
        <div>{children}</div>
      </div>
    </QueryProvider>
  );
};
