"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiUser, FiMail, FiLock, FiPhone } from "react-icons/fi";
import AuthShell from "@/components/auth/AuthShell";
import { AuthField, AuthButton, AuthError } from "@/components/auth/AuthField";
import { t } from "@/lib/translate";

interface RegForm {
  firstName: string;
  lastName: string;
  mobile: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";

  const [form, setForm] = useState<RegForm>({
    firstName: "",
    lastName: "",
    mobile: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k: keyof RegForm) => (v: string) => {
    setForm((f) => ({ ...f, [k]: k === "mobile" ? v.replace(/\D/g, "") : v }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // ✅ Client-side validation এখনও error-code দিয়েই দেখানো হচ্ছে, consistency এর জন্য
    if (!/^01[3-9]\d{8}$/.test(form.mobile)) {
      setError(t("INVALID_MOBILE", "en"));
      return;
    }
    if (form.password.length < 6) {
      setError(t("WEAK_PASSWORD", "en"));
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError(t("PASSWORDS_MISMATCH", "en"));
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          name: `${form.firstName.trim()} ${form.lastName.trim()}`.trim(),
          mobile: form.mobile,
          email: form.email.trim().toLowerCase(),
          password: form.password,
          confirmPassword: form.confirmPassword,
          provider: "email",
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(t(data?.code || "SERVER_ERROR", "en"));
        return;
      }

      router.replace(
        data?.user?.role === "admin" || data?.user?.role === "super_admin"
          ? "/dashboard"
          : redirectUrl,
      );
      router.refresh();
    } catch (err) {
      console.error("Registration error:", err);
      setError(t("SERVER_ERROR", "en"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Create Account"
      switchHref={`/login?redirect=${encodeURIComponent(redirectUrl)}`}
      switchLabel="Log In"
    >
      <AuthError message={error} />

      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthField
          icon={<FiUser size={16} />}
          placeholder="First Name *"
          value={form.firstName}
          onChange={set("firstName")}
          autoComplete="given-name"
        />
        <AuthField
          icon={<FiUser size={16} />}
          placeholder="Last Name *"
          value={form.lastName}
          onChange={set("lastName")}
          autoComplete="family-name"
        />
        <AuthField
          icon={<FiPhone size={16} />}
          placeholder="Mobile Number *"
          type="tel"
          inputMode="numeric"
          maxLength={11}
          value={form.mobile}
          onChange={set("mobile")}
          autoComplete="tel"
        />
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
          autoComplete="new-password"
        />
        <AuthField
          icon={<FiLock size={16} />}
          placeholder="Confirm Password *"
          type="password"
          value={form.confirmPassword}
          onChange={set("confirmPassword")}
          autoComplete="new-password"
        />

        <AuthButton loading={loading} label="Sign Up" />
      </form>
    </AuthShell>
  );
}
