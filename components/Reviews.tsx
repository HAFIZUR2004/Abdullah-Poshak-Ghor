"use client";

import React from "react";

export default function Reviews() {
  return (
    <section className="relative bg-[#faf8f5] py-20 md:py-28 overflow-hidden font-sans border-t border-gray-100">
      
      {/* Decorative leaf/plant pattern on the left */}
      <div className="absolute left-0 bottom-0 w-40 md:w-64 h-64 md:h-96 opacity-10 pointer-events-none select-none">
        <svg viewBox="0 0 100 100" className="w-full h-full text-[#3a4739]" fill="currentColor">
          <path d="M10,90 Q30,60 50,80 T90,50 Q70,40 50,60 T10,90 Z" />
          <path d="M20,80 Q40,50 60,70 T100,40 Q80,30 60,50 T20,80 Z" opacity="0.5" />
        </svg>
      </div>

      {/* Decorative peach circle on the bottom right */}
      <div className="absolute -right-16 -bottom-16 w-64 h-64 md:w-96 md:h-96 bg-[#e8c4b4]/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        
        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#2e3a2c]">
            What Our Customers Say
          </h2>
          <div className="w-12 h-[2px] bg-[#d69a45] mx-auto mt-3" />
        </div>

        {/* Large Decorative Quote mark */}
        <span className="text-[#3a4739] text-8xl font-serif block leading-none select-none opacity-20 -mb-4">
          “
        </span>

        {/* Testimonial Quote */}
        <blockquote className="text-gray-700 text-lg md:text-2xl font-medium leading-relaxed max-w-3xl mx-auto mb-8 font-sans">
          The craftsmanship is outstanding, and the pieces feel both elegant and comfortable.
          Delivery was smooth, and the team made sure everything was set up perfectly.
          Truly a five-star experience!
        </blockquote>

        {/* User Info with Avatar */}
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-md bg-gray-100 flex items-center justify-center">
            {/* Initials fallback in case image isn't loaded */}
            <div className="w-full h-full bg-[#3a4739] flex items-center justify-center text-white text-sm font-bold">
              AH
            </div>
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#2e3a2c]">Arif Hossain</h4>
            <p className="text-[10px] text-gray-500 font-bold tracking-wider uppercase mt-0.5">Interior Designer</p>
          </div>
        </div>

      </div>
    </section>
  );
}
