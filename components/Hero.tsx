"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

// ─── Data ──────────────────────────────────────────────────────────────────────

const mainSlides = [
  { id: 1, image: "/images/heroimg.webp", alt: "Fashion Collection" },
  { id: 1, image: "/images/side.jpg", alt: "Fashion Collection" },
  { id: 2, image: "/images/side2.jpg", alt: "New Season" },
  { id: 3, image: "/images/side2.jpg", alt: "Hot Deals" },
];

const sideImages = [
  {
    id: 1,
    image: "/images/suchit-poojari-ljRiZl00n18-unsplash.jpg",
    alt: "Accessories",
    label: "New Arrivals",
  },
  { id: 2, image: "/images/katja-rooke-77JACslA8G0-unsplash.jpg", alt: "Footwear", label: "Hot Deals" },
];

const categoryPills = [
  "Sofas & Couches",
  "Beds & Mattresses",
  "Dining Tables & Chairs",
  "Wardrobes & Almirahs",
  "TV Units & Cabinets",
  "Office Furniture",
  "Bookshelves & Racks",
  "Dressing Tables",
  "Center & Coffee Tables",
  "Shoe Racks",
  "Outdoor Furniture",
  "Home Decor & Lighting",
];

// ─── Component ─────────────────────────────────────────────────────────────────

export default function Hero() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrentSlide((index + mainSlides.length) % mainSlides.length);
      setTimeout(() => setIsTransitioning(false), 700);
    },
    [isTransitioning],
  );

  useEffect(() => {
    const timer = setInterval(() => {
      goToSlide(currentSlide + 1);
    }, 2000);
    return () => clearInterval(timer);
  }, [currentSlide, goToSlide]);

  return (
    <div className="bg-white">
      {/* ── Main Hero: split layout ──────────────────────────── */}
      <div className="max-w-[1400px] mx-auto px-3 sm:px-5 lg:px-8 pt-3 pb-4">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_440px] gap-3">
          {/* ── Left: large slider ── */}
          <div className="relative rounded-2xl overflow-hidden group">
            <div className="relative w-full aspect-[16/7] sm:aspect-[16/8] lg:aspect-[16/9]">
              {mainSlides.map((slide, index) => (
                <div
                  key={slide.id}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                    index === currentSlide
                      ? "opacity-100 z-10"
                      : "opacity-0 z-0"
                  }`}
                >
                  <Image
                    src={slide.image}
                    alt={slide.alt}
                    fill
                    className="object-cover object-center"
                    priority={index === 0}
                    sizes="(max-width: 1024px) 100vw, 70vw"
                    quality={90}
                  />
                  {/* Subtle gradient overlay for text legibility */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent" />
                </div>
              ))}
            </div>

            {/* Prev / Next arrows — shown on hover */}
            <button
              onClick={() => goToSlide(currentSlide - 1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white"
              aria-label="Previous slide"
            >
              <FiChevronLeft size={18} className="text-gray-800" />
            </button>
            <button
              onClick={() => goToSlide(currentSlide + 1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white"
              aria-label="Next slide"
            >
              <FiChevronRight size={18} className="text-gray-800" />
            </button>

            {/* Dot indicators */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
              {mainSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  aria-label={`Slide ${index + 1}`}
                  className={`transition-all duration-300 rounded-full ${
                    index === currentSlide
                      ? "w-6 h-2 bg-orange-500 shadow"
                      : "w-2 h-2 bg-white/70 hover:bg-white"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* ── Right: two stacked banners ── */}
          <div className="hidden lg:flex flex-col gap-3">
            {sideImages.map((img) => (
              <div
                key={img.id}
                className="relative flex-1 rounded-2xl overflow-hidden cursor-pointer group"
                onClick={() => router.push("/shop")}
              >
                <Image
                  src={img.image}
                  alt={img.alt}
                  fill
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  sizes="440px"
                  quality={85}
                />
                {/* Overlay + label */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                <div className="absolute bottom-3 left-4">
                  <span className="inline-block bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                    {img.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Category Pill Scrollbar ──────────────────────────── */}
      <div className="border-y border-gray-100 bg-white">
        <div className="max-w-[1400px] mx-auto px-3 sm:px-5 lg:px-8">
          <div className="flex items-center gap-2 py-2.5 overflow-x-auto scrollbar-hide">
            {/* All categories icon */}
            <button className="shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-orange-500 text-white text-xs font-semibold shadow-sm hover:bg-orange-600 transition">
              <span className="text-sm">☰</span>
              <span>All</span>
            </button>

            {categoryPills.map((cat) => (
              <button
                key={cat}
                onClick={() =>
                  router.push(`/shop?category=${encodeURIComponent(cat)}`)
                }
                className="shrink-0 whitespace-nowrap px-4 py-1.5 rounded-full border border-gray-200 text-gray-600 text-xs font-medium hover:border-orange-400 hover:text-orange-500 hover:bg-orange-50 transition-all duration-200"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
