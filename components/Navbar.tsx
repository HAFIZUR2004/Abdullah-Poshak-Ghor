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

// ─── Constants ─────────────────────────────────────────────────────────────────
const navLinks = [
  { name: "Home", href: "/", icon: FiHome },
  { name: "Shop", href: "/shop", icon: FiShoppingBag },
  { name: "About Us", href: "/about" },
  { name: "Collection", href: "/collection" },
  { name: "Blog", href: "/blog" },
  { name: "Contact Us", href: "/contact", icon: FiMessageSquare },
  { name: "Track Order", href: "/track-order", icon: FiTruck },
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
        className="w-7 h-7 rounded-full object-cover ring-2 ring-[#0D9488]/30"
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <div className="w-7 h-7 bg-gradient-to-br from-[#0D9488] to-[#0B7A72] rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm">
      {name?.charAt(0).toUpperCase() || "U"}
    </div>
  );
};

// ─── Search Product Item (reused in desktop & mobile) ──────────────────────────
const SearchItem = ({ product, onClick }: { product: Product; onClick: () => void }) => (
  <button
    onClick={onClick}
    className="w-full text-left px-4 py-2.5 hover:bg-[#F9F6F0] flex items-center gap-3 transition-colors group"
  >
    <div className="w-10 h-10 bg-[#F0EBE3] rounded overflow-hidden shrink-0">
      <img
        src={getProductImage(product)}
        alt={product.name}
        className="w-full h-full object-cover"
        onError={(e) => ((e.target as HTMLImageElement).src = "/placeholder.jpg")}
      />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-[#1E293B] truncate group-hover:text-[#0D9488] transition-colors">
        {product.name}
      </p>
      <p className="text-xs text-[#0D9488] font-bold">৳{product.price}</p>
    </div>
    <FiChevronRight size={14} className="text-[#94A3B8] group-hover:text-[#0D9488] transition-colors shrink-0" />
  </button>
);

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

  // Scroll effect
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
      confirmButtonColor: "#0D9488",
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
        <div className="relative bg-[#0D9488] overflow-hidden">
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
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-white/80 hover:text-white transition rounded-full hover:bg-white/20"
              aria-label="Close announcement"
            >
              <FiX size={12} />
            </button>
          </div>
          <style>{`
            .marquee { position: relative; width: 100%; overflow: hidden; }
            .marquee-track { display: inline-flex; gap: 2.25rem; align-items: center; white-space: nowrap; will-change: transform; animation: marquee 18s linear infinite; min-width: max-content; }
            .marquee-item { display: inline-block; color: white; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.01em; }
            @keyframes marquee { 0% { transform: translateX(0%); } 100% { transform: translateX(-50%); } }
            @media (max-width: 420px) { .marquee-track { animation-duration: 22s; } .marquee-item { font-size: 0.72rem; } }
          `}</style>
        </div>
      )}

      {/* Main Header */}
      <header
        className={`bg-[#F9F6F0] border-b border-[#E2DCD3] sticky top-0 z-50 transition-all duration-300 shadow-md font-sans ${
          isScrolled ? "shadow-[0_2px_20px_rgba(0,0,0,0.08)]" : ""
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[60px] gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0 group">
              <div className="relative w-12 h-12 bg-white rounded-full p-1 flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105">
                <Image src="/images/logo.webp" alt="Sareng Furniture" width={40} height={40} className="w-10 h-10 object-contain" priority />
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-xl font-bold tracking-wider leading-none text-[#1E293B] uppercase font-sans">Sareng</span>
                <span className="text-[9px] uppercase tracking-widest text-[#0D9488] font-sans">Furniture</span>
              </div>
            </Link>

            {/* Desktop Search */}
            <div className="hidden md:block flex-1 max-w-xl relative" ref={searchRef}>
              <form onSubmit={handleSearch} className="w-full">
                <div className="relative flex items-center bg-white border border-[#E2DCD3] rounded overflow-hidden shadow-sm h-9">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchOpen(true)}
                    placeholder="Search furniture..."
                    className="w-full bg-transparent pl-3 pr-9 py-1.5 text-sm text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none"
                  />
                  {searchQuery && (
                    <button type="button" onClick={() => setSearchQuery("")} className="absolute right-9 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#1E293B] transition p-1">
                      <FiXCircle size={14} />
                    </button>
                  )}
                  <button type="submit" className="absolute right-0 top-0 h-full w-9 flex items-center justify-center bg-[#0D9488] text-white hover:bg-[#0B7A72] transition-colors" aria-label="Search">
                    <FiSearch size={15} />
                  </button>
                </div>
              </form>

              {/* Desktop Search Dropdown */}
              {isSearchOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#E2DCD3] rounded-md shadow-xl z-50 overflow-hidden text-[#1E293B]">
                  <div className="px-4 pt-3 pb-2 border-b border-[#EEE8E0]">
                    <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
                      {searchQuery ? "Search Results" : "Trending Products"}
                    </p>
                  </div>
                  <div className="max-h-72 overflow-y-auto py-1">
                    {(searchQuery ? searchResults : trendingProducts).map((product) => (
                      <SearchItem key={product._id} product={product} onClick={() => handleResultClick(product._id)} />
                    ))}
                    {searchQuery && searchResults.length === 0 && (
                      <div className="px-4 py-8 text-center">
                        <div className="w-12 h-12 bg-[#F9F6F0] rounded-full flex items-center justify-center mx-auto mb-3">
                          <FiSearch size={20} className="text-[#94A3B8]" />
                        </div>
                        <p className="text-sm font-medium text-[#1E293B]">No products found</p>
                        <p className="text-xs text-[#94A3B8] mt-1">Try a different search term</p>
                      </div>
                    )}
                  </div>
                  {searchQuery && searchResults.length > 0 && (
                    <div className="border-t border-[#EEE8E0] px-4 py-2.5">
                      <button onClick={handleSearch as any} className="text-xs text-[#0D9488] font-semibold hover:text-[#0B7A72] transition flex items-center gap-1">
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
                className="md:hidden w-9 h-9 flex items-center justify-center text-[#1E293B] hover:text-[#0D9488] transition"
                onClick={() => { setIsSearchOpen(!isSearchOpen); setTimeout(() => mobileInputRef.current?.focus(), 100); }}
                aria-label="Search"
              >
                <FiSearch size={20} />
              </button>

              <Link href="/wishlist" className="hidden lg:flex w-9 h-9 items-center justify-center text-[#1E293B] hover:text-[#0D9488] transition" aria-label="Wishlist">
                <FiHeart size={20} />
              </Link>

              {/* Cart Icon Removed from Desktop */}

              {!loading && (
                <div className="hidden lg:flex">
                  {user ? (
                    <div className="flex items-center gap-1.5">
                      {userRole === "admin" ? (
                        <Link href="/dashboard" className="flex items-center gap-1.5 bg-[#0D9488] hover:bg-[#0B7A72] px-3 py-1.5 rounded transition">
                          <FiLayout size={15} />
                          <span className="text-sm font-semibold text-white">Dashboard</span>
                        </Link>
                      ) : (
                        <Link href="/profile" className="flex items-center gap-2 bg-[#0D9488] hover:bg-[#0B7A72] px-2.5 py-1.5 rounded transition">
                          <UserAvatar photoURL={user.photoURL} name={(user as any)?.displayName || user.name} />
                          <span className="text-sm font-semibold text-white max-w-[80px] truncate">{getUserName()}</span>
                        </Link>
                      )}
                      <button onClick={handleLogout} className="w-9 h-9 flex items-center justify-center text-[#1E293B] hover:text-red-500 transition" aria-label="Logout">
                        <FiLogOut size={20} />
                      </button>
                    </div>
                  ) : (
                    <Link href="/login" className="flex items-center gap-1.5 bg-[#0D9488] hover:bg-[#0B7A72] text-white px-4 py-2 rounded font-semibold text-sm transition-all">
                      <FiUser size={14} />
                      <span>Login</span>
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center justify-between py-2.5 border-t border-[#E2DCD3]">
            <nav className="flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative px-4 py-1.5 rounded-sm text-xs font-medium transition-colors ${
                    isActive(link.href) ? "bg-[#0D9488] text-white" : "text-[#1E293B] hover:text-[#0D9488] hover:bg-[#F0EBE3]"
                  }`}
                >
                  {link.name}
                  {isActive(link.href) && link.href !== "/" && (
                    <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-white rounded-full" />
                  )}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-1.5 text-[#64748B] text-xs">
              <FiHeadphones size={13} className="text-[#0D9488]" />
              <span>Need Help? +123 456 7890</span>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Search Bar */}
      {isSearchOpen && (
        <div className="md:hidden pb-3 border-t border-[#E2DCD3] pt-3 bg-[#F9F6F0] relative z-40">
          <form onSubmit={handleSearch} className="relative max-w-[1400px] mx-auto px-4 sm:px-6">
            <div className="flex items-center bg-white border border-[#E2DCD3] rounded overflow-hidden shadow-sm h-9">
              <input
                ref={mobileInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search furniture..."
                className="w-full bg-transparent pl-3 pr-9 py-1.5 text-sm text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none"
              />
              {searchQuery && (
                <button type="button" onClick={() => setSearchQuery("")} className="absolute right-9 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#1E293B] transition p-1">
                  <FiXCircle size={14} />
                </button>
              )}
              <button type="submit" className="absolute right-4 top-0 h-9 w-9 flex items-center justify-center bg-[#0D9488] text-white hover:bg-[#0B7A72] transition-colors rounded-r">
                <FiSearch size={15} />
              </button>
            </div>
          </form>
          {(searchResults.length > 0 || (!searchQuery && trendingProducts.length > 0)) && (
            <div className="mt-2 bg-white border border-[#E2DCD3] rounded-md shadow-lg overflow-hidden mx-4">
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
        <div className="w-full bg-[#F9F6F0] border-t border-[#E2DCD3] shadow-[0_-5px_25px_rgba(0,0,0,0.06)]">
          <div className="h-[70px] flex items-center justify-around px-1 sm:px-4 relative" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
            {[
              { href: "/", icon: FiHome, label: "Home" },
              { href: "/shop", icon: FiShoppingBag, label: "Shop" },
            ].map((item) => (
              <Link key={item.href} href={item.href} className={`relative flex flex-col items-center justify-center w-[20%] h-full gap-1 transition-all duration-200 ${isActive(item.href) ? "text-[#0D9488]" : "text-[#94A3B8]"}`}>
                <item.icon size={21} strokeWidth={isActive(item.href) ? 2.5 : 2} />
                <span className="text-[10px] font-semibold">{item.label}</span>
                {isActive(item.href) && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[3px] bg-[#0D9488] rounded-b-full" />}
              </Link>
            ))}

            <div className="relative w-[20%] h-full flex items-center justify-center">
              <button onClick={() => setIsMenuOpen(true)} className="absolute -top-[22px] w-[58px] h-[58px] rounded-full bg-[#0D9488] text-white flex items-center justify-center shadow-[0_6px_20px_rgba(13,148,136,0.45)] border-[5px] border-[#F9F6F0] active:scale-95 hover:bg-[#0B7A72] transition-all duration-200" aria-label="Open menu">
                {isMenuOpen ? <FiX size={25} /> : <Image src="/images/logo.webp" alt="Sareng Furniture" width={34} height={34} className="w-8 h-8 object-contain" />}
              </button>
              <span className="absolute bottom-[7px] text-[9px] font-bold text-[#0D9488] whitespace-nowrap">Menu</span>
            </div>

            {/* Wishlist */}
            <Link href="/wishlist" className={`relative flex flex-col items-center justify-center w-[20%] h-full gap-1 transition-all duration-200 ${isActive("/wishlist") ? "text-[#0D9488]" : "text-[#94A3B8]"}`}>
              <FiHeart size={21} strokeWidth={isActive("/wishlist") ? 2.5 : 2} />
              <span className="text-[10px] font-semibold">Wishlist</span>
              {isActive("/wishlist") && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[3px] bg-[#0D9488] rounded-b-full" />}
            </Link>

            {/* Search (Cart এর জায়গায়) */}
            <button
              onClick={() => { setIsSearchOpen(!isSearchOpen); setTimeout(() => mobileInputRef.current?.focus(), 100); }}
              className={`relative flex flex-col items-center justify-center w-[20%] h-full gap-1 transition-all duration-200 ${isSearchOpen ? "text-[#0D9488]" : "text-[#94A3B8]"}`}
              aria-label="Search"
            >
              <FiSearch size={21} strokeWidth={isSearchOpen ? 2.5 : 2} />
              <span className="text-[10px] font-semibold">Search</span>
              {isSearchOpen && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[3px] bg-[#0D9488] rounded-b-full" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[200] lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
          <div className="absolute top-0 left-0 h-full w-72 bg-[#F9F6F0] text-[#1E293B] shadow-2xl flex flex-col overflow-y-auto">
            <div className="flex justify-between items-center px-5 py-4 border-b border-[#E2DCD3]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                  <Image src="/images/logo.webp" alt="Sareng Furniture" width={25} height={25} className="w-6 h-6 object-contain" />
                </div>
                <span className="font-bold text-lg">Menu</span>
              </div>
              <button onClick={() => setIsMenuOpen(false)} className="p-1 hover:bg-[#F0EBE3] rounded transition" aria-label="Close menu">
                <FiX size={24} />
              </button>
            </div>

            {!loading && user && (
              <div className="mx-4 mt-4 p-3 bg-white border border-[#E2DCD3] rounded-xl flex items-center gap-3">
                <UserAvatar photoURL={user.photoURL} name={(user as any)?.displayName || user.name} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#1E293B] truncate">{getUserName()}</p>
                  <p className="text-[11px] text-[#64748B] truncate">{user.email}</p>
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
                    isActive(link.href) ? "bg-[#0D9488] text-white" : "text-[#1E293B] hover:bg-[#F0EBE3] hover:text-[#0D9488]"
                  }`}
                >
                  {link.icon && <link.icon size={16} />}
                  {link.name}
                  {isActive(link.href) && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />}
                </Link>
              ))}
            </nav>

            <div className="px-4 pb-6 pt-2 border-t border-[#E2DCD3] space-y-2">
              {!loading && !user ? (
                <Link href="/login" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-center gap-2 w-full bg-[#0D9488] text-white py-2.5 rounded-xl font-bold text-sm shadow-sm">
                  <FiUser size={14} /> Login / Register
                </Link>
              ) : (
                <button onClick={handleLogout} className="flex items-center justify-center gap-2 w-full border border-red-400/30 text-red-500 hover:bg-red-500/10 py-2.5 rounded-xl font-semibold text-sm transition">
                  <FiLogOut size={14} /> Logout
                </button>
              )}
              <div className="flex items-center gap-2 text-[#64748B] mt-3 px-1">
                <FiHeadphones size={16} className="text-[#0D9488]" />
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