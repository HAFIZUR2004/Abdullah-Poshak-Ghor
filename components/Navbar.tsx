"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  FiMenu,
  FiX,
  FiSearch,
  FiHome,
  FiShoppingBag,
  FiMessageSquare,
  FiTruck,
  FiLogOut,
  FiLayout,
  FiXCircle,
  FiUser,
  FiChevronRight,
} from "react-icons/fi";
import Image from "next/image";
import CartIcon from "./CartIcon";
import { useProducts } from "@/hooks/useProducts";
import { useAuth } from "@/hooks/useAuth";
import { Product } from "@/types";
import Swal from "sweetalert2";

// ─── Types ──────────────────────────────────────────────────────────────────────

interface NavLink {
  name: string;
  href: string;
  icon: React.ElementType;
}

const navLinks: NavLink[] = [
  { name: "Home", href: "/", icon: FiHome },
  { name: "Shop", href: "/shop", icon: FiShoppingBag },
  { name: "Contact", href: "/contact", icon: FiMessageSquare },
  { name: "Track Order", href: "/track-order", icon: FiTruck },
];

// ─── User Avatar ────────────────────────────────────────────────────────────────

const UserAvatar = ({
  photoURL,
  name,
}: {
  photoURL?: string | null;
  name?: string | null;
}) => {
  const [imgError, setImgError] = useState(false);

  if (photoURL && !imgError) {
    return (
      <img
        src={photoURL}
        alt={name || "User"}
        className="w-7 h-7 rounded-full object-cover ring-2 ring-orange-200"
        onError={() => setImgError(true)}
      />
    );
  }
  const initial = name?.charAt(0).toUpperCase() || "U";
  return (
    <div className="w-7 h-7 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm">
      {initial}
    </div>
  );
};

// ─── Product Image Getter ────────────────────────────────────────────────────────

const getProductImage = (product: Product): string => {
  if (product.images && product.images.length > 0 && product.images[0])
    return product.images[0];
  if (product.image && typeof product.image === "string") return product.image;
  return "/placeholder.jpg";
};

// ─── Main Navbar ────────────────────────────────────────────────────────────────

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  const { user, loading, logout, userRole } = useAuth();
  const { products } = useProducts();

  // Scroll shadow effect
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const trendingProducts = useMemo(() => {
    if (!products.length) return [];
    return products.filter((p) => p.rating && p.rating >= 4.5).slice(0, 5);
  }, [products]);

  const searchResults = useMemo(() => {
    if (searchQuery.trim() === "" || !products.length) return [];
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      .slice(0, 6);
  }, [searchQuery, products]);

  // Close search on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
        setSearchQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  }, [pathname]);

  // Lock scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to logout?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#f97316",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      await logout();
      setIsMenuOpen(false);
      router.push("/");
      Swal.fire({
        title: "Logged Out!",
        text: "You have been successfully logged out.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleResultClick = (productId: string | undefined) => {
    if (productId && productId !== "undefined") {
      router.push(`/product/${productId}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const isActive = (href: string): boolean => {
    if (href === "/") return pathname === href;
    return pathname.startsWith(href);
  };

  const getUserName = (): string => {
    if (user?.displayName) return user.displayName.split(" ")[0];
    if (user?.email) return user.email?.split("@")[0] || "User";
    return "User";
  };

  return (
    <>
      {/* ── Announcement Bar ─────────────────────────────────── */}
      {showAnnouncement && (
        <div className="relative bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 overflow-hidden">
          <div className="flex items-center justify-center px-10 py-2">
            {/* Marquee text */}
            <div className="overflow-hidden flex-1 max-w-3xl mx-auto">
              <div className="relative">
                {/* Continuous marquee: duplicated track for seamless loop */}
                <div className="marquee">
                  <div className="marquee-track">
                    <span className="marquee-item">
                      🚀 Free Delivery on orders above ৳999
                      &nbsp;&nbsp;·&nbsp;&nbsp; 💳 Cash on Delivery Available
                      &nbsp;&nbsp;·&nbsp;&nbsp; ✨ New Arrivals Every Week
                      &nbsp;&nbsp;·&nbsp;&nbsp; 🎁 Exclusive Deals for Members
                      &nbsp;&nbsp;·&nbsp;&nbsp; 📦 7-Day Easy Returns
                    </span>
                    <span className="marquee-item">
                      � Free Delivery on orders above ৳999
                      &nbsp;&nbsp;·&nbsp;&nbsp; 💳 Cash on Delivery Available
                      &nbsp;&nbsp;·&nbsp;&nbsp; ✨ New Arrivals Every Week
                      &nbsp;&nbsp;·&nbsp;&nbsp; 🎁 Exclusive Deals for Members
                      &nbsp;&nbsp;·&nbsp;&nbsp; 📦 7-Day Easy Returns
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowAnnouncement(false)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-white/80 hover:text-white transition rounded-full hover:bg-white/20"
              aria-label="Close announcement"
            >
              <FiX size={12} />
            </button>
          </div>
          <style>{`
            /* Continuous marquee styles */
            .marquee { position: relative; width: 100%; overflow: hidden; }
            .marquee-track { display: inline-flex; gap: 2.25rem; align-items: center; white-space: nowrap; will-change: transform; animation: marquee 18s linear infinite; animation-delay: 0s; animation-timing-function: linear; min-width: max-content; }
            .marquee-item { display: inline-block; color: black; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.01em; }

            /* Move track left by 50% (one full content width because we duplicated it) for a seamless loop */
            @keyframes marquee { 0% { transform: translateX(0%); } 100% { transform: translateX(-50%); } }

            /* Slightly slower on very small screens to keep legibility */
            @media (max-width: 420px) {
              .marquee-track { animation-duration: 22s; }
              .marquee-item { font-size: 0.72rem; }
            }
          `}</style>
        </div>
      )}

      {/* ── Main Header ──────────────────────────────────────── */}
      <header
        className={`bg-white sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "shadow-[0_2px_20px_rgba(0,0,0,0.08)] border-b border-gray-100"
            : "border-b border-gray-100/60"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-3 sm:px-5 lg:px-8">
          <div className="flex items-center gap-3 lg:gap-6 h-16">
            {/* ── Logo ── */}
            <Link href="/" className="flex items-center gap-2 shrink-0 group">
              <div className="relative">
                <Image
                  src="/images/image.png"
                  alt="Sareng F
                  urniture"
                  width={56}
                  height={56}
                  className="w-12 h-12 md:w-14 md:h-14 object-contain transition-transform group-hover:scale-105"
                  priority
                />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-base md:text-lg font-black text-gray-900 leading-none tracking-tight">
                  Sareng  {" "}
                  <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                    Furniture
                  </span>
                </h1>
                <p className="text-[9px] text-gray-400 font-medium tracking-widest uppercase leading-none mt-0.5">
                  Premium Store
                </p>
              </div>
            </Link>

            {/* ── Desktop Search ── */}
            <div
              className="hidden md:block flex-1 max-w-xl relative"
              ref={searchRef}
            >
              <form onSubmit={handleSearch}>
                <div className="relative flex items-center bg-gray-50 border border-gray-200 rounded-xl hover:border-orange-300 focus-within:border-orange-400 focus-within:bg-white transition-all duration-200 shadow-sm focus-within:shadow-orange-100 focus-within:shadow-md">
                  <FiSearch
                    className="absolute left-3.5 text-gray-400"
                    size={16}
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchOpen(true)}
                    placeholder="Search for products, brands and more..."
                    className="w-full bg-transparent pl-10 pr-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none rounded-xl"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="mr-1 text-gray-400 hover:text-gray-600 transition p-1"
                    >
                      <FiXCircle size={14} />
                    </button>
                  )}
                  <button
                    type="submit"
                    className="shrink-0 mr-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white p-2 rounded-lg transition-all shadow-sm"
                    aria-label="Search"
                  >
                    <FiSearch size={14} />
                  </button>
                </div>
              </form>

              {/* ── Search Dropdown ── */}
              {isSearchOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden">
                  {/* Header */}
                  <div className="px-4 pt-3 pb-2 border-b border-gray-50">
                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                      {searchQuery ? "Search Results" : "Trending Products"}
                    </p>
                  </div>

                  <div className="max-h-80 overflow-y-auto py-1">
                    {searchQuery &&
                      searchResults.length > 0 &&
                      searchResults.map((product) => (
                        <button
                          key={product._id}
                          onClick={() => handleResultClick(product._id)}
                          className="w-full text-left px-4 py-2.5 hover:bg-orange-50 flex items-center gap-3 transition-colors group"
                        >
                          <div className="w-10 h-10 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                            <img
                              src={getProductImage(product)}
                              alt={product.name}
                              className="w-full h-full object-cover"
                              onError={(e) =>
                                ((e.target as HTMLImageElement).src =
                                  "/placeholder.jpg")
                              }
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-800 truncate group-hover:text-orange-600 transition-colors">
                              {product.name}
                            </p>
                            <p className="text-xs text-orange-500 font-bold">
                              ৳{product.price}
                            </p>
                          </div>
                          <FiChevronRight
                            size={14}
                            className="text-gray-300 group-hover:text-orange-400 transition-colors shrink-0"
                          />
                        </button>
                      ))}

                    {!searchQuery &&
                      trendingProducts.length > 0 &&
                      trendingProducts.map((product) => (
                        <button
                          key={product._id}
                          onClick={() => handleResultClick(product._id)}
                          className="w-full text-left px-4 py-2.5 hover:bg-orange-50 flex items-center gap-3 transition-colors group"
                        >
                          <div className="w-10 h-10 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                            <img
                              src={getProductImage(product)}
                              alt={product.name}
                              className="w-full h-full object-cover"
                              onError={(e) =>
                                ((e.target as HTMLImageElement).src =
                                  "/placeholder.jpg")
                              }
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-800 truncate group-hover:text-orange-600 transition-colors">
                              {product.name}
                            </p>
                            <p className="text-xs text-orange-500 font-bold">
                              ৳{product.price}
                            </p>
                          </div>
                          <FiChevronRight
                            size={14}
                            className="text-gray-300 group-hover:text-orange-400 transition-colors shrink-0"
                          />
                        </button>
                      ))}

                    {searchQuery && searchResults.length === 0 && (
                      <div className="px-4 py-8 text-center">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <FiSearch size={20} className="text-gray-400" />
                        </div>
                        <p className="text-sm font-medium text-gray-500">
                          No products found
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Try a different search term
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  {searchQuery && searchResults.length > 0 && (
                    <div className="border-t border-gray-50 px-4 py-2.5">
                      <button
                        onClick={handleSearch as any}
                        className="text-xs text-orange-500 font-semibold hover:text-orange-600 transition flex items-center gap-1"
                      >
                        See all results for "{searchQuery}"
                        <FiChevronRight size={12} />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ── Desktop Nav Links ── */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 group ${
                    isActive(link.href)
                      ? "text-orange-600 bg-orange-50"
                      : "text-gray-600 hover:text-orange-500 hover:bg-orange-50/60"
                  }`}
                >
                  {link.name}
                  {/* Active underline */}
                  {isActive(link.href) && (
                    <span className="absolute bottom-1 left-3 right-3 h-0.5 bg-gradient-to-r from-orange-500 to-amber-400 rounded-full" />
                  )}
                </Link>
              ))}
            </nav>

            {/* ── Right Actions ── */}
            <div className="flex items-center gap-1.5 sm:gap-2 ml-auto shrink-0">
              {/* Mobile Search Toggle */}
              <button
                className="md:hidden w-9 h-9 flex items-center justify-center text-gray-600 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition"
                onClick={() => {
                  setIsSearchOpen(!isSearchOpen);
                  setTimeout(() => mobileInputRef.current?.focus(), 100);
                }}
                aria-label="Search"
              >
                <FiSearch size={18} />
              </button>

              {/* Cart */}
              <Link
                href="/cart"
                className="w-9 h-9 flex items-center justify-center hover:bg-orange-50 rounded-lg transition"
              >
                <CartIcon />
              </Link>

              {/* Auth section */}
              {!loading && (
                <>
                  {user ? (
                    <div className="flex items-center gap-1.5">
                      {userRole === "admin" ? (
                        <Link
                          href="/dashboard"
                          className="flex items-center gap-1.5 bg-orange-50 hover:bg-orange-100 border border-orange-100 px-3 py-1.5 rounded-lg transition"
                        >
                          <FiLayout size={15} className="text-orange-500" />
                          <span className="text-sm font-semibold text-gray-700 hidden sm:block">
                            Dashboard
                          </span>
                        </Link>
                      ) : (
                        <Link
                          href="/profile"
                          className="flex items-center gap-2 bg-orange-50 hover:bg-orange-100 border border-orange-100 px-2.5 py-1.5 rounded-lg transition"
                        >
                          <UserAvatar
                            photoURL={user.photoURL}
                            name={user.displayName}
                          />
                          <span className="text-sm font-semibold text-gray-700 hidden sm:block max-w-[80px] truncate">
                            {getUserName()}
                          </span>
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                        aria-label="Logout"
                      >
                        <FiLogOut size={16} />
                      </button>
                    </div>
                  ) : (
                    <Link
                      href="/login"
                      className="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-4 py-2 rounded-lg font-semibold text-sm shadow-sm shadow-orange-200 transition-all"
                    >
                      <FiUser size={14} />
                      <span>Login</span>
                    </Link>
                  )}
                </>
              )}

              {/* Mobile Menu Hamburger */}
              <button
                className="lg:hidden w-9 h-9 flex items-center justify-center text-gray-600 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
              </button>
            </div>
          </div>

          {/* ── Mobile Search Bar ── */}
          {isSearchOpen && (
            <div className="md:hidden pb-3 border-t border-gray-100 pt-3">
              <form onSubmit={handleSearch} className="relative">
                <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl focus-within:border-orange-400 focus-within:bg-white transition-all">
                  <FiSearch
                    className="absolute left-3.5 text-gray-400"
                    size={15}
                  />
                  <input
                    ref={mobileInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full bg-transparent pl-10 pr-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="text-gray-400 mr-1 p-1"
                    >
                      <FiXCircle size={14} />
                    </button>
                  )}
                  <button
                    type="submit"
                    className="shrink-0 mr-1.5 bg-orange-500 text-white p-2 rounded-lg"
                  >
                    <FiSearch size={13} />
                  </button>
                </div>
              </form>

              {/* Mobile search results */}
              {(searchResults.length > 0 ||
                (!searchQuery && trendingProducts.length > 0)) && (
                <div className="mt-2 bg-white border border-gray-100 rounded-2xl shadow-lg overflow-hidden">
                  <div className="max-h-64 overflow-y-auto py-1">
                    {(searchQuery ? searchResults : trendingProducts).map(
                      (product) => (
                        <button
                          key={product._id}
                          onClick={() => handleResultClick(product._id)}
                          className="w-full text-left px-3 py-2 hover:bg-orange-50 flex items-center gap-2.5 transition-colors"
                        >
                          <div className="w-9 h-9 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                            <img
                              src={getProductImage(product)}
                              alt={product.name}
                              className="w-full h-full object-cover"
                              onError={(e) =>
                                ((e.target as HTMLImageElement).src =
                                  "/placeholder.jpg")
                              }
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-gray-800 truncate">
                              {product.name}
                            </p>
                            <p className="text-[11px] text-orange-500 font-bold">
                              ৳{product.price}
                            </p>
                          </div>
                        </button>
                      ),
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* ── Mobile Menu Overlay ───────────────────────────────── */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          />
          {/* Drawer */}
          <div className="absolute top-0 left-0 h-full w-72 bg-white shadow-2xl flex flex-col overflow-y-auto">
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <Link
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-2"
              >
                <Image
                  src="/images/logo.webp"
                  alt="Solid Bazzar"
                  width={48}
                  height={48}
                  className="w-12 h-12 object-contain"
                  priority
                />
                <span className="font-black text-gray-900">
                  Solid <span className="text-orange-500">Bazzar</span>
                </span>
              </Link>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* User section in drawer */}
            {!loading && user && (
              <div className="mx-4 mt-4 p-3 bg-orange-50 border border-orange-100 rounded-xl flex items-center gap-3">
                <UserAvatar photoURL={user.photoURL} name={user.displayName} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-800 truncate">
                    {getUserName()}
                  </p>
                  <p className="text-[11px] text-gray-400 truncate">
                    {user.email}
                  </p>
                </div>
              </div>
            )}

            {/* Nav Links */}
            <nav className="flex-1 px-4 py-4 space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      isActive(link.href)
                        ? "bg-orange-50 text-orange-600 border border-orange-100"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <Icon
                      size={16}
                      className={
                        isActive(link.href)
                          ? "text-orange-500"
                          : "text-gray-400"
                      }
                    />
                    {link.name}
                    {isActive(link.href) && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-500" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Bottom auth actions */}
            <div className="px-4 pb-6 pt-2 border-t border-gray-100 space-y-2">
              {!loading && !user ? (
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-2.5 rounded-xl font-bold text-sm shadow-sm"
                >
                  <FiUser size={14} />
                  Login / Register
                </Link>
              ) : (
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 w-full border border-red-100 text-red-500 hover:bg-red-50 py-2.5 rounded-xl font-semibold text-sm transition"
                >
                  <FiLogOut size={14} />
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
