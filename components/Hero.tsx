// components/Hero.tsx
"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const DEFAULT_IMAGES: string[] = [
  "https://i.ibb.co.com/rfX2KWq3/hero1.webp",
  "https://i.ibb.co.com/rfX2KWq3/hero1.webp",
];

export default function Hero() {
  const router = useRouter();

  const [images, setImages] = useState<string[]>(DEFAULT_IMAGES);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const res = await fetch("/api/hero", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch hero data");
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

  useEffect(() => {
    if (images.length < 2 || paused) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length, paused]);

  useEffect(() => {
    if (images.length > 0 && current >= images.length) {
      setCurrent(0);
    }
  }, [images.length, current]);

  const goTo = useCallback((idx: number) => {
    setCurrent(idx);
  }, []);

  return (
    <section
      className="relative w-full overflow-hidden bg-white font-sans"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* 
        ✅ Mobile Response Fix:
        ১. মোবাইলে aspect-[16/9] বা aspect-auto কাজ করবে এবং ডেস্কটপে aspect-[1900/768] থাকবে।
        ২. min-h বাদ দেওয়া হয়েছে যা মোবাইলে ইমেজ ক্রপ করার মূল কারণ ছিল।
      */}
      <div className="relative w-full aspect-[16/9]  sm:aspect-[21/9] lg:aspect-[1900/768] overflow-hidden">
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
              className="object-cover object-center w-full h-full"
              unoptimized={src.startsWith("data:")}
            />
          </div>
        ))}

        {/* CONTENT OVERLAY (Optional Text/Content Layer) */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <div className="mx-auto flex h-full w-full max-w-[1400px] items-center px-4 sm:px-6 lg:px-8">
            <div className="pointer-events-auto w-full max-w-[560px] lg:w-[52%]">
              {/* প্রয়োজন অনুযায়ী আপনার টেক্সট এখানে রাখতে পারেন */}
            </div>
          </div>
        </div>

        {/* SLIDER DOTS */}
        {images.length > 1 && (
          <div className="absolute bottom-3 sm:bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5 sm:gap-2">
            {images.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => goTo(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full transition-all duration-300 ${
                  idx === current
                    ? "scale-125 bg-[#0B2523]"
                    : "bg-[#0B2523]/30 hover:bg-[#0B2523]/60"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}