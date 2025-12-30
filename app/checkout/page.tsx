import { Suspense } from "react";
import CheckoutClient from "./checkoutClient";

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="p-10">Loading checkout...</div>}>
      <CheckoutClient />
    </Suspense>
  );
}
