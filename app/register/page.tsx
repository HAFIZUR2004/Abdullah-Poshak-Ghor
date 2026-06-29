import React, { Suspense } from "react";
import RegisterClient from "./RegisterClient";

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center">Loading...</div>
        </div>
      }
    >
      <RegisterClient />
    </Suspense>
  );
}
