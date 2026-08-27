"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();

  return (
    <div className="relative overflow-hidden min-h-[500px] sm:min-h-[550px] lg:min-h-[620px] font-sans flex items-center">
      {/* 1. Full-screen background room interior image */}
      <div className="absolute inset-0 -z-30">
        <Image
          src="/images/side.jpg"
          alt="Premium Furniture Room Scene"
          fill
          priority
          className="object-cover object-right lg:object-center"
          quality={90}
        />
      </div>

      {/* 2. Solid cream curved overlay on desktop */}
      <div className="absolute inset-0 -z-10 hidden lg:block">
        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
          <path d="M 0 0 L 70 0 Q 58 45 42 100 L 0 100 Z" fill="#F9F6F0" />
        </svg>
      </div>

      {/* 3. High-opacity cream backdrop on mobile/tablet for text readability */}
      <div className="absolute inset-0 bg-[#F9F6F0]/95 lg:hidden -z-10" />

      {/* 4. Text Content and CTAs */}
      <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center lg:min-h-[550px]">
          
          {/* Left Column (Over the solid cream area) */}
          <div className="space-y-6 max-w-xl py-16 lg:py-0 text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] xl:text-[3.75rem] font-extrabold tracking-tight text-[#1E293B] leading-[1.15]">
              <span>Live Beautifully.</span>
              <span className="block text-[#0D9488] mt-2">Furnish Thoughtfully.</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed max-w-sm font-light">
              Discover timeless furniture that blends comfort, craftsmanship, and modern design.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => router.push("/shop")}
                className="bg-[#0D9488] hover:bg-[#0B7A72] text-white text-xs font-black uppercase tracking-widest px-7 py-3 rounded-sm transition-all shadow-md cursor-pointer whitespace-nowrap"
              >
                Shop Now
              </button>
              <button
                onClick={() => router.push("/collection")}
                className="border border-[#1E293B]/30 hover:border-[#1E293B] text-[#1E293B] text-xs font-bold uppercase tracking-widest px-7 py-3 rounded-sm transition-all cursor-pointer whitespace-nowrap"
              >
                Explore Collection
              </button>
            </div>
          </div>

          {/* Right Column (Placeholder to preserve grid spacing) */}
          <div className="hidden lg:block h-[500px]" />

        </div>
      </div>
    </div>
  );
}