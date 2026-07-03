"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  FiMenu,
  FiX,
  FiSearch,
  FiShoppingBag,
  FiUser,
  FiLogOut,
  FiChevronRight,
  FiHeart,
  FiHeadphones,
  FiHome,
  FiMessageSquare,
  FiTruck,
  FiLayout,
  FiXCircle,
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
  icon?: React.ElementType;
}

const navLinks: NavLink[] = [
  { name: "Home", href: "/", icon: FiHome },
  { name: "Shop", href: "/shop", icon: FiShoppingBag },
  { name: "About Us", href: "/about" },
  { name: "Collection", href: "/collection" },
  { name: "Blog", href: "/blog" },
  { name: "Contact Us", href: "/contact", icon: FiMessageSquare },
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
                      🚀 Free Delivery on orders above ৳999
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
        className={`bg-[#3a4739] text-white sticky top-0 z-50 transition-all duration-300 shadow-md font-sans ${
          isScrolled ? "shadow-[0_2px_20px_rgba(0,0,0,0.3)]" : ""
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Top Row: Logo, Search, Icons */}
          <div className="flex items-center justify-between h-[60px] gap-4">
            
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0 group">
              <div className="relative w-12 h-12 bg-white rounded-full p-1 flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105">
                <Image
                  src="/images/logo.webp" 
                  alt="Sareng Furniture"
                  width={40}
                  height={40}
                  className="w-10 h-10 object-contain"
                  priority
                />
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-xl font-bold tracking-wider leading-none text-white uppercase font-sans">Sareng</span>
                <span className="text-[9px] uppercase tracking-widest text-[#d69a45] font-sans">Furniture</span>
              </div>
            </Link>

            {/* Search Bar (Desktop) */}
            <div
              className="hidden md:block flex-1 max-w-xl relative"
              ref={searchRef}
            >
              <form onSubmit={handleSearch} className="w-full">
                <div className="relative flex items-center bg-white rounded overflow-hidden shadow-sm h-9">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchOpen(true)}
                    placeholder="Search furniture..."
                    className="w-full bg-transparent pl-3 pr-9 py-1.5 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-9 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition p-1"
                    >
                      <FiXCircle size={14} />
                    </button>
                  )}
                  <button
                    type="submit"
                    className="absolute right-0 top-0 h-full w-9 flex items-center justify-center bg-[#d69a45] text-white hover:bg-[#c0873a] transition-colors"
                    aria-label="Search"
                  >
                    <FiSearch size={15} />
                  </button>
                </div>
              </form>

              {/* Search Dropdown */}
              {isSearchOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-md shadow-xl z-50 overflow-hidden text-gray-800">
                  {/* Header */}
                  <div className="px-4 pt-3 pb-2 border-b border-gray-50">
                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                      {searchQuery ? "Search Results" : "Trending Products"}
                    </p>
                  </div>

                  <div className="max-h-72 overflow-y-auto py-1">
                    {searchQuery &&
                      searchResults.length > 0 &&
                      searchResults.map((product) => (
                        <button
                          key={product._id}
                          onClick={() => handleResultClick(product._id)}
                          className="w-full text-left px-4 py-2.5 hover:bg-orange-50 flex items-center gap-3 transition-colors group"
                        >
                          <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden shrink-0">
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
                            <p className="text-xs text-[#d69a45] font-bold">
                              ৳{product.price}
                            </p>
                          </div>
                          <FiChevronRight
                            size={14}
                            className="text-gray-300 group-hover:text-[#d69a45] transition-colors shrink-0"
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
                          <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden shrink-0">
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
                            <p className="text-xs text-[#d69a45] font-bold">
                              ৳{product.price}
                            </p>
                          </div>
                          <FiChevronRight
                            size={14}
                            className="text-gray-300 group-hover:text-[#d69a45] transition-colors shrink-0"
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
                        className="text-xs text-[#d69a45] font-semibold hover:text-[#c0873a] transition flex items-center gap-1"
                      >
                        See all results for "{searchQuery}"
                        <FiChevronRight size={12} />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <button 
                className="md:hidden w-9 h-9 flex items-center justify-center text-white/80 hover:text-white transition"
                onClick={() => {
                  setIsSearchOpen(!isSearchOpen);
                  setTimeout(() => mobileInputRef.current?.focus(), 100);
                }}
              >
                <FiSearch size={20} />
              </button>
              
              <Link href="/wishlist" className="w-9 h-9 flex items-center justify-center text-white/80 hover:text-[#d69a45] transition">
                <FiHeart size={20} />
              </Link>

              <Link href="/cart" className="w-9 h-9 flex items-center justify-center text-white/80 hover:text-[#d69a45] transition">
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
                          className="flex items-center gap-1.5 bg-[#d69a45] hover:bg-[#c0873a] px-3 py-1.5 rounded transition"
                        >
                          <FiLayout size={15} />
                          <span className="text-sm font-semibold text-white hidden sm:block">
                            Dashboard
                          </span>
                        </Link>
                      ) : (
                        <Link
                          href="/profile"
                          className="flex items-center gap-2 bg-[#d69a45] hover:bg-[#c0873a] px-2.5 py-1.5 rounded transition"
                        >
                          <UserAvatar
                            photoURL={user.photoURL}
                            name={user.displayName}
                          />
                          <span className="text-sm font-semibold text-white hidden sm:block max-w-[80px] truncate">
                            {getUserName()}
                          </span>
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-9 h-9 flex items-center justify-center text-white/80 hover:text-red-400 transition"
                        aria-label="Logout"
                      >
                        <FiLogOut size={20} />
                      </button>
                    </div>
                  ) : (
                    <Link
                      href="/login"
                      className="hidden sm:flex items-center gap-1.5 bg-[#d69a45] hover:bg-[#c0873a] text-white px-4 py-2 rounded font-semibold text-sm transition-all"
                    >
                      <FiUser size={14} />
                      <span>Login</span>
                    </Link>
                  )}
                </>
              )}

              {/* Mobile Hamburger */}
              <button
                className="lg:hidden w-9 h-9 flex items-center justify-center text-white/80 hover:text-white transition"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
            </div>
          </div>

          {/* Bottom Row: Nav Links & Help */}
          <div className="hidden lg:flex items-center justify-between py-2.5 border-t border-white/10">
            
            <nav className="flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative px-4 py-1.5 rounded-sm text-xs font-medium transition-colors ${
                    isActive(link.href)
                      ? "bg-[#d69a45] text-white"
                      : "text-white/75 hover:text-white"
                  }`}
                >
                  {link.name}
                  {/* Active underline */}
                  {isActive(link.href) && link.href !== "/" && (
                    <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-white rounded-full" />
                  )}
                </Link>
              ))}
            </nav>

            {/* Help Line Info */}
            <div className="flex items-center gap-1.5 text-white/70 text-xs">
              <FiHeadphones size={13} className="text-[#d69a45]" />
              <span>Need Help? +123 456 7890</span>
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile Search Bar ── */}
      {isSearchOpen && (
        <div className="md:hidden pb-3 border-t border-white/10 pt-3 bg-[#3a4739]">
          <form onSubmit={handleSearch} className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center bg-white rounded overflow-hidden shadow-sm h-9">
              <input
                ref={mobileInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search furniture..."
                className="w-full bg-transparent pl-3 pr-9 py-1.5 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-9 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition p-1"
                >
                  <FiXCircle size={14} />
                </button>
              )}
              <button
                type="submit"
                className="absolute right-0 top-0 h-full w-9 flex items-center justify-center bg-[#d69a45] text-white hover:bg-[#c0873a] transition-colors"
              >
                <FiSearch size={15} />
              </button>
            </div>
          </form>

          {/* Mobile search results */}
          {(searchResults.length > 0 ||
            (!searchQuery && trendingProducts.length > 0)) && (
            <div className="mt-2 bg-white border border-gray-100 rounded-md shadow-lg overflow-hidden mx-4">
              <div className="max-h-64 overflow-y-auto py-1">
                {(searchQuery ? searchResults : trendingProducts).map(
                  (product) => (
                    <button
                      key={product._id}
                      onClick={() => handleResultClick(product._id)}
                      className="w-full text-left px-3 py-2 hover:bg-orange-50 flex items-center gap-2.5 transition-colors"
                    >
                      <div className="w-9 h-9 bg-gray-100 rounded overflow-hidden shrink-0">
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
                        <p className="text-[11px] text-[#d69a45] font-bold">
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

      {/* ── Mobile Menu Drawer ───────────────────────────────── */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
          <div className="absolute top-0 left-0 h-full w-72 bg-[#3a4739] text-white shadow-2xl flex flex-col overflow-y-auto">
            {/* Drawer Header */}
            <div className="flex justify-between items-center px-5 py-4 border-b border-white/10">
              <span className="font-bold text-lg">Menu</span>
              <button onClick={() => setIsMenuOpen(false)} className="p-1 hover:bg-white/10 rounded transition">
                <FiX size={24} />
              </button>
            </div>

            {/* User section in drawer */}
            {!loading && user && (
              <div className="mx-4 mt-4 p-3 bg-white/10 border border-white/20 rounded-xl flex items-center gap-3">
                <UserAvatar photoURL={user.photoURL} name={user.displayName} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate">
                    {getUserName()}
                  </p>
                  <p className="text-[11px] text-white/70 truncate">
                    {user.email}
                  </p>
                </div>
              </div>
            )}

            {/* Nav Links */}
            <nav className="flex-1 px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive(link.href)
                      ? "bg-[#d69a45] text-white"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {link.icon && <link.icon size={16} />}
                  {link.name}
                  {isActive(link.href) && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </Link>
              ))}
            </nav>

            {/* Bottom auth actions */}
            <div className="px-4 pb-6 pt-2 border-t border-white/10 space-y-2">
              {!loading && !user ? (
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full bg-[#d69a45] text-white py-2.5 rounded-xl font-bold text-sm shadow-sm"
                >
                  <FiUser size={14} />
                  Login / Register
                </Link>
              ) : (
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 w-full border border-red-400/30 text-red-400 hover:bg-red-500/10 py-2.5 rounded-xl font-semibold text-sm transition"
                >
                  <FiLogOut size={14} />
                  Logout
                </button>
              )}
              <div className="flex items-center gap-2 text-white/70 mt-3 px-1">
                <FiHeadphones size={16} className="text-[#d69a45]" />
                <span className="text-sm">Need Help? +123 456 7890</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}