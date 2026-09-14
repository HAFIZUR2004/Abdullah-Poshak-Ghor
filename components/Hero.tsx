// components/Hero.tsx
"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

// 🟢 ১. Fallback images দিন যাতে API লোড হতে দেরি হলেও বা Fail করলেও Auto Slide কাজ করে
const DEFAULT_IMAGES: string[] = [
  "https://i.ibb.co.com/rfX2KWq3/hero1.webp",
  "https://i.ibb.co.com/rfX2KWq3/hero1.webp",
];

export default function Hero() {
  const router = useRouter();

  const [images, setImages] = useState<string[]>(DEFAULT_IMAGES);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  // =========================================================
  // FETCH HERO IMAGES
  // =========================================================
  useEffect(() => {
    const fetchHero = async () => {
      try {
        const res = await fetch("/api/hero", {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch hero data");
        }

        const data = await res.json();

        if (
          data?.success &&
          Array.isArray(data.hero?.heroImages) &&
          data.hero.heroImages.length > 0
        ) {
          setImages(data.hero.heroImages);
        }
      } catch (error) {
        console.error("Failed to load hero images:", error);
      }
    };

    fetchHero();
  }, []);

  // =========================================================
  // AUTO SLIDE (FIXED DEPENDENCY & STATE UPDATE)
  // =========================================================
  useEffect(() => {
    // 🟢 ২. ইমেজ ২টার কম থাকলে বা মাউস হোভার করা থাকলে স্লাইড হবে না
    if (images.length < 2 || paused) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length, paused]); // 🟢 images reference নয়, images.length ও paused নির্ভর করে চলবে

  // =========================================================
  // CURRENT SLIDE GUARD
  // =========================================================
  useEffect(() => {
    if (images.length > 0 && current >= images.length) {
      setCurrent(0);
    }
  }, [images.length, current]);

  // =========================================================
  // CHANGE SLIDE
  // =========================================================
  const goTo = useCallback((idx: number) => {
    setCurrent(idx);
  }, []);

  return (
    <section
      className="relative w-full overflow-hidden bg-white font-sans"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="
          relative
          w-full
          aspect-[1900/768]
          min-h-[520px]
          sm:min-h-[580px]
          overflow-hidden
        "
      >
        {/* SLIDES */}
        {images.map((src, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              idx === current
                ? "z-[1] opacity-100"
                : "z-0 opacity-0 pointer-events-none"
            }`}
            aria-hidden={idx !== current}
          >
            <Image
              src={src}
              alt={`Hero slide ${idx + 1}`}
              fill
              priority={idx === 0}
              quality={100}
              sizes="100vw"
              className="object-cover object-center"
              unoptimized={src.startsWith("data:")}
            />
          </div>
        ))}

        {/* CONTENT OVERLAY */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <div
            className="
              mx-auto
              flex
              h-full
              w-full
              max-w-[1400px]
              items-center
              px-4
              sm:px-6
              lg:px-8
            "
          >
            <div
              className="
                pointer-events-auto
                w-full
                max-w-[560px]
                lg:w-[52%]
              "
            >
              <div className="space-y-3">
                <div className="border-l-4 border-[#0B2523] pl-4">
                  <p className="text-sm font-bold uppercase tracking-widest text-[#0B2523]">
                    Sareng Furniture
                  </p>
                  <p className="mt-1 text-xs font-medium text-[#0B2523]/60">
                    2026
                  </p>
                </div>

                <p className="mt-4 pl-4 text-xs font-bold uppercase tracking-[0.2em] text-[#0B2523]/70">
                  New Arrivals
                </p>
              </div>

              <h1 className="mt-5 text-5xl font-medium leading-[1.05] tracking-tight text-[#0B2523] sm:text-6xl lg:text-[76px] xl:text-[82px]">
                Spring
                <span className="block">Collection</span>
              </h1>

              <p className="mt-5 max-w-[500px] text-sm font-medium leading-7 text-[#0B2523]/70 sm:text-base">
                Discover timeless furniture that blends comfort, craftsmanship, and modern design.
              </p>

              <div className="flex items-center gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => router.push("/shop")}
                  className="cursor-pointer whitespace-nowrap rounded-sm bg-[#FF7A00] px-9 py-3.5 text-sm font-bold uppercase tracking-wider text-white shadow-md transition-all duration-200 hover:bg-[#E56E00] active:scale-95"
                >
                  Shop now →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SLIDER DOTS */}
        {images.length > 1 && (
          <div
            className="
              absolute
              bottom-7
              left-1/2
              z-20
              flex
              -translate-x-1/2
              items-center
              gap-2
            "
          >
            {images.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => goTo(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`
                  h-2.5
                  w-2.5
                  rounded-full
                  transition-all
                  duration-300
                  ${
                    idx === current
                      ? "scale-125 bg-[#0B2523]"
                      : "bg-[#0B2523]/30 hover:bg-[#0B2523]/60"
                  }
                `}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}