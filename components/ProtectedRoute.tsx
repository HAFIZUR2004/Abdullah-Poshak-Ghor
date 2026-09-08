"use client";

import { useAuth } from "@/hooks/AuthContext";
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

  /*
   * Role permission logic
   *
   * user
   *   └── no dashboard access
   *
   * admin
   *   └── dashboard access
   *
   * super_admin
   *   └── all admin access
   *   └── users management access
   */

  const hasAccess =
    !allowedRoles ||
    allowedRoles.includes(userRole || "user") ||
    (userRole === "super_admin" && allowedRoles.includes("admin"));

  useEffect(() => {
    console.log("🔐 ProtectedRoute - userRole:", userRole);
    console.log("🔐 ProtectedRoute - loading:", loading);
    console.log("🔐 ProtectedRoute - allowedRoles:", allowedRoles);
    console.log("🔐 ProtectedRoute - user:", user);
    console.log("🔐 ProtectedRoute - hasAccess:", hasAccess);

    if (loading) return;

    // No logged-in user
    if (!user) {
      console.log("🔐 No user, redirecting to login");

      router.replace(
        `${redirectTo}?redirect=${encodeURIComponent(
          window.location.pathname,
        )}`,
      );

      return;
    }

    // User doesn't have permission
    if (!hasAccess) {
      console.log("🔐 Role not allowed, redirecting to home");

      router.replace("/");

      return;
    }

    // Access granted
    console.log("🔐 Access granted ✅");
  }, [
    user,
    loading,
    userRole,
    allowedRoles,
    redirectTo,
    router,
    hasAccess,
  ]);

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-gold" />
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return null;
  }

  // No permission
  if (!hasAccess) {
    return null;
  }

  // Permission granted
  return <>{children}</>;
}