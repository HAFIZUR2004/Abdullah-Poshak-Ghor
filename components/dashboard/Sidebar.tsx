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
} from "react-icons/fi";

interface User {
  name?: string;
  email?: string;
  avatar?: string;
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
    
    {
      label: "Products",
      icon: <FiPackage />,
      path: "/dashboard/products",
    },
  {
    label: "Categories",
    icon: <FiFolder />, // 🔥 Ficategorie-এর বদলে FiFolder বা FiGrid ব্যবহার করুন
    path: "/dashboard/categories",
  },
    {
      label: "Users",
      icon: <FiUsers />,
      path: "/dashboard/users",
    },
    {
      label: "Orders",
      icon: <FiShoppingBag />,
      path: "/dashboard/orders",
    },
    {
      label: "Favorites",
      icon: <FiHeart />,
      path: "/dashboard/favorites",
    },
    {
      label: "Profile",
      icon: <FiUser />,
      path: "/dashboard/profile",
    },
    {
      label: "Notifications",
      icon: <FiBell />,
      path: "/dashboard/notifications",
    },
    {
      label: "Settings",
      icon: <FiSettings />,
      path: "/dashboard/settings",
    },
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
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white/10 backdrop-blur-md rounded-lg text-white"
      >
        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Sidebar Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white
          transform transition-transform duration-300 ease-in-out
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
            <div className="transition-transform group-hover:scale-105">
              <Image
                src="/images/logo.webp"
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

        {/* Navigation */}
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

              <span className="font-medium">
                {item.label}
              </span>
            </button>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
          {/* User Info */}
          <div className="flex items-center gap-3 mb-4 p-3 bg-amber-50 rounded-lg">
            {/* Avatar */}
            <div className="w-10 h-10 bg-linear-to-br from-amber-500 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold overflow-hidden">
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
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {getDisplayName()}
                  </p>

                  <p className="text-xs text-gray-500 truncate">
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
            className="w-full py-2.5 px-4 bg-red-50 text-red-600 rounded-lg flex items-center justify-center gap-2 hover:bg-red-100 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiLogOut size={18} />

            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </aside>
    </>
  );
}