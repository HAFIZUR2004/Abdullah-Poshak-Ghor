"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();

  return (
    <div className="relative overflow-hidden min-h-[500px] sm:min-h-[600px] lg:min-h-[700px] font-sans flex items-center bg-[#FDF6EE]">
      
      {/* 1. Main Background Color (Light Peach/Cream) */}
      <div className="absolute inset-0 z-0 bg-[#FDF6EE]" />

      {/* 2. Decorative Green Circle Shape behind the product */}
      <div className="absolute right-[5%] top-[10%] lg:right-[8%] lg:top-[12%] w-[350px] h-[350px] sm:w-[450px] sm:h-[450px] lg:w-[600px] lg:h-[600px] rounded-full bg-[#DCE8C8] opacity-80 z-[1]" />

      {/* 3. Product/Furniture Image */}
      <div className="absolute right-0 bottom-0 lg:right-[2%] lg:bottom-0 w-[80%] sm:w-[65%] lg:w-[55%] h-full z-[2] flex items-end justify-end pointer-events-none">
        <Image
          src="/images/hero-removebg-preview.png"
          alt="Spring Collection Furniture"
          width={900}
          height={900}
          priority
          className="object-contain object-bottom w-full h-full drop-shadow-2xl scale-105 lg:scale-110"
        />
      </div>

      {/* 4. Large Background Number "01" - Slightly darker cream color */}
      <div className="absolute bottom-[-50px] left-[8%] z-[3] select-none pointer-events-none">
        <span className="text-[220px] sm:text-[320px] lg:text-[480px] font-extrabold text-[#F0E6D8] leading-none tracking-tighter">
          01
        </span>
      </div>

      {/* 5. Text Content and CTAs */}
      <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center lg:min-h-[600px]">
          
          {/* Left Column */}
          <div className="space-y-6 max-w-xl py-16 lg:py-0 text-left">
            
            {/* Small Brand Text */}
            <div className="space-y-3">
              <div className="border-l-4 border-[#0B2523] pl-4">
                <p className="text-sm font-bold text-[#0B2523] uppercase tracking-widest">
                  Davici Furniture
                </p>
                <p className="text-xs text-[#0B2523]/60 font-medium mt-1">
                  2020
                </p>
              </div>
              
              {/* NEW ARRIVALS Text */}
              <p className="text-xs font-bold text-[#0B2523]/70 uppercase tracking-[0.2em] pl-4 mt-4">
                New Arrivals
              </p>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-medium text-[#0B2523] leading-[1.1] tracking-tight mt-4">
              Spring
              <span className="block">Collection</span>
            </h1>

            {/* Short Description */}
            <p className="text-sm text-[#0B2523]/70 leading-relaxed max-w-sm font-medium mt-2">
              Discover timeless furniture that blends comfort, craftsmanship, and modern design.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-6">
              <button
                onClick={() => router.push("/shop")}
                className="bg-[#FF7A00] hover:bg-[#E56E00] text-white text-sm font-bold uppercase tracking-wider px-8 py-3 rounded-sm transition-all shadow-md cursor-pointer whitespace-nowrap active:scale-95"
              >
                Shop now →
              </button>
            </div>
          </div>

          {/* Right Column (Empty to keep layout balanced) */}
          <div className="hidden lg:block h-[500px]" />

        </div>
      </div>

      {/* 6. Bottom Pagination Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 flex gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-[#0B2523]"></span>
        <span className="w-2.5 h-2.5 rounded-full bg-[#0B2523]/30"></span>
        <span className="w-2.5 h-2.5 rounded-full bg-[#0B2523]/30"></span>
      </div>

    </div>
  );
}