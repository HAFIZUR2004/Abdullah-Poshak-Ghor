"use client";

import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types";
import { FiShoppingCart } from "react-icons/fi";

export default function ProductListItem({ product }: { product: Product }) {
  const productId = product._id || product.id;

  return (
    <Link href={`/product/${productId}`} className="block group">
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition p-4 flex flex-col sm:flex-row gap-4">
        {/* Image */}
        <div className="relative w-full sm:w-32 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition duration-300"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-2xl">
              📦
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-primary-gold bg-primary-gold/10 px-2 py-0.5 rounded-full">
                {product.category}
              </span>
              {product.status === 'Trending' && (
                <span className="text-xs font-medium text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">
                  🔥 Trending
                </span>
              )}
            </div>
            <h3 className="font-semibold text-gray-800 group-hover:text-primary-gold transition line-clamp-2">
              {product.name}
            </h3>
            {product.description && (
              <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                {product.description}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-primary-gold">
                ৳{product.price}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-gray-400 line-through">
                  ৳{product.originalPrice}
                </span>
              )}
              {product.rating && (
                <div className="flex items-center gap-1">
                  <span className="text-yellow-400">★</span>
                  <span className="text-sm text-gray-600">{product.rating}</span>
                </div>
              )}
            </div>
            <button className="flex items-center gap-2 bg-primary-gold text-white px-4 py-2 rounded-full text-sm hover:bg-primary-gold/90 transition">
              <FiShoppingCart className="w-4 h-4" />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}