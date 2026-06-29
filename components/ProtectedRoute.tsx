"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  redirectTo?: string;
}

export default function ProtectedRoute({
  children,
  allowedRoles,
  redirectTo = "/login",
}: ProtectedRouteProps) {
  const { user, loading, userRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log("🔐 ProtectedRoute - userRole:", userRole);
    console.log("🔐 ProtectedRoute - loading:", loading);
    console.log("🔐 ProtectedRoute - allowedRoles:", allowedRoles);
    console.log("🔐 ProtectedRoute - user:", user);

    if (!loading) {
      if (!user) {
        console.log("🔐 No user, redirecting to login");
        router.push(
          `${redirectTo}?redirect=${encodeURIComponent(window.location.pathname)}`,
        );
      } else if (allowedRoles && !allowedRoles.includes(userRole || "user")) {
        console.log("🔐 Role not allowed, redirecting to home");
        router.push("/");
      } else {
        console.log("🔐 Access granted ✅");
      }
    }
  }, [user, loading, router, allowedRoles, userRole, redirectTo]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-gold"></div>
      </div>
    );
  }

  if (!user) return null;
  if (allowedRoles && !allowedRoles.includes(userRole || "user")) return null;

  return <>{children}</>;
}
