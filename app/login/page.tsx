import { Suspense } from "react";
import LoginClient from "./LoginClient";

export const metadata = { title: "Log In" };

export default function LoginPage() {
  return (
    <Suspense
      fallback={<div className="min-h-screen bg-[var(--background)]" />}
    >
      <LoginClient />
    </Suspense>
  );
}
