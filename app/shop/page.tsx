"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  FiSearch, 
  FiSliders, 
  FiHeart, 
  FiStar, 
  FiChevronDown,
  FiCheck,
  FiBox
} from "react-icons/fi";
import { Product } from "@/types";
import PremiumLoader from "@/components/PremiumLoader";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const categoryIcons: Record<string, React.ElementType> = {
  "Sofa & Sectionals": FiBox,
  "Accent Chairs & Ottomans": FiBox,
  "Chair": FiBox,
  "Table": FiBox,
  "Sofa": FiBox,
  "Storage": FiBox,
  "Bed": FiBox,
};

const getProductImage = (product: Product): string =>
  product.images?.[0] || product.image || "/placeholder.jpg";

// ─── Discount Calculation Helper ────────────────────────────────────────────────
const getDiscountInfo = (product: Product) => {
  if (product.originalPrice && product.originalPrice > product.price) {
    const discountPercent = Math.round(
      ((product.originalPrice - product.price) / product.originalPrice) * 100
    );
    return {
      hasDiscount: true,
      discountPercent,
      originalPrice: product.originalPrice,
    };
  }

  if (product.discount && product.discount > 0) {
    const discountedPrice = product.price;
    const originalPrice = Math.round(
      discountedPrice / (1 - product.discount / 100)
    );
    return {
      hasDiscount: true,
      discountPercent: product.discount,
      originalPrice,
    };
  }

  return {
    hasDiscount: false,
    discountPercent: 0,
    originalPrice: product.price,
  };
};

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All Furniture");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();

        let productArray: Product[] = [];

        if (Array.isArray(data)) {
          productArray = data;
        } else if (data?.data && Array.isArray(data.data)) {
          productArray = data.data;
        } else if (data?.success === true && Array.isArray(data.data)) {
          productArray = data.data;
        } else {
          setProducts([]);
          setIsLoading(false);
          return;
        }

        const activeProducts = productArray.filter(
          (p: Product) => p.status === "Active"
        );
        setProducts(activeProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = [
    "All Furniture",
    ...Array.from(new Set(products.map((p) => p.category).filter(Boolean))),
  ];

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "All Furniture" || product.category === selectedCategory;
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "low-to-high") return a.price - b.price;
    if (sortBy === "high-to-low") return b.price - a.price;
    if (sortBy === "newest")
      return (
        new Date(b.createdAt || Date.now()).getTime() -
        new Date(a.createdAt || Date.now()).getTime()
      );
    if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
    return 0;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F9F6F0]">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <PremiumLoader />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F6F0] text-[#1E293B] pb-16">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* SEARCH & MOBILE FILTER BAR */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8 bg-white p-4 rounded-xl shadow-sm border border-[#E2DCD3] lg:mt-5">
          <div className="relative w-full md:w-96">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] size-5" />
            <input
              type="text"
              placeholder="Search sofa, bed, table..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-[#F9F6F0] border border-[#E2DCD3] rounded-lg text-sm text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-[#0D9488] transition"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <button
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="md:hidden flex items-center gap-2 px-4 py-2.5 border border-[#E2DCD3] rounded-lg text-sm font-medium bg-[#F9F6F0] hover:bg-[#F0EBE3] transition"
            >
              <FiSliders className="size-4" /> Filter
            </button>

            <div className="flex items-center gap-2 w-auto">
              <span className="text-xs font-medium text-[#64748B] hidden sm:inline">Sort by:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-[#F9F6F0] border border-[#E2DCD3] rounded-lg pl-3 pr-8 py-2.5 text-sm font-medium text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0D9488] cursor-pointer"
                >
                  <option value="featured">Featured</option>
                  <option value="low-to-high">Price: Low to High</option>
                  <option value="high-to-low">Price: High to Low</option>
                  <option value="newest">Newest Arrivals</option>
                </select>
                <FiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none size-4" />
              </div>
            </div>
          </div>
        </div>

        {/* MOBILE FILTER DRAWER */}
        {isMobileFilterOpen && (
          <div className="md:hidden bg-white p-5 rounded-xl border border-[#E2DCD3] shadow-sm mb-6">
            <h3 className="text-base font-bold text-[#1E293B] border-b border-[#EEE8E0] pb-3 mb-4">
              Categories
            </h3>
            <ul className="space-y-1.5">
              {categories.map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => {
                      setSelectedCategory(cat);
                      setIsMobileFilterOpen(false);
                    }}
                    className={`w-full flex items-center justify-between text-left px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                      selectedCategory === cat
                        ? "bg-[#0D9488] text-white shadow-sm"
                        : "text-[#64748B] hover:bg-[#F9F6F0]"
                    }`}
                  >
                    <span>{cat}</span>
                    {selectedCategory === cat && <FiCheck className="size-4" />}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* MAIN LAYOUT */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* DESKTOP SIDEBAR */}
          <aside className="hidden md:block md:col-span-1 space-y-6">
            <div className="bg-white p-5 rounded-xl border border-[#E2DCD3] shadow-sm sticky top-24">
              <h3 className="text-base font-bold text-[#1E293B] border-b border-[#EEE8E0] pb-3 mb-4">
                Categories
              </h3>
              <ul className="space-y-1.5">
                {categories.map((cat) => (
                  <li key={cat}>
                    <button
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full flex items-center justify-between text-left px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                        selectedCategory === cat
                          ? "bg-[#0D9488] text-white shadow-sm"
                          : "text-[#64748B] hover:bg-[#F9F6F0]"
                      }`}
                    >
                      <span>{cat}</span>
                      {selectedCategory === cat && <FiCheck className="size-4" />}
                    </button>
                  </li>
                ))}
              </ul>

              {/* Price Filter Widget */}
              <div className="mt-8 border-t border-[#EEE8E0] pt-5">
                <h3 className="text-base font-bold text-[#1E293B] mb-4">Price Range</h3>
                <div className="space-y-3">
                  <input
                    type="range"
                    min="5000"
                    max="100000"
                    step="2000"
                    className="w-full accent-[#0D9488] cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-[#64748B] font-medium">
                    <span>৳ 5,000</span>
                    <span>৳ 1,00,000</span>
                  </div>
                </div>
              </div>

              {/* Availability Filter */}
              <div className="mt-6 border-t border-[#EEE8E0] pt-5">
                <h3 className="text-base font-bold text-[#1E293B] mb-3">Availability</h3>
                <label className="flex items-center gap-2.5 cursor-pointer text-sm text-[#64748B]">
                  <input type="checkbox" className="rounded text-[#0D9488] focus:ring-[#0D9488] size-4" defaultChecked />
                  In Stock Only
                </label>
              </div>
            </div>
          </aside>

          {/* PRODUCT GRID */}
          <main className="md:col-span-3 pb-16">
            {sortedProducts.length === 0 ? (
              <div className="bg-white rounded-xl border border-[#E2DCD3] p-12 text-center mb-8">
                <p className="text-[#64748B] text-base">কোনো প্রোডাক্ট পাওয়া যায়নি।</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 pb-16">
                {sortedProducts.map((product) => {
                  const productId = product._id || product.id;
                  const { hasDiscount, discountPercent, originalPrice } = getDiscountInfo(product);

                  const isNew = product.status === "Trending" || product.status === "Featured";

                  return (
                    <div
                      key={productId}
                      className="group bg-white rounded-2xl border border-[#E2DCD3] shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden relative"
                    >
                      {/* Image Area - Linked to Product Details Page */}
                      <div className="relative w-full h-40 sm:h-48 lg:h-56 bg-[#F0EBE3] overflow-hidden">
                        <Link href={`/product/${productId}`} className="block w-full h-full">
                          <Image
                            src={getProductImage(product)}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </Link>

                        {/* Badges */}
                        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10 pointer-events-none">
                          {isNew && (
                            <span className="bg-[#0D9488] text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                              New
                            </span>
                          )}
                          {hasDiscount && (
                            <span className="bg-red-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                              {discountPercent}% OFF
                            </span>
                          )}
                        </div>

                        {/* Wishlist Button */}
                        <button 
                          aria-label="Add to Wishlist"
                          className="absolute top-2 right-2 p-1.5 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full text-[#64748B] hover:text-red-500 transition shadow-sm z-10"
                        >
                          <FiHeart className="size-3.5" />
                        </button>
                      </div>

                      {/* Product Details Area */}
                      <div className="p-3 sm:p-4 lg:p-5 flex-1 flex flex-col">
                        <span className="text-[9px] sm:text-[11px] text-[#94A3B8] font-medium uppercase tracking-wider">
                          {product.category}
                        </span>
                        
                        {/* Title - Linked to Product Details Page */}
                        <Link href={`/product/${productId}`}>
                          <h2 className="text-xs sm:text-sm lg:text-[15px] font-bold text-[#1E293B] hover:text-[#0D9488] transition line-clamp-2 mt-1">
                            {product.name}
                          </h2>
                        </Link>

                        {/* Rating */}
                        <div className="flex items-center gap-1 mt-2">
                          <div className="flex text-amber-400">
                            <FiStar className="size-3 fill-amber-400" />
                          </div>
                          <span className="text-[10px] sm:text-xs font-bold text-[#1E293B]">{product.rating || 4.5}</span>
                          <span className="text-[9px] sm:text-xs text-[#94A3B8]">(0)</span>
                        </div>

                        {/* Price */}
                        <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-[#EEE8E0]">
                          <div className="text-sm sm:text-lg lg:text-xl font-extrabold text-[#0D9488]">
                            ৳ {product.price.toLocaleString("en-BD")}
                          </div>
                          {hasDiscount && (
                            <div className="text-[9px] sm:text-xs text-[#94A3B8] line-through mt-0.5">
                              ৳ {originalPrice.toLocaleString("en-BD")}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Footer এর আগে স্পেসার */}
      <div className="h-16" />

      <Footer />
    </div>
  );
}