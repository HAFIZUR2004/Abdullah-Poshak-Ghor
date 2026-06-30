"use client";

import React, { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FiArrowRight,
  FiCheckCircle,
} from "react-icons/fi";

// ─── Icon SVGs (inline) ──────────────────────────────────────────────────────

function IconRuler({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3l18 18" /><path d="M3 9l6-6" /><path d="M9 3l-6 6" /><path d="M21 15l-6 6" /><path d="M15 21l6-6" />
    </svg>
  );
}

function IconPalette({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="13.5" cy="6.5" r="1" /><circle cx="17.5" cy="10.5" r="1" /><circle cx="8.5" cy="7.5" r="1" /><circle cx="6.5" cy="12.5" r="1" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.667 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.042a1.65 1.65 0 0 1 1.648-1.666h1.979c3.014 0 5.6-2.586 5.6-5.6C22 6.5 17.5 2 12 2z" />
    </svg>
  );
}

function IconWood({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /><line x1="12" y1="12" x2="12" y2="16" /><line x1="10" y1="14" x2="14" y2="14" />
    </svg>
  );
}

function IconDimensions({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 6H3" /><path d="M21 18H3" /><path d="M3 6v12" /><path d="M21 6v12" /><path d="M8 6v12" /><path d="M16 6v12" />
    </svg>
  );
}

function IconFinish({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function IconDesign({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" />
    </svg>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const FURNITURE_TYPES = [
  "Custom Tables",
  "Dining Tables",
  "Office Tables",
  "Cabinets",
  "Wardrobes",
  "TV Units",
  "Beds",
  "Shelves",
  "Other Wooden Furniture",
];

const CUSTOMIZATION_OPTIONS = [
  { icon: IconRuler,      label: "Size",        desc: "Any dimension you need" },
  { icon: IconDesign,     label: "Design",      desc: "Your own aesthetic style" },
  { icon: IconWood,       label: "Material",    desc: "Premium wood selection" },
  { icon: IconPalette,    label: "Color",       desc: "Custom stain & paint" },
  { icon: IconFinish,     label: "Finish",      desc: "Matte, gloss, or natural" },
  { icon: IconDimensions, label: "Dimensions",  desc: "Fits any space perfectly" },
];

const HIGHLIGHTS = [
  "Built to Your Exact Requirements",
  "Premium Wood & Quality Materials",
  "Handmade by Skilled Craftsmen",
  "Delivery Across Bangladesh",
  "Free Design Consultation",
];

// ─── useInView Hook ────────────────────────────────────────────────────────────

function useInView(ref: React.RefObject<HTMLElement | null>) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.12 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);
  return inView;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CustomOrderSection() {
  const router = useRouter();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef);

  return (
    <section
      ref={sectionRef}
      className="relative py-0 bg-[#faf8f5] overflow-hidden"
      aria-label="Custom Furniture Order Service"
    >
      {/* Top gold accent line */}
      <div className="h-[3px] bg-gradient-to-r from-transparent via-[#d69a45] to-transparent" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* ── Left: Image Panel ─────────────────────────────── */}
          <div
            className={`relative transition-all duration-700 ease-out ${
              inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
            }`}
          >
            {/* Glow blobs */}
            <div className="absolute -top-6 -left-6 w-48 h-48 rounded-full bg-[#d69a45]/10 blur-2xl pointer-events-none" />
            <div className="absolute -bottom-6 -right-6 w-64 h-64 rounded-full bg-[#3a4739]/10 blur-3xl pointer-events-none" />

            {/* Main image */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/customfur.avif"
                alt="Skilled craftsman building custom wooden furniture in a workshop"
                className="w-full h-[340px] sm:h-[420px] lg:h-[500px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
              {/* Dark gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1e2a1e]/70 via-transparent to-transparent" />

              {/* Bottom-left badge */}
              <div className="absolute bottom-5 left-5 flex items-center gap-3 bg-white/95 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg">
                <div className="w-10 h-10 bg-[#3a4739] rounded-full flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#d69a45" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wider">Handcrafted</p>
                  <p className="text-sm font-black text-[#2e3a2c]">Made to Order</p>
                </div>
              </div>

              {/* Top-right badge */}
              <div className="absolute top-5 right-5 bg-[#d69a45] text-white rounded-lg px-3 py-2 text-center shadow-md">
                <span className="block text-xs font-black uppercase tracking-wider">Free</span>
                <span className="block text-[10px] font-semibold opacity-90">Consultation</span>
              </div>
            </div>

            {/* Furniture type pills */}
            <div className="mt-5 flex flex-wrap gap-2">
              {FURNITURE_TYPES.map((type) => (
                <span
                  key={type}
                  className="text-[11px] font-semibold text-[#3a4739] bg-white border border-[#d69a45]/30 rounded-full px-3 py-1 shadow-sm hover:bg-[#d69a45]/10 hover:border-[#d69a45] transition-all cursor-default"
                >
                  {type}
                </span>
              ))}
            </div>
          </div>

          {/* ── Right: Content Panel ───────────────────────────── */}
          <div
            className={`space-y-7 transition-all duration-700 ease-out delay-150 ${
              inView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
            }`}
          >
            {/* Service label */}
            <div className="inline-flex items-center gap-2 bg-[#d69a45]/10 border border-[#d69a45]/30 rounded-full px-4 py-1.5">
              <span className="w-1.5 h-1.5 bg-[#d69a45] rounded-full animate-pulse" />
              <span className="text-[11px] font-bold text-[#d69a45] uppercase tracking-widest">Custom Order Service</span>
            </div>

            {/* Heading */}
            <div className="space-y-3">
              <h2 className="text-3xl sm:text-4xl lg:text-[2.5rem] font-extrabold text-[#2e3a2c] leading-tight tracking-tight">
                Furniture Built{" "}
                <span className="relative inline-block">
                  <span className="text-[#d69a45]">Your Way</span>
                  <span className="absolute -bottom-1 left-0 w-full h-[3px] bg-[#d69a45]/25 rounded-full" />
                </span>
              </h2>
              <p className="text-gray-500 text-sm sm:text-[15px] leading-relaxed max-w-lg">
                We manufacture premium custom furniture tailored exactly to your preferences — from size and material to finish and design. Share your vision, and our skilled craftsmen will build it.
              </p>
            </div>

            {/* Customization options grid */}
            <div>
              <p className="text-[11px] font-bold text-[#2e3a2c] uppercase tracking-widest mb-3">Customize Every Detail</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {CUSTOMIZATION_OPTIONS.map(({ icon: Icon, label, desc }) => (
                  <div
                    key={label}
                    className="group flex items-start gap-3 bg-white border border-gray-100 rounded-xl p-3.5 hover:border-[#d69a45]/40 hover:shadow-md transition-all duration-300"
                  >
                    <div className="w-8 h-8 bg-[#faf8f5] rounded-lg flex items-center justify-center text-[#d69a45] shrink-0 group-hover:bg-[#d69a45]/10 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-xs text-[#2e3a2c]">{label}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5 leading-snug">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-[#d69a45]/30 via-gray-200 to-transparent" />

            {/* Highlights */}
            <div className="space-y-2.5">
              {HIGHLIGHTS.map((item) => (
                <div key={item} className="flex items-center gap-2.5">
                  <FiCheckCircle size={15} className="text-[#d69a45] shrink-0" />
                  <span className="text-sm text-[#2e3a2c] font-medium">{item}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <button
                onClick={() => router.push("/contact")}
                className="inline-flex items-center gap-2 bg-[#3a4739] hover:bg-[#2e3a2c] text-white text-[11px] font-black uppercase tracking-widest px-7 py-3.5 rounded-sm transition-all shadow-md hover:shadow-lg cursor-pointer group"
              >
                Request a Custom Order
                <FiArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => router.push("/contact")}
                className="inline-flex items-center gap-2 border border-[#d69a45] text-[#d69a45] hover:bg-[#d69a45] hover:text-white text-[11px] font-bold uppercase tracking-widest px-7 py-3.5 rounded-sm transition-all cursor-pointer"
              >
                Get a Free Quote
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom gold accent line */}
      <div className="h-[3px] bg-gradient-to-r from-transparent via-[#d69a45]/40 to-transparent" />
    </section>
  );
}
