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
  FiArrowUpRight,
  FiShoppingBag,
  FiHeart,
  FiScissors,
} from "react-icons/fi";

// ─── Scroll-trigger Hook ──────────────────────────────────────────────────────
function useInView(ref: React.RefObject<HTMLElement | null>, threshold = 0.1) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setVisible(true);
      },
      { threshold }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref, threshold]);
  return visible;
}

// ─── Animated Counter ─────────────────────────────────────────────────────────
function AnimatedNumber({
  target,
  suffix = "",
}: {
  target: number;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
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
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
//  STATIC SHOWROOMS (fashion brand outlets)
// ══════════════════════════════════════════════════════════════════════════════

const SHOWROOMS = [
  {
    id: "rupatoli",
    name: "Rupatoli Housing",
    city: "Barishal",
    address:
      "Rupatoli Housing Estate, Road # 7, Bangladesh Open University Area Office, Barishal 8200",
    phone: "01761-758729",
    hours: "Open Daily · 10:00 AM – 10:30 PM",
  },
  {
    id: "banglabazar",
    name: "Banglabazar More",
    city: "Barishal",
    address:
      "Banglabazar More, Police Line, Barishal",
    phone: "01767-473504",
    hours: "Open Daily · 10:00 AM – 10:30 PM",
  },
];

// ══════════════════════════════════════════════════════════════════════════════
//  DATA
// ══════════════════════════════════════════════════════════════════════════════

const STATS = [
  { value: 2018, suffix: "", label: "Established", icon: FiCalendar },
  { value: 2, suffix: "", label: "Outlets in Barishal", icon: FiMapPin },
  { value: 25000, suffix: "+", label: "Happy Families", icon: FiUsers },
  { value: 500, suffix: "+", label: "Styles & Designs", icon: FiLayers },
  { value: 15, suffix: "+", label: "Years of Trust", icon: FiAward },
];

const WHAT_WE_DO = [
  {
    icon: FiShoppingBag,
    title: "Men's Ready-Made",
    desc: "Shirts, Punjabis, trousers, and casual wear — tailored to fit every Bangladeshi man's everyday style.",
  },
  {
    icon: FiHeart,
    title: "Women's Collection",
    desc: "Sarees, salwar kameez, three-piece sets and modest daily wear that celebrates our heritage and comfort.",
  },
  {
    icon: FiUsers,
    title: "Kids & Family Wear",
    desc: "Colourful, comfortable, and affordable clothing for every member of the family — from toddlers to grandparents.",
  },
  {
    icon: FiScissors,
    title: "School & Office Uniforms",
    desc: "Bulk-ready uniforms crafted with premium cotton blends for schools, offices, and institutions across Barishal.",
  },
];

const WHY_CHOOSE = [
  {
    icon: FiShield,
    title: "Quality You Can Feel",
    desc: "We handpick fabric quality and stitching standards before every piece reaches our shelf. No compromises.",
  },
  {
    icon: FiAward,
    title: "Modest & Family Fashion",
    desc: "Curated to honour the modest sensibilities of Bangladeshi families — elegant without overcomplicating.",
  },
  {
    icon: FiCompass,
    title: "Everyday Affordability",
    desc: "Direct-sourcing means premium fashion at prices that work for everyday families, not just special occasions.",
  },
  {
    icon: FiDollarSign,
    title: "Two Outlets, One Promise",
    desc: "Whether you visit Rupatoli Housing or Banglabazar More, you get the same honest pricing and warm service.",
  },
  {
    icon: FiTruck,
    title: "Local Delivery & WhatsApp",
    desc: "Message us on WhatsApp, place an order, and we deliver within Barishal quickly and reliably.",
  },
  {
    icon: FiThumbsUp,
    title: "Trusted by Families",
    desc: "Thousands of families have trusted us since 2018 for their daily, festival, and ceremonial wardrobes.",
  },
];

// ══════════════════════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ══════════════════════════════════════════════════════════════════════════════

export default function AboutPage() {
  const router = useRouter();

  const storyRef = useRef<HTMLElement>(null);
  const valuesRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLElement>(null);
  const whatRef = useRef<HTMLElement>(null);
  const customRef = useRef<HTMLElement>(null);
  const whyRef = useRef<HTMLElement>(null);
  const showroomRef = useRef<HTMLElement>(null);

  const storyIn = useInView(storyRef);
  const valuesIn = useInView(valuesRef);
  const statsIn = useInView(statsRef);
  const whatIn = useInView(whatRef);
  const customIn = useInView(customRef);
  const whyIn = useInView(whyRef);
  const showroomIn = useInView(showroomRef);

  return (
    <>
      <Navbar />

      {/* ═══════════════════════════════════════════════════════════════════
          1. HERO — Fashion Editorial Split
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[520px] sm:min-h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 -z-20">
          <img
            src="/images/fashion-hero.jpg"
            alt="Abdullah Poshak Ghor fashion collection"
            className="w-full h-full object-cover object-center scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/images/side.jpg";
            }}
          />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#2e3a2c]/95 via-[#3a4739]/90 to-[#2e3a2c]/95" />
        <div className="absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#d69a45] to-transparent z-10" />

        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <nav className="flex items-center gap-2 text-white/50 text-xs mb-8 font-sans tracking-wide">
            <Link href="/" className="hover:text-[#d69a45] transition-colors">
              Home
            </Link>
            <span className="text-white/30">/</span>
            <span className="text-[#d69a45] font-semibold">About Us</span>
          </nav>

          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-1.5">
              <span className="w-1.5 h-1.5 bg-[#d69a45] rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-[#d69a45] uppercase tracking-[0.2em]">
                Since 2018 · Barishal
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.05]">
              Everyday Fashion,
              <br />
              Woven with <span className="text-[#d69a45]">Trust.</span>
            </h1>

            <p className="text-white/70 text-sm sm:text-base leading-relaxed font-light max-w-xl">
              From the heart of Barishal, <strong className="text-white font-semibold">Abdullah Poshak Ghor</strong> has
              been dressing families since 2018 — offering quality ready-made
              garments for men, women, and children at honest,
              everyday prices.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => router.push("/shop")}
                className="inline-flex items-center gap-2 bg-[#d69a45] hover:bg-[#c0873a] text-white text-[11px] font-black uppercase tracking-widest px-7 py-4 rounded-sm transition-all shadow-lg group"
              >
                Explore Collection
                <FiArrowRight
                  size={14}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
              <button
                onClick={() => router.push("/contact")}
                className="inline-flex items-center gap-2 text-white/80 hover:text-white text-[11px] font-bold uppercase tracking-widest px-5 py-4 transition-colors"
              >
                Visit Our Outlets
                <FiArrowUpRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          2. OUR STORY
      ═══════════════════════════════════════════════════════════════════ */}
      <section
        ref={storyRef}
        className="py-20 lg:py-32 bg-[#faf8f5] relative overflow-hidden"
        aria-label="Brand Story"
      >
        <div className="absolute top-32 -left-32 w-96 h-96 bg-[#d69a45]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left: Image Stack */}
            <div
              className={`w-full lg:col-span-5 relative transition-all duration-700 ease-out ${
                storyIn
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-8"
              }`}
            >
              <div className="relative rounded-2xl overflow-hidden shadow-xl bg-white p-2">
                <img
                  src="/images/fashion-story.jpg"
                  alt="Abdullah Poshak Ghor storefront and collection"
                  className="w-full h-[420px] sm:h-[520px] object-cover rounded-xl"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/images/side1.jpg";
                  }}
                />
              </div>

              {/* Floating info card */}
              <div className="absolute -bottom-6 -right-6 hidden sm:block bg-white rounded-2xl shadow-xl border border-gray-100 p-5 max-w-[220px]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-[#d69a45]/10 flex items-center justify-center">
                    <FiMapPin size={14} className="text-[#d69a45]" />
                  </div>
                  <span className="text-[10px] font-bold text-[#d69a45] uppercase tracking-widest">
                    Proudly Local
                  </span>
                </div>
                <p className="text-sm font-extrabold text-[#2e3a2c] leading-tight">
                  Barishal,
                  <br />
                  Bangladesh
                </p>
              </div>
            </div>

            {/* Right: Narrative */}
            <div
              className={`w-full lg:col-span-7 space-y-8 transition-all duration-700 ease-out delay-150 ${
                storyIn
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-8"
              }`}
            >
              <div className="inline-flex items-center gap-2 bg-[#d69a45]/10 border border-[#d69a45]/30 rounded-full px-3.5 py-1">
                <span className="w-1.5 h-1.5 bg-[#d69a45] rounded-full" />
                <span className="text-[10px] font-bold text-[#d69a45] uppercase tracking-[0.2em]">
                  Chapter 01 — Our Story
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#2e3a2c] leading-[1.1] tracking-tight">
                Rooted in Barishal&apos;s{" "}
                <span className="text-[#d69a45]">family fashion.</span>
              </h2>

              <div className="text-gray-600 text-sm sm:text-[15px] leading-relaxed space-y-5 font-light">
                <p>
                  <strong className="font-semibold text-[#2e3a2c]">
                    Abdullah Poshak Ghor
                  </strong>{" "}
                  opened its doors in 2018 with one simple idea — that everyday
                  Bangladeshi families deserve good clothing at honest prices.
                  What started as a single outlet in Rupatoli Housing has since
                  grown into a trusted name across Barishal.
                </p>
                <p>
                  We specialize in{" "}
                  <strong className="font-semibold text-[#2e3a2c]">
                    ready-made garments for men, women, and children
                  </strong>{" "}
                  — from Punjabis and shirts to sarees, salwar kameez, three-piece
                  sets, school uniforms, and comfortable cotton wear. Every
                  piece is selected for fabric quality, fit, and modesty.
                </p>
                <p>
                  Today we proudly operate{" "}
                  <strong className="font-semibold text-[#2e3a2c]">
                    two outlets
                  </strong>{" "}
                  — one at Rupatoli Housing Estate (Road #7) and another at
                  Banglabazar More, Police Line. Whether you visit us in person
                  or message on WhatsApp, you&apos;ll always find the same warm
                  service and fair pricing.
                </p>
              </div>

              {/* Founder quote */}
              <div className="border-l-2 border-[#d69a45] pl-5 py-2">
                <p className="text-[#2e3a2c] font-medium italic text-sm leading-relaxed">
                  &ldquo;Simplicity and style can live together. We dress
                  Barishal&apos;s families the way we&apos;d dress our own.&rdquo;
                </p>
                <p className="text-[10px] font-bold text-[#d69a45] uppercase tracking-widest mt-3">
                  — Abdullah Poshak Ghor
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          3. MISSION, VISION & VALUES
      ═══════════════════════════════════════════════════════════════════ */}
      <section
        ref={valuesRef}
        className="py-20 lg:py-32 bg-white"
        aria-label="Mission and Vision"
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div
              className={`w-full lg:col-span-7 space-y-10 transition-all duration-700 ease-out ${
                valuesIn
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-8"
              }`}
            >
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 bg-[#3a4739]/10 border border-[#3a4739]/30 rounded-full px-3.5 py-1">
                  <span className="w-1.5 h-1.5 bg-[#3a4739] rounded-full" />
                  <span className="text-[10px] font-bold text-[#3a4739] uppercase tracking-[0.2em]">
                    Chapter 02 — Commitment
                  </span>
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#2e3a2c] tracking-tight leading-[1.1]">
                  Our Core Values.
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-4">
                {[
                  {
                    label: "Our Mission",
                    text: "To provide quality ready-made garments for every member of the Barishal family — honestly priced, modestly styled, and reliably available.",
                  },
                  {
                    label: "Our Vision",
                    text: "To grow as Bangladesh's most trusted local fashion destination, expanding our outlets without ever compromising on quality or affordability.",
                  },
                  {
                    label: "Our Promise",
                    text: "Fabric that feels right. Fit that respects you. Prices that stay honest. Service that remembers your name.",
                  },
                ].map((item) => (
                  <div key={item.label} className="space-y-3">
                    <div className="w-8 h-[2px] bg-[#d69a45]" />
                    <h3 className="font-extrabold text-xs uppercase tracking-[0.15em] text-[#d69a45]">
                      {item.label}
                    </h3>
                    <p className="text-gray-500 text-xs leading-relaxed font-light">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div
              className={`w-full lg:col-span-5 relative transition-all duration-700 ease-out delay-150 ${
                valuesIn
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-8"
              }`}
            >
              <div className="relative rounded-2xl overflow-hidden shadow-xl bg-white p-2">
                <img
                  src="/images/fashion-values.jpg"
                  alt="Premium fabric and clothing collection"
                  className="w-full h-[420px] sm:h-[520px] object-cover rounded-xl"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "/images/onno-zGKRmwzplVc-unsplash.jpg";
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          4. STATS BAR
      ═══════════════════════════════════════════════════════════════════ */}
      <section
        ref={statsRef}
        className="py-16 bg-[#2e3a2c] relative overflow-hidden"
        aria-label="Company Statistics"
      >
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#d69a45,transparent_70%)]" />
        </div>

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 text-center">
            {STATS.map((s, i) => {
              const Icon = s.icon;
              return (
                <div
                  key={i}
                  className="flex flex-col items-center justify-center space-y-2 py-3"
                >
                  <div className="w-10 h-10 rounded-full bg-[#d69a45]/10 border border-[#d69a45]/20 flex items-center justify-center mb-1">
                    <Icon size={16} className="text-[#d69a45]" />
                  </div>
                  <span className="text-3xl sm:text-4xl font-black text-white leading-none tracking-tight">
                    {statsIn ? (
                      <AnimatedNumber target={s.value} suffix={s.suffix} />
                    ) : (
                      "0"
                    )}
                  </span>
                  <span className="text-[10px] text-white/50 uppercase tracking-[0.15em] font-semibold">
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          5. WHAT WE OFFER
      ═══════════════════════════════════════════════════════════════════ */}
      <section
        ref={whatRef}
        className="py-20 lg:py-32 bg-white"
        aria-label="Our Collections"
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-16 space-y-3">
            <div className="inline-flex items-center gap-2 bg-[#d69a45]/10 border border-[#d69a45]/30 rounded-full px-3.5 py-1">
              <span className="w-1.5 h-1.5 bg-[#d69a45] rounded-full" />
              <span className="text-[10px] font-bold text-[#d69a45] uppercase tracking-[0.2em]">
                Chapter 03 — Collections
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#2e3a2c] tracking-tight leading-[1.1]">
              What We Offer.
            </h2>
            <p className="text-gray-400 text-sm font-light">
              Everyday wear for the whole family — curated with care, priced
              honestly.
            </p>
            <div className="w-12 h-[2px] bg-[#d69a45] mt-5" />
          </div>

          <div
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 transition-all duration-700 ${
              whatIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            {WHAT_WE_DO.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="group space-y-4 p-6 rounded-2xl border border-gray-100 hover:border-[#d69a45]/30 hover:shadow-lg hover:shadow-gray-100 transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-[#faf8f5] text-[#3a4739] rounded-xl flex items-center justify-center border border-gray-100 group-hover:bg-[#d69a45] group-hover:text-white group-hover:border-[#d69a45] transition-all duration-300">
                    <Icon size={20} />
                  </div>
                  <h3 className="font-extrabold text-sm text-[#2e3a2c] tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed font-light">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          6. WHATSAPP / ORDER
      ═══════════════════════════════════════════════════════════════════ */}
      <section
        ref={customRef}
        className="py-20 lg:py-32 bg-[#faf8f5] relative overflow-hidden"
        aria-label="WhatsApp Orders"
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div
              className={`w-full space-y-7 transition-all duration-700 ${
                customIn
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-8"
              }`}
            >
              <div className="inline-flex items-center gap-2 bg-[#d69a45]/10 border border-[#d69a45]/30 rounded-full px-3.5 py-1">
                <span className="w-1.5 h-1.5 bg-[#d69a45] rounded-full" />
                <span className="text-[10px] font-bold text-[#d69a45] uppercase tracking-[0.2em]">
                  Chapter 04 — Order via WhatsApp
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#2e3a2c] tracking-tight leading-[1.1]">
                Shop from home —{" "}
                <span className="text-[#d69a45]">just message us.</span>
              </h2>

              <p className="text-gray-500 text-sm leading-relaxed font-light max-w-lg">
                Can&apos;t visit the outlet? Send us a WhatsApp message with
                your size and preferred style — our team will reply with photos,
                prices, and delivery options within Barishal.
              </p>

              <div className="space-y-3 max-w-sm pt-2">
                {[
                  "Send us a WhatsApp with your style preference",
                  "Get photos, sizes, and prices instantly",
                  "Confirm your order and address",
                  "Fast local delivery within Barishal",
                ].map((opt) => (
                  <div key={opt} className="flex items-center gap-3">
                    <FiCheckCircle
                      size={16}
                      className="text-[#d69a45] shrink-0"
                    />
                    <span className="text-xs text-[#2e3a2c] font-medium">
                      {opt}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 flex flex-wrap gap-3">
                <a
                  href="https://wa.me/8801761758729"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5b] text-white text-[11px] font-black uppercase tracking-widest px-7 py-4 rounded-sm transition-all shadow-lg"
                >
                  WhatsApp · 01761-758729
                </a>
                <a
                  href="https://wa.me/8801767473504"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#3a4739] hover:bg-[#2e3a2c] text-white text-[11px] font-black uppercase tracking-widest px-7 py-4 rounded-sm transition-all shadow-lg"
                >
                  WhatsApp · 01767-473504
                </a>
              </div>
            </div>

            <div
              className={`w-full transition-all duration-700 delay-150 ${
                customIn
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-8"
              }`}
            >
              <div className="relative rounded-2xl overflow-hidden shadow-xl bg-white p-2">
                <img
                  src="/images/fashion-whatsapp.jpg"
                  alt="Shop clothing via WhatsApp"
                  className="w-full h-[420px] sm:h-[520px] object-cover rounded-xl"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/images/customfur.avif";
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          7. WHY CHOOSE US
      ═══════════════════════════════════════════════════════════════════ */}
      <section
        ref={whyRef}
        className="py-20 lg:py-32 bg-white"
        aria-label="Why Choose Us"
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-16 space-y-3">
            <div className="inline-flex items-center gap-2 bg-[#d69a45]/10 border border-[#d69a45]/30 rounded-full px-3.5 py-1">
              <span className="w-1.5 h-1.5 bg-[#d69a45] rounded-full" />
              <span className="text-[10px] font-bold text-[#d69a45] uppercase tracking-[0.2em]">
                Chapter 05 — Why Families Choose Us
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#2e3a2c] tracking-tight leading-[1.1]">
              Our Promise to You.
            </h2>
            <p className="text-gray-400 text-sm font-light">
              Honest pricing, quality fabrics, and a warm welcome — every visit.
            </p>
            <div className="w-12 h-[2px] bg-[#d69a45] mt-5" />
          </div>

          <div
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-700 ${
              whyIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            {WHY_CHOOSE.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="group space-y-3 p-6 rounded-2xl bg-[#faf8f5] border border-transparent hover:border-[#d69a45]/20 hover:bg-white hover:shadow-lg hover:shadow-gray-100 transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-[#d69a45] group-hover:bg-[#d69a45] group-hover:text-white group-hover:border-[#d69a45] transition-all duration-300">
                    <Icon size={18} />
                  </div>
                  <h3 className="font-extrabold text-sm text-[#2e3a2c] tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed font-light">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          8. OUR SHOWROOMS (STATIC)
      ═══════════════════════════════════════════════════════════════════ */}
      <section
        ref={showroomRef}
        className="py-20 lg:py-32 bg-[#faf8f5]"
        aria-label="Our Outlets"
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-14 space-y-3">
            <div className="inline-flex items-center gap-2 bg-[#d69a45]/10 border border-[#d69a45]/30 rounded-full px-3.5 py-1">
              <span className="w-1.5 h-1.5 bg-[#d69a45] rounded-full" />
              <span className="text-[10px] font-bold text-[#d69a45] uppercase tracking-[0.2em]">
                Chapter 06 — Our Outlets
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#2e3a2c] tracking-tight leading-[1.1]">
              Visit Us in Barishal.
            </h2>
            <p className="text-gray-400 text-sm font-light">
              Two convenient outlets to experience the collection in person.
            </p>
            <div className="w-12 h-[2px] bg-[#d69a45] mt-5" />
          </div>

          <div
            className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-all duration-700 ${
              showroomIn
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
          >
            {SHOWROOMS.map((s) => (
              <div
                key={s.id}
                className="group bg-white border border-gray-100 rounded-2xl p-7 hover:shadow-xl hover:shadow-gray-100 hover:border-[#d69a45]/30 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-[#faf8f5] flex items-center justify-center text-[#d69a45] group-hover:bg-[#d69a45] group-hover:text-white transition-all duration-300">
                      <FiMapPin size={16} />
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-[#d69a45]">
                      {s.city}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-base text-[#2e3a2c] group-hover:text-[#d69a45] transition-colors tracking-tight">
                    {s.name} Showroom
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed font-light">
                    {s.address}
                  </p>
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                    {s.hours}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 mt-5 pt-4 border-t border-gray-100">
                  <a
                    href={`tel:${s.phone.replace(/[^\d+]/g, "")}`}
                    className="inline-flex items-center gap-2 text-[11px] font-bold text-[#3a4739] hover:text-[#d69a45] transition-colors uppercase tracking-widest"
                  >
                    <FiPhone size={12} className="text-[#d69a45]" />
                    {s.phone}
                  </a>
                  <a
                    href={`https://wa.me/88${s.phone.replace(/[^\d]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[11px] font-bold text-[#25D366] hover:text-[#1ebe5b] transition-colors uppercase tracking-widest"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          9. CLOSING CTA
      ═══════════════════════════════════════════════════════════════════ */}
      <section
        className="py-0 bg-[#faf8f5] px-4 sm:px-6 lg:px-8 pb-20"
        aria-label="Contact Section"
      >
        <div className="max-w-[1400px] mx-auto">
          <div className="relative bg-[#2e3a2c] rounded-3xl overflow-hidden shadow-2xl">
            <div className="absolute inset-0">
              <img
                src="/images/fashion-cta.jpg"
                alt="Abdullah Poshak Ghor collection"
                className="w-full h-full object-cover opacity-20"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/images/side2.jpg";
                }}
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-[#2e3a2c]/80 via-transparent to-[#2e3a2c]/80" />

            <div className="relative z-10 py-20 px-6 sm:px-12 text-center max-w-2xl mx-auto space-y-6">
              <div className="inline-flex items-center gap-2 bg-[#d69a45]/20 border border-[#d69a45]/40 rounded-full px-4 py-1.5">
                <span className="text-[10px] font-bold text-[#d69a45] uppercase tracking-[0.2em]">
                  Get In Touch
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight tracking-tight">
                Simplicity and Style Await.
              </h2>
              <p className="text-white/70 text-sm leading-relaxed font-light max-w-md mx-auto">
                Whether you&apos;re dressing for Eid, school, office, or
                everyday comfort — we&apos;re here. Visit our outlets or
                WhatsApp us today.
              </p>

              <div className="pt-3 flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => router.push("/contact")}
                  className="inline-flex items-center gap-2 bg-[#d69a45] hover:bg-[#c0873a] text-white text-[11px] font-black uppercase tracking-widest px-9 py-4 rounded-sm transition-all shadow-lg group"
                >
                  Contact Us
                  <FiArrowRight
                    size={14}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
                <button
                  onClick={() => router.push("/shop")}
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-[11px] font-black uppercase tracking-widest px-7 py-4 rounded-sm transition-all"
                >
                  Shop Now
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