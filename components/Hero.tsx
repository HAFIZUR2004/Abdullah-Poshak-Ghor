"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();

  return (
    <div className="relative overflow-hidden min-h-[520px] lg:min-h-[620px] font-sans flex items-center">
      {/* Background decoration: split organic curved panel */}
      {/* Light warm beige base background */}
      <div className="absolute inset-0 bg-[#faf8f5] -z-20" />
      
      {/* Dark green organic curved panel on desktop */}
      <div className="absolute inset-0 -z-10 hidden lg:block">
        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
          <path d="M 0 0 L 62 0 Q 52 50 35 100 L 0 100 Z" fill="#3a4739" />
        </svg>
      </div>
      
      {/* Full dark green background on mobile/tablet */}
      <div className="absolute inset-0 bg-[#3a4739] lg:hidden -z-10" />

      <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center lg:min-h-[550px]">

          {/* Left Column: Typography & CTAs */}
          <div className="space-y-6 max-w-xl py-12 lg:py-0">
            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold tracking-tight text-white leading-tight">
              <span>Live Beautifully.</span>
              <span className="block text-[#d69a45] mt-2">Furnish Thoughtfully.</span>
            </h1>
            <p className="text-sm sm:text-base text-white/70 leading-relaxed max-w-md">
              Discover timeless furniture that blends comfort, craftsmanship, and modern design to elevate your daily living space.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => router.push("/shop")}
                className="bg-[#d69a45] hover:bg-[#c0873a] text-white text-xs font-bold uppercase tracking-widest px-8 py-3.5 rounded-sm transition-all shadow-md cursor-pointer whitespace-nowrap"
              >
                Shop Now
              </button>
              <button
                onClick={() => router.push("/collection")}
                className="border border-white/50 hover:border-white text-white text-xs font-bold uppercase tracking-widest px-8 py-3.5 rounded-sm transition-all cursor-pointer whitespace-nowrap"
              >
                Explore Collection
              </button>
            </div>
          </div>

          {/* Right Column: Armchair in front of curve on light warm beige background */}
          <div className="relative flex justify-center lg:justify-end items-end h-[350px] sm:h-[450px] lg:h-[550px]">
            {/* Hanging Pendant Lamp decoration on the beige side */}
            <div className="absolute top-0 right-[42%] w-[1.5px] h-36 bg-gray-300 hidden lg:block opacity-40" />
            <div className="absolute top-36 right-[calc(42%-13px)] w-7 h-5 bg-white rounded-t-full shadow-sm hidden lg:block opacity-90 border border-gray-100" />
            
            {/* Subtle dot grid pattern on the beige side */}
            <div
              className="absolute top-10 right-4 w-20 h-20 opacity-15 pointer-events-none hidden lg:block"
              style={{
                backgroundImage: "radial-gradient(#2e3a2c 1px, transparent 1px)",
                backgroundSize: "8px 8px",
              }}
            />

            {/* Armchair image mock-up */}
            <div className="relative w-full h-[90%] max-w-[480px] lg:max-w-[500px] hover:scale-102 transition-transform duration-700">
              <Image
                src="/images/heroimg.webp"
                alt="Live Beautifully - Premium Lounge Armchair"
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
