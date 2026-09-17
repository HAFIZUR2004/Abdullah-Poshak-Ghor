"use client";

import { useEffect } from "react";
import { useAuth } from "@/hooks/AuthContext";
import { useRouter } from "next/navigation";

export default function DashboardHomePage() {
  const { userRole, loading } = useAuth();
  const router = useRouter();

  // Only admin / super_admin can access
  useEffect(() => {
    if (!loading) {
      const allowed = userRole === "admin" || userRole === "super_admin";
      if (!allowed) {
        router.replace("/");
      }
    }
  }, [userRole, loading, router]);

  // Loading
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-gold" />
      </div>
    );
  }

  // Unauthorized
  if (userRole !== "admin" && userRole !== "super_admin") {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Welcome Back! 👋
        </h1>

        <p className="text-gray-300 text-lg">
          Apni ekhon{" "}
          <span className="text-amber-400 font-semibold">
            {userRole === "super_admin" ? "Super Admin" : "Admin"}
          </span>{" "}
          hishebe logged in achen.
        </p>
      </div>
    </div>
  );
}