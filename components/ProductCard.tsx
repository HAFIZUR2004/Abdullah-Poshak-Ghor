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
    <div className="group relative bg-[#f4f2ec] rounded-xl overflow-hidden hover:shadow-md transition-all duration-300 h-full flex flex-col">
      <Link href={`/product/${productId}`} className="block flex-1">
        {/* Image Section */}
        <div className="relative aspect-square w-full bg-gray-50 flex items-center justify-center overflow-hidden">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover group-hover:scale-105 transition duration-500"
              unoptimized
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-4xl">
              📦
            </div>
          )}

          {/* Discount Badge */}
          {product.discount && product.discount > 0 && (
            <span className="absolute top-2 left-2 bg-[#d69a45] text-white text-[9px] font-bold px-2 py-0.5 rounded-full z-10">
              -{product.discount}%
            </span>
          )}

          {/* Quick Cart Trigger (Hover overlay) */}
          {product.inStock !== false && (
            <button
              onClick={handleAddToCart}
              className="absolute bottom-2 right-2 bg-white text-[#2e3a2c] hover:bg-[#d69a45] hover:text-white p-2.5 rounded-full shadow-md transition-all duration-300 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 z-10 cursor-pointer"
              aria-label="Add to cart"
            >
              <FiShoppingCart size={14} />
            </button>
          )}

          {/* Out of Stock Badge */}
          {product.inStock === false && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
              <span className="bg-white text-gray-800 px-3 py-1 rounded-full text-xs font-semibold">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-4 flex flex-col gap-1.5 text-left">
          <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
            {product.category}
          </p>
          <h3 className="font-bold text-gray-800 text-sm line-clamp-1 group-hover:text-[#d69a45] transition-colors">
            {product.name}
          </h3>
          
          {/* Rating */}
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`text-xs ${
                  i < Math.floor(product.rating || 5)
                    ? "text-amber-400"
                    : "text-gray-300"
                }`}
              >
                ★
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 mt-1">
            <span className="text-[#d69a45] font-black text-sm md:text-base">
              ৳{product.price}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-gray-400 text-xs line-through">
                ৳{product.originalPrice}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
