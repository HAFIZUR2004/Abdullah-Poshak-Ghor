"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";

const FALLBACK_IMAGES = [
  "https://i.ibb.co.com/Vh4FCzd/download-9.jpg",
  "https://i.ibb.co.com/tp1hJpTP/download-10.jpg",
  "https://i.ibb.co.com/fGNmtw35/download-11.jpg",
];

interface HeroProps {
  initialImages?: string[];
}

export default function Hero({ initialImages }: HeroProps) {
  const initial =
    initialImages && initialImages.length > 0
      ? initialImages
      : FALLBACK_IMAGES;

  const [images, setImages] = useState<string[]>(initial);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  // ---------------------------------------------------------
  // Fetch hero images
  // ---------------------------------------------------------
  useEffect(() => {
    if (initialImages && initialImages.length > 0) {
      setImages(initialImages);
      return;
    }

    let cancelled = false;

    const fetchHero = async () => {
      try {
        const res = await fetch("/api/hero", {
          cache: "force-cache",
        });

        if (!res.ok) throw new Error("Failed to fetch hero");

        const data = await res.json();

        if (
          !cancelled &&
          data?.success &&
          Array.isArray(data?.hero?.heroImages) &&
          data.hero.heroImages.length > 0
        ) {
          setImages(data.hero.heroImages);
        }
      } catch (error) {
        console.error("Hero fetch error:", error);
      }
    };

    fetchHero();

    return () => {
      cancelled = true;
    };
  }, [initialImages]);

  // ---------------------------------------------------------
  // Auto slider
  // ---------------------------------------------------------
  useEffect(() => {
    if (images.length < 2 || paused) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length, paused]);

  // ---------------------------------------------------------
  // Safety
  // ---------------------------------------------------------
  useEffect(() => {
    if (current >= images.length) {
      setCurrent(0);
    }
  }, [images.length, current]);

  const goTo = useCallback((index: number) => {
    setCurrent(index);
  }, []);

  return (
    <section
      className="relative w-full overflow-hidden bg-white font-sans"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative w-full aspect-[16/9] sm:aspect-[16/8] lg:aspect-[16/7] overflow-hidden">
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
              alt={`Sareng Furniture hero slide ${idx + 1}`}
              fill
              priority={idx === 0}
              loading={idx === 0 ? "eager" : "lazy"}
              quality={75}
              sizes="100vw"
              className="object-cover object-center"
              unoptimized={src.startsWith("data:")}
              placeholder="blur"
              blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxIiBoZWlnaHQ9IjEiPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNGREY2RUUiLz48L3N2Zz4="
            />
          </div>
        ))}

        {/* CONTENT OVERLAY */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <div className="mx-auto flex h-full w-full max-w-[1400px] items-center px-4 sm:px-6 lg:px-8">
            <div className="pointer-events-auto w-full max-w-[560px] lg:w-[52%]">
              {/* আপনার hero text এখানে রাখবেন */}
            </div>
          </div>
        </div>

        {/* SLIDER DOTS */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5 sm:bottom-6 sm:gap-2">
            {images.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => goTo(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2 w-2 rounded-full transition-all duration-300 sm:h-2.5 sm:w-2.5 ${
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