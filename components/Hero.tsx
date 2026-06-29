"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();

  return (
    <div className="bg-[#faf8f5] relative overflow-hidden py-12 md:py-20 lg:py-24 font-sans">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column: Typography & CTAs */}
          <div className="space-y-6 max-w-xl z-10">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight">
              <span className="block text-[#2e3a2c]">Live Beautifully.</span>
              <span className="block text-[#d69a45] mt-2">Furnish Thoughtfully.</span>
            </h1>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
              Discover timeless furniture that blends comfort, craftsmanship, and modern design.
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <button
                onClick={() => router.push("/shop")}
                className="bg-[#d69a45] hover:bg-[#c0873a] text-white text-sm font-bold uppercase tracking-wider px-8 py-4 rounded transition-all shadow-md text-center cursor-pointer"
              >
                Shop Now
              </button>
              <button
                onClick={() => router.push("/collection")}
                className="border border-[#d69a45] text-[#2e3a2c] hover:bg-[#d69a45] hover:text-white text-sm font-bold uppercase tracking-wider px-8 py-4 rounded transition-all text-center cursor-pointer"
              >
                Explore Collection
              </button>
            </div>
          </div>

          {/* Right Column: Cozy lounge chair in front of curvy green backdrop */}
          <div className="relative flex justify-center lg:justify-end items-center h-[350px] sm:h-[450px] lg:h-[550px]">
            {/* Dark green backdrop shape */}
            <div className="absolute right-0 top-0 bottom-0 w-[80%] sm:w-[70%] lg:w-[85%] bg-[#3a4739] rounded-l-[200px] lg:rounded-l-[300px] rounded-br-[100px] -z-10 shadow-lg overflow-hidden">
              {/* Subtle background glow */}
              <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
            </div>

            {/* Armchair image */}
            <div className="relative w-[90%] h-[90%] sm:w-[80%] sm:h-[80%] lg:w-[90%] lg:h-[90%] hover:scale-105 transition-transform duration-700">
              <Image
                src="/images/heroimg.webp"
                alt="Live Beautifully"
                fill
                priority
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
