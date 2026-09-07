"use client";

import { useState, useEffect, useRef } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";
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

export default function NewArrivalsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  const newArrivalSwiper = useRef<SwiperType | null>(null);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        setLoading(true);
        // Collection API থেকে New Arrival প্রোডাক্ট fetch
        const res = await fetch("/api/collections?type=new-arrival");
        
        if (res.ok) {
          const data = await res.json();
          setProducts(Array.isArray(data) ? data : []);
        } else {
          console.error("Failed to fetch new arrivals:", res.status);
          setProducts([]);
        }
      } catch (e) {
        console.error("Error fetching new arrivals:", e);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  return (
    <div className={`${modernSans.variable} font-sans bg-[#FDF6EE] text-[#0B2523] antialiased`}>
      <section className="py-10 mt-4 bg-[#FDF6EE]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-3">
              <div className="border-l-4 border-[#FF7A00] pl-4">
                <p className="text-[10px] font-bold text-[#0B2523]/60 uppercase tracking-widest">Fresh Collection</p>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#0B2523] tracking-tight">New Arrivals</h2>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-16 text-[#0B2523]/50 text-sm">Loading new arrivals...</div>
          ) : products.length === 0 ? (
            <div className="text-center py-16 text-[#0B2523]/50 text-sm">
              No products found. Please add products from dashboard.
            </div>
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