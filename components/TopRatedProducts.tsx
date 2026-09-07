"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/types";

const modernSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

function NavBtn({ onClick, dir, disabled = false }: { onClick: () => void; dir: "prev" | "next"; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer shrink-0 ${
        disabled 
          ? "border-[#DCE8C8]/50 text-[#DCE8C8]/50 cursor-not-allowed" 
          : "border-[#0B2523]/20 text-[#0B2523] hover:bg-[#0F3D39] hover:border-[#0F3D39] hover:text-[#E5D3B3]"
      }`}
      aria-label={dir === "prev" ? "Previous" : "Next"}
    >
      {dir === "prev" ? <FiChevronLeft size={16} /> : <FiChevronRight size={16} />}
    </button>
  );
}

export default function TopRatedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  const topRatedSwiper = useRef<SwiperType | null>(null);

  // Collection API থেকে Top Rated প্রোডাক্ট fetch করা
  useEffect(() => {
    const fetchTopRated = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/collections?type=top-rated");
        
        if (res.ok) {
          const data = await res.json();
          // Collection API থেকে প্রাপ্ত প্রোডাক্টগুলো সেট করা
          if (Array.isArray(data)) {
            setProducts(data as Product[]);
          } else {
            setProducts([]);
          }
        } else {
          console.error("Failed to fetch top rated products:", res.status);
          setProducts([]);
        }
      } catch (e) {
        console.error("Error fetching top rated products:", e);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTopRated();
  }, []);

  return (
    <div className={`${modernSans.variable} font-sans bg-[#FDF6EE] text-[#0B2523] antialiased`}>
      <section className="py-10 bg-[#FDF6EE]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-3">
              <div className="border-l-4 border-[#FF7A00] pl-4">
                <p className="text-[10px] font-bold text-[#0B2523]/60 uppercase tracking-widest">Customer Favorites</p>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#0B2523] tracking-tight">Top Rated Products</h2>
            </div>
            <div className="flex items-center gap-2">
              <NavBtn dir="prev" onClick={() => topRatedSwiper.current?.slidePrev()} />
              <NavBtn dir="next" onClick={() => topRatedSwiper.current?.slideNext()} />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-16 text-[#0B2523]/50 text-sm">Loading top rated...</div>
          ) : products.length === 0 ? (
            <div className="text-center py-16 text-[#0B2523]/50 text-sm">
              No products found. Please add products from dashboard.
            </div>
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
              {products.map((product) => (
                <SwiperSlide key={product._id || product.id}>
                  <ProductCard product={product} />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </section>
    </div>
  );
}