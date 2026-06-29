"use client";

import ProtectedRoute from "@/components/ProtectedRoute";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute allowedRoles={["user"]}>{children}</ProtectedRoute>;
}
