"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FiHeart, FiTrash2, FiShoppingCart, FiStar } from "react-icons/fi";
import { toast } from "react-hot-toast";

interface FavoriteProduct {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  discount?: number;
  inStock: boolean;
}

export default function AdminFavoritesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    // Redirect if not logged in
    if (!loading && !user) {
      router.push("/login");
      return;
    }

    // Load favorites if user is logged in
    const loadFavorites = async () => {
      if (!user?.uid) return;

      try {
        const response = await fetch(`/api/users/favorites?userId=${user.uid}`);
        if (response.ok) {
          const data = await response.json();
          setFavorites(data.favorites || []);
        }
      } catch (error) {
        console.error("Error loading favorites:", error);
      } finally {
        setPageLoading(false);
      }
    };

    if (user) {
      loadFavorites();
    }
  }, [user, loading, router]);

  const removeFromFavorites = async (productId: string) => {
    setRemovingId(productId);
    try {
      const response = await fetch("/api/users/favorites", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.uid,
          productId: productId,
        }),
      });

      if (response.ok) {
        setFavorites(favorites.filter((item) => item._id !== productId));
        toast.success("Removed from favorites");
      } else {
        toast.error("Failed to remove");
      }
    } catch (error) {
      console.error("Error removing favorite:", error);
      toast.error("Something went wrong");
    } finally {
      setRemovingId(null);
    }
  };

  const addToCart = async (product: FavoriteProduct) => {
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.uid,
          productId: product._id,
          quantity: 1,
        }),
      });

      if (response.ok) {
        toast.success("Added to cart!");
      } else {
        toast.error("Failed to add to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Something went wrong");
    }
  };

  if (loading || pageLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-gold"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
          <FiHeart className="text-primary-gold" />
          My Favorites
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          {favorites.length} {favorites.length === 1 ? "item" : "items"} in your
          wishlist
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-12 text-center border border-white/10">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-primary-gold/20 rounded-full">
              <FiHeart size={48} className="text-primary-gold" />
            </div>
          </div>
          <h3 className="text-lg font-medium text-white mb-2">
            No favorites yet
          </h3>
          <p className="text-gray-400 text-sm mb-6">
            Start adding products you love to your wishlist
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary-gold hover:bg-primary-gold/80 text-white rounded-lg transition-all"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.map((product) => (
            <div
              key={product._id}
              className="bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 hover:border-primary-gold/50 transition-all group"
            >
              <Link href={`/product/${product._id}`} className="block relative">
                <div className="relative h-48 md:h-56 overflow-hidden bg-gray-800">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                      No Image
                    </div>
                  )}
                  {product.discount && product.discount > 0 && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      -{product.discount}%
                    </div>
                  )}
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="bg-white/90 text-gray-800 px-3 py-1 rounded-full text-sm font-semibold">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>
              </Link>

              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-xs text-primary-gold font-medium mb-1">
                      {product.category}
                    </p>
                    <Link href={`/product/${product._id}`}>
                      <h3 className="font-semibold text-white hover:text-primary-gold transition line-clamp-2 text-sm md:text-base">
                        {product.name}
                      </h3>
                    </Link>
                  </div>
                  <button
                    onClick={() => removeFromFavorites(product._id)}
                    disabled={removingId === product._id}
                    className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-all disabled:opacity-50"
                  >
                    {removingId === product._id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-400 border-t-transparent" />
                    ) : (
                      <FiTrash2 size={16} />
                    )}
                  </button>
                </div>

                {product.rating && (
                  <div className="flex items-center gap-1 mt-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <FiStar
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < Math.floor(product.rating)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-500"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-400">
                      ({product.rating})
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-2 mt-3">
                  <span className="text-lg font-bold text-primary-gold">
                    ৳{product.price.toLocaleString()}
                  </span>
                  {product.originalPrice &&
                    product.originalPrice > product.price && (
                      <span className="text-sm text-gray-500 line-through">
                        ৳{product.originalPrice.toLocaleString()}
                      </span>
                    )}
                </div>

                {product.inStock !== false && (
                  <button
                    onClick={() => addToCart(product)}
                    className="w-full mt-4 flex items-center justify-center gap-2 py-2 bg-primary-gold/20 hover:bg-primary-gold text-primary-gold hover:text-white rounded-lg transition-all text-sm font-medium"
                  >
                    <FiShoppingCart size={16} />
                    Add to Cart
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
