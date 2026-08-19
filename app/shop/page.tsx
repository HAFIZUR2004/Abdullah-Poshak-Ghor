"use client";

import { useState, useEffect } from "react";
import { FiSearch, FiGrid, FiList } from "react-icons/fi";
import ProductCard from "@/components/ProductCard";
import ProductListItem from "@/components/ProductListItem";
import PremiumLoader from "@/components/PremiumLoader";
import { Product } from "@/types";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [mounted, setMounted] = useState(false);

  // Fetch products from MongoDB
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const data = await res.json();
          // শুধুমাত্র Active প্রোডাক্ট দেখাবো
          const activeProducts = data.filter(
            (p: Product) => p.status === "Active",
          );
          setProducts(activeProducts);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && typeof window !== "undefined") {
      const saved = localStorage.getItem("shopViewMode");
      if (saved === "list") {
        setViewMode("list");
      }
    }
  }, [mounted]);

  const handleViewModeChange = (mode: "grid" | "list") => {
    setViewMode(mode);
    if (typeof window !== "undefined") {
      localStorage.setItem("shopViewMode", mode);
    }
  };

  // Get unique categories from products
  const uniqueCategories = [
    "All",
    ...Array.from(new Set(products.map((p) => p.category).filter(Boolean))),
  ];

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.category &&
        product.category.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
    if (sortBy === "newest")
      return (
        new Date(b.createdAt || Date.now()).getTime() -
        new Date(a.createdAt || Date.now()).getTime()
      );
    return 0;
  });

  // Loading State
  if (isLoading || !mounted) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <PremiumLoader />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Shop all Products
          </h1>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="w-full md:flex-1 relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:border-primary-gold focus:ring-2 focus:ring-primary-gold/20 text-sm text-gray-700"
              />
              <FiSearch
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
            </div>

            {/* Category Filter */}
            <div className="w-full md:w-auto flex gap-2 overflow-x-auto pb-2 md:pb-0">
              {uniqueCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`whitespace-nowrap transition font-medium text-sm px-3 py-1.5 rounded-md ${
                    selectedCategory === cat
                      ? "text-white bg-primary-gold"
                      : "text-gray-700 hover:bg-primary-gold/10 border border-gray-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Sort & View Options */}
            <div className="w-full md:w-auto flex items-center justify-between md:justify-end gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 text-gray-700 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-primary-gold"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price (Low to High)</option>
                <option value="price-high">Price (High to Low)</option>
                <option value="rating">Rating</option>
              </select>

              <div className="hidden md:flex gap-1 border border-gray-200 rounded-md p-1">
                <button
                  onClick={() => handleViewModeChange("grid")}
                  className={`p-2 rounded transition ${
                    viewMode === "grid"
                      ? "bg-primary-gold text-white"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                  aria-label="Grid view"
                >
                  <FiGrid size={18} />
                </button>
                <button
                  onClick={() => handleViewModeChange("list")}
                  className={`p-2 rounded transition ${
                    viewMode === "list"
                      ? "bg-primary-gold text-white"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                  aria-label="List view"
                >
                  <FiList size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-gray-500">
            Showing {sortedProducts.length} products
          </p>
        </div>

        {/* Products Grid/List View */}
        {sortedProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
            <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <FiSearch className="text-gray-400" size={28} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              No products found
            </h3>
            <p className="text-gray-500 text-sm">
              Try adjusting your search or category filters.
            </p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {sortedProducts.map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {sortedProducts.map((product) => (
              <ProductListItem
                key={product._id || product.id}
                product={product}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
