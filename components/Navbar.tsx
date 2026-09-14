"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  FiMenu, FiX, FiSearch, FiShoppingBag, FiUser, FiLogOut,
  FiChevronRight, FiHeart, FiHeadphones, FiHome, FiMessageSquare,
  FiTruck, FiLayout, FiXCircle,
} from "react-icons/fi";
import Image from "next/image";
import { useProducts } from "@/hooks/useProducts";
import { useAuth } from "@/hooks/AuthContext";
import { Product } from "@/types";
import Swal from "sweetalert2";
import { Inter } from "next/font/google"; // 👈 Inter font import

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// ─── imgbb লিংক ────────────────────────────────────────────────────────────────
const LOGO_URL = "https://i.ibb.co.com/Y7ZZrcJ5/newlogo.png";

// ─── Constants ─────────────────────────────────────────────────────────────────
const navLinks = [
  { name: "Home", href: "/", icon: FiHome },
  { name: "Shop", href: "/shop", icon: FiShoppingBag },
  { name: "About Us", href: "/about" },
 

  { name: "Contact Us", href: "/contact", icon: FiMessageSquare },
 
];

const getProductImage = (product: Product): string =>
  product.images?.[0] || product.image || "/placeholder.jpg";

// ─── User Avatar Component ─────────────────────────────────────────────────────
const UserAvatar = ({ photoURL, name }: { photoURL?: string | null; name?: string | null }) => {
  const [imgError, setImgError] = useState(false);

  if (photoURL && !imgError) {
    return (
      <img
        src={photoURL}
        alt={name || "User"}
        className="w-7 h-7 rounded-full object-cover ring-2 ring-[#E5D3B3]"
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <div className="w-7 h-7 bg-[#0F3D39] text-[#E5D3B3] rounded-full flex items-center justify-center text-xs font-bold shadow-sm">
      {name?.charAt(0).toUpperCase() || "U"}
    </div>
  );
};

// ─── Search Product Item ──────────────────────────────────────────────────────
const SearchItem = ({ product, onClick }: { product: Product; onClick: () => void }) => (
  <button
    onClick={onClick}
    className="w-full text-left px-4 py-2.5 hover:bg-[#F4F5F7] flex items-center gap-3 transition-colors group"
  >
    <div className="w-10 h-10 bg-[#ECECEC] rounded overflow-hidden shrink-0">
      <img
        src={getProductImage(product)}
        alt={product.name}
        className="w-full h-full object-cover"
        onError={(e) => ((e.target as HTMLImageElement).src = "/placeholder.jpg")}
      />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-[#0B2523] truncate group-hover:text-[#0F3D39] transition-colors">
        {product.name}
      </p>
      <p className="text-xs text-[#0F3D39] font-bold">৳{product.price}</p>
    </div>
    <FiChevronRight size={14} className="text-[#0B2523]/50 group-hover:text-[#0F3D39] transition-colors shrink-0" />
  </button>
);

// ─── Main Navbar ────────────────────────────────────────────────────────────────
export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [wishlistCount, setWishlistCount] = useState(0);

  const pathname = usePathname();
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  const { user, loading, logout, userRole } = useAuth();
  const { products } = useProducts();

  // Scroll effect
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Wishlist count load
  useEffect(() => {
    const loadWishlistCount = () => {
      const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
      setWishlistCount(wishlist.length);
    };

    loadWishlistCount();
    window.addEventListener("storage", loadWishlistCount);
    
    const interval = setInterval(loadWishlistCount, 2000);

    return () => {
      window.removeEventListener("storage", loadWishlistCount);
      clearInterval(interval);
    };
  }, []);

  // Trending products
  const trendingProducts = useMemo(
    () => products.filter((p) => (p.rating || 0) >= 4.5).slice(0, 5),
    [products]
  );

  // Search results
  const searchResults = useMemo(
    () =>
      searchQuery.trim()
        ? products
            .filter(
              (p) =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.category.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .slice(0, 6)
        : [],
    [searchQuery, products]
  );

  // Close search outside click
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

  // Close menu/search on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  }, [pathname]);

  // Lock scroll on menu open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMenuOpen]);

  // Logout handler
  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to logout?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#0F3D39",
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

  // Search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  // Product click
  const handleResultClick = (productId: string | undefined) => {
    if (productId && productId !== "undefined") {
      router.push(`/product/${productId}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  // Active route
  const isActive = (href: string) => (href === "/" ? pathname === href : pathname.startsWith(href));

  // User name
  const getUserName = () => {
    if ((user as any)?.displayName) return (user as any).displayName.split(" ")[0];
    return user?.email?.split("@")[0] || "User";
  };

  return (
    <>
      {/* Announcement Bar */}
      {showAnnouncement && (
        <div className={`relative bg-[#0F3D39] text-[#E5D3B3] overflow-hidden ${inter.variable}`}>
          <div className="flex items-center justify-center px-10 py-2">
            <div className="overflow-hidden flex-1 max-w-3xl mx-auto">
              <div className="marquee">
                <div className="marquee-track">
                  <span className="marquee-item">
                    🚀 Free Delivery on orders above ৳999 &nbsp;·&nbsp; 💳 Cash on Delivery Available &nbsp;·&nbsp; ✨ New Arrivals Every Week &nbsp;·&nbsp; 🎁 Exclusive Deals for Members &nbsp;·&nbsp; 📦 7-Day Easy Returns
                  </span>
                  <span className="marquee-item">
                    🚀 Free Delivery on orders above ৳999 &nbsp;·&nbsp; 💳 Cash on Delivery Available &nbsp;·&nbsp; ✨ New Arrivals Every Week &nbsp;·&nbsp; 🎁 Exclusive Deals for Members &nbsp;·&nbsp; 📦 7-Day Easy Returns
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowAnnouncement(false)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-[#E5D3B3]/80 hover:text-[#E5D3B3] transition rounded-full hover:bg-white/10"
              aria-label="Close announcement"
            >
              <FiX size={12} />
            </button>
          </div>
          <style>{`
            .marquee { position: relative; width: 100%; overflow: hidden; }
            .marquee-track { display: inline-flex; gap: 2.25rem; align-items: center; white-space: nowrap; will-change: transform; animation: marquee 18s linear infinite; min-width: max-content; }
            .marquee-item { display: inline-block; color: #E5D3B3; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.01em; font-family: 'Inter', sans-serif !important; }
            @keyframes marquee { 0% { transform: translateX(0%); } 100% { transform: translateX(-50%); } }
            @media (max-width: 420px) { .marquee-track { animation-duration: 22s; } .marquee-item { font-size: 0.72rem; } }
          `}</style>
        </div>
      )}

      {/* Main Header - Inter Font ব্যবহার করা হয়েছে */}
      <header
        className={`bg-[#FDF6EE] border-b border-[#E5D3B3] sticky top-0 z-50 transition-all duration-300 font-sans ${inter.variable} ${
          isScrolled ? "shadow-[0_4px_20px_rgba(0,0,0,0.1)]" : ""
        }`}
        style={{ fontFamily: "'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" }}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[60px] gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0 group">
              <div className="relative w-22 h-22 rounded-full flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105">
                <img src={LOGO_URL} alt="Sareng Furniture" width={40} height={40} className="w-16 h-17 object-contain" />
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-xl font-bold tracking-wider leading-none text-[#0B2523] uppercase font-sans" style={{ fontFamily: "'Inter', sans-serif" }}>Sareng</span>
                <span className="text-[9px] uppercase tracking-widest text-[#0F3D39] font-sans" style={{ fontFamily: "'Inter', sans-serif" }}>Furniture</span>
              </div>
            </Link>

            {/* Desktop Search */}
            <div className="hidden md:block flex-1 max-w-xl relative" ref={searchRef}>
              <form onSubmit={handleSearch} className="w-full">
                <div className="relative flex items-center bg-[#F4F5F7] border border-[#E5D3B3] rounded overflow-hidden shadow-sm h-9">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchOpen(true)}
                    placeholder="Search furniture..."
                    className="w-full bg-transparent pl-3 pr-9 py-1.5 text-sm text-[#0B2523] placeholder:text-[#0B2523]/50 focus:outline-none"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  />
                  {searchQuery && (
                    <button type="button" onClick={() => setSearchQuery("")} className="absolute right-9 top-1/2 -translate-y-1/2 text-[#0B2523]/50 hover:text-[#0B2523] transition p-1">
                      <FiXCircle size={14} />
                    </button>
                  )}
                  <button type="submit" className="absolute right-0 top-0 h-full w-9 flex items-center justify-center bg-[#0F3D39] text-[#E5D3B3] hover:bg-[#0B2523] transition-colors" aria-label="Search">
                    <FiSearch size={15} />
                  </button>
                </div>
              </form>

              {/* Desktop Search Dropdown */}
              {isSearchOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#ECECEC] rounded-md shadow-xl z-50 overflow-hidden text-[#0B2523]">
                  <div className="px-4 pt-3 pb-2 border-b border-[#ECECEC]">
                    <p className="text-[11px] font-semibold text-[#0B2523]/60 uppercase tracking-wider">
                      {searchQuery ? "Search Results" : "Trending Products"}
                    </p>
                  </div>
                  <div className="max-h-72 overflow-y-auto py-1">
                    {(searchQuery ? searchResults : trendingProducts).map((product) => (
                      <SearchItem key={product._id} product={product} onClick={() => handleResultClick(product._id)} />
                    ))}
                    {searchQuery && searchResults.length === 0 && (
                      <div className="px-4 py-8 text-center">
                        <div className="w-12 h-12 bg-[#F4F5F7] rounded-full flex items-center justify-center mx-auto mb-3">
                          <FiSearch size={20} className="text-[#0B2523]/50" />
                        </div>
                        <p className="text-sm font-medium text-[#0B2523]">No products found</p>
                        <p className="text-xs text-[#0B2523]/50 mt-1">Try a different search term</p>
                      </div>
                    )}
                  </div>
                  {searchQuery && searchResults.length > 0 && (
                    <div className="border-t border-[#ECECEC] px-4 py-2.5">
                      <button onClick={handleSearch as any} className="text-xs text-[#0F3D39] font-semibold hover:text-[#0B2523] transition flex items-center gap-1">
                        See all results for "{searchQuery}" <FiChevronRight size={12} />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <button
                className="md:hidden w-9 h-9 flex items-center justify-center text-[#0B2523] hover:text-[#0F3D39] transition"
                onClick={() => { setIsSearchOpen(!isSearchOpen); setTimeout(() => mobileInputRef.current?.focus(), 100); }}
                aria-label="Search"
              >
                <FiSearch size={20} />
              </button>

              {/* Wishlist with Count */}
              <Link href="/wishlist" className="hidden lg:flex relative w-9 h-9 items-center justify-center text-[#0B2523] hover:text-[#0F3D39] transition" aria-label="Wishlist">
                <FiHeart size={20} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#0F3D39] text-[#E5D3B3] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {!loading && (
                <div className="hidden lg:flex">
                  {user ? (
                    <div className="flex items-center gap-1.5">
                     {userRole === "admin" || userRole === "super_admin" ? (
                        <Link href="/dashboard" className="flex items-center gap-1.5 bg-[#0F3D39] hover:bg-[#0F3D39]/80 px-3 py-1.5 rounded text-[#E5D3B3] transition">
                          <FiLayout size={15} />
                          <span className="text-sm font-semibold">Dashboard</span>
                        </Link>
                      ) : (
                        <Link href="/profile" className="flex items-center gap-2 bg-[#0F3D39] hover:bg-[#0F3D39]/80 px-2.5 py-1.5 rounded transition">
                          <UserAvatar photoURL={user.photoURL} name={(user as any)?.displayName || user.name} />
                          <span className="text-sm font-semibold text-[#E5D3B3] max-w-[80px] truncate">{getUserName()}</span>
                        </Link>
                      )}
                      <button onClick={handleLogout} className="w-9 h-9 flex items-center justify-center text-[#0B2523] hover:text-red-500 transition" aria-label="Logout">
                        <FiLogOut size={20} />
                      </button>
                    </div>
                  ) : (
                    <Link href="/login" className="flex items-center gap-1.5 bg-[#0F3D39] hover:bg-[#0F3D39]/80 text-[#E5D3B3] px-4 py-2 rounded font-semibold text-sm transition-all border border-[#E5D3B3]/20">
                      <FiUser size={14} />
                      <span>Login</span>
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center justify-between py-2.5 border-t border-[#E5D3B3]">
            <nav className="flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative px-4 py-1.5 rounded-sm text-xs font-medium transition-colors ${
                    isActive(link.href) ? "bg-[#0F3D39] text-[#E5D3B3] font-bold" : "text-[#0B2523] hover:text-[#0F3D39] hover:bg-[#E5D3B3]"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-1.5 text-[#0B2523]/80 text-xs">
              <FiHeadphones size={13} className="text-[#0F3D39]" />
              <span>Need Help? +880 1806-971390</span>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Search Bar */}
      {isSearchOpen && (
        <div className="md:hidden pb-3 border-t border-[#E5D3B3] pt-3 bg-[#FDF6EE] relative z-40">
          <form onSubmit={handleSearch} className="relative max-w-[1400px] mx-auto px-4 sm:px-6">
            <div className="flex items-center bg-[#F4F5F7] border border-[#E5D3B3] rounded overflow-hidden shadow-sm h-9">
              <input
                ref={mobileInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search furniture..."
                className="w-full bg-transparent pl-3 pr-9 py-1.5 text-sm text-[#0B2523] placeholder:text-[#0B2523]/50 focus:outline-none"
                style={{ fontFamily: "'Inter', sans-serif" }}
              />
              {searchQuery && (
                <button type="button" onClick={() => setSearchQuery("")} className="absolute right-9 top-1/2 -translate-y-1/2 text-[#0B2523]/50 hover:text-[#0B2523] transition p-1">
                  <FiXCircle size={14} />
                </button>
              )}
              <button type="submit" className="absolute right-4 top-0 h-9 w-9 flex items-center justify-center bg-[#0F3D39] text-[#E5D3B3] hover:bg-[#0B2523] transition-colors rounded-r">
                <FiSearch size={15} />
              </button>
            </div>
          </form>
          {(searchResults.length > 0 || (!searchQuery && trendingProducts.length > 0)) && (
            <div className="mt-2 bg-white border border-[#ECECEC] rounded-md shadow-lg overflow-hidden mx-4">
              <div className="max-h-64 overflow-y-auto py-1">
                {(searchQuery ? searchResults : trendingProducts).map((product) => (
                  <SearchItem key={product._id} product={product} onClick={() => handleResultClick(product._id)} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-[100] lg:hidden">
        <div className="w-full bg-[#FDF6EE] border-t border-[#E5D3B3] shadow-[0_-5px_25px_rgba(0,0,0,0.1)]">
          <div className="h-[70px] flex items-center justify-around px-1 sm:px-4 relative" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
            {[
              { href: "/", icon: FiHome, label: "Home" },
              { href: "/shop", icon: FiShoppingBag, label: "Shop" },
            ].map((item) => (
              <Link key={item.href} href={item.href} className={`relative flex flex-col items-center justify-center w-[20%] h-full gap-1 transition-all duration-200 ${isActive(item.href) ? "text-[#0F3D39]" : "text-[#0B2523]/50"}`}>
                <item.icon size={21} strokeWidth={isActive(item.href) ? 2.5 : 2} />
                <span className="text-[10px] font-semibold">{item.label}</span>
                {isActive(item.href) && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[3px] bg-[#0F3D39] rounded-b-full" />}
              </Link>
            ))}

            <div className="relative w-[20%] h-full flex items-center justify-center">
              <button onClick={() => setIsMenuOpen(true)} className="absolute -top-[22px] w-[58px] h-[58px] rounded-full bg-[#0F3D39] text-[#E5D3B3] flex items-center justify-center shadow-[0_6px_20px_rgba(15,61,57,0.5)] border-[5px] border-[#FDF6EE] active:scale-95 hover:bg-[#0B2523] transition-all duration-200" aria-label="Open menu">
                {isMenuOpen ? <FiX size={25} /> : <img src={LOGO_URL} alt="Sareng Furniture" width={34} height={34} className="w-8 h-8 object-contain" />}
              </button>
              <span className="absolute bottom-[7px] text-[9px] font-bold text-[#0B2523] whitespace-nowrap">Menu</span>
            </div>

            {/* Wishlist with Count */}
            <Link href="/wishlist" className={`relative flex flex-col items-center justify-center w-[20%] h-full gap-1 transition-all duration-200 ${isActive("/wishlist") ? "text-[#0F3D39]" : "text-[#0B2523]/50"}`}>
              <div className="relative">
                <FiHeart size={21} strokeWidth={isActive("/wishlist") ? 2.5 : 2} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#0F3D39] text-[#E5D3B3] text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-semibold">Wishlist</span>
              {isActive("/wishlist") && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[3px] bg-[#0F3D39] rounded-b-full" />}
            </Link>

            {/* Search */}
            <button
              onClick={() => { setIsSearchOpen(!isSearchOpen); setTimeout(() => mobileInputRef.current?.focus(), 100); }}
              className={`relative flex flex-col items-center justify-center w-[20%] h-full gap-1 transition-all duration-200 ${isSearchOpen ? "text-[#0F3D39]" : "text-[#0B2523]/50"}`}
              aria-label="Search"
            >
              <FiSearch size={21} strokeWidth={isSearchOpen ? 2.5 : 2} />
              <span className="text-[10px] font-semibold">Search</span>
              {isSearchOpen && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[3px] bg-[#0F3D39] rounded-b-full" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[200] lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
          <div className="absolute top-0 left-0 h-full w-72 bg-[#FDF6EE] text-[#0B2523] shadow-2xl flex flex-col overflow-y-auto border-r border-[#E5D3B3]">
            <div className="flex justify-between items-center px-5 py-4 border-b border-[#E5D3B3]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#F4F5F7] flex items-center justify-center">
                  <img src={LOGO_URL} alt="Sareng Furniture" width={25} height={25} className="w-6 h-6 object-contain" />
                </div>
                <span className="font-bold text-lg text-[#0B2523]">Menu</span>
              </div>
              <button onClick={() => setIsMenuOpen(false)} className="p-1 hover:bg-[#E5D3B3] rounded transition text-[#0B2523]" aria-label="Close menu">
                <FiX size={24} />
              </button>
            </div>

            {!loading && user && (
              <div className="mx-4 mt-4 p-3 bg-[#0F3D39] border border-[#E5D3B3]/20 rounded-xl flex items-center gap-3">
                <UserAvatar photoURL={user.photoURL} name={(user as any)?.displayName || user.name} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#E5D3B3] truncate">{getUserName()}</p>
                  <p className="text-[11px] text-[#E5D3B3]/70 truncate">{user.email}</p>
                </div>
              </div>
            )}

            <nav className="flex-1 px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive(link.href) ? "bg-[#0F3D39] text-[#E5D3B3] font-bold" : "text-[#0B2523] hover:bg-[#E5D3B3] hover:text-[#0F3D39]"
                  }`}
                >
                  {link.icon && <link.icon size={16} />}
                  {link.name}
                  {isActive(link.href) && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#E5D3B3]" />}
                </Link>
              ))}
            </nav>

            <div className="px-4 pb-6 pt-2 border-t border-[#E5D3B3] space-y-2">
              {!loading && !user ? (
                <Link href="/login" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-center gap-2 w-full bg-[#0F3D39] text-[#E5D3B3] py-2.5 rounded-xl font-bold text-sm shadow-sm border border-[#E5D3B3]/20">
                  <FiUser size={14} /> Login / Register
                </Link>
              ) : (
                <button onClick={handleLogout} className="flex items-center justify-center gap-2 w-full border border-red-400/30 text-red-400 hover:bg-red-500/10 py-2.5 rounded-xl font-semibold text-sm transition">
                  <FiLogOut size={14} /> Logout
                </button>
              )}
              <div className="flex items-center gap-2 text-[#0B2523]/80 mt-3 px-1">
                <FiHeadphones size={16} className="text-[#0F3D39]" />
                <span className="text-sm">Need Help? +123 456 7890</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Space */}
      <div className="h-[70px] lg:hidden" />
    </>
  );
}