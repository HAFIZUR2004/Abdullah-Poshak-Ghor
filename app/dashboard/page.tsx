"use client";

import { useEffect } from "react";
import { useAuth } from "@/hooks/AuthContext";
import { useRouter } from "next/navigation";

export default function DashboardHomePage() {
  const { userRole, loading } = useAuth();
  const router = useRouter();

  // Route Guard: Only admin / super_admin can access
  useEffect(() => {
    if (!loading) {
      const isAllowed = userRole === "admin" || userRole === "super_admin";
      if (!isAllowed) {
        router.replace("/");
      }
    }
  }, [userRole, loading, router]);

  // Loading State
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-400" />
      </div>
    );
  }

  // Prevent UI flash for unauthorized users
  if (userRole !== "admin" && userRole !== "super_admin") {
    return null;
  }

  const roleTitle = userRole === "super_admin" ? "Super Admin" : "Admin";

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-950 text-white">
      <div className="max-w-md w-full bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-xl text-center">
        
        {/* Badge */}
        <div className="inline-block px-3 py-1 mb-6 text-xs font-medium tracking-wide uppercase bg-amber-400/10 text-amber-400 rounded-full border border-amber-400/20">
          {roleTitle} Dashboard
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 tracking-tight">
          Welcome Back! 👋
        </h1>

        {/* Description */}
        <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
          You are currently logged in as a{" "}
          <span className="text-amber-400 font-semibold">{roleTitle}</span>. 
          Manage your system settings and data from this portal.
        </p>

      </div>
    </div>
  );
}