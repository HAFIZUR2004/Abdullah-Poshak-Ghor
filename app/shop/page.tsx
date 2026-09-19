"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  FiSearch,
  FiSliders,
  FiHeart,
  FiStar,
  FiChevronDown,
  FiCheck,
} from "react-icons/fi";
import { Product } from "@/types";
import PremiumLoader from "@/components/PremiumLoader";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";

interface Category {
  _id: string;
  name: string;
  image: string;
  slug: string;
}

// ✅ FIXED: main image priority, then gallery first image
const getProductImage = (product: Product): string =>
  product.image || product.images?.[0] || "/placeholder.jpg";

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

// ─── Shop Content Component ──────────────────────────────────────────────────
function ShopContent() {
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams?.get("category") || "All Furniture";

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);

  // Update selected category when URL param changes
  useEffect(() => {
    const cat = searchParams?.get("category");
    if (cat && cat !== selectedCategory) {
      setSelectedCategory(cat);
    }
  }, [searchParams]);

  // Load wishlist from localStorage
  useEffect(() => {
    const savedWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setWishlist(savedWishlist);
  }, []);

  // Fetch Products and Categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch Products
        const productsRes = await fetch("/api/products");
        const productsData = await productsRes.json();

        let productArray: Product[] = [];

        if (Array.isArray(productsData)) {
          productArray = productsData;
        } else if (productsData?.data && Array.isArray(productsData.data)) {
          productArray = productsData.data;
        } else if (
          productsData?.success === true &&
          Array.isArray(productsData.data)
        ) {
          productArray = productsData.data;
        }

        const activeProducts = productArray.filter(
          (p: Product) => p.status === "Active"
        );
        setProducts(activeProducts);

        // Fetch Categories from Database
        const categoriesRes = await fetch("/api/categories");
        const categoriesData = await categoriesRes.json();

        if (categoriesData.success && categoriesData.categories.length > 0) {
          setCategories(categoriesData.categories);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setProducts([]);
        setCategories([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // ─── Category List ──────────────────────────────────────────────────────────
  const categoryList = ["All Furniture", ...categories.map((cat) => cat.name)];

  // ─── Filter & Sort ──────────────────────────────────────────────────────────
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "All Furniture" ||
      product.category === selectedCategory;
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

  // ─── Wishlist ────────────────────────────────────────────────────────────────
  const toggleWishlist = (productId: string | number | undefined) => {
    if (!productId) return;

    const id = String(productId);
    const isLiked = wishlist.includes(id);
    let updatedWishlist: string[];

    if (isLiked) {
      updatedWishlist = wishlist.filter((item) => item !== id);
      toast.success("Removed from wishlist");
    } else {
      updatedWishlist = [...wishlist, id];
      toast.success("Added to wishlist ❤️");
    }

    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    window.dispatchEvent(new Event("storage"));
  };

  // ─── Handle Category Click ──────────────────────────────────────────────────
  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    const currentParams = new URLSearchParams(searchParams?.toString() || "");
    if (category === "All Furniture") {
      currentParams.delete("category");
    } else {
      currentParams.set("category", category);
    }
    const queryString = currentParams.toString();
    window.history.pushState(
      { category },
      "",
      `/shop${queryString ? `?${queryString}` : ""}`
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FDF6EE]">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <PremiumLoader />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF6EE] text-[#0B2523] pb-16">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* SEARCH & MOBILE FILTER BAR */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8 bg-white p-4 rounded-xl shadow-sm border border-[#E5D3B3]/30 lg:mt-5">
          <div className="relative w-full md:w-96">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0F3D39]/60 size-5" />
            <input
              type="text"
              placeholder="Search sofa, bed, table..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-[#FDF6EE] border border-[#E5D3B3]/40 rounded-lg text-sm text-[#0B2523] placeholder:text-[#0F3D39]/50 focus:outline-none focus:ring-2 focus:ring-[#0F3D39] focus:border-[#0F3D39] transition"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <button
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="md:hidden flex items-center gap-2 px-4 py-2.5 border border-[#E5D3B3]/40 rounded-lg text-sm font-medium bg-[#FDF6EE] text-[#0B2523] hover:bg-[#E5D3B3]/20 transition"
            >
              <FiSliders className="size-4" /> Filter
            </button>

            <div className="flex items-center gap-2 w-auto">
              <span className="text-xs font-medium text-[#0F3D39]/70 hidden sm:inline">
                Sort by:
              </span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-[#FDF6EE] border border-[#E5D3B3]/40 rounded-lg pl-3 pr-8 py-2.5 text-sm font-medium text-[#0B2523] focus:outline-none focus:ring-2 focus:ring-[#0F3D39] cursor-pointer"
                >
                  <option value="featured">Featured</option>
                  <option value="low-to-high">Price: Low to High</option>
                  <option value="high-to-low">Price: High to Low</option>
                  <option value="newest">Newest Arrivals</option>
                </select>
                <FiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#0F3D39]/60 pointer-events-none size-4" />
              </div>
            </div>
          </div>
        </div>

        {/* MOBILE FILTER DRAWER */}
        {isMobileFilterOpen && (
          <div className="md:hidden bg-white p-5 rounded-xl border border-[#E5D3B3]/30 shadow-sm mb-6">
            <h3 className="text-base font-bold text-[#0B2523] border-b border-[#E5D3B3]/30 pb-3 mb-4">
              Categories
            </h3>
            <ul className="space-y-1.5">
              {categoryList.map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => {
                      handleCategoryClick(cat);
                      setIsMobileFilterOpen(false);
                    }}
                    className={`w-full flex items-center justify-between text-left px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                      selectedCategory === cat
                        ? "bg-[#0F3D39] text-[#E5D3B3] shadow-sm"
                        : "text-[#0F3D39]/80 hover:bg-[#FDF6EE]"
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
            <div className="bg-white p-5 rounded-xl border border-[#E5D3B3]/30 shadow-sm sticky top-24">
              <h3 className="text-base font-bold text-[#0B2523] border-b border-[#E5D3B3]/30 pb-3 mb-4">
                Categories
              </h3>
              <ul className="space-y-1.5">
                {categoryList.map((cat) => (
                  <li key={cat}>
                    <button
                      onClick={() => handleCategoryClick(cat)}
                      className={`w-full flex items-center justify-between text-left px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                        selectedCategory === cat
                          ? "bg-[#0F3D39] text-[#E5D3B3] shadow-sm"
                          : "text-[#0F3D39]/80 hover:bg-[#FDF6EE]"
                      }`}
                    >
                      <span>{cat}</span>
                      {selectedCategory === cat && <FiCheck className="size-4" />}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* PRODUCT GRID */}
          <main className="md:col-span-3 pb-16">
            {sortedProducts.length === 0 ? (
              <div className="bg-white rounded-xl border border-[#E5D3B3]/30 p-12 text-center mb-8">
                <p className="text-[#0F3D39]/70 text-base">
                  No products found.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 pb-16">
                {sortedProducts.map((product) => {
                  const productId = product._id || product.id;
                  const { hasDiscount, discountPercent, originalPrice } =
                    getDiscountInfo(product);

                  const isNew =
                    product.status === "Trending" ||
                    product.status === "Featured";
                  const isLiked = wishlist.includes(String(productId));

                  return (
                    <div
                      key={productId}
                      className="group bg-white rounded-2xl border border-[#E5D3B3]/30 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden relative"
                    >
                      {/* Image Area */}
                      <div className="relative w-full h-40 sm:h-48 lg:h-56 bg-[#FDF6EE] overflow-hidden">
                        <Link
                          href={`/product/${productId}`}
                          className="block w-full h-full"
                        >
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
                            <span className="bg-[#0F3D39] text-[#E5D3B3] text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                              New
                            </span>
                          )}
                          {hasDiscount && (
                            <span className="bg-[#FF7A00] text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                              {discountPercent}% OFF
                            </span>
                          )}
                        </div>

                        {/* Wishlist Button */}
                        <button
                          onClick={() => toggleWishlist(productId)}
                          aria-label="Add to Wishlist"
                          className={`absolute top-2 right-2 p-1.5 rounded-full transition shadow-sm z-10 ${
                            isLiked
                              ? "bg-red-500 text-white"
                              : "bg-white/80 hover:bg-white text-[#0B2523] hover:text-red-500"
                          }`}
                        >
                          <FiHeart
                            className={`size-3.5 ${
                              isLiked ? "fill-current" : ""
                            }`}
                          />
                        </button>
                      </div>

                      {/* Product Details */}
                      <div className="p-3 sm:p-4 lg:p-5 flex-1 flex flex-col">
                        <span className="text-[9px] sm:text-[11px] text-[#0F3D39]/60 font-medium uppercase tracking-wider">
                          {product.category}
                        </span>

                        <Link href={`/product/${productId}`}>
                          <h2 className="text-xs sm:text-sm lg:text-[15px] font-bold text-[#0B2523] hover:text-[#0F3D39] transition line-clamp-2 mt-1">
                            {product.name}
                          </h2>
                        </Link>

                        {/* Rating */}
                        <div className="flex items-center gap-1 mt-2">
                          <div className="flex text-amber-500">
                            <FiStar className="size-3 fill-amber-500" />
                          </div>
                          <span className="text-[10px] sm:text-xs font-bold text-[#0B2523]">
                            {product.rating || 4.5}
                          </span>
                          <span className="text-[9px] sm:text-xs text-[#0F3D39]/50">
                            (0)
                          </span>
                        </div>

                        {/* Price */}
                        <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-[#E5D3B3]/30">
                          <div className="text-sm sm:text-lg lg:text-xl font-extrabold text-[#0F3D39]">
                            ৳ {product.price.toLocaleString("en-BD")}
                          </div>
                          {hasDiscount && (
                            <div className="text-[9px] sm:text-xs text-[#0F3D39]/50 line-through mt-0.5">
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

      <div className="h-16" />

      <Footer />
    </div>
  );
}

// ─── Main Export with Suspense ──────────────────────────────────────────────────
export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col bg-[#FDF6EE]">
          <Navbar />
          <main className="flex-1 flex items-center justify-center">
            <PremiumLoader />
          </main>
          <Footer />
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}