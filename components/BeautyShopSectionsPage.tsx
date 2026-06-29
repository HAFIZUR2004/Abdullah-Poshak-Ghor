"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Zap,
  Gift,
  Sparkles,
  Star,
  ChevronRight,
  Truck,
  Shield,
  RefreshCw,
  CreditCard,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/types";

// ─── Countdown Hook ─────────────────────────────────────────────────────────────

function useCountdown(targetDate: string | Date) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calc = () => {
      const diff = Number(new Date(targetDate)) - Date.now();
      if (diff <= 0) return;
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return timeLeft;
}

// ─── Shared Helpers ────────────────────────────────────────────────────────────

const categoryColors = [
  "from-orange-400 to-amber-500",
  "from-amber-400 to-yellow-500",
  "from-rose-400 to-orange-500",
  "from-yellow-400 to-orange-400",
  "from-orange-500 to-red-500",
  "from-amber-500 to-orange-400",
  "from-yellow-500 to-amber-400",
  "from-orange-300 to-amber-400",
  "from-red-400 to-orange-500",
  "from-amber-600 to-yellow-500",
];

const getDefaultImageForCategory = (category: string) => {
  const map: Record<string, string> = {
    Electronics:
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=400&auto=format&fit=crop",
    Fashion:
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=400&auto=format&fit=crop",
    "Home & Living":
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=400&auto=format&fit=crop",
    Beauty:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=400&auto=format&fit=crop",
    Sports:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=400&auto=format&fit=crop",
    "Toys & Kids":
      "https://images.unsplash.com/photo-1558060370-d644479a6d0b?q=80&w=400&auto=format&fit=crop",
    Accessories:
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=400&auto=format&fit=crop",
    Grocery:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=400&auto=format&fit=crop",
    Footwear:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=400&auto=format&fit=crop",
    Watches:
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=400&auto=format&fit=crop",
  };
  return (
    map[category] ||
    "https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=400&auto=format&fit=crop"
  );
};

// ─── Section Header ─────────────────────────────────────────────────────────────

function SectionHeader({
  icon,
  title,
  accent,
  onViewAll,
}: {
  icon: React.ReactNode;
  title: string;
  accent?: string;
  onViewAll?: () => void;
}) {
  return (
    <div className="flex items-end justify-between mb-7 pb-4 border-b border-gray-100">
      <div>
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-500">
            {icon}
          </div>
          <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">
            {title}
            {accent && (
              <span className="ml-2 text-sm font-semibold bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent">
                {accent}
              </span>
            )}
          </h2>
        </div>
        {/* Decorative underline */}
        <div className="h-0.5 w-10 bg-gradient-to-r from-orange-500 to-amber-400 rounded-full ml-11" />
      </div>
      <button
        onClick={onViewAll}
        className="group flex items-center gap-1 text-orange-500 hover:text-white font-bold text-xs md:text-sm bg-orange-50 hover:bg-orange-500 border border-orange-100 hover:border-transparent px-4 py-2 rounded-full transition-all duration-200 shadow-sm"
      >
        View All
        <ChevronRight
          size={14}
          className="group-hover:translate-x-0.5 transition-transform"
        />
      </button>
    </div>
  );
}

// ─── Featured Category Section (with left image card like reference) ────────────

function CategorySection({
  title,
  icon,
  accent,
  products,
  onViewAll,
  bgColor = "white",
}: {
  title: string;
  icon: React.ReactNode;
  accent?: string;
  products: any[];
  onViewAll: () => void;
  bgColor?: string;
}) {
  const featuredProduct = products[0];
  const gridProducts = products.slice(1, 5);

  return (
    <section
      className={`py-12 md:py-16 ${
        bgColor === "gradient"
          ? "bg-gradient-to-br from-amber-50/60 via-white to-orange-50/40"
          : "bg-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          icon={icon}
          title={title}
          accent={accent}
          onViewAll={onViewAll}
        />

        {products.length === 0 ? (
          <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-sm">
            No products available right now.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4 md:gap-5">
            {/* Left featured card */}
            {featuredProduct && (
              <div
                className="relative rounded-2xl overflow-hidden cursor-pointer group bg-gradient-to-br from-gray-900 to-gray-800 min-h-[280px] lg:min-h-0"
                onClick={() => onViewAll()}
              >
                {featuredProduct.images?.[0] || featuredProduct.image ? (
                  <Image
                    src={featuredProduct.images?.[0] || featuredProduct.image}
                    alt={featuredProduct.name}
                    fill
                    className="object-cover opacity-80 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
                    sizes="280px"
                  />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <span className="inline-block bg-orange-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full mb-2 uppercase tracking-wide">
                    NEW ARRIVAL
                  </span>
                  <h3 className="text-white font-bold text-sm leading-snug line-clamp-2 mb-2">
                    {title} Collection
                  </h3>
                  <p className="text-white/70 text-xs mb-3">
                    All of our modern collection
                  </p>
                  <button className="flex items-center gap-1.5 text-white text-xs font-semibold bg-white/20 hover:bg-orange-500 backdrop-blur-sm px-3 py-1.5 rounded-full transition-all duration-200">
                    Shop Collection
                    <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            )}

            {/* Right product grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {gridProducts.map((product) => (
                <div key={product._id || product.id}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Countdown Block ────────────────────────────────────────────────────────────

function CountdownBlock({ targetDate }: { targetDate: string | Date }) {
  const { days, hours, minutes, seconds } = useCountdown(targetDate);

  return (
    <div className="flex items-center gap-2 md:gap-3">
      {[
        { val: days, label: "Days" },
        { val: hours, label: "Hrs" },
        { val: minutes, label: "Min" },
        { val: seconds, label: "Sec" },
      ].map(({ val, label }, i) => (
        <div key={i} className="flex items-center gap-2 md:gap-3">
          <div className="text-center">
            <div className="w-12 md:w-14 h-12 md:h-14 bg-white rounded-xl flex items-center justify-center shadow-sm border border-orange-100">
              <span className="text-lg md:text-2xl font-black text-gray-900 tabular-nums">
                {String(val).padStart(2, "0")}
              </span>
            </div>
            <span className="text-[10px] text-gray-500 font-semibold mt-1 block">
              {label}
            </span>
          </div>
          {i < 3 && (
            <span className="text-orange-500 font-black text-lg md:text-xl mb-4">
              :
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────────

export default function BeautyShopSectionsPage() {
  const router = useRouter();
  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [dynamicCategories, setDynamicCategories] = useState<
    Array<{ name: string; count: number; image: string; color?: string }>
  >([]);

  // Deal ends 4 months from now
  const dealEndDate = useMemo(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 4);
    return d.toISOString();
  }, []);

  const generateCategories = (products: Product[]) => {
    const map = new Map();
    products.forEach((p) => {
      const name = p.category || "Uncategorized";
      if (!map.has(name)) {
        map.set(name, {
          name,
          count: 0,
          image: p.image || getDefaultImageForCategory(name),
        });
      }
      const e = map.get(name);
      e.count++;
      map.set(name, e);
    });
    setDynamicCategories(
      Array.from(map.values()).map((c, i) => ({
        ...c,
        color: categoryColors[i % categoryColors.length],
      })),
    );
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const data = await res.json();
          const productsData = data as Product[];
          const active = productsData.filter(
            (p: Product) => p.status === "Active",
          );
          setDbProducts(active);
          generateCategories(active);
        }
      } catch (e) {
        console.error("Error fetching products:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const trendingProducts = useMemo(
    () => dbProducts.filter((p) => (p.rating ?? 5) >= 4.2).slice(0, 8),
    [dbProducts],
  );
  const specialDeals = useMemo(
    () => dbProducts.filter((p) => p.discount && p.discount > 10).slice(0, 8),
    [dbProducts],
  );
  const newProducts = useMemo(
    () => [...dbProducts].reverse().slice(0, 8),
    [dbProducts],
  );
  const bestSellers = useMemo(
    () => dbProducts.filter((p) => p.stock && p.stock < 100).slice(0, 8),
    [dbProducts],
  );

  const goToShop = () => router.push("/shop");

  return (
    <div className="min-h-screen bg-gray-50/50 text-gray-900 antialiased">
      {/* ── Trust Bar ─────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px divide-x divide-gray-100">
            {[
              {
                icon: Truck,
                title: "Cash on Delivery",
                desc: "Pay at your doorstep",
              },
              {
                icon: Shield,
                title: "100% Original",
                desc: "Guaranteed authentic",
              },
              {
                icon: RefreshCw,
                title: "Easy Returns",
                desc: "7-day hassle-free",
              },
              {
                icon: CreditCard,
                title: "Secure Payment",
                desc: "Encrypted checkout",
              },
            ].map(({ icon: Icon, title, desc }, i) => (
              <div
                key={i}
                className="group flex items-center gap-3 px-4 py-4 hover:bg-orange-50/50 transition-colors duration-200"
              >
                <div className="w-9 h-9 bg-orange-50 group-hover:bg-orange-100 rounded-xl flex items-center justify-center shrink-0 transition-colors">
                  <Icon size={16} className="text-orange-500" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-xs font-bold text-gray-800">{title}</p>
                  <p className="text-[11px] text-gray-400">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Shop by Category ──────────────────────────────────── */}
      {dynamicCategories.length > 0 && (
        <section className="py-12 md:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
                Shop by{" "}
                <span className="bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent">
                  Category
                </span>
              </h2>
              <p className="text-sm text-gray-500 mt-1.5">
                {dynamicCategories.length} categories to explore
              </p>
              <div className="h-1 w-12 bg-gradient-to-r from-orange-500 to-amber-400 rounded-full mx-auto mt-3" />
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3 md:gap-4">
              {dynamicCategories.slice(0, 8).map((cat, index) => (
                <button
                  key={index}
                  onClick={() =>
                    router.push(
                      `/shop?category=${encodeURIComponent(cat.name)}`,
                    )
                  }
                  className="group flex flex-col items-center gap-2.5 p-3 md:p-4 bg-white border border-gray-100 rounded-2xl hover:border-orange-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                >
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gray-50 border border-gray-100 overflow-hidden relative shadow-inner">
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      unoptimized
                      sizes="64px"
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-[11px] md:text-xs font-bold text-gray-700 group-hover:text-orange-600 transition-colors line-clamp-1">
                      {cat.name}
                    </p>
                    <span className="text-[10px] text-gray-400 group-hover:text-orange-400 transition-colors">
                      {cat.count} items
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Flash Deal Banner ─────────────────────────────────── */}
      {specialDeals.length > 0 && (
        <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 py-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-5 md:py-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Zap size={18} className="text-white fill-white" />
                  <span className="text-white/90 text-xs font-semibold uppercase tracking-widest">
                    Happy New Year Sale
                  </span>
                </div>
                <h3 className="text-white text-lg md:text-2xl font-black leading-tight">
                  Grab your favorites before they're gone!
                </h3>
                <p className="text-white/80 text-xs md:text-sm mt-0.5">
                  Exclusive discounts available for a limited time only.
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right hidden md:block">
                  <p className="text-white/70 text-xs font-semibold uppercase tracking-wide mb-2">
                    Offer Ends In
                  </p>
                  <CountdownBlock targetDate={dealEndDate} />
                </div>
                <button
                  onClick={goToShop}
                  className="shrink-0 bg-white text-orange-600 hover:bg-orange-50 font-bold text-sm px-6 py-2.5 rounded-full shadow-md transition-all hover:-translate-y-0.5"
                >
                  Shop Deals
                </button>
              </div>
            </div>

            {/* Mobile countdown */}
            <div className="flex justify-center pb-4 md:hidden">
              <CountdownBlock targetDate={dealEndDate} />
            </div>
          </div>
        </div>
      )}

      {/* ── Loading State ──────────────────────────────────────── */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 font-medium animate-pulse text-sm">
            Loading products...
          </p>
        </div>
      )}

      {/* ── Product Sections ───────────────────────────────────── */}
      {!loading && (
        <>
          {trendingProducts.length > 0 && (
            <CategorySection
              title="Trending Now"
              icon={<Zap size={18} />}
              products={trendingProducts}
              onViewAll={goToShop}
            />
          )}

          {specialDeals.length > 0 && (
            <CategorySection
              title="Special Deals"
              icon={<Gift size={18} />}
              accent="Up to 50% off"
              products={specialDeals}
              bgColor="gradient"
              onViewAll={goToShop}
            />
          )}

          {newProducts.length > 0 && (
            <CategorySection
              title="New Arrivals"
              icon={<Sparkles size={18} />}
              products={newProducts}
              onViewAll={goToShop}
            />
          )}

          {bestSellers.length > 0 && (
            <CategorySection
              title="Best Sellers"
              icon={
                <Star size={18} className="fill-amber-500 text-amber-500" />
              }
              products={bestSellers}
              bgColor="gradient"
              onViewAll={goToShop}
            />
          )}
        </>
      )}

      {/* ── Brand Promise Banner ───────────────────────────────── */}
      <section className="py-14 md:py-20 bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-orange-500 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-amber-400 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 px-4 py-1.5 rounded-full mb-5">
            <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">
              Why Choose Us
            </span>
          </div>
          <h2 className="text-2xl md:text-4xl font-extrabold text-white mb-3 tracking-tight">
            Bangladesh's Most Trusted{" "}
            <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
              Online Store
            </span>
          </h2>
          <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto mb-10">
            Premium quality, unbeatable prices, and lightning-fast delivery —
            all in one place.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { num: "500+", label: "Premium Brands" },
              { num: `${dbProducts.length || "1K"}+`, label: "Live Products" },
              { num: "98%", label: "Happy Customers" },
              { num: "100+", label: "Cities Served" },
            ].map((s, i) => (
              <div
                key={i}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors"
              >
                <div className="text-2xl md:text-3xl font-extrabold bg-gradient-to-b from-orange-400 to-amber-300 bg-clip-text text-transparent">
                  {s.num}
                </div>
                <div className="text-xs text-gray-400 mt-1 font-medium">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
