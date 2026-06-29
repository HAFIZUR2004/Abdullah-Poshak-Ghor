"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { FiShoppingCart, FiHeart } from "react-icons/fi";

interface ProductCardProps {
  product: Product;
  variant?: "default" | "compact" | "featured";
}

export default function ProductCard({
  product,
  variant = "default",
}: ProductCardProps) {
  const { addToCart } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  // ইমেজ সোর্স নির্ধারণ (MongoDB এর `image` বা `images[0]`)
  const imageSrc = product.image || product.images?.[0] || null;

  // প্রোডাক্ট আইডি নির্ধারণ (MongoDB এর `_id` বা `id`)
  const productId = product._id || product.id;

  // Compact variant
  if (variant === "compact") {
    return (
      <Link href={`/product/${productId}`} className="block group">
        <div className="flex gap-2 p-2 bg-white rounded-lg hover:shadow-md transition">
          <div className="relative w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
            {imageSrc ? (
              <Image
                src={imageSrc}
                alt={product.name}
                fill
                sizes="48px"
                className="object-cover group-hover:scale-105 transition duration-300"
                unoptimized
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xl">
                📦
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-800 text-xs line-clamp-1">
              {product.name}
            </h3>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-primary-gold font-bold text-xs">
                ৳{product.price}
              </span>
              {product.originalPrice &&
                product.originalPrice > product.price && (
                  <span className="text-gray-400 text-[10px] line-through">
                    ৳{product.originalPrice}
                  </span>
                )}
            </div>
            {product.rating && (
              <div className="flex items-center gap-0.5 mt-0.5">
                <span className="text-yellow-400 text-[10px]">★</span>
                <span className="text-[10px] text-gray-600">
                  {product.rating}
                </span>
              </div>
            )}
          </div>
        </div>
      </Link>
    );
  }

  // Default variant
  return (
    <div className="group relative bg-white rounded-lg md:rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 h-full">
      <Link href={`/product/${productId}`} className="block">
        {/* Image Section */}
        <div className="relative h-48 md:h-64 bg-gray-100 overflow-hidden">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition duration-500"
              unoptimized
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-4xl md:text-6xl">
              📦
            </div>
          )}

          {/* Discount Badge */}
          {product.discount && product.discount > 0 && (
            <span className="absolute top-1 left-1 md:top-2 md:left-2 bg-red-500 text-white text-[10px] md:text-xs font-bold px-1.5 py-0.5 md:px-2 md:py-1 rounded-full z-10">
              {product.discount}% OFF
            </span>
          )}

          {/* Wishlist Button - Top Right */}
          <button
            onClick={handleWishlist}
            className="absolute top-1 right-1 md:top-2 md:right-2 bg-white/90 backdrop-blur-sm p-1.5 md:p-2 rounded-full shadow-md hover:scale-110 transition-transform z-10"
            aria-label="Add to wishlist"
          >
            <FiHeart
              size={14}
              className={`transition-colors ${
                isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"
              }`}
            />
          </button>

          {/* Out of Stock Badge */}
          {product.inStock === false && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
              <span className="bg-white text-gray-800 px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[10px] md:text-sm font-semibold">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-2 md:p-4">
          <p className="text-[10px] md:text-xs text-primary-gold font-medium mb-0.5 md:mb-1 uppercase tracking-wider">
            {product.category}
          </p>
          <h3 className="font-semibold text-gray-800 mb-1 md:mb-2 line-clamp-2 group-hover:text-primary-gold transition text-xs md:text-base">
            {product.name}
          </h3>
          <div className="flex items-center gap-1 md:gap-2 mb-1 md:mb-2">
            <span className="text-primary-gold font-bold text-sm md:text-lg">
              ৳{product.price}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-gray-400 text-[10px] md:text-sm line-through">
                ৳{product.originalPrice}
              </span>
            )}
          </div>
          {product.rating && (
            <div className="flex items-center justify-between gap-2 mt-1 md:mt-2">
              <div className="flex items-center gap-0.5 md:gap-1">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-sm ${
                        i < Math.floor(product.rating || 0)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-sm text-gray-500">{product.rating}</span>
              </div>

              {product.inStock !== false && (
                <button
                  onClick={handleAddToCart}
                  className="text-primary-gold px-2 py-1 md:px-3 md:py-1.5 text-sm font-semibold rounded-md hover:bg-primary-gold hover:text-white transition whitespace-nowrap border border-primary-gold/20 flex justify-center items-center gap-2"
                >
                  <FiShoppingCart />
                  Add
                </button>
              )}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
