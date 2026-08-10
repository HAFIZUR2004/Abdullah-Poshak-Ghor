import { Suspense } from "react";
import RegisterClient from "./RegisterClient";

export const metadata = { title: "Create Account" };

export default function RegisterPage() {
  return (
    <Suspense
      fallback={<div className="min-h-screen bg-[var(--background)]" />}
    >
      <RegisterClient />
    </Suspense>
  );
}
