// components/Hero.tsx
"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";

interface HeroProps {
  initialImages?: string[];
}

export default function Hero({ initialImages }: HeroProps) {
  const [images, setImages] = useState<string[]>(initialImages ?? []);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [loading, setLoading] = useState(
    !initialImages || initialImages.length === 0
  );

  useEffect(() => {
    if (initialImages && initialImages.length > 0) {
      setImages(initialImages);
      setLoading(false);
      return;
    }

    let cancelled = false;
    const fetchHero = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/hero", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        if (!cancelled && data?.success && Array.isArray(data.hero?.heroImages)) {
          setImages(data.hero.heroImages);
        }
      } catch (err) {
        console.error("Hero fetch error:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchHero();
    return () => { cancelled = true; };
  }, [initialImages]);

  useEffect(() => {
    if (images.length < 2 || paused) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length, paused]);

  useEffect(() => {
    if (images.length > 0 && current >= images.length) setCurrent(0);
  }, [images.length, current]);

  const goTo = useCallback((idx: number) => setCurrent(idx), []);

  if (loading) {
    return (
      <section className="relative w-full bg-gray-100 animate-pulse">
        <div className="w-full aspect-[16/9] sm:aspect-[16/8] lg:aspect-[16/7]" />
      </section>
    );
  }

  if (images.length === 0) return null;

  return (
    <section
      className="relative w-full overflow-hidden bg-white font-sans"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ✅ Responsive aspect ratio — সব slide এর জন্য একই container */}
      <div className="relative w-full aspect-[16/9] sm:aspect-[16/8] lg:aspect-[16/7] overflow-hidden">

        {/* SLIDES */}
        {images.map((src, idx) => (
          <div
            key={`${src}-${idx}`}
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
          <div className="mx-auto flex h-full w-full max-w-[1400px] items-center px-4 sm:px-6 lg:px-8">
            <div className="pointer-events-auto w-full max-w-[560px] lg:w-[52%]">
              {/* আপনার টেক্সট এখানে */}
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