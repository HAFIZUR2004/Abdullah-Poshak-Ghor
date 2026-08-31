"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Grid } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/grid";
import { FiChevronLeft, FiChevronRight, FiArrowLeft } from "react-icons/fi";

// ─── Categories Data ──────────────────────────────────────────────────────────
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

// ─── Reusable Nav Button ──────────────────────────────────────────────────────
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

export default function Categories() {
  const router = useRouter();
  const categorySwiper = useRef<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  return (
    <div className="bg-[#FDF6EE] text-[#0B2523] font-sans antialiased min-h-screen ">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-3">
        
        {/* Page Header */}
        <div className="text-center ">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-medium text-[#0B2523] leading-[1.1] tracking-tight">
  Shop By <span className="inline-block text-[#0F3D39] ml-2">Category</span>
</h1>
          
          <div className="w-16 h-[2px] bg-[#FF7A00] mx-auto mt-6" />
          
          <p className="text-sm text-[#0B2523]/70 mt-6 max-w-md mx-auto font-medium">
            Explore our wide range of furniture categories to find the perfect pieces for your home.
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-end  gap-3">
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

        {/* Category Grid (Swiper with 2 Rows) */}
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
          spaceBetween={16}
          slidesPerView={2}
          grid={{ rows: 2, fill: "row" }}
          breakpoints={{
            640: { slidesPerView: 3, grid: { rows: 2 }, spaceBetween: 16 },
            768: { slidesPerView: 4, grid: { rows: 2 }, spaceBetween: 16 },
            1024: { slidesPerView: 6, grid: { rows: 2 }, spaceBetween: 20 },
          }}
          className="w-full overflow-hidden py-2"
        >
          {staticCategories.map((cat, index) => (
            <SwiperSlide key={index} className="h-auto">
              <button
                onClick={() => router.push(`/shop?category=${encodeURIComponent(cat.name)}`)}
                className="group w-full cursor-pointer focus:outline-none text-center h-full"
              >
                <div className="bg-white rounded-xl p-5 flex flex-col items-center justify-center transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-2 group-hover:border-[#0F3D39] min-h-[160px] h-full border-2 border-transparent">
                  
                  <div className="w-full aspect-[4/3] relative flex items-center justify-center mb-3">
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                      className="object-contain p-2 transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  
                  <p className="text-[#0B2523] text-sm font-bold tracking-wide group-hover:text-[#0F3D39] transition-colors">
                    {cat.name}
                  </p>
                  
                  <div className="w-8 h-[2px] bg-[#FF7A00] mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </button>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Back to Home Button */}
       

      </div>
    </div>
  );
}