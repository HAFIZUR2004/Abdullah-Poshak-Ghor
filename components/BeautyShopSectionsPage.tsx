"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  FiShield,
  FiTruck,
  FiAward,
  FiHeart,
  FiUsers,
  FiThumbsUp,
  FiArrowRight,
  FiChevronLeft,
  FiChevronRight,
  FiGift,
  FiDollarSign,
  FiTrendingUp,
} from "react-icons/fi";
import CustomOrderSection from "@/components/CustomOrderSection";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Grid } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/grid";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/types";

// ─── Countdown Hook ───────────────────────────────────────────────────────────

function useCountdown(targetDate: string | Date) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

const staticCategories = [
  { name: "Sofa", image: "/images/sofa.png" },
  { name: "Bed", image: "/images/bed.png" },
  { name: "Dining Table", image: "/images/dining.png" },
  { name: "Chair", image: "/images/chair.png" },
  { name: "Wardrobe", image: "/images/dresing-taible.png" },
  { name: "Bookshelf", image: "/images/reaging-taible.png" },
  { name: "Coffee Table", image: "/images/coffee-table.png" },
  { name: "Lamp", image: "/images/lamp.png" },
  { name: "Desk", image: "/images/desk.png" },
  { name: "Mirror", image: "/images/mirror.png" },
  { name: "Rug", image: "/images/img1 (2).png" },
  { name: "Cabinet", image: "/images/img33.png" },
];

const blogPosts = [
  {
    title: "5 Tips to Style Your Living Room",
    excerpt: "Learn how to choose the right layout, mix textures, and create a cozy seating area that feels both elegant and inviting.",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=600&auto=format&fit=crop",
    link: "/blog/style-living-room",
    category: "Interior Design",
  },
  {
    title: "How to Choose the Perfect Dining Set",
    excerpt: "From table shapes to chair selections, find the dining set that fits your family's needs and personal style.",
    image: "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?q=80&w=600&auto=format&fit=crop",
    link: "/blog/choose-dining-set",
    category: "Furniture Guide",
  },
  {
    title: "Sustainable Furniture: Why It Matters",
    excerpt: "Explore the ecological benefits of choosing durable, sustainable, and ethically sourced wood furniture.",
    image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=600&auto=format&fit=crop",
    link: "/blog/sustainable-furniture",
    category: "Sustainability",
  },
];

// ─── Reusable Carousel Nav Button ────────────────────────────────────────────

function NavBtn({ onClick, dir, disabled = false }: { onClick: () => void; dir: "prev" | "next"; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all cursor-pointer shrink-0 ${
        disabled 
          ? "border-gray-200 text-gray-300 cursor-not-allowed" 
          : "border-gray-300 text-gray-500 hover:bg-[#d69a45] hover:border-[#d69a45] hover:text-white"
      }`}
      aria-label={dir === "prev" ? "Previous" : "Next"}
    >
      {dir === "prev" ? <FiChevronLeft size={15} /> : <FiChevronRight size={15} />}
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function BeautyShopSectionsPage() {
  const router = useRouter();
  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [dynamicCategories] = useState(staticCategories);
  
  const categorySwiper = useRef<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const bestSellerSwiper = useRef<SwiperType | null>(null);
  const newArrivalSwiper = useRef<SwiperType | null>(null);
  const topRatedSwiper = useRef<SwiperType | null>(null);

  const dealEndDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString();
  }, []);
  const countdown = useCountdown(dealEndDate);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const data = await res.json();
          const active = (data as Product[]).filter((p: Product) => p.status === "Active");
          setDbProducts(active);
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
    () => dbProducts.filter((p) => (p.rating ?? 5) >= 4.2).slice(0, 10),
    [dbProducts]
  );
  const specialDeals = useMemo(
    () => dbProducts.filter((p) => p.discount && p.discount > 10).slice(0, 10),
    [dbProducts]
  );
  const newArrivals = useMemo(() => [...dbProducts].reverse().slice(0, 10), [dbProducts]);
  const bestSellers = useMemo(
    () => dbProducts.filter((p) => p.stock && p.stock < 100).slice(0, 10),
    [dbProducts]
  );
  const dealProduct = useMemo(() => specialDeals[0] || dbProducts[0] || null, [specialDeals, dbProducts]);

  const goToShop = () => router.push("/shop");

  return (
    <div className="bg-[#faf8f5] text-[#2e3326] font-sans antialiased">

      {/* ── 1. Custom Order Section ────────────────────────── */}
      <CustomOrderSection />

      {/* ════════════════════════════════════════════════════════════ */}
      {/* ── 2. Shop By Category (Swiper Grid - 2 Rows) ──────────── */}
      {/* ════════════════════════════════════════════════════════════ */}
      {dynamicCategories.length > 0 && (
        <section className="py-12 bg-white">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Header Section with Navigation */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex flex-col">
                <h2 className="text-2xl md:text-3xl font-bold text-[#333333] tracking-wide">
                  Shop By Category
                </h2>
                <div className="w-10 h-[1px] bg-[#d5a158] mt-3" />
              </div>
              
              <div className="flex items-center gap-2">
                <NavBtn 
                  dir="prev" 
                  onClick={() => categorySwiper.current?.slidePrev()} 
                  disabled={isBeginning}
                />
                <NavBtn 
                  dir="next" 
                  onClick={() => categorySwiper.current?.slideNext()} 
                  disabled={isEnd}
                />
              </div>
            </div>

            {/* ✅ Swiper Grid (২ লাইন) */}
            <Swiper
              modules={[Grid, Navigation]}
              onSwiper={(swiper) => {
                categorySwiper.current = swiper;
                setIsBeginning(swiper.isBeginning);
                setIsEnd(swiper.isEnd);
              }}
              onSlideChange={(swiper) => {
                setIsBeginning(swiper.isBeginning);
                setIsEnd(swiper.isEnd);
              }}
              spaceBetween={10} // মোবাইলে গ্যাপ কমিয়ে 10 করা হয়েছে যাতে ৪টি ফিট হয়
              slidesPerView={4} // ✅ মোবাইলে (সবচেয়ে ছোট স্ক্রিনে) ৪টি কলাম
              grid={{ rows: 2, fill: "row" }}
              breakpoints={{
                // 640px এর উপরে ৩টি কলাম
                640: { slidesPerView: 3, grid: { rows: 2 }, spaceBetween: 16 },
                // 1024px এর উপরে ৬টি কলাম
                1024: { slidesPerView: 6, grid: { rows: 2 }, spaceBetween: 16 },
              }}
              className="w-full overflow-hidden py-2"
            >
              {dynamicCategories.map((cat, index) => (
                <SwiperSlide key={index} className="h-auto">
                  <button
                    onClick={() => router.push(`/shop?category=${encodeURIComponent(cat.name)}`)}
                    className="group w-full cursor-pointer focus:outline-none text-center h-full"
                  >
                    <div className="bg-[#f9f7f4] rounded-lg p-2 sm:p-3 md:p-4 flex flex-col items-center justify-center transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1 min-h-[80px] sm:min-h-[100px] md:min-h-[120px] h-full">
                      
                      <div className="w-full aspect-[4/3] relative flex items-center justify-center mb-1 sm:mb-2 md:mb-3">
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="w-[75%] sm:w-[80%] h-[75%] sm:h-[80%] object-contain transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>

                      <p className="text-[#555555] text-[9px] sm:text-[10px] md:text-xs font-medium tracking-wide">
                        {cat.name}
                      </p>
                    </div>
                  </button>
                </SwiperSlide>
              ))}
            </Swiper>

          </div>
        </section>
      )}

      {/* ── 3. Our Best Sellers ─────────────────────────────── */}
      <section className="py-10 bg-[#faf8f5]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-extrabold text-[#2e3a2c]">Our Best Sellers</h2>
              <div className="w-10 h-[2px] bg-[#d69a45] mt-2" />
            </div>
            <div className="flex items-center gap-2">
              <NavBtn dir="prev" onClick={() => bestSellerSwiper.current?.slidePrev()} />
              <NavBtn dir="next" onClick={() => bestSellerSwiper.current?.slideNext()} />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-16 text-gray-400 text-sm">Loading best sellers...</div>
          ) : bestSellers.length === 0 ? (
            <div className="text-center py-16 text-gray-400 text-sm">No products found.</div>
          ) : (
            <Swiper
              modules={[Navigation, Autoplay]}
              onSwiper={(s) => { bestSellerSwiper.current = s; }}
              spaceBetween={16}
              slidesPerView={1.2}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              breakpoints={{
                480: { slidesPerView: 2, spaceBetween: 16 },
                768: { slidesPerView: 3, spaceBetween: 16 },
                1024: { slidesPerView: 4, spaceBetween: 20 },
              }}
              className="w-full overflow-hidden py-2 px-1"
            >
              {bestSellers.map((product) => (
                <SwiperSlide key={product._id || product.id}>
                  <ProductCard product={product} />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </section>

      {/* ── 4. Banner ────────────────────────────────────────── */}
      <section className="py-0 bg-[#faf8f5] px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1400px] mx-auto">
          <div className="bg-[#3a4739] rounded-xl overflow-hidden grid grid-cols-1 lg:grid-cols-[1fr_380px] min-h-[240px]">
            <div className="p-8 sm:p-10 lg:p-12 flex flex-col justify-center gap-4">
              <h3 className="text-2xl sm:text-3xl font-extrabold leading-snug">
                <span className="block text-[#d69a45]">Crafted for Comfort.</span>
                <span className="block text-[#d69a45]">Designed for You.</span>
              </h3>
              <p className="text-white/70 text-sm leading-relaxed max-w-sm">
                Sustainable wood. Premium finish. Made to last for generations.
              </p>
              <button
                onClick={goToShop}
                className="mt-2 inline-flex items-center gap-2 bg-transparent border border-white/40 hover:border-[#d69a45] hover:bg-[#d69a45]/10 text-white text-[11px] font-bold uppercase tracking-widest px-5 py-2.5 rounded-sm transition-all w-fit cursor-pointer"
              >
                Discover More
              </button>
            </div>
            <div className="relative min-h-[200px] lg:min-h-0 hidden lg:block">
              <img
                src="https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=700&auto=format&fit=crop"
                alt="Crafted furniture"
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. New Arrivals ──────────────────────────────────── */}
      <section className="py-10 mt-4 bg-[#faf8f5]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-extrabold text-[#2e3a2c]">New Arrivals</h2>
              <div className="w-10 h-[2px] bg-[#d69a45] mt-2" />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-16 text-gray-400 text-sm">Loading new arrivals...</div>
          ) : newArrivals.length === 0 ? (
            <div className="text-center py-16 text-gray-400 text-sm">No products found.</div>
          ) : (
            <Swiper
              modules={[Navigation, Autoplay]}
              onSwiper={(s) => { newArrivalSwiper.current = s; }}
              spaceBetween={14}
              slidesPerView={2}
              autoplay={{ delay: 3500, disableOnInteraction: false }}
              breakpoints={{
                480: { slidesPerView: 2 },
                640: { slidesPerView: 3 },
                1024: { slidesPerView: 5, spaceBetween: 16 },
              }}
              className="w-full overflow-hidden py-2 px-1"
            >
              {newArrivals.map((product) => (
                <SwiperSlide key={product._id || product.id}>
                  <ProductCard product={product} />
                </SwiperSlide>
              ))}
            </Swiper>
          )}

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-10 pt-8 border-t border-gray-100">
            {[
              { icon: FiGift, title: "Summer Sale", desc: "Up to 40% Off" },
              { icon: FiTruck, title: "Free Shipping", desc: "On Orders Over ৳2000" },
              { icon: FiShield, title: "Secure Payments", desc: "100% Safe & Secure" },
              { icon: FiThumbsUp, title: "24/7 Support", desc: "We're Here to Help" },
            ].map(({ icon: Icon, title, desc }, i) => (
              <div key={i} className="flex items-center gap-3 p-4 bg-[#f4f2ec] rounded-xl">
                <Icon size={22} className="text-[#d69a45] shrink-0" />
                <div>
                  <h5 className="font-bold text-xs text-[#2e3a2c]">{title}</h5>
                  <p className="text-[11px] text-gray-400 mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. Make Your Space ───────────────────────────────── */}
      <section className="py-16 md:py-24 bg-[#faf8f5] overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="space-y-6 lg:pr-10 relative z-10">
              <div className="inline-block px-3 py-1 bg-[#d69a45]/10 text-[#d69a45] text-[10px] font-bold uppercase tracking-widest rounded-sm mb-2">
                Premium Collection
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#2e3a2c] leading-[1.15] tracking-tight">
                Make Your Space<br />More Stylish &amp; Functional
              </h2>
              <p className="text-gray-500 text-[15px] leading-relaxed max-w-md">
                From modern minimalism to classic elegance, discover thoughtfully designed pieces.
              </p>
              <div className="pt-2">
                <button
                  onClick={goToShop}
                  className="group relative inline-flex items-center justify-center bg-[#d69a45] text-white text-[11px] font-bold uppercase tracking-[0.2em] px-8 py-4 rounded-sm overflow-hidden transition-all hover:shadow-[0_10px_20px_rgba(214,154,69,0.3)]"
                >
                  <span className="relative z-10">Shop Collection</span>
                  <div className="absolute inset-0 h-full w-0 bg-[#c0873a] transition-all duration-300 ease-out group-hover:w-full z-0"></div>
                </button>
              </div>
            </div>

            <div className="relative flex justify-center items-end h-[400px] sm:h-[500px] lg:h-[600px] mt-10 lg:mt-0">
              <div className="absolute bottom-0 w-[85%] sm:w-[75%] h-[85%] bg-[#3a4739] rounded-t-full shadow-2xl overflow-hidden group">
                <div className="absolute inset-0 opacity-20 bg-[url('/images/side.jpg')] bg-cover bg-center mix-blend-overlay transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
              </div>
              <div className="absolute -bottom-6 -left-6 lg:left-10 w-40 h-40 bg-[#d69a45]/30 rounded-full blur-3xl" />
              <img
                src="/images/julia-RuCVvjuyNeQ-unsplash.jpg"
                alt="Stylish Armchair"
                className="relative z-10 w-[85%] sm:w-[80%] lg:w-[85%] object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.4)] transition-transform duration-700 hover:-translate-y-3"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. Why Choose ────────────────────────────────────── */}
      <section className="py-14 bg-[#faf8f5]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl md:text-2xl font-extrabold text-[#2e3a2c] tracking-tight mb-10">
            Why Choose Sea Connecting Dots?
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: FiAward, title: "Premium Material", desc: "High-quality, durable & sustainable." },
              { icon: FiHeart, title: "Thoughtful Design", desc: "Designed for comfort and style." },
              { icon: FiUsers, title: "Trusted by Many", desc: "Thousands of happy customers." },
              { icon: FiThumbsUp, title: "Satisfaction Guaranteed", desc: "We stand by our promise." },
            ].map(({ icon: Icon, title, desc }, idx) => (
              <div key={idx} className="flex flex-col items-center text-center gap-3 p-6 bg-[#f4f2ec] rounded-xl">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-[#d69a45] shadow-sm">
                  <Icon size={20} />
                </div>
                <h4 className="font-bold text-sm text-[#2e3a2c]">{title}</h4>
                <p className="text-[11px] text-gray-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. Stats Bar ─────────────────────────────────────── */}
      <section className="bg-[#3a4739] text-white py-8">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {[
              { stat: "12+", label: "Years Experience" },
              { stat: "25K+", label: "Happy Customers" },
              { stat: `${dbProducts.length || "360"}+`, label: "Products" },
              { stat: "98%", label: "Satisfaction Rate" },
            ].map(({ stat, label }, idx) => (
              <div key={idx}>
                <div className="text-2xl md:text-3xl font-extrabold text-[#d69a45]">{stat}</div>
                <div className="text-[11px] text-white/60 uppercase tracking-wider mt-1 font-medium">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. Deal Of The Week ──────────────────────────────── */}
      {dealProduct && (
        <section className="py-12 bg-[#faf8f5]">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl md:text-2xl font-extrabold text-[#2e3a2c]">Deal Of The Week</h2>
                <div className="w-10 h-[2px] bg-[#d69a45] mt-2" />
              </div>
              <div className="flex items-center gap-2">
                <NavBtn dir="prev" onClick={() => {}} />
                <NavBtn dir="next" onClick={() => {}} />
              </div>
            </div>

            <div className="bg-[#f4f2ec] rounded-xl p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-8 items-center">
              <div
                className="bg-white rounded-xl flex items-center justify-center h-[220px] sm:h-[280px] cursor-pointer overflow-hidden"
                onClick={() => router.push(`/product/${dealProduct._id || dealProduct.id}`)}
              >
                <img
                  src={dealProduct.image || dealProduct.images?.[0] || "https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=600&auto=format&fit=crop"}
                  alt={dealProduct.name}
                  className="max-h-full object-contain hover:scale-105 transition-transform duration-500 p-4"
                />
              </div>

              <div className="space-y-4">
                <h3
                  className="text-xl sm:text-2xl font-extrabold text-[#2e3a2c] hover:text-[#d69a45] transition-colors cursor-pointer leading-snug"
                  onClick={() => router.push(`/product/${dealProduct._id || dealProduct.id}`)}
                >
                  {dealProduct.name}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
                  {dealProduct.description || "Premium quality piece built for comfort."}
                </p>
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-black text-[#d69a45]">৳{dealProduct.price}</span>
                  {dealProduct.originalPrice && dealProduct.originalPrice > dealProduct.price && (
                    <span className="text-sm text-gray-400 line-through">৳{dealProduct.originalPrice}</span>
                  )}
                </div>
                <div className="flex gap-3">
                  {[
                    { value: countdown.days, label: "Days" },
                    { value: countdown.hours, label: "Hours" },
                    { value: countdown.minutes, label: "Min" },
                    { value: countdown.seconds, label: "Sec" },
                  ].map(({ value, label }, idx) => (
                    <div key={idx} className="bg-white rounded-lg px-3 py-2 text-center min-w-[56px] shadow-sm">
                      <span className="block font-black text-[#2e3a2c] text-base tabular-nums">
                        {String(value).padStart(2, "0")}
                      </span>
                      <span className="text-[9px] text-gray-400 uppercase font-semibold tracking-wide">{label}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => router.push(`/product/${dealProduct._id || dealProduct.id}`)}
                  className="bg-[#d69a45] hover:bg-[#c0873a] text-white text-[11px] font-bold uppercase tracking-widest px-7 py-3 rounded-sm transition-all cursor-pointer shadow-sm"
                >
                  Shop Now
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── 10. Top Rated Products ───────────────────────────── */}
      <section className="py-10 bg-[#faf8f5]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-extrabold text-[#2e3a2c]">Top Rated Products</h2>
              <div className="w-10 h-[2px] bg-[#d69a45] mt-2" />
            </div>
            <div className="flex items-center gap-2">
              <NavBtn dir="prev" onClick={() => topRatedSwiper.current?.slidePrev()} />
              <NavBtn dir="next" onClick={() => topRatedSwiper.current?.slideNext()} />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-16 text-gray-400 text-sm">Loading top rated...</div>
          ) : trendingProducts.length === 0 ? (
            <div className="text-center py-16 text-gray-400 text-sm">No products found.</div>
          ) : (
            <Swiper
              modules={[Navigation, Autoplay]}
              onSwiper={(s) => { topRatedSwiper.current = s; }}
              spaceBetween={14}
              slidesPerView={2}
              autoplay={{ delay: 4500, disableOnInteraction: false }}
              breakpoints={{
                480: { slidesPerView: 2 },
                640: { slidesPerView: 3 },
                1024: { slidesPerView: 5, spaceBetween: 16 },
              }}
              className="w-full overflow-hidden py-2 px-1"
            >
              {trendingProducts.map((product) => (
                <SwiperSlide key={product._id || product.id}>
                  <ProductCard product={product} />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </section>

      {/* ── 11. Banner ───────────────────────────────────────── */}
      <section className="py-0 bg-[#faf8f5] px-4 sm:px-6 lg:px-8 pb-10">
        <div className="max-w-[1400px] mx-auto">
          <div className="bg-[#2e3a2c] rounded-xl overflow-hidden grid grid-cols-1 lg:grid-cols-[1fr_420px] min-h-[220px]">
            <div className="p-8 sm:p-10 flex flex-col justify-center gap-4">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-snug">
                Design That Defines<br />Your Lifestyle
              </h3>
              <p className="text-white/60 text-sm leading-relaxed max-w-sm">
                Furniture that fits your space, your story, and your style.
              </p>
              <button
                onClick={goToShop}
                className="mt-1 inline-flex items-center gap-2 border border-white/30 hover:border-[#d69a45] hover:bg-[#d69a45]/10 text-white text-[11px] font-bold uppercase tracking-widest px-5 py-2.5 rounded-sm transition-all w-fit cursor-pointer"
              >
                Browse Collection
              </button>
            </div>
            <div className="relative min-h-[180px] hidden lg:block">
              <img
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=800&auto=format&fit=crop"
                alt="Lifestyle Design"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── 12. Blog ─────────────────────────────────────────── */}
      <section className="py-12 bg-[#faf8f5]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl md:text-2xl font-extrabold text-[#2e3a2c] mb-8 text-center">
            Latest From Our Blog
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogPosts.map((post, index) => (
              <div
                key={index}
                className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col"
              >
                <div className="relative h-[180px] overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-[#d69a45] text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                    {post.category}
                  </span>
                </div>
                <div className="p-5 flex-1 flex flex-col gap-3">
                  <h3 className="font-bold text-sm text-[#2e3a2c] line-clamp-2 hover:text-[#d69a45] transition-colors cursor-pointer leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed flex-1">
                    {post.excerpt}
                  </p>
                  <button
                    onClick={() => router.push(post.link)}
                    className="text-[11px] font-bold text-[#d69a45] hover:text-[#2e3a2c] transition-colors flex items-center gap-1 cursor-pointer uppercase tracking-wider mt-auto w-fit"
                  >
                    Read More <FiArrowRight size={11} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 13. Badges ───────────────────────────────────────── */}
      <section className="py-8 bg-[#faf8f5] border-t border-gray-100">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { title: "10% Off", desc: "For First Order", icon: FiGift },
              { title: "Refer & Earn", desc: "Get $20 Bonus", icon: FiDollarSign },
              { title: "VIP Club", desc: "Exclusive Benefits", icon: FiTrendingUp },
            ].map(({ title, desc, icon: Icon }, idx) => (
              <div key={idx} className="p-5 bg-[#f4f2ec] rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="font-black text-sm text-[#2e3a2c]">{title}</h4>
                  <p className="text-[11px] text-gray-400 mt-0.5">{desc}</p>
                </div>
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#d69a45] shadow-sm shrink-0">
                  <Icon size={18} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}