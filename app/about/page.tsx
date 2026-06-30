"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  FiArrowRight,
  FiCheckCircle,
  FiMapPin,
  FiPhone,
  FiCalendar,
  FiUsers,
  FiLayers,
  FiAward,
  FiHome,
  FiBriefcase,
  FiShield,
  FiDollarSign,
  FiTruck,
  FiThumbsUp,
  FiCompass,
  FiBox,
} from "react-icons/fi";

// ─── Scroll-trigger Hook ──────────────────────────────────────────────────────
function useInView(ref: React.RefObject<HTMLElement | null>, threshold = 0.1) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref, threshold]);
  return visible;
}

// ─── Animated Counter ─────────────────────────────────────────────────────────
function AnimatedNumber({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        let start = 0;
        const step = Math.ceil(target / 50);
        const timer = setInterval(() => {
          start += step;
          if (start >= target) {
            setCount(target);
            clearInterval(timer);
          } else {
            setCount(start);
          }
        }, 20);
      }
    }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// ══════════════════════════════════════════════════════════════════════════════
//  DATA DEFINITIONS — Sourced from Existing Project Configurations
// ══════════════════════════════════════════════════════════════════════════════

const STATS = [
  { value: 2018,  suffix: "",   label: "Established",         icon: FiCalendar },
  { value: 6,     suffix: "",   label: "Showrooms",           icon: FiMapPin },
  { value: 10000, suffix: "+",  label: "Happy Customers",     icon: FiUsers },
  { value: 150,   suffix: "+",  label: "Furniture Designs",   icon: FiLayers },
  { value: 50,    suffix: "+",  label: "Skilled Craftsmen",   icon: FiAward },
];

const WHAT_WE_DO = [
  { icon: FiHome,       title: "Residential Furniture", desc: "Premium dining sets, luxury beds, wardrobes, and cabinets built to bring warmth to modern households." },
  { icon: FiBriefcase,  title: "Commercial Fittings",   desc: "Conference tables, reception counters, and ergonomic office desks optimized for productivity." },
  { icon: FiBox,        title: "Solid Wood Doors",      desc: "Seasoned teak and local hardwood doors carved with traditional patterns or modern flush veneers." },
  { icon: FiCompass,    title: "Interior Woodwork",     desc: "Custom wall paneling, display racks, and specialized TV units crafted to match interior layouts." },
];

const WHY_CHOOSE = [
  { icon: FiShield,     title: "Premium Seasoned Timber", desc: "We use only genuine Chittagong Teak (সেগুন), Mahogany, and Silkoroi wood, thoroughly seasoned to prevent split or warp." },
  { icon: FiAward,      title: "Traditional Joinery",     desc: "Our carpenters specialize in hand-fitted joinery methods like mortise-and-tenon to secure long-term structural integrity." },
  { icon: FiCompass,    title: "Bespoke Customization",   desc: "Every piece of furniture can be tailored down to the exact millimeter, polish hue, and timber species." },
  { icon: FiDollarSign, title: "Factory Direct Value",    desc: "By manufacturing locally in our Bagerhat factory, we deliver luxury solid wood furniture at sensible prices." },
  { icon: FiTruck,      title: "Nationwide Installation", desc: "Our in-house logistics team handles secure shipping, loading, and direct set-up inside your home." },
  { icon: FiThumbsUp,   title: "Structural Warranty",     desc: "Every product is backed by our workshop warranty against wood pests and natural timber structural defects." },
];

const OUTLETS = [
  { city: "Dhaka",        address: "House 12, Road 5, Gulshan-1, Dhaka-1212",       phone: "+880 1797-312699" },
  { city: "Chattogram",   address: "45 Agrabad Commercial Area, Chattogram-4100",    phone: "+880 1797-312699" },
  { city: "Rajshahi",     address: "72 Shaheb Bazar Road, Rajshahi-6000",           phone: "+880 1797-312699" },
  { city: "Khulna",       address: "18 KDA Avenue, Khulna-9000",                    phone: "+880 1797-312699" },
  { city: "Sylhet",       address: "33 Zindabazar, Sylhet-3100",                    phone: "+880 1797-312699" },
  { city: "Rangpur",      address: "60 Station Road, Rangpur-5400",                 phone: "+880 1797-312699" },
];

// ══════════════════════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ══════════════════════════════════════════════════════════════════════════════

export default function AboutPage() {
  const router = useRouter();

  // Refs for scroll animations
  const storyRef   = useRef<HTMLElement>(null);
  const valuesRef  = useRef<HTMLElement>(null);
  const statsRef   = useRef<HTMLElement>(null);
  const whatRef    = useRef<HTMLElement>(null);
  const customRef  = useRef<HTMLElement>(null);
  const whyRef     = useRef<HTMLElement>(null);
  const showroomRef= useRef<HTMLElement>(null);

  const storyIn   = useInView(storyRef);
  const valuesIn  = useInView(valuesRef);
  const statsIn   = useInView(statsRef);
  const whatIn    = useInView(whatRef);
  const customIn  = useInView(customRef);
  const whyIn     = useInView(whyRef);
  const showroomIn = useInView(showroomRef);

  return (
    <>
      <Navbar />

      {/* ─── 1. HERO SECTION (Reuses homepage hero background side.jpg) ─────── */}
      <section className="relative min-h-[380px] sm:min-h-[440px] flex items-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 -z-20">
          <img
            src="/images/side.jpg"
            alt="Premium solid wood furniture"
            className="w-full h-full object-cover object-center"
          />
        </div>
        {/* Dark overlay matching homepage opacity */}
        <div className="absolute inset-0 -z-10 bg-[#3a4739]/85 lg:bg-[#3a4739]/90" />
        <div className="absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#d69a45] to-transparent z-10" />

        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-white/50 text-xs mb-6 font-sans">
            <Link href="/" className="hover:text-[#d69a45] transition-colors">Home</Link>
            <span className="text-white/30">/</span>
            <span className="text-[#d69a45]">About Us</span>
          </nav>

          <div className="max-w-xl space-y-4">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Our Legacy
            </h1>
            <p className="text-white/70 text-sm sm:text-base leading-relaxed font-light">
              Crafting premium seasoned hardwood furniture since 2018. Discover our story of legacy carpentry, design integrity, and factory-direct quality.
            </p>
          </div>
        </div>
      </section>

      {/* ─── 2. OUR STORY (Editorial Alternating Layout: Image Left, Content Right) ─── */}
      <section
        ref={storyRef}
        className="py-16 lg:py-24 bg-[#faf8f5]"
        aria-label="Brand Story"
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* Left: Reused premium room image (side1.jpg) */}
            <div className={`relative transition-all duration-700 ease-out ${storyIn ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}>
              <div className="absolute -top-4 -left-4 w-40 h-40 bg-[#d69a45]/5 rounded-full blur-3xl pointer-events-none" />
              <div className="relative rounded-xl overflow-hidden shadow-md bg-white p-2">
                <img
                  src="/images/side1.jpg"
                  alt="Premium Sareng Furniture living room design setup"
                  className="w-full h-[360px] sm:h-[460px] object-cover rounded-lg"
                />
              </div>
            </div>

            {/* Right: Narrative Story Content */}
            <div className={`space-y-6 transition-all duration-700 ease-out delay-150 ${storyIn ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}>
              <div className="inline-flex items-center gap-2 bg-[#d69a45]/10 border border-[#d69a45]/30 rounded-full px-3.5 py-1">
                <span className="w-1.5 h-1.5 bg-[#d69a45] rounded-full" />
                <span className="text-[10px] font-bold text-[#d69a45] uppercase tracking-widest">Our Story</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2e3a2c] leading-tight tracking-tight">
                Roots in Fine Carpentry
              </h2>
              
              <div className="text-gray-500 text-sm leading-relaxed space-y-4 font-light">
                <p>
                  Sareng Furniture was established in 2018 as a small workshop in Bagerhat, Bangladesh. We recognized that the market was flooded with cheap, pressed-board furniture that failed within years. We set out to change that by building exclusively with seasoned solid wood logs.
                </p>
                <p>
                  By focusing on wood-drying methods, legacy carpenters, and traditional jointing, we grew from local doors and dining sets to furnishing whole offices and residential developments nationwide.
                </p>
                <p>
                  Today, we retain our workshop values. We allow clients to visit our yards, inspect timber logs, and oversee the customized drawing phase, establishing a completely transparent company profile.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── 3. MISSION, VISION & CORE VALUES (Alternating: Content Left, Image Right) ─── */}
      <section
        ref={valuesRef}
        className="py-16 lg:py-24 bg-white border-t border-gray-100"
        aria-label="Mission and Vision"
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* Left: Text Content */}
            <div className={`space-y-8 transition-all duration-700 ease-out ${valuesIn ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}>
              
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 bg-[#3a4739]/10 border border-[#3a4739]/30 rounded-full px-3.5 py-1">
                  <span className="w-1.5 h-1.5 bg-[#3a4739] rounded-full" />
                  <span className="text-[10px] font-bold text-[#3a4739] uppercase tracking-widest text-[#3a4739]">Commitment</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2e3a2c] tracking-tight">Our Core Directives</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-extrabold text-sm text-[#2e3a2c] mb-2 uppercase tracking-wider text-[#d69a45]">The Mission</h3>
                  <p className="text-gray-500 text-sm leading-relaxed font-light">
                    To construct solid hardwood furniture designed to last generations, utilizing factory-direct logistics to bypass commercial showroom inflation.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-extrabold text-sm text-[#2e3a2c] mb-2 uppercase tracking-wider text-[#d69a45]">The Vision</h3>
                  <p className="text-gray-500 text-sm leading-relaxed font-light">
                    To scale custom furniture carpentry across Bangladesh without compromising traditional seasoned timber jointing and direct artisan employment.
                  </p>
                </div>

                <div>
                  <h3 className="font-extrabold text-sm text-[#2e3a2c] mb-2 uppercase tracking-wider text-[#d69a45]">Company Values</h3>
                  <p className="text-gray-500 text-sm leading-relaxed font-light">
                    Honesty in wood selection, pride in jointing craftsmanship, and total accountability in customer post-sales relationships guide every cut we make.
                  </p>
                </div>
              </div>

            </div>

            {/* Right: Reused premium item image (onno-zGKRmwzplVc-unsplash.jpg) */}
            <div className={`relative transition-all duration-700 ease-out delay-150 ${valuesIn ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}>
              <div className="relative rounded-xl overflow-hidden shadow-md bg-white p-2">
                <img
                  src="/images/onno-zGKRmwzplVc-unsplash.jpg"
                  alt="Premium finished solid wood side table"
                  className="w-full h-[360px] sm:h-[460px] object-cover rounded-lg"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── 4. STATS BAR (Minimal typography layout, no cards) ────────────── */}
      <section
        ref={statsRef}
        className="py-12 bg-[#3a4739] relative overflow-hidden"
        aria-label="Company Statistics"
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 text-center">
            {STATS.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="flex flex-col items-center justify-center space-y-1 py-3">
                  <Icon size={20} className="text-[#d69a45] mb-2" />
                  <span className="text-2xl sm:text-3xl font-black text-white leading-none">
                    {statsIn ? <AnimatedNumber target={s.value} suffix={s.suffix} /> : "0"}
                  </span>
                  <span className="text-[10px] text-white/60 uppercase tracking-widest font-semibold">{s.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── 5. WHAT WE DO (Clean typography & icon list) ──────────────────── */}
      <section
        ref={whatRef}
        className="py-16 lg:py-24 bg-white"
        aria-label="Capabilities"
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-xl mb-12 space-y-2">
            <div className="inline-flex items-center gap-2 bg-[#d69a45]/10 border border-[#d69a45]/30 rounded-full px-3.5 py-1">
              <span className="w-1.5 h-1.5 bg-[#d69a45] rounded-full" />
              <span className="text-[10px] font-bold text-[#d69a45] uppercase tracking-wider">Expertise</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2e3a2c] tracking-tight">Our Work Areas</h2>
            <p className="text-gray-400 text-sm font-light">We manufacture solid-timber furniture and custom structural fits tailored to spaces.</p>
            <div className="w-10 h-[2px] bg-[#d69a45] mt-4" />
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 transition-all duration-700 ${whatIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            {WHAT_WE_DO.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="space-y-3">
                  <div className="w-10 h-10 bg-[#faf8f5] text-[#3a4739] rounded-xl flex items-center justify-center shrink-0 border border-gray-100">
                    <Icon size={18} />
                  </div>
                  <h3 className="font-extrabold text-sm text-[#2e3a2c]">{item.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed font-light">{item.desc}</p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ─── 6. CUSTOM FURNITURE SECTION (Alternating: Content Left, Image Right) ─── */}
      <section
        ref={customRef}
        className="py-16 lg:py-24 bg-[#faf8f5] relative overflow-hidden"
        aria-label="Custom Carpentry"
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* Left: Custom content details */}
            <div className={`space-y-6 transition-all duration-700 ${customIn ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}>
              <div className="inline-flex items-center gap-2 bg-[#d69a45]/10 border border-[#d69a45]/30 rounded-full px-3.5 py-1">
                <span className="w-1.5 h-1.5 bg-[#d69a45] rounded-full" />
                <span className="text-[10px] font-bold text-[#d69a45] uppercase tracking-wider">Bespoke Orders</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2e3a2c] tracking-tight">
                Crafted to Your Sizing Specifications
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed font-light">
                We accommodate fully custom furniture dimensions, wood specifications, and lacquer shades. Simply contact our workshop with your references or sketches.
              </p>

              {/* Custom specs checklist */}
              <div className="space-y-2 max-w-sm pt-2">
                {["Custom Sizing to fit exact walls", "Premium wood log selection (Teak/Mahogany)", "Tailored color tints and Italian lacquer finish", "Draft sketches and design approval"].map((opt) => (
                  <div key={opt} className="flex items-center gap-2.5">
                    <FiCheckCircle size={14} className="text-[#d69a45] shrink-0" />
                    <span className="text-xs text-[#2e3a2c] font-medium">{opt}</span>
                  </div>
                ))}
              </div>

              {/* CTA button */}
              <div className="pt-2">
                <button
                  onClick={() => router.push("/contact")}
                  className="inline-flex items-center gap-2 bg-[#3a4739] hover:bg-[#2e3a2c] text-white text-[11px] font-black uppercase tracking-widest px-7 py-3.5 rounded-sm transition-all shadow-md cursor-pointer group"
                >
                  Request a Custom Order
                  <FiArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Right: Reused workshop avif image (customfur.avif) */}
            <div className={`transition-all duration-700 delay-150 ${customIn ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}>
              <div className="relative rounded-xl overflow-hidden shadow-md bg-white p-2">
                <img
                  src="/images/customfur.avif"
                  alt="Custom woodwork details at factory"
                  className="w-full h-[360px] sm:h-[440px] object-cover rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/images/side1.jpg";
                  }}
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── 7. WHY CHOOSE US (Craftsmanship Focus) ─────────────────────────── */}
      <section
        ref={whyRef}
        className="py-16 lg:py-24 bg-white"
        aria-label="Quality Standards"
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-xl mb-12 space-y-2">
            <div className="inline-flex items-center gap-2 bg-[#d69a45]/10 border border-[#d69a45]/30 rounded-full px-3.5 py-1">
              <span className="w-1.5 h-1.5 bg-[#d69a45] rounded-full" />
              <span className="text-[10px] font-bold text-[#d69a45] uppercase tracking-wider">Quality Pillars</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2e3a2c] tracking-tight">Our Standards</h2>
            <p className="text-gray-400 text-sm font-light">Why we focus purely on solid structural timber joinery rather than mass production.</p>
            <div className="w-10 h-[2px] bg-[#d69a45] mt-4" />
          </div>

          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-700 ${whyIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            {WHY_CHOOSE.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="space-y-2 border-l border-gray-200 pl-4 hover:border-[#d69a45] transition-colors">
                  <div className="text-[#d69a45] mb-2">
                    <Icon size={20} />
                  </div>
                  <h3 className="font-extrabold text-sm text-[#2e3a2c]">{item.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed font-light">{item.desc}</p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ─── 8. OUR SHOWROOMS (Divisional Outlets) ──────────────────────────── */}
      <section
        ref={showroomRef}
        className="py-16 lg:py-24 bg-[#faf8f5]"
        aria-label="Our Outlets"
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-xl mb-10 space-y-2">
            <div className="inline-flex items-center gap-2 bg-[#d69a45]/10 border border-[#d69a45]/30 rounded-full px-3.5 py-1">
              <span className="w-1.5 h-1.5 bg-[#d69a45] rounded-full" />
              <span className="text-[10px] font-bold text-[#d69a45] uppercase tracking-wider">Outlets</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2e3a2c] tracking-tight">Our Showrooms</h2>
            <p className="text-gray-400 text-sm font-light">Divisional outlets to experience the catalog quality in person.</p>
            <div className="w-10 h-[2px] bg-[#d69a45] mt-4" />
          </div>

          {/* Showroom info placeholder block */}
          <div className="mb-8 p-3.5 bg-[#d69a45]/5 border border-[#d69a45]/20 rounded-xl text-left max-w-lg">
            <p className="text-[10px] text-[#2e3a2c] font-semibold flex items-center gap-1.5">
              <FiShield size={12} className="text-[#d69a45]" />
              Address details are temporary placeholders pending final client verification.
            </p>
          </div>

          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-700 ${showroomIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            {OUTLETS.map((s, i) => (
              <div
                key={i}
                className="group bg-white border border-gray-100 rounded-xl p-6 hover:shadow-sm hover:border-[#d69a45]/20 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <h3 className="font-extrabold text-sm text-[#2e3a2c] group-hover:text-[#d69a45] transition-colors">{s.city} Showroom</h3>
                  <p className="text-xs text-gray-500 leading-relaxed font-light">{s.address}</p>
                </div>
                
                <a
                  href={`tel:${s.phone.replace(/\s+/g, "")}`}
                  className="inline-flex items-center gap-1.5 mt-4 text-[10px] font-bold text-[#3a4739] hover:text-[#d69a45] transition-colors uppercase tracking-wider"
                >
                  <FiPhone size={11} className="text-[#d69a45]" />
                  {s.phone}
                </a>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ─── 9. CLOSING SECTION (Full-bleed room backdrop with CTA) ─────────── */}
      <section
        className="py-0 bg-[#faf8f5] px-4 sm:px-6 lg:px-8 pb-16"
        aria-label="Contact Section"
      >
        <div className="max-w-[1400px] mx-auto">
          <div className="relative bg-[#3a4739] rounded-2xl overflow-hidden shadow-lg">
            {/* Reuses side2.jpg room scene image */}
            <div className="absolute inset-0">
              <img
                src="/images/side2.jpg"
                alt="Modern living spaces showcase"
                className="w-full h-full object-cover opacity-15"
              />
            </div>
            
            {/* Content panel */}
            <div className="relative z-10 py-16 px-6 sm:px-12 text-center max-w-xl mx-auto space-y-5">
              <div className="inline-flex items-center gap-2 bg-[#d69a45]/20 border border-[#d69a45]/30 rounded-full px-3.5 py-1">
                <span className="text-[10px] font-bold text-[#d69a45] uppercase tracking-wider">Contact Us</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                Our Quality Promise
              </h2>
              <p className="text-white/70 text-xs sm:text-sm leading-relaxed font-light">
                Every piece that leaves our workshop is built to look beautiful and last a lifetime. Get in touch with our design leads to start your layout.
              </p>
              
              <div className="pt-2">
                <button
                  onClick={() => router.push("/contact")}
                  className="inline-flex items-center gap-2 bg-[#d69a45] hover:bg-[#c0873a] text-white text-[11px] font-black uppercase tracking-widest px-8 py-4 rounded-sm transition-all shadow-md cursor-pointer group"
                >
                  Contact Us
                  <FiArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
