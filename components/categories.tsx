"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Grid } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/grid";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface Category {
  _id?: string;
  name: string;
  image: string;
  slug?: string;
}

export default function Categories() {
  const router = useRouter();
  const swiperRef = useRef<SwiperType | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/categories");
        const data = await res.json();
        if (data.success && data.categories.length > 0) {
          setCategories(data.categories);
        }
      } catch (error) {
        console.error("Failed to load categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // ✅ Swiper state sync helper
  const syncNavState = useCallback((swiper: SwiperType) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  }, []);

  // ✅ Prev handler — disabled check + touch support
  const handlePrev = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const swiper = swiperRef.current;
      if (!swiper || swiper.isBeginning) return;
      swiper.slidePrev();
      // mobile-এ state update force করো
      requestAnimationFrame(() => syncNavState(swiper));
    },
    [syncNavState]
  );

  // ✅ Next handler
  const handleNext = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const swiper = swiperRef.current;
      if (!swiper || swiper.isEnd) return;
      swiper.slideNext();
      requestAnimationFrame(() => syncNavState(swiper));
    },
    [syncNavState]
  );

  if (!isMounted) return null;

  const isTwoRows = categories.length > 3;

  return (
    <div className="bg-[#FDF6EE] text-[#0B2523] font-sans antialiased py-6 sm:py-12 lg:py-16 select-none">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-6 sm:mb-10 lg:mb-12">
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-medium text-[#0B2523] leading-[1.1] tracking-tight">
            Shop By <span className="inline-block text-[#0F3D39] ml-1 sm:ml-2">Category</span>
          </h1>

          <div className="w-10 sm:w-16 h-[2px] bg-[#FF7A00] mx-auto mt-3 sm:mt-6" />

          <p className="text-[11px] sm:text-sm text-[#0B2523]/70 mt-3 sm:mt-6 max-w-xs sm:max-w-md mx-auto font-medium px-2">
            Explore our wide range of furniture categories to find the perfect pieces for your home.
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-end gap-2 sm:gap-3 mb-3 sm:mb-6 relative z-30">
          <button
            type="button"
            onClick={handlePrev}
            onTouchEnd={handlePrev}
            aria-disabled={isBeginning}
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer shrink-0 z-30 touch-manipulation ${
              isBeginning
                ? "border-[#E5D3B3]/40 text-[#E5D3B3]/40 cursor-not-allowed opacity-50"
                : "border-[#0B2523]/20 text-[#0B2523] active:scale-90 hover:bg-[#0F3D39] hover:border-[#0F3D39] hover:text-[#E5D3B3]"
            }`}
            aria-label="Previous"
          >
            <FiChevronLeft size={18} />
          </button>

          <button
            type="button"
            onClick={handleNext}
            onTouchEnd={handleNext}
            aria-disabled={isEnd}
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer shrink-0 z-30 touch-manipulation ${
              isEnd
                ? "border-[#E5D3B3]/40 text-[#E5D3B3]/40 cursor-not-allowed opacity-50"
                : "border-[#0B2523]/20 text-[#0B2523] active:scale-90 hover:bg-[#0F3D39] hover:border-[#0F3D39] hover:text-[#E5D3B3]"
            }`}
            aria-label="Next"
          >
            <FiChevronRight size={18} />
          </button>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-8 h-8 border-4 border-[#0F3D39] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-sm">
            No categories available at the moment.
          </div>
        ) : (
          <div className="relative">
            <Swiper
              key={categories.length}
              modules={[Navigation, Grid]}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
                // ✅ initial state sync
                syncNavState(swiper);
                setTimeout(() => {
                  swiper.update();
                  syncNavState(swiper);
                }, 300);
              }}
              onSlideChange={syncNavState}
              onResize={syncNavState}
              onReachBeginning={syncNavState}
              onReachEnd={syncNavState}
              onFromEdge={syncNavState}
              slidesPerView={3}
              grid={{
                rows: isTwoRows ? 2 : 1,
                fill: "row",
              }}
              spaceBetween={6}
              watchOverflow={true}
              breakpoints={{
                0: {
                  slidesPerView: 3,
                  grid: { rows: isTwoRows ? 2 : 1 },
                  spaceBetween: 6,
                },
                640: {
                  slidesPerView: 4,
                  grid: { rows: isTwoRows ? 2 : 1 },
                  spaceBetween: 10,
                },
                768: {
                  slidesPerView: 5,
                  grid: { rows: isTwoRows ? 2 : 1 },
                  spaceBetween: 12,
                },
                1024: {
                  slidesPerView: 6,
                  grid: { rows: isTwoRows ? 2 : 1 },
                  spaceBetween: 14,
                },
                1280: {
                  slidesPerView: 7,
                  grid: { rows: isTwoRows ? 2 : 1 },
                  spaceBetween: 16,
                },
              }}
              className="w-full overflow-hidden"
            >
              {categories.map((cat, index) => (
                <SwiperSlide key={cat._id || index} className="h-auto">
                  <button
                    onClick={() =>
                      router.push(`/shop?category=${encodeURIComponent(cat.name)}`)
                    }
                    className="group w-full cursor-pointer focus:outline-none text-center h-full"
                  >
                    <div className="bg-white rounded-lg sm:rounded-xl p-1.5 sm:p-2.5 lg:p-3 flex flex-col items-center justify-center transition-all duration-300 group-hover:shadow-lg sm:group-hover:shadow-xl group-hover:-translate-y-1 group-hover:border-[#0F3D39] min-h-[80px] sm:min-h-[100px] lg:min-h-[110px] h-full border-2 border-transparent">
                      <div className="w-full aspect-[3/2] relative flex items-center justify-center mb-1 sm:mb-1.5">
                        <Image
                          src={cat.image || "/placeholder.png"}
                          alt={cat.name}
                          fill
                          sizes="(max-width: 640px) 25vw, (max-width: 768px) 20vw, (max-width: 1024px) 16vw, 12vw"
                          className="object-contain p-0.5 sm:p-1 transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>

                      <p className="text-[#0B2523] text-[9px] sm:text-[11px] lg:text-xs font-bold tracking-tight sm:tracking-wide group-hover:text-[#0F3D39] transition-colors line-clamp-1">
                        {cat.name}
                      </p>

                      <div className="w-3 sm:w-5 h-[1px] sm:h-[1.5px] bg-[#FF7A00] mt-0.5 sm:mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </button>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}

      </div>
    </div>
  );
}