// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { SearchProvider } from "@/context/SearchContext";
import { AuthProvider } from "@/hooks/AuthContext";

export const metadata: Metadata = {
  title: "sareng furniture - A House of Quality Furniture",
  description: "সেরা মানের পণ্য সবচেয়ে কম দামে |",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <body className="font-sans" suppressHydrationWarning>
        <AuthProvider>
          <CartProvider>
            <SearchProvider>
              <main className="min-h-screen">{children}</main>
            </SearchProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

// windows