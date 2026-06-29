import React, { Suspense } from "react";
import PaymentClient from "./PaymentClient";

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center">Loading...</div>
        </div>
      }
    >
      <PaymentClient />
    </Suspense>
  );
}
