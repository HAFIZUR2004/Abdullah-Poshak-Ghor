"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FiHome,
  FiShoppingBag,
  FiHeart,
  FiBell,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
  FiPackage,
  FiUser,
  FiUsers,
} from "react-icons/fi";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const navItems = [
    { label: "Overview", icon: <FiHome />, path: "/dashboard" },
    { label: "Products", icon: <FiPackage />, path: "/dashboard/products" },
    { label: "Users", icon: <FiUsers />, path: "/dashboard/users" },
    { label: "Orders", icon: <FiShoppingBag />, path: "/dashboard/orders" },
    { label: "Favorites", icon: <FiHeart />, path: "/dashboard/favorites" },
    { label: "Profile", icon: <FiUser />, path: "/dashboard/profile" },
    {
      label: "Notifications",
      icon: <FiBell />,
      path: "/dashboard/notifications",
    },
    { label: "Settings", icon: <FiSettings />, path: "/dashboard/settings" },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white/10 backdrop-blur-md rounded-lg text-white"
      >
        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Sidebar Overlay for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-100">
          <Link
            href="/"
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="bg-linear-to-br   transition-transform group-hover:scale-105">
              <Image
                src="/images/image.png"
                alt="Sareng Furniture"
                width={55}
                height={55}
                className="rounded-full object-contain"
                priority
              />
            </div>
            <div>
              <h2 className="text-base md:text-lg font-black text-gray-900 leading-none tracking-tight">
               Sareng Furniture
              </h2>
              <p className="text-[9px] text-gray-400 font-medium tracking-widest uppercase leading-none mt-0.5">
                Dashboard
              </p>
            </div>
          </Link>
        </div>

        {/* Sidebar Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                router.push(item.path);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                pathname === item.path
                  ? "bg-linear-to-r from-amber-500 to-yellow-500 text-white shadow-lg"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 mb-4 p-3 bg-amber-50 rounded-lg">
            <div className="w-10 h-10 bg-linear-to-br from-amber-500 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold">
              {auth.currentUser?.displayName?.charAt(0) ||
                auth.currentUser?.email?.charAt(0) ||
                "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">
                {auth.currentUser?.displayName ||
                  auth.currentUser?.email?.split("@")[0] ||
                  "User"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {auth.currentUser?.email || "user@example.com"}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full py-2.5 px-4 bg-red-50 text-red-600 rounded-lg flex items-center justify-center gap-2 hover:bg-red-100 transition-colors font-medium text-sm"
          >
            <FiLogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
