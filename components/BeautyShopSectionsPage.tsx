"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  FiShield,
  FiRotateCcw,
  FiTruck,
  FiAward,
  FiUsers,
  FiThumbsUp,
  FiHeart,
  FiArrowRight,
  FiChevronLeft,
  FiChevronRight,
  FiGift,
  FiDollarSign,
  FiTrendingUp,
} from "react-icons/fi";

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

const blogPosts = [
  {
    title: "5 Tips to Style Your Living Room",
    excerpt: "Learn how to choose the right layout, mix textures, and create a cozy seating area.",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=600&auto=format&fit=crop",
    link: "/blog/style-living-room",
  },
  {
    title: "How to Choose the Perfect Dining Set",
    excerpt: "From table shapes to chair selections, find the dining set that fits your family's style.",
    image: "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?q=80&w=600&auto=format&fit=crop",
    link: "/blog/choose-dining-set",
  },
  {
    title: "Sustainable Furniture: Why It Matters",
    excerpt: "Explore the ecological benefits of choosing durable, sustainable, and ethically sourced wood.",
    image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=600&auto=format&fit=crop",
    link: "/blog/sustainable-furniture",
  },
];

// ─── Main Component ─────────────────────────────────────────────────────────────

export default function BeautyShopSectionsPage() {
  const router = useRouter();
  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [dynamicCategories, setDynamicCategories] = useState<
    Array<{ name: string; count: number; image: string; color?: string }>
  >([]);

  // Target date for Deal Of The Week: 14 days from now
  const dealEndDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString();
  }, []);

  const countdown = useCountdown(dealEndDate);

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
          const active = (data as Product[]).filter((p: Product) => p.status === "Active");
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

  // Filter products using original filters
  const trendingProducts = useMemo(
    () => dbProducts.filter((p) => (p.rating ?? 5) >= 4.2).slice(0, 8),
    [dbProducts],
  );
  const specialDeals = useMemo(
    () => dbProducts.filter((p) => p.discount && p.discount > 10).slice(0, 8),
    [dbProducts],
  );
  const newArrivals = useMemo(
    () => [...dbProducts].reverse().slice(0, 8),
    [dbProducts],
  );
  const bestSellers = useMemo(
    () => dbProducts.filter((p) => p.stock && p.stock < 100).slice(0, 8),
    [dbProducts],
  );

  // Dynamic deal of the week product
  const dealProduct = useMemo(() => {
    return specialDeals[0] || dbProducts[0] || null;
  }, [specialDeals, dbProducts]);

  const goToShop = () => router.push("/shop");

  return (
    <div className="bg-[#faf8f5] text-[#2e3326] font-sans antialiased">
      
      {/* ── 1. Trust Bar (Under Hero) ────────────────────────── */}
      <section className="bg-[#faf8f5] border-y border-gray-100 py-8">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: FiAward, title: "Premium Quality", desc: "Finest materials" },
              { icon: FiHeart, title: "Timeless Design", desc: "Trendy & timeless" },
              { icon: FiTruck, title: "Fast Delivery", desc: "On-time at your door" },
              { icon: FiRotateCcw, title: "Easy Returns", desc: "Hassle-free returns" },
            ].map(({ icon: Icon, title, desc }, i) => (
              <div key={i} className="flex items-center gap-4 justify-center">
                <div className="w-12 h-12 bg-[#f4f2ec] rounded-full flex items-center justify-center text-[#d69a45] shrink-0">
                  <Icon size={20} />
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-sm text-[#2e3a2c]">{title}</h4>
                  <p className="text-xs text-gray-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 2. Shop By Category (Restored Dynamic Generation) ── */}
      {dynamicCategories.length > 0 && (
        <section className="py-16 bg-[#faf8f5]">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#2e3a2c] tracking-tight mb-3">
              Shop By Category
            </h2>
            <p className="text-xs text-gray-500 mb-2">{dynamicCategories.length} categories to explore</p>
            <div className="w-12 h-[2px] bg-[#d69a45] mx-auto mb-12" />

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {dynamicCategories.slice(0, 6).map((cat, index) => (
                <button
                  key={index}
                  onClick={() => router.push(`/shop?category=${encodeURIComponent(cat.name)}`)}
                  className="group flex flex-col items-center gap-4 p-5 bg-[#f4f2ec] rounded-xl hover:shadow-md transition-all duration-300 cursor-pointer"
                >
                  <div className="w-24 h-24 relative overflow-hidden flex items-center justify-center bg-white rounded-lg shadow-inner">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <span className="font-bold text-sm text-[#2e3a2c] group-hover:text-[#d69a45] transition-colors line-clamp-1">
                    {cat.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 3. Our Best Sellers ─────────────────────────────── */}
      <section className="py-16 bg-[#faf8f5]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div className="text-left">
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#2e3a2c]">
                Our Best Sellers
              </h2>
              <div className="w-12 h-[2px] bg-[#d69a45] mt-3" />
            </div>
            {/* Nav Arrows Indicator */}
            <div className="flex gap-2">
              <button className="w-9 h-9 rounded-full bg-[#f4f2ec] hover:bg-[#d69a45] hover:text-white flex items-center justify-center text-gray-700 transition cursor-pointer">
                <FiChevronLeft size={18} />
              </button>
              <button className="w-9 h-9 rounded-full bg-[#f4f2ec] hover:bg-[#d69a45] hover:text-white flex items-center justify-center text-gray-700 transition cursor-pointer">
                <FiChevronRight size={18} />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">Loading best sellers...</div>
          ) : bestSellers.length === 0 ? (
            <div className="text-center py-12 text-gray-400">No products available.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {bestSellers.map((product) => (
                <ProductCard key={product._id || product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── 4. Promo Banner 1 ────────────────────────────────── */}
      <section className="py-8 bg-[#faf8f5]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#3a4739] rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 gap-0 shadow-lg">
            {/* Left Content */}
            <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center space-y-6 text-left">
              <h3 className="text-3xl sm:text-4xl font-extrabold leading-tight">
                <span className="block text-white">Crafted for Comfort.</span>
                <span className="block text-[#d69a45] mt-1">Designed for You.</span>
              </h3>
              <p className="text-white/80 text-sm sm:text-base leading-relaxed">
                Sustainable wood. Premium finish. Made to last for generations. Each piece is meticulously built to deliver both physical comfort and aesthetic value.
              </p>
              <button
                onClick={goToShop}
                className="inline-block border border-white hover:border-[#d69a45] text-white hover:text-[#d69a45] text-xs font-bold uppercase tracking-wider px-6 py-3 rounded transition-all max-w-[200px] text-center cursor-pointer"
              >
                Discover More
              </button>
            </div>
            {/* Right Image */}
            <div className="relative min-h-[300px] lg:min-h-0">
              <img
                src="https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=800&auto=format&fit=crop"
                alt="Crafted for Comfort"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. New Arrivals ─────────────────────────────────── */}
      <section className="py-16 bg-[#faf8f5]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#2e3a2c]">
              New Arrivals
            </h2>
            <div className="w-12 h-[2px] bg-[#d69a45] mx-auto mt-3" />
          </div>

          {loading ? (
            <div className="text-center py-12">Loading new arrivals...</div>
          ) : newArrivals.length === 0 ? (
            <div className="text-center py-12 text-gray-400">No products available.</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {newArrivals.map((product) => (
                <ProductCard key={product._id || product.id} product={product} />
              ))}
            </div>
          )}

          {/* Under arrivals trust highlights bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-16 pt-8 border-t border-gray-100">
            {[
              { icon: FiGift, title: "Summer Sale", desc: "Up to 40% Off" },
              { icon: FiTruck, title: "Free Shipping", desc: "On Orders Over $200" },
              { icon: FiShield, title: "Secure Payments", desc: "100% Safe & Secure" },
              { icon: FiThumbsUp, title: "24/7 Support", desc: "We're Here to Help" },
            ].map(({ icon: Icon, title, desc }, i) => (
              <div key={i} className="flex flex-col items-center text-center p-4 bg-[#f4f2ec] rounded-xl">
                <Icon size={24} className="text-[#d69a45] mb-2" />
                <h5 className="font-bold text-sm text-[#2e3a2c]">{title}</h5>
                <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── 6. Make Your Space More Stylish & Functional ────── */}
      <section className="py-16 bg-[#f4f2ec] relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center text-left">
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#2e3a2c] leading-tight">
                Make Your Space <br /> More Stylish & Functional
              </h2>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                From modern minimalism to classic elegance, find the perfect pieces to match your lifestyle. Enhance your daily living with functional design choices.
              </p>
              <button
                onClick={goToShop}
                className="bg-[#d69a45] hover:bg-[#c0873a] text-white text-xs font-bold uppercase tracking-wider px-8 py-4 rounded transition-all inline-block shadow-md cursor-pointer"
              >
                Shop Collection
              </button>
            </div>
            
            {/* Visual Armchair + Circle graphic */}
            <div className="relative flex justify-center items-center h-[350px] sm:h-[450px]">
              {/* Graphic gold circle in the background */}
              <div className="absolute w-[280px] h-[280px] sm:w-[380px] sm:h-[380px] bg-[#d69a45]/20 rounded-full -z-10" />
              {/* Armchair image */}
              <div className="relative w-[85%] h-[85%]">
                <img
                  src="/images/julia-RuCVvjuyNeQ-unsplash.jpg"
                  alt="Stylish Armchair"
                  className="w-full h-full object-contain rounded-full shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. Why Choose Sea Connecting Dots? ────────────────── */}
      <section className="py-16 bg-[#faf8f5]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#2e3a2c] tracking-tight mb-3">
            Why Choose Sea Connecting Dots?
          </h2>
          <div className="w-12 h-[2px] bg-[#d69a45] mx-auto mb-12" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: FiAward, title: "Premium Material", desc: "We use high-quality, durable & sustainable materials." },
              { icon: FiHeart, title: "Thoughtful Design", desc: "Every piece is designed for comfort and style." },
              { icon: FiUsers, title: "Trusted by Many", desc: "Thousands of happy customers trust our quality." },
              { icon: FiThumbsUp, title: "Satisfaction Guaranteed", desc: "We stand by our promise of quality." },
            ].map(({ icon: Icon, title, desc }, idx) => (
              <div key={idx} className="p-6 bg-[#f4f2ec] rounded-xl flex flex-col items-center text-center space-y-3">
                <Icon size={24} className="text-[#d69a45]" />
                <h4 className="font-bold text-base text-[#2e3a2c]">{title}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. Stats Bar (Dark Olive Green & Dynamic Live count)  ── */}
      <section className="bg-[#2e3a2c] text-white py-10 shadow-inner">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { stat: "12+", label: "Years Experience" },
              { stat: "25K+", label: "Happy Customers" },
              { stat: `${dbProducts.length || "360"}+`, label: "Live Products" },
              { stat: "98%", label: "Satisfaction Rate" },
            ].map(({ stat, label }, idx) => (
              <div key={idx} className="space-y-1">
                <div className="text-3xl md:text-4xl font-extrabold text-[#d69a45]">{stat}</div>
                <div className="text-xs text-white/70 uppercase tracking-wider font-semibold">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. Deal Of The Week (Restored Dynamic Spotlight) ── */}
      {dealProduct && (
        <section className="py-16 bg-[#faf8f5]">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div className="text-left">
                <h2 className="text-2xl md:text-3xl font-extrabold text-[#2e3a2c]">
                  Deal Of The Week
                </h2>
                <div className="w-12 h-[2px] bg-[#d69a45] mt-3" />
              </div>
              {/* Slider arrows */}
              <div className="flex gap-2">
                <button className="w-9 h-9 rounded-full bg-[#f4f2ec] flex items-center justify-center text-gray-500 cursor-pointer">
                  <FiChevronLeft size={18} />
                </button>
                <button className="w-9 h-9 rounded-full bg-[#f4f2ec] flex items-center justify-center text-gray-500 cursor-pointer">
                  <FiChevronRight size={18} />
                </button>
              </div>
            </div>

            {/* Deal Spotlight Card */}
            <div className="bg-[#f4f2ec] rounded-2xl p-6 sm:p-10 lg:p-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Deal Image */}
              <div 
                className="bg-white rounded-xl p-4 flex items-center justify-center aspect-square h-[250px] sm:h-[350px] cursor-pointer"
                onClick={() => router.push(`/product/${dealProduct._id || dealProduct.id}`)}
              >
                <img
                  src={dealProduct.image || dealProduct.images?.[0] || "https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=600&auto=format&fit=crop"}
                  alt={dealProduct.name}
                  className="max-h-full object-contain hover:scale-102 transition-transform duration-300"
                />
              </div>
              {/* Deal Details */}
              <div className="text-left space-y-6">
                <span className="inline-block bg-[#d69a45] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Special Offer
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#2e3a2c] hover:text-[#d69a45] transition-colors cursor-pointer"
                    onClick={() => router.push(`/product/${dealProduct._id || dealProduct.id}`)}
                >
                  {dealProduct.name}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                  {dealProduct.description || "Premium quality piece constructed to offer the highest levels of comfort and design styling to elevate your home space."}
                </p>

                {/* Price Details */}
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-black text-[#d69a45]">৳{dealProduct.price}</span>
                  {dealProduct.originalPrice && dealProduct.originalPrice > dealProduct.price && (
                    <span className="text-sm text-gray-400 line-through">৳{dealProduct.originalPrice}</span>
                  )}
                </div>

                {/* Timer/Countdown display */}
                <div className="flex gap-4">
                  {[
                    { value: countdown.days, label: "Days" },
                    { value: countdown.hours, label: "Hours" },
                    { value: countdown.minutes, label: "Min" },
                    { value: countdown.seconds, label: "Sec" },
                  ].map(({ value, label }, idx) => (
                    <div key={idx} className="bg-white px-3 py-2 rounded-lg text-center min-w-[60px] shadow-sm">
                      <span className="block font-black text-[#2e3a2c] text-lg tabular-nums">
                        {String(value).padStart(2, "0")}
                      </span>
                      <span className="text-[10px] text-gray-500 uppercase font-semibold">{label}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => router.push(`/product/${dealProduct._id || dealProduct.id}`)}
                  className="bg-[#d69a45] hover:bg-[#c0873a] text-white text-xs font-bold uppercase tracking-wider px-8 py-3.5 rounded transition-all inline-block shadow cursor-pointer"
                >
                  Shop Now
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── 10. Top Rated Products ──────────────────────────── */}
      <section className="py-16 bg-[#faf8f5]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div className="text-left">
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#2e3a2c]">
                Top Rated Products
              </h2>
              <div className="w-12 h-[2px] bg-[#d69a45] mt-3" />
            </div>
            <div className="flex gap-2">
              <button className="w-9 h-9 rounded-full bg-[#f4f2ec] flex items-center justify-center text-gray-500 cursor-pointer">
                <FiChevronLeft size={18} />
              </button>
              <button className="w-9 h-9 rounded-full bg-[#f4f2ec] flex items-center justify-center text-gray-500 cursor-pointer">
                <FiChevronRight size={18} />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">Loading top rated products...</div>
          ) : trendingProducts.length === 0 ? (
            <div className="text-center py-12 text-gray-400">No products available.</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {trendingProducts.slice(0, 5).map((product) => (
                <ProductCard key={product._id || product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── 11. Promo Banner 2 ───────────────────────────────── */}
      <section className="py-8 bg-[#faf8f5]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#3a4739] rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 gap-0 shadow-lg">
            {/* Left Content */}
            <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center space-y-6 text-left">
              <h3 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                Design that Defines Your Lifestyle
              </h3>
              <p className="text-white/80 text-sm sm:text-base leading-relaxed">
                Furniture that fits your space, your story, and your style. Add a touch of character and elevate standard rooms into design-forward settings.
              </p>
              <button
                onClick={goToShop}
                className="inline-block border border-white hover:border-[#d69a45] text-white hover:text-[#d69a45] text-xs font-bold uppercase tracking-wider px-6 py-3 rounded transition-all max-w-[200px] text-center cursor-pointer"
              >
                Browse Collection
              </button>
            </div>
            {/* Right Image */}
            <div className="relative min-h-[300px] lg:min-h-0">
              <img
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=800&auto=format&fit=crop"
                alt="Lifestyle Furniture Design"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── 12. Latest From Our Blog ────────────────────────── */}
      <section className="py-16 bg-[#faf8f5]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#2e3a2c] tracking-tight mb-3">
            Latest From Our Blog
          </h2>
          <div className="w-12 h-[2px] bg-[#d69a45] mx-auto mb-12" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {blogPosts.map((post, index) => (
              <div key={index} className="bg-[#f4f2ec] rounded-xl overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col h-full">
                <div className="relative aspect-video w-full">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-bold text-lg text-[#2e3a2c] line-clamp-2 hover:text-[#d69a45] transition-colors cursor-pointer">
                      {post.title}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>
                  <button
                    onClick={() => router.push(post.link)}
                    className="text-xs font-bold text-[#d69a45] hover:text-[#2e3a2c] transition-colors flex items-center gap-1.5 cursor-pointer uppercase tracking-wider"
                  >
                    Read More <FiArrowRight />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 13. Bottom Highlight Badges ──────────────────────── */}
      <section className="py-8 bg-[#faf8f5]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "10% Off", desc: "For First Order", icon: FiGift },
              { title: "Refer & Earn", desc: "Get $20 Bonus", icon: FiDollarSign },
              { title: "VIP Club", desc: "Exclusive Benefits", icon: FiTrendingUp },
            ].map(({ title, desc, icon: Icon }, idx) => (
              <div key={idx} className="p-6 bg-[#f4f2ec] rounded-xl flex items-center justify-between border border-[#3a4739]/5 shadow-sm">
                <div className="text-left space-y-1">
                  <h4 className="font-black text-lg text-[#2e3a2c]">{title}</h4>
                  <p className="text-xs text-gray-500">{desc}</p>
                </div>
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#d69a45] shadow-inner shrink-0">
                  <Icon size={20} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
