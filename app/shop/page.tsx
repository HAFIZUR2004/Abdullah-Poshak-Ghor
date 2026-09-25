"use client";

import React, {
  useState,
  useEffect,
  Suspense,
  useMemo,
  useCallback,
  memo,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
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
  image?: string;
  slug: string;
}

/* ─────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────── */

const getProductImage = (product: Product): string =>
  product.image || product.images?.[0] || "/placeholder.jpg";

const getDiscountInfo = (product: Product) => {
  const price = Number(product.price) || 0;
  const original = Number(product.originalPrice) || 0;
  const discount = Number(product.discount) || 0;

  if (original > price) {
    return {
      hasDiscount: true,
      discountPercent: Math.round(
        ((original - price) / original) * 100
      ),
      originalPrice: original,
    };
  }

  if (discount > 0 && discount < 100) {
    return {
      hasDiscount: true,
      discountPercent: discount,
      originalPrice: Math.round(price / (1 - discount / 100)),
    };
  }

  return {
    hasDiscount: false,
    discountPercent: 0,
    originalPrice: price,
  };
};

const normalizeProducts = (data: any): Product[] => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.products)) return data.products;
  return [];
};

const normalizeCategories = (data: any): Category[] => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.categories)) return data.categories;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

/* ─────────────────────────────────────────────────────────────
   PRODUCT CARD
───────────────────────────────────────────────────────────── */

interface ProductCardProps {
  product: Product;
  index: number;
  isLiked: boolean;
  onWishlist: (id?: string | number) => void;
}

const ProductCard = memo(function ProductCard({
  product,
  index,
  isLiked,
  onWishlist,
}: ProductCardProps) {
  const productId = product._id || product.id;

  const { hasDiscount, discountPercent, originalPrice } =
    getDiscountInfo(product);

  const isNew =
    String(product.status).toLowerCase() === "trending" ||
    String(product.status).toLowerCase() === "featured";

  const image = getProductImage(product);

  const price = Number(product.price) || 0;

  return (
    <div
      className="group bg-white rounded-2xl border border-[#E5D3B3]/30 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden relative"
    >
      {/* IMAGE */}
      <div className="relative w-full h-40 sm:h-48 lg:h-56 bg-[#FDF6EE] overflow-hidden">
        <Link
          href={`/product/${productId}`}
          className="block w-full h-full"
          prefetch={index < 6}
        >
          <Image
            src={image}
            alt={product.name || "Furniture product"}
            fill
            sizes="
              (max-width: 640px) 50vw,
              (max-width: 1024px) 33vw,
              25vw
            "
            priority={index < 2}
            loading={index < 2 ? "eager" : "lazy"}
            quality={70}
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* BADGES */}
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

        {/* WISHLIST */}
        <button
          type="button"
          onClick={() => onWishlist(productId)}
          aria-label={
            isLiked ? "Remove from Wishlist" : "Add to Wishlist"
          }
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

      {/* CONTENT */}
      <div className="p-3 sm:p-4 lg:p-5 flex-1 flex flex-col">
        <span className="text-[9px] sm:text-[11px] text-[#0F3D39]/60 font-medium uppercase tracking-wider truncate">
          {product.category || "Furniture"}
        </span>

        <Link
          href={`/product/${productId}`}
          prefetch={index < 6}
        >
          <h2 className="text-xs sm:text-sm lg:text-[15px] font-bold text-[#0B2523] hover:text-[#0F3D39] transition line-clamp-2 mt-1">
            {product.name}
          </h2>
        </Link>

        {/* RATING */}
        <div className="flex items-center gap-1 mt-2">
          <FiStar className="size-3 fill-amber-500 text-amber-500" />

          <span className="text-[10px] sm:text-xs font-bold text-[#0B2523]">
            {product.rating || 4.5}
          </span>

          <span className="text-[9px] sm:text-xs text-[#0F3D39]/50">
            (0)
          </span>
        </div>

        {/* PRICE */}
        <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-[#E5D3B3]/30">
          <div className="text-sm sm:text-lg lg:text-xl font-extrabold text-[#0F3D39]">
            ৳ {price.toLocaleString("en-BD")}
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
});

/* ─────────────────────────────────────────────────────────────
   CATEGORY BUTTON
───────────────────────────────────────────────────────────── */

interface CategoryButtonProps {
  category: string;
  selected: boolean;
  onClick: (category: string) => void;
}

const CategoryButton = memo(function CategoryButton({
  category,
  selected,
  onClick,
}: CategoryButtonProps) {
  return (
    <li>
      <button
        type="button"
        onClick={() => onClick(category)}
        className={`w-full flex items-center justify-between text-left px-3 py-2.5 rounded-lg text-sm font-medium transition ${
          selected
            ? "bg-[#0F3D39] text-[#E5D3B3] shadow-sm"
            : "text-[#0F3D39]/80 hover:bg-[#FDF6EE]"
        }`}
      >
        <span className="truncate">{category}</span>

        {selected && (
          <FiCheck className="size-4 shrink-0 ml-2" />
        )}
      </button>
    </li>
  );
});

/* ─────────────────────────────────────────────────────────────
   SHOP CONTENT
───────────────────────────────────────────────────────────── */

function ShopContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const categoryFromUrl =
    searchParams?.get("category") || "All Furniture";

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] =
    useState(categoryFromUrl);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");

  const [isMobileFilterOpen, setIsMobileFilterOpen] =
    useState(false);

  const [wishlist, setWishlist] = useState<string[]>([]);

  /* ─────────────────────────────
     CATEGORY URL SYNC
  ───────────────────────────── */

  useEffect(() => {
    const category =
      searchParams?.get("category") || "All Furniture";

    setSelectedCategory(category);
  }, [searchParams]);

  /* ─────────────────────────────
     LOAD WISHLIST
  ───────────────────────────── */

  useEffect(() => {
    try {
      const saved = localStorage.getItem("wishlist");

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          setWishlist(parsed.map(String));
        }
      }
    } catch {
      setWishlist([]);
    }
  }, []);

  /* ─────────────────────────────
     FETCH DATA
  ───────────────────────────── */

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        setIsLoading(true);

        const [productsRes, categoriesRes] =
          await Promise.all([
            fetch("/api/products", {
              next: { revalidate: 60 },
            }),
            fetch("/api/categories", {
              next: { revalidate: 300 },
            }),
          ]);

        if (!productsRes.ok || !categoriesRes.ok) {
          throw new Error("Failed to fetch shop data");
        }

        const [productsData, categoriesData] =
          await Promise.all([
            productsRes.json(),
            categoriesRes.json(),
          ]);

        if (cancelled) return;

        /* PRODUCTS */

        const productArray =
          normalizeProducts(productsData);

        const activeProducts = productArray.filter(
          (product: any) => {
            if (!product.status) return true;

            const status = String(
              product.status
            ).toLowerCase();

            return (
              status === "active" ||
              status === "trending" ||
              status === "featured"
            );
          }
        );

        /* CATEGORIES */

        const categoryArray =
          normalizeCategories(categoriesData);

        setProducts(activeProducts);
        setCategories(categoryArray);
      } catch (error) {
        console.error("Shop fetch error:", error);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, []);

  /* ─────────────────────────────
     WISHLIST SET
  ───────────────────────────── */

  const wishlistSet = useMemo(
    () => new Set(wishlist),
    [wishlist]
  );

  /* ─────────────────────────────
     CATEGORY LIST
  ───────────────────────────── */

  const categoryList = useMemo(() => {
    const names = categories
      .map((category) => category.name)
      .filter(Boolean);

    return ["All Furniture", ...new Set(names)];
  }, [categories]);

  /* ─────────────────────────────
     FILTER + SORT
  ───────────────────────────── */

  const sortedProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    let result = products;

    /* CATEGORY */

    if (selectedCategory !== "All Furniture") {
      result = result.filter(
        (product) =>
          product.category === selectedCategory
      );
    }

    /* SEARCH */

    if (query) {
      result = result.filter((product) => {
        const name =
          product.name?.toLowerCase() || "";

        const category =
          product.category?.toLowerCase() || "";

        return (
          name.includes(query) ||
          category.includes(query)
        );
      });
    }

    /* SORT */

    if (sortBy !== "featured") {
      result = [...result];

      switch (sortBy) {
        case "low-to-high":
          result.sort(
            (a, b) =>
              Number(a.price || 0) -
              Number(b.price || 0)
          );
          break;

        case "high-to-low":
          result.sort(
            (a, b) =>
              Number(b.price || 0) -
              Number(a.price || 0)
          );
          break;

        case "newest":
          result.sort(
            (a, b) =>
              new Date(
                b.createdAt || 0
              ).getTime() -
              new Date(
                a.createdAt || 0
              ).getTime()
          );
          break;

        case "rating":
          result.sort(
            (a, b) =>
              Number(b.rating || 0) -
              Number(a.rating || 0)
          );
          break;
      }
    }

    return result;
  }, [
    products,
    selectedCategory,
    searchQuery,
    sortBy,
  ]);

  /* ─────────────────────────────
     WISHLIST
  ───────────────────────────── */

  const toggleWishlist = useCallback(
    (productId?: string | number) => {
      if (!productId) return;

      const id = String(productId);

      setWishlist((prev) => {
        const exists = prev.includes(id);

        const updated = exists
          ? prev.filter((item) => item !== id)
          : [...prev, id];

        try {
          localStorage.setItem(
            "wishlist",
            JSON.stringify(updated)
          );
        } catch {}

        window.dispatchEvent(
          new Event("storage")
        );

        toast.success(
          exists
            ? "Removed from wishlist"
            : "Added to wishlist ❤️"
        );

        return updated;
      });
    },
    []
  );

  /* ─────────────────────────────
     CATEGORY CLICK
  ───────────────────────────── */

  const handleCategoryClick = useCallback(
    (category: string) => {
      const params = new URLSearchParams(
        searchParams?.toString() || ""
      );

      if (category === "All Furniture") {
        params.delete("category");
      } else {
        params.set("category", category);
      }

      const queryString = params.toString();

      router.push(
        `/shop${
          queryString ? `?${queryString}` : ""
        }`,
        { scroll: false }
      );
    },
    [router, searchParams]
  );

  /* ─────────────────────────────
     LOADING
  ───────────────────────────── */

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDF6EE]">
        <PremiumLoader />
      </div>
    );
  }

  /* ─────────────────────────────
     UI
  ───────────────────────────── */

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

      {/* SEARCH + SORT */}

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8 bg-white p-4 rounded-xl shadow-sm border border-[#E5D3B3]/30">

        {/* SEARCH */}

        <div className="relative w-full md:w-96">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0F3D39]/60 size-5" />

          <input
            type="search"
            placeholder="Search sofa, bed, table..."
            value={searchQuery}
            onChange={(e) =>
              setSearchQuery(e.target.value)
            }
            className="w-full pl-11 pr-4 py-2.5 bg-[#FDF6EE] border border-[#E5D3B3]/40 rounded-lg text-sm text-[#0B2523] placeholder:text-[#0F3D39]/50 focus:outline-none focus:ring-2 focus:ring-[#0F3D39] focus:border-[#0F3D39] transition"
          />
        </div>

        {/* SORT */}

        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">

          {/* MOBILE FILTER */}

          <button
            type="button"
            onClick={() =>
              setIsMobileFilterOpen(
                (prev) => !prev
              )
            }
            className="md:hidden flex items-center gap-2 px-4 py-2.5 border border-[#E5D3B3]/40 rounded-lg text-sm font-medium bg-[#FDF6EE] text-[#0B2523] hover:bg-[#E5D3B3]/20 transition"
          >
            <FiSliders className="size-4" />
            Filter
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-[#0F3D39]/70 hidden sm:inline">
              Sort by:
            </span>

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value)
                }
                className="appearance-none bg-[#FDF6EE] border border-[#E5D3B3]/40 rounded-lg pl-3 pr-8 py-2.5 text-sm font-medium text-[#0B2523] focus:outline-none focus:ring-2 focus:ring-[#0F3D39] cursor-pointer"
              >
                <option value="featured">
                  Featured
                </option>

                <option value="low-to-high">
                  Price: Low to High
                </option>

                <option value="high-to-low">
                  Price: High to Low
                </option>

                <option value="newest">
                  Newest Arrivals
                </option>

                <option value="rating">
                  Top Rated
                </option>
              </select>

              <FiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#0F3D39]/60 pointer-events-none size-4" />
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE FILTER */}

      {isMobileFilterOpen && (
        <div className="md:hidden bg-white p-5 rounded-xl border border-[#E5D3B3]/30 shadow-sm mb-6">

          <h3 className="text-base font-bold text-[#0B2523] border-b border-[#E5D3B3]/30 pb-3 mb-4">
            Categories
          </h3>

          <ul className="space-y-1.5 max-h-[50vh] overflow-y-auto pr-1 custom-scrollbar">
            {categoryList.map((category) => (
              <CategoryButton
                key={category}
                category={category}
                selected={
                  selectedCategory === category
                }
                onClick={(value) => {
                  handleCategoryClick(value);
                  setIsMobileFilterOpen(false);
                }}
              />
            ))}
          </ul>
        </div>
      )}

      {/* MAIN */}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* SIDEBAR */}

        <aside className="hidden md:block md:col-span-1">
          <div className="bg-white p-5 rounded-xl border border-[#E5D3B3]/30 shadow-sm sticky top-24">

            <h3 className="text-base font-bold text-[#0B2523] border-b border-[#E5D3B3]/30 pb-3 mb-4">
              Categories
            </h3>

            <ul className="space-y-1.5 max-h-[60vh] overflow-y-auto pr-1 custom-scrollbar">
              {categoryList.map((category) => (
                <CategoryButton
                  key={category}
                  category={category}
                  selected={
                    selectedCategory === category
                  }
                  onClick={handleCategoryClick}
                />
              ))}
            </ul>
          </div>
        </aside>

        {/* PRODUCTS */}

        <main className="md:col-span-3 pb-8">

          {sortedProducts.length === 0 ? (
            <div className="bg-white rounded-xl border border-[#E5D3B3]/30 p-12 text-center mb-8">
              <p className="text-[#0F3D39]/70 text-base">
                No products found.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">

              {sortedProducts.map(
                (product, index) => {
                  const productId =
                    product._id || product.id;

                  return (
                    <ProductCard
                      key={productId}
                      product={product}
                      index={index}
                      isLiked={wishlistSet.has(
                        String(productId)
                      )}
                      onWishlist={
                        toggleWishlist
                      }
                    />
                  );
                }
              )}

            </div>
          )}
        </main>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────────── */

export default function ShopPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FDF6EE] text-[#0B2523]">

      <Navbar />

      <div className="flex-1">
        <Suspense
          fallback={
            <div className="min-h-[60vh] flex items-center justify-center">
              <PremiumLoader />
            </div>
          }
        >
          <ShopContent />
        </Suspense>
      </div>

      <Footer />
    </div>
  );
}

