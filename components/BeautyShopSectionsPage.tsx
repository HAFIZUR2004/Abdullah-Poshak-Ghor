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
import { Navigation, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
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

// ─── Reusable Carousel Nav Button (Hero Style) ─────────────────────────────────

function NavBtn({ onClick, dir, disabled = false }: { onClick: () => void; dir: "prev" | "next"; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer shrink-0 ${
        disabled 
          ? "border-[#E5D3B3]/40 text-[#E5D3B3]/40 cursor-not-allowed" 
          : "border-[#0B2523]/20 text-[#0B2523] hover:bg-[#0F3D39] hover:border-[#0F3D39] hover:text-[#E5D3B3]"
      }`}
      aria-label={dir === "prev" ? "Previous" : "Next"}
    >
      {dir === "prev" ? <FiChevronLeft size={16} /> : <FiChevronRight size={16} />}
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function BeautyShopSectionsPage() {
  const router = useRouter();
  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
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
    <div className="bg-[#FDF6EE] text-[#0B2523] font-sans antialiased">

      {/* ── 3. Our Best Sellers ─────────────────────────────── */}
      <section className="py-10 bg-[#FDF6EE]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-extrabold text-[#0B2523]">Our Best Sellers</h2>
              <div className="w-10 h-[2px] bg-[#FF7A00] mt-2" />
            </div>
            <div className="flex items-center gap-2">
              <NavBtn dir="prev" onClick={() => bestSellerSwiper.current?.slidePrev()} />
              <NavBtn dir="next" onClick={() => bestSellerSwiper.current?.slideNext()} />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-16 text-[#0B2523]/50 text-sm">Loading best sellers...</div>
          ) : bestSellers.length === 0 ? (
            <div className="text-center py-16 text-[#0B2523]/50 text-sm">No products found.</div>
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
      <section className="py-0 bg-[#FDF6EE] px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1400px] mx-auto">
          <div className="bg-[#0F3D39] rounded-xl overflow-hidden grid grid-cols-1 lg:grid-cols-[1fr_380px] min-h-[240px]">
            <div className="p-8 sm:p-10 lg:p-12 flex flex-col justify-center gap-4">
              <h3 className="text-2xl sm:text-3xl font-extrabold leading-snug">
                <span className="block text-[#E5D3B3]">Crafted for Comfort.</span>
                <span className="block text-[#E5D3B3]">Designed for You.</span>
              </h3>
              <p className="text-[#E5D3B3]/70 text-sm leading-relaxed max-w-sm">
                Sustainable wood. Premium finish. Made to last for generations.
              </p>
              <button
                onClick={goToShop}
                className="mt-2 inline-flex items-center gap-2 bg-transparent border border-[#E5D3B3]/40 hover:border-[#FF7A00] hover:bg-[#FF7A00]/10 text-[#E5D3B3] text-[11px] font-bold uppercase tracking-widest px-5 py-2.5 rounded-sm transition-all w-fit cursor-pointer"
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
      <section className="py-10 mt-4 bg-[#FDF6EE]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-extrabold text-[#0B2523]">New Arrivals</h2>
              <div className="w-10 h-[2px] bg-[#FF7A00] mt-2" />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-16 text-[#0B2523]/50 text-sm">Loading new arrivals...</div>
          ) : newArrivals.length === 0 ? (
            <div className="text-center py-16 text-[#0B2523]/50 text-sm">No products found.</div>
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

        
        </div>
      </section>

      {/* ── 6. Make Your Space ───────────────────────────────── */}
      <section className="py-16 md:py-24 bg-[#FDF6EE] overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="space-y-6 lg:pr-10 relative z-10">
              <div className="inline-block px-3 py-1 bg-[#FF7A00]/10 text-[#FF7A00] text-[10px] font-bold uppercase tracking-widest rounded-sm mb-2">
                Premium Collection
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B2523] leading-[1.15] tracking-tight">
                Make Your Space<br />More Stylish &amp; Functional
              </h2>
              <p className="text-[#0B2523]/70 text-[15px] leading-relaxed max-w-md">
                From modern minimalism to classic elegance, discover thoughtfully designed pieces.
              </p>
              <div className="pt-2">
                <button
                  onClick={goToShop}
                  className="group relative inline-flex items-center justify-center bg-[#FF7A00] text-white text-[11px] font-bold uppercase tracking-[0.2em] px-8 py-4 rounded-sm overflow-hidden transition-all hover:shadow-[0_10px_20px_rgba(255,122,0,0.3)]"
                >
                  <span className="relative z-10">Shop Collection</span>
                  <div className="absolute inset-0 h-full w-0 bg-[#E56E00] transition-all duration-300 ease-out group-hover:w-full z-0"></div>
                </button>
              </div>
            </div>

            <div className="relative flex justify-center items-end h-[400px] sm:h-[500px] lg:h-[600px] mt-10 lg:mt-0">
              <div className="absolute bottom-0 w-[85%] sm:w-[75%] h-[85%] bg-[#0F3D39] rounded-t-full shadow-2xl overflow-hidden group">
                <div className="absolute inset-0 opacity-20 bg-[url('/images/side.jpg')] bg-cover bg-center mix-blend-overlay transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
              </div>
              <div className="absolute -bottom-6 -left-6 lg:left-10 w-40 h-40 bg-[#FF7A00]/30 rounded-full blur-3xl" />
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
      <section className="py-14 bg-[#FDF6EE]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl md:text-2xl font-extrabold text-[#0B2523] tracking-tight mb-10">
            Why Choose Davici Furniture?
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: FiAward, title: "Premium Material", desc: "High-quality, durable & sustainable." },
              { icon: FiHeart, title: "Thoughtful Design", desc: "Designed for comfort and style." },
              { icon: FiUsers, title: "Trusted by Many", desc: "Thousands of happy customers." },
              { icon: FiThumbsUp, title: "Satisfaction Guaranteed", desc: "We stand by our promise." },
            ].map(({ icon: Icon, title, desc }, idx) => (
              <div key={idx} className="flex flex-col items-center text-center gap-3 p-6 bg-white rounded-xl border border-[#E5D3B3]/20">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#FDF6EE] text-[#FF7A00] shadow-sm">
                  <Icon size={20} />
                </div>
                <h4 className="font-bold text-sm text-[#0B2523]">{title}</h4>
                <p className="text-[11px] text-[#0B2523]/60 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. Stats Bar ─────────────────────────────────────── */}
      <section className="bg-[#0F3D39] text-white py-8">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {[
              { stat: "12+", label: "Years Experience" },
              { stat: "25K+", label: "Happy Customers" },
              { stat: `${dbProducts.length || "360"}+`, label: "Products" },
              { stat: "98%", label: "Satisfaction Rate" },
            ].map(({ stat, label }, idx) => (
              <div key={idx}>
                <div className="text-2xl md:text-3xl font-extrabold text-[#E5D3B3]">{stat}</div>
                <div className="text-[11px] text-[#E5D3B3]/60 uppercase tracking-wider mt-1 font-medium">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. Deal Of The Week ──────────────────────────────── */}
      {dealProduct && (
        <section className="py-12 bg-[#FDF6EE]">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl md:text-2xl font-extrabold text-[#0B2523]">Deal Of The Week</h2>
                <div className="w-10 h-[2px] bg-[#FF7A00] mt-2" />
              </div>
              <div className="flex items-center gap-2">
                <NavBtn dir="prev" onClick={() => {}} />
                <NavBtn dir="next" onClick={() => {}} />
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-8 items-center border border-[#E5D3B3]/20 shadow-sm">
              <div
                className="bg-[#FDF6EE] rounded-xl flex items-center justify-center h-[220px] sm:h-[280px] cursor-pointer overflow-hidden"
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
                  className="text-xl sm:text-2xl font-extrabold text-[#0B2523] hover:text-[#FF7A00] transition-colors cursor-pointer leading-snug"
                  onClick={() => router.push(`/product/${dealProduct._id || dealProduct.id}`)}
                >
                  {dealProduct.name}
                </h3>
                <p className="text-[#0B2523]/70 text-sm leading-relaxed line-clamp-2">
                  {dealProduct.description || "Premium quality piece built for comfort."}
                </p>
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-black text-[#FF7A00]">৳{dealProduct.price}</span>
                  {dealProduct.originalPrice && dealProduct.originalPrice > dealProduct.price && (
                    <span className="text-sm text-[#0B2523]/50 line-through">৳{dealProduct.originalPrice}</span>
                  )}
                </div>
                <div className="flex gap-3">
                  {[
                    { value: countdown.days, label: "Days" },
                    { value: countdown.hours, label: "Hours" },
                    { value: countdown.minutes, label: "Min" },
                    { value: countdown.seconds, label: "Sec" },
                  ].map(({ value, label }, idx) => (
                    <div key={idx} className="bg-[#FDF6EE] rounded-lg px-3 py-2 text-center min-w-[56px] shadow-sm border border-[#E5D3B3]/20">
                      <span className="block font-black text-[#0B2523] text-base tabular-nums">
                        {String(value).padStart(2, "0")}
                      </span>
                      <span className="text-[9px] text-[#0B2523]/50 uppercase font-semibold tracking-wide">{label}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => router.push(`/product/${dealProduct._id || dealProduct.id}`)}
                  className="bg-[#FF7A00] hover:bg-[#E56E00] text-white text-[11px] font-bold uppercase tracking-widest px-7 py-3 rounded-sm transition-all cursor-pointer shadow-sm"
                >
                  Shop Now
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── 10. Top Rated Products ───────────────────────────── */}
      <section className="py-10 bg-[#FDF6EE]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-extrabold text-[#0B2523]">Top Rated Products</h2>
              <div className="w-10 h-[2px] bg-[#FF7A00] mt-2" />
            </div>
            <div className="flex items-center gap-2">
              <NavBtn dir="prev" onClick={() => topRatedSwiper.current?.slidePrev()} />
              <NavBtn dir="next" onClick={() => topRatedSwiper.current?.slideNext()} />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-16 text-[#0B2523]/50 text-sm">Loading top rated...</div>
          ) : trendingProducts.length === 0 ? (
            <div className="text-center py-16 text-[#0B2523]/50 text-sm">No products found.</div>
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
      <section className="py-0 bg-[#FDF6EE] px-4 sm:px-6 lg:px-8 pb-10">
        <div className="max-w-[1400px] mx-auto">
          <div className="bg-[#0B2523] rounded-xl overflow-hidden grid grid-cols-1 lg:grid-cols-[1fr_420px] min-h-[220px]">
            <div className="p-8 sm:p-10 flex flex-col justify-center gap-4">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#E5D3B3] leading-snug">
                Design That Defines<br />Your Lifestyle
              </h3>
              <p className="text-[#E5D3B3]/60 text-sm leading-relaxed max-w-sm">
                Furniture that fits your space, your story, and your style.
              </p>
              <button
                onClick={goToShop}
                className="mt-1 inline-flex items-center gap-2 border border-[#E5D3B3]/30 hover:border-[#FF7A00] hover:bg-[#FF7A00]/10 text-[#E5D3B3] text-[11px] font-bold uppercase tracking-widest px-5 py-2.5 rounded-sm transition-all w-fit cursor-pointer"
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
    

   

    </div>
  );
}