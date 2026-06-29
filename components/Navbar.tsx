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
}

const navLinks: NavLink[] = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "About Us", href: "/about" },
  { name: "Collection", href: "/collection" },
  { name: "Blog", href: "/blog" },
  { name: "Contact Us", href: "/contact" },
];

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
  const pathname = usePathname();
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  const { user, loading, logout } = useAuth();
  const { products } = useProducts();

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

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to logout?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#f97316",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout",
    });

    if (result.isConfirmed) {
      await logout();
      setIsMenuOpen(false);
      router.push("/");
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

  return (
    <>
      {/* ── Main Header (MATCHING THE IMAGE) ────────────────── */}
      <header className="bg-[#3e3f33] text-white sticky top-0 z-50 shadow-md font-sans">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Top Row: Logo, Search, Icons */}
          <div className="flex items-center justify-between h-20 gap-4">
            
            {/* Logo */}
            <Link href="/" className="shrink-0">
              <div className="relative">
                {/* Make sure your logo image is transparent PNG */}
                <Image
                  src="/images/image.png" 
                  alt="Sea Commercial"
                  width={60}
                  height={60}
                  className="w-14 h-14 object-contain"
                  priority
                />
              </div>
            </Link>

            {/* Search Bar (Desktop) */}
            <div
              className="hidden md:block flex-1 max-w-xl relative"
              ref={searchRef}
            >
              <form onSubmit={handleSearch} className="w-full">
                <div className="relative flex items-center bg-white rounded-md overflow-hidden shadow-sm h-11">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchOpen(true)}
                    placeholder="Search furniture..."
                    className="w-full bg-transparent pl-4 pr-10 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="absolute right-0 top-0 h-full w-10 flex items-center justify-center bg-white text-gray-400 hover:text-orange-500 transition-colors"
                    aria-label="Search"
                  >
                    <FiSearch size={18} />
                  </button>
                </div>
              </form>

              {/* Search Dropdown */}
              {isSearchOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-md shadow-xl z-50 overflow-hidden text-gray-800">
                  <div className="max-h-72 overflow-y-auto py-1">
                    {searchResults.length > 0 ? (
                      searchResults.map((product) => (
                        <button
                          key={product._id}
                          onClick={() => handleResultClick(product._id)}
                          className="w-full text-left px-4 py-2 hover:bg-orange-50 flex items-center gap-3 transition-colors"
                        >
                          <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden shrink-0">
                            <img
                              src={getProductImage(product)}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">
                              {product.name}
                            </p>
                            <p className="text-xs text-orange-500 font-bold">
                              ৳{product.price}
                            </p>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-6 text-center text-sm text-gray-500">
                        No products found
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <button className="md:hidden w-9 h-9 flex items-center justify-center text-white/80 hover:text-white transition">
                <FiSearch size={20} />
              </button>
              
              <Link href="/wishlist" className="w-9 h-9 flex items-center justify-center text-white/80 hover:text-white transition">
                <FiHeart size={20} />
              </Link>

              <Link href="/cart" className="w-9 h-9 flex items-center justify-center text-white/80 hover:text-white transition">
                <CartIcon />
              </Link>

              {/* User Icon */}
              {!loading && (
                <>
                  {user ? (
                    <div className="flex items-center gap-2">
                      <Link href="/profile" className="w-9 h-9 flex items-center justify-center text-white/80 hover:text-white transition">
                         <FiUser size={20} />
                      </Link>
                      <button onClick={handleLogout} className="w-9 h-9 flex items-center justify-center text-white/80 hover:text-red-400 transition">
                        <FiLogOut size={20} />
                      </button>
                    </div>
                  ) : (
                    <Link href="/login" className="w-9 h-9 flex items-center justify-center text-white/80 hover:text-white transition">
                      <FiUser size={20} />
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

          {/* Bottom Row: Nav Links & Help (MATCHING IMAGE) */}
          <div className="hidden lg:flex items-center justify-between py-3 border-t border-white/10">
            
            <nav className="flex items-center gap-6">
              {/* Home is orange box */}
              <Link
                href="/"
                className={`px-5 py-1.5 rounded-sm text-sm font-medium transition-colors ${
                  isActive("/") 
                    ? "bg-[#e18d46] text-white" 
                    : "text-white/80 hover:text-white"
                }`}
              >
                Home
              </Link>

              {navLinks.slice(1).map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? "text-white border-b-2 border-[#e18d46] pb-0.5"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Help Line Info */}
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <FiHeadphones size={16} className="text-[#e18d46]" />
              <span>Need Help? +123 456 7890</span>
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile Menu Drawer ───────────────────────────────── */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setIsMenuOpen(false)} />
          <div className="absolute top-0 left-0 h-full w-72 bg-[#3e3f33] text-white shadow-2xl flex flex-col p-5 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <span className="font-bold text-lg">Menu</span>
              <button onClick={() => setIsMenuOpen(false)} className="p-1">
                <FiX size={24} />
              </button>
            </div>
            
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-3 py-2 rounded-sm text-base font-medium ${
                    isActive(link.href) ? "bg-[#e18d46] text-white" : "text-white/80"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
            
            <div className="mt-8 pt-6 border-t border-white/10 flex flex-col gap-3">
              {!loading && !user && (
                 <Link href="/login" onClick={() => setIsMenuOpen(false)} className="bg-[#e18d46] text-center py-2 rounded-sm font-medium">
                   Login / Register
                 </Link>
              )}
              <div className="flex items-center gap-2 text-white/80 mt-2">
                <FiHeadphones size={16} className="text-[#e18d46]" />
                <span className="text-sm">Need Help? +123 456 7890</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}