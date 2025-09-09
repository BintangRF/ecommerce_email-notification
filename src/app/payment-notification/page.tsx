import { Suspense } from "react";
import PaymentNotification from "@/components/PaymentNotifPage/PaymentNotification";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentNotification />
    </Suspense>
  );
}
