"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FiMail, FiLock } from "react-icons/fi";
import AuthShell from "@/components/auth/AuthShell";
import { AuthField, AuthButton, AuthError } from "@/components/auth/AuthField";
import { t } from "@/lib/translate";

export default function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k: "email" | "password") => (v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: form.email.trim().toLowerCase(),
          password: form.password,
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(t(data?.code || "SERVER_ERROR", "en"));
        return;
      }

      // Single redirect with full page reload
      const targetUrl =
        data?.user?.role === "admin" || data?.user?.role === "super_admin"
          ? "/dashboard"
          : redirectUrl;

      window.location.href = targetUrl;
      return;
    } catch (err) {
      console.error("Login error:", err);
      setError(t("SERVER_ERROR", "en"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Log in to Your Account"
      switchHref={`/register?redirect=${encodeURIComponent(redirectUrl)}`}
      switchLabel="Sign Up"
    >
      <AuthError message={error} />

      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthField
          icon={<FiMail size={16} />}
          placeholder="Email Address *"
          type="email"
          value={form.email}
          onChange={set("email")}
          autoComplete="email"
        />
        <AuthField
          icon={<FiLock size={16} />}
          placeholder="Password *"
          type="password"
          value={form.password}
          onChange={set("password")}
          autoComplete="current-password"
        />

        <div className="text-center">
          <Link
            href="/forgot-password"
            className="text-xs text-primary-gold underline underline-offset-2 hover:text-dark-bronze"
          >
            Forgot Password
          </Link>
        </div>

        <AuthButton loading={loading} label="Log In" />
      </form>
    </AuthShell>
  );
}
