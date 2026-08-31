"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiHeart, FiArrowLeft } from "react-icons/fi";
import { Product } from "@/types";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PremiumLoader from "@/components/PremiumLoader";

const getProductImage = (product: Product): string =>
  product.images?.[0] || product.image || "/placeholder.jpg";

export default function WishlistPage() {
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlistProducts = async () => {
      try {
        const wishlistIds = JSON.parse(localStorage.getItem("wishlist") || "[]");
        
        if (wishlistIds.length === 0) {
          setWishlistProducts([]);
          setLoading(false);
          return;
        }

        const res = await fetch("/api/products");
        const data = await res.json();

        let productArray: Product[] = [];

        if (Array.isArray(data)) {
          productArray = data;
        } else if (data?.data && Array.isArray(data.data)) {
          productArray = data.data;
        } else if (data?.success === true && Array.isArray(data.data)) {
          productArray = data.data;
        }

        const wishlistProducts = productArray.filter((product) =>
          wishlistIds.includes(product._id) || wishlistIds.includes(String(product.id))
        );

        setWishlistProducts(wishlistProducts);
      } catch (error) {
        console.error("Error fetching wishlist products:", error);
        setWishlistProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistProducts();
  }, []);

  const removeFromWishlist = (productId: string | number | undefined) => {
    if (!productId) return;

    const wishlistIds = JSON.parse(localStorage.getItem("wishlist") || "[]");
    const updatedWishlist = wishlistIds.filter(
      (id: string) => id !== productId && id !== String(productId)
    );
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));

    setWishlistProducts((prev) =>
      prev.filter((product) => product._id !== productId && product.id !== productId)
    );
  };

  if (loading) {
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1E293B]">
            My Wishlist
          </h1>
          <span className="text-sm text-[#64748B]">
            {wishlistProducts.length} items
          </span>
        </div>

        {wishlistProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E2DCD3] p-16 text-center">
            <div className="w-16 h-16 bg-[#F0EBE3] rounded-full flex items-center justify-center mx-auto mb-4">
              <FiHeart className="size-8 text-[#94A3B8]" />
            </div>
            <h2 className="text-lg font-bold text-[#1E293B] mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-sm text-[#64748B] mb-6">
              Save your favorite products and they will appear here.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-[#0D9488] hover:bg-[#0B7A72] text-white px-6 py-3 rounded-xl font-semibold text-sm transition"
            >
              <FiArrowLeft className="size-4" /> Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            {/* Mobile: Vertical List View */}
            <div className="lg:hidden space-y-3">
              {wishlistProducts.map((product) => (
                <div
                  key={product._id || product.id}
                  className="bg-white rounded-xl border border-[#E2DCD3] shadow-sm p-3 flex items-center gap-3"
                >
                  {/* Image */}
                  <Link href={`/product/${product._id || product.id}`} className="shrink-0">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-[#F0EBE3]">
                      <Image
                        src={getProductImage(product)}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] text-[#94A3B8] font-medium uppercase tracking-wider">
                      {product.category}
                    </span>
                    <Link href={`/product/${product._id || product.id}`}>
                      <h2 className="text-sm font-bold text-[#1E293B] hover:text-[#0D9488] transition line-clamp-2 mt-0.5">
                        {product.name}
                      </h2>
                    </Link>
                    <div className="text-base font-extrabold text-[#0D9488] mt-1">
                      ৳ {product.price.toLocaleString("en-BD")}
                    </div>
                  </div>

                  {/* Remove Heart Icon */}
                  <button
                    onClick={() => removeFromWishlist(product._id || product.id)}
                    className="shrink-0 p-2 bg-[#F0EBE3] hover:bg-red-500 hover:text-white rounded-full text-[#64748B] transition"
                    aria-label="Remove from wishlist"
                  >
                    <FiHeart className="size-4 fill-red-500 text-red-500" />
                  </button>
                </div>
              ))}
            </div>

            {/* Desktop: Grid View */}
            <div className="hidden lg:grid grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlistProducts.map((product) => (
                <div
                  key={product._id || product.id}
                  className="group bg-white rounded-2xl border border-[#E2DCD3] shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden relative"
                >
                  {/* Image Area */}
                  <div className="relative w-full h-56 bg-[#F0EBE3] overflow-hidden">
                    <Link href={`/product/${product._id || product.id}`} className="block w-full h-full">
                      <Image
                        src={getProductImage(product)}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </Link>

                    {/* Remove Heart Button */}
                    <button
                      onClick={() => removeFromWishlist(product._id || product.id)}
                      className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-red-500 hover:text-white rounded-full text-[#64748B] transition shadow-sm z-10"
                      aria-label="Remove from wishlist"
                    >
                      <FiHeart className="size-4 fill-red-500 text-red-500" />
                    </button>
                  </div>

                  {/* Product Details */}
                  <div className="p-5 flex-1 flex flex-col">
                    <span className="text-[11px] text-[#94A3B8] font-medium uppercase tracking-wider">
                      {product.category}
                    </span>
                    <Link href={`/product/${product._id || product.id}`}>
                      <h2 className="text-[15px] font-bold text-[#1E293B] hover:text-[#0D9488] transition line-clamp-2 mt-1">
                        {product.name}
                      </h2>
                    </Link>

                    {/* Price */}
                    <div className="mt-3 pt-3 border-t border-[#EEE8E0]">
                      <div className="text-xl font-extrabold text-[#0D9488]">
                        ৳ {product.price.toLocaleString("en-BD")}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}