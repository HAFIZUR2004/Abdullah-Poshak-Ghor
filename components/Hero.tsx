"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();

  return (
    // The hero background is the same dark forest-green as the navbar
    <div className="bg-[#3a4739] relative overflow-hidden font-sans">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-end min-h-[480px] md:min-h-[560px]">

          {/* Left Column: Typography & CTAs — vertically centred */}
          <div className="flex flex-col justify-center py-16 lg:py-20 space-y-5 z-10">
            <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] xl:text-6xl font-extrabold tracking-tight leading-[1.1]">
              <span className="block text-white">Live Beautifully.</span>
              <span className="block text-[#d69a45] mt-1">Furnish Thoughtfully.</span>
            </h1>
            <p className="text-sm sm:text-base text-white/70 leading-relaxed max-w-sm">
              Discover timeless furniture that blends comfort, craftsmanship, and modern design.
            </p>

            {/* CTA Buttons — matching reference: filled amber + ghost outline */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => router.push("/shop")}
                className="bg-[#d69a45] hover:bg-[#c0873a] text-white text-xs font-bold uppercase tracking-widest px-7 py-3 rounded-sm transition-all shadow-md cursor-pointer whitespace-nowrap"
              >
                Shop Now
              </button>
              <button
                onClick={() => router.push("/collection")}
                className="border border-white/50 hover:border-white text-white text-xs font-bold uppercase tracking-widest px-7 py-3 rounded-sm transition-all cursor-pointer whitespace-nowrap"
              >
                Explore Collection
              </button>
            </div>
          </div>

          {/* Right Column: Furniture photo sitting on the green background */}
          <div className="relative flex justify-center lg:justify-end items-end h-[320px] sm:h-[420px] lg:h-[520px]">
            {/* Subtle dot-grid decoration (top-right corner) */}
            <div
              className="absolute top-8 right-4 w-24 h-24 opacity-20 pointer-events-none"
              style={{
                backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)",
                backgroundSize: "10px 10px",
              }}
            />

            {/* Hero furniture image — fills from bottom */}
            <div className="relative w-full h-full max-w-[540px]">
              <Image
                src="/images/heroimg.webp"
                alt="Live Beautifully — premium furniture"
                fill
                priority
                className="object-contain object-bottom drop-shadow-2xl"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
