import React, { Suspense } from "react";
import LoginClient from "./LoginClient";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center">Loading...</div>
        </div>
      }
    >
      {/* Client component handles useSearchParams and other browser hooks */}
      <LoginClient />
    </Suspense>
  );
}
