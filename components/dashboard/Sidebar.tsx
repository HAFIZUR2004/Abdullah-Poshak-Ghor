"use client";

import { useEffect, useState } from "react";
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
  FiFolder,
  FiUsers,
  FiSliders,
  FiStar,
  FiImage,
  FiMapPin, // Showroom Outlet Icon
} from "react-icons/fi";

interface User {
  name?: string;
  email?: string;
  avatar?: string;
  role?: "admin" | "super_admin";
  status?: string;
}

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  // =========================
  // Get logged-in user from JWT
  // =========================
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const response = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        if (!response.ok) {
          setUser(null);
          return;
        }

        const data = await response.json();
        setUser(data.user || data);
      } catch (error) {
        console.error("Failed to get current user:", error);
        setUser(null);
      } finally {
        setLoadingUser(false);
      }
    };

    getCurrentUser();
  }, []);

  // =========================
  // JWT Logout
  // =========================
  const handleLogout = async () => {
    if (loggingOut) return;

    try {
      setLoggingOut(true);

      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      setUser(null);
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoggingOut(false);
    }
  };

  const navItems = [
    {
      label: "Overview",
      icon: <FiHome />,
      path: "/dashboard",
    },
    // {
    //   label: "Hero",
    //   icon: <FiHome />,
    //   path: "/dashboard/hero",
    // },
    {
      label: "Products",
      icon: <FiPackage />,
      path: "/dashboard/products",
    },
    {
      label: "Categories",
      icon: <FiFolder />,
      path: "/dashboard/categories",
    },
    // {
    //   label: "Banner",
    //   icon: <FiImage />,
    //   path: "/dashboard/banner",
    // },
    // {
    //   label: "Custom Section",
    //   icon: <FiSliders />,
    //   path: "/dashboard/custom-section",
    // },
    {
      label: "Users",
      icon: <FiUsers />,
      path: "/dashboard/users",
    },
    // {
    //   label: "Showrooms",
    //   icon: <FiMapPin />, // Icon changed to Map Pin
    //   path: "/dashboard/showrooms",
    // },
   
  ];

  // =========================
  // User initials
  // =========================
  const getInitial = () => {
    if (user?.name) {
      return user.name.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return "U";
  };

  // =========================
  // User display name
  // =========================
  const getDisplayName = () => {
    if (user?.name) {
      return user.name;
    }
    if (user?.email) {
      return user.email.split("@")[0];
    }
    return "User";
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-[#006A4E] rounded-xl text-white shadow-lg hover:bg-[#075631] transition-colors"
      >
        {isOpen ? <FiX size={22} /> : <FiMenu size={22} />}
      </button>

      {/* Sidebar Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-[280px] bg-white shadow-2xl
          transform transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0 lg:shadow-none
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-[#006A4E] to-[#008060]">
          <Link
            href="/"
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="transition-transform group-hover:scale-105">
              <Image
                src="https://i.ibb.co.com/chYMQcpM/Whats-App-Image-2026-11-06-at-9-40-51-PM.jpg"
                alt="Abdullah Poshak Ghor
"
                width={50}
                height={50}
                className="rounded-full border-2 border-white/30 object-contain"
                priority
              />
            </div>

            <div>
              <h2 className="text-lg font-bold text-white leading-none tracking-tight">
                Abdullah

              </h2>
              <p className="text-[10px] text-white/70 font-medium tracking-[0.2em] uppercase">
                Dashboard
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-220px)]">
          {navItems.map((item) => {
            const isActive =
              pathname === item.path || pathname?.startsWith(item.path + "/");

            return (
              <button
                key={item.path}
                onClick={() => {
                  router.push(item.path);
                  setIsOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                  ${
                    isActive
                      ? "bg-[#006A4E] text-white shadow-lg shadow-[#006A4E]/20"
                      : "text-gray-600 hover:bg-gray-50 hover:text-[#006A4E]"
                  }
                `}
              >
                <span
                  className={`text-lg ${
                    isActive ? "text-white" : "text-gray-400"
                  }`}
                >
                  {item.icon}
                </span>

                <span
                  className={`font-medium text-sm ${
                    isActive ? "text-white" : "text-gray-700"
                  }`}
                >
                  {item.label}
                </span>

                {isActive && (
                  <span className="ml-auto w-1.5 h-6 bg-white rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-white">
          {/* User Info */}
          <div className="flex items-center gap-3 mb-3 p-3 bg-gray-50 rounded-xl">
            {/* Avatar */}
            <div className="w-10 h-10 bg-gradient-to-br from-[#006A4E] to-[#008060] rounded-full flex items-center justify-center text-white font-bold text-sm overflow-hidden shrink-0">
              {user?.avatar ? (
                <Image
                  src={user.avatar}
                  alt={getDisplayName()}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              ) : (
                getInitial()
              )}
            </div>

            {/* User Details */}
            <div className="flex-1 min-w-0">
              {loadingUser ? (
                <>
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-1" />
                  <div className="h-3 w-28 bg-gray-200 rounded animate-pulse" />
                </>
              ) : (
                <>
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {getDisplayName()}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {user?.email || "user@example.com"}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full py-2.5 px-4 bg-red-50 text-red-600 rounded-xl flex items-center justify-center gap-2 hover:bg-red-100 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiLogOut size={18} />
            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </aside>
    </>
  );
}