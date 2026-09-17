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

// ─── Showroom Interface ───────────────────────────────────────────────────────
interface Showroom {
  _id: string;
  city: string;
  address: string;
  phone: string;
  createdAt?: string;
}

// ══════════════════════════════════════════════════════════════════════════════
//  DATA
// ══════════════════════════════════════════════════════════════════════════════

const STATS = [
  { value: 1954, suffix: "", label: "Established", icon: FiCalendar },
  { value: 8, suffix: "", label: "Showrooms", icon: FiMapPin },
  { value: 25000, suffix: "+", label: "Happy Customers", icon: FiUsers },
  { value: 500, suffix: "+", label: "Furniture Designs", icon: FiLayers },
  { value: 50, suffix: "+", label: "Skilled Craftsmen", icon: FiAward },
];

const WHAT_WE_DO = [
  {
    icon: FiHome,
    title: "Residential Furniture",
    desc: "Premium dining sets, luxury beds, wardrobes, and cabinets built to bring warmth to modern households.",
  },
  {
    icon: FiBriefcase,
    title: "Commercial Fittings",
    desc: "Conference tables, reception counters, and ergonomic office desks optimized for productivity.",
  },
  {
    icon: FiBox,
    title: "Solid Wood Doors",
    desc: "Seasoned teak and local hardwood doors carved with traditional patterns or modern flush veneers.",
  },
  {
    icon: FiCompass,
    title: "Interior Woodwork",
    desc: "Custom wall paneling, display racks, and specialized TV units crafted to match interior layouts.",
  },
];

const WHY_CHOOSE = [
  {
    icon: FiShield,
    title: "Premium Seasoned Timber",
    desc: "We use only genuine Chittagong Teak (সেগুন), Mahogany, and Silkoroi wood, thoroughly seasoned to prevent split or warp.",
  },
  {
    icon: FiAward,
    title: "Traditional Joinery",
    desc: "Our carpenters specialize in hand-fitted joinery methods like mortise-and-tenon to secure long-term structural integrity.",
  },
  {
    icon: FiCompass,
    title: "Bespoke Customization",
    desc: "Every piece of furniture can be tailored down to the exact millimeter, polish hue, and timber species.",
  },
  {
    icon: FiDollarSign,
    title: "Factory Direct Value",
    desc: "By manufacturing locally in our Barishal factory, we deliver luxury solid wood furniture at sensible prices.",
  },
  {
    icon: FiTruck,
    title: "Nationwide Installation",
    desc: "Our in-house logistics team handles secure shipping, loading, and direct set-up inside your home.",
  },
  {
    icon: FiThumbsUp,
    title: "Structural Warranty",
    desc: "Every product is backed by our workshop warranty against wood pests and natural timber structural defects.",
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

  // ─── Dynamic Showrooms ─────────────────────────────────────────────────
  const [showrooms, setShowrooms] = useState<Showroom[]>([]);
  const [showroomsLoading, setShowroomsLoading] = useState(true);
  const [showroomsError, setShowroomsError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShowrooms = async () => {
      try {
        setShowroomsLoading(true);
        setShowroomsError(null);
        const res = await fetch("/api/showrooms", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load showrooms");
        const result = await res.json();
        if (result.success) {
          setShowrooms(result.data || []);
        } else {
          throw new Error(result.error || "Failed to load showrooms");
        }
      } catch (err: any) {
        console.error("Failed to fetch showrooms:", err);
        setShowroomsError(err.message || "Could not load showrooms");
        setShowrooms([]);
      } finally {
        setShowroomsLoading(false);
      }
    };
    fetchShowrooms();
  }, []);

  // ─── Live stats: replace hardcoded showroom count ──────────────────────
  const liveStats = STATS.map((s) =>
    s.label === "Showrooms" && showrooms.length > 0
      ? { ...s, value: showrooms.length }
      : s
  );

  return (
    <>
      <Navbar />

      {/* ═══════════════════════════════════════════════════════════════════
          1. HERO — Premium Editorial Split
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[520px] sm:min-h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 -z-20">
          <img
            src="/images/side.jpg"
            alt="Premium solid wood furniture"
            className="w-full h-full object-cover object-center scale-105"
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
              Where Timber
              <br />
              Meets <span className="text-[#d69a45]">Tradition.</span>
            </h1>

            <p className="text-white/70 text-sm sm:text-base leading-relaxed font-light max-w-xl">
              Born in the heart of Barishal, Sareng Furniture has been crafting
              premium seasoned hardwood pieces since 2018 — pairing legacy
              carpentry with modern design integrity and factory-direct
              honesty.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => router.push("/products")}
                className="inline-flex items-center gap-2 bg-[#d69a45] hover:bg-[#c0873a] text-white text-[11px] font-black uppercase tracking-widest px-7 py-4 rounded-sm transition-all shadow-lg group"
              >
                Explore Catalog
                <FiArrowRight
                  size={14}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
              <button
                onClick={() => router.push("/contact")}
                className="inline-flex items-center gap-2 text-white/80 hover:text-white text-[11px] font-bold uppercase tracking-widest px-5 py-4 transition-colors"
              >
                Visit Workshop
                <FiArrowUpRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          2. OUR STORY — Barishal Origin
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
                  src="/images/side1.jpg"
                  alt="Sareng Furniture workshop and showroom"
                  className="w-full h-[420px] sm:h-[520px] object-cover rounded-xl"
                />
              </div>

              {/* Floating info card */}
              <div className="absolute -bottom-6 -right-6 hidden sm:block bg-white rounded-2xl shadow-xl border border-gray-100 p-5 max-w-[220px]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-[#d69a45]/10 flex items-center justify-center">
                    <FiMapPin size={14} className="text-[#d69a45]" />
                  </div>
                  <span className="text-[10px] font-bold text-[#d69a45] uppercase tracking-widest">
                    Origin
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
                Roots in the riverside workshops of{" "}
                <span className="text-[#d69a45]">Barishal.</span>
              </h2>

              <div className="text-gray-600 text-sm sm:text-[15px] leading-relaxed space-y-5 font-light">
                <p>
                  Sareng Furniture was born in 2018 in the riverside city of{" "}
                  <strong className="font-semibold text-[#2e3a2c]">
                    Barishal
                  </strong>
                  , where generations of carpenters have shaped some of the
                  finest hardwood in southern Bangladesh. What began as a
                  modest workshop with three craftsmen and a single seasoning
                  yard has grown into a trusted name in premium solid-wood
                  furniture.
                </p>
                <p>
                  The market at the time was flooded with cheap, pressed-board
                  imports that cracked, warped, and fell apart within years. We
                  took the opposite path — building exclusively with{" "}
                  <strong className="font-semibold text-[#2e3a2c]">
                    slow-seasoned solid wood logs
                  </strong>{" "}
                  sourced from the Barishal region&apos;s finest timber
                  suppliers and seasoned under natural airflow for months.
                </p>
                <p>
                  By focusing on wood-drying discipline, legacy hand-jointing
                  techniques, and honest factory-direct pricing, we grew from
                  local door and dining-set commissions into a nationwide
                  operation — furnishing homes, offices, and developments
                  across Bangladesh. Through it all, our heart still beats in
                  Barishal.
                </p>
                <p>
                  Today, we invite clients to visit our yards, inspect raw
                  timber, and oversee the customized drawing phase — because
                  transparency has always been the foundation of our craft.
                </p>
              </div>

              {/* Founder quote */}
              <div className="border-l-2 border-[#d69a45] pl-5 py-2">
                <p className="text-[#2e3a2c] font-medium italic text-sm leading-relaxed">
                  &ldquo;Wood remembers every hand that shaped it. In Barishal,
                  we learned to shape it slowly, honestly, and to last.&rdquo;
                </p>
                <p className="text-[10px] font-bold text-[#d69a45] uppercase tracking-widest mt-3">
                  — Founder, Sareng Furniture
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          3. MISSION, VISION & CORE VALUES
      ═══════════════════════════════════════════════════════════════════ */}
      <section
        ref={valuesRef}
        className="py-20 lg:py-32 bg-white"
        aria-label="Mission and Vision"
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
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
                  Our Core Directives.
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-4">
                {[
                  {
                    label: "The Mission",
                    text: "To construct solid hardwood furniture designed to last generations, utilizing factory-direct logistics to bypass commercial showroom inflation.",
                  },
                  {
                    label: "The Vision",
                    text: "To scale custom furniture carpentry across Bangladesh without compromising traditional seasoned timber jointing and direct artisan employment.",
                  },
                  {
                    label: "Our Values",
                    text: "Honesty in wood selection, pride in jointing craftsmanship, and total accountability in every customer relationship.",
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

            {/* Right Image */}
            <div
              className={`w-full lg:col-span-5 relative transition-all duration-700 ease-out delay-150 ${
                valuesIn
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-8"
              }`}
            >
              <div className="relative rounded-2xl overflow-hidden shadow-xl bg-white p-2">
                <img
                  src="/images/onno-zGKRmwzplVc-unsplash.jpg"
                  alt="Premium finished solid wood side table"
                  className="w-full h-[420px] sm:h-[520px] object-cover rounded-xl"
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
            {liveStats.map((s, i) => {
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
          5. WHAT WE DO
      ═══════════════════════════════════════════════════════════════════ */}
      <section
        ref={whatRef}
        className="py-20 lg:py-32 bg-white"
        aria-label="Capabilities"
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-16 space-y-3">
            <div className="inline-flex items-center gap-2 bg-[#d69a45]/10 border border-[#d69a45]/30 rounded-full px-3.5 py-1">
              <span className="w-1.5 h-1.5 bg-[#d69a45] rounded-full" />
              <span className="text-[10px] font-bold text-[#d69a45] uppercase tracking-[0.2em]">
                Chapter 03 — Expertise
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#2e3a2c] tracking-tight leading-[1.1]">
              Our Work Areas.
            </h2>
            <p className="text-gray-400 text-sm font-light">
              We manufacture solid-timber furniture and custom structural fits
              tailored to spaces.
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
          6. CUSTOM FURNITURE  ← FIXED SECTION
      ═══════════════════════════════════════════════════════════════════ */}
      <section
        ref={customRef}
        className="py-20 lg:py-32 bg-[#faf8f5] relative overflow-hidden"
        aria-label="Custom Carpentry"
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Content */}
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
                  Chapter 04 — Bespoke Orders
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#2e3a2c] tracking-tight leading-[1.1]">
                Crafted to your{" "}
                <span className="text-[#d69a45]">
                  sizing specifications.
                </span>
              </h2>

              <p className="text-gray-500 text-sm leading-relaxed font-light max-w-lg">
                We accommodate fully custom furniture dimensions, wood
                specifications, and lacquer shades. Simply contact our
                workshop with your references or sketches.
              </p>

              <div className="space-y-3 max-w-sm pt-2">
                {[
                  "Custom sizing to fit exact walls",
                  "Premium wood log selection (Teak / Mahogany)",
                  "Tailored color tints and Italian lacquer finish",
                  "Draft sketches and design approval",
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

              <div className="pt-3">
                <button
                  onClick={() => router.push("/contact")}
                  className="inline-flex items-center gap-2 bg-[#3a4739] hover:bg-[#2e3a2c] text-white text-[11px] font-black uppercase tracking-widest px-8 py-4 rounded-sm transition-all shadow-lg group"
                >
                  Request a Custom Order
                  <FiArrowRight
                    size={14}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </div>
            </div>

            {/* Right: Image */}
            <div
              className={`w-full transition-all duration-700 delay-150 ${
                customIn
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-8"
              }`}
            >
              <div className="relative rounded-2xl overflow-hidden shadow-xl bg-white p-2">
                <img
                  src="/images/customfur.avif"
                  alt="Custom woodwork details at factory"
                  className="w-full h-[420px] sm:h-[520px] object-cover rounded-xl"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/images/side1.jpg";
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
        aria-label="Quality Standards"
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-16 space-y-3">
            <div className="inline-flex items-center gap-2 bg-[#d69a45]/10 border border-[#d69a45]/30 rounded-full px-3.5 py-1">
              <span className="w-1.5 h-1.5 bg-[#d69a45] rounded-full" />
              <span className="text-[10px] font-bold text-[#d69a45] uppercase tracking-[0.2em]">
                Chapter 05 — Quality Pillars
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#2e3a2c] tracking-tight leading-[1.1]">
              Our Standards.
            </h2>
            <p className="text-gray-400 text-sm font-light">
              Why we focus purely on solid structural timber joinery rather
              than mass production.
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
          8. OUR SHOWROOMS (DYNAMIC)
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
                Chapter 06 — Outlets
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#2e3a2c] tracking-tight leading-[1.1]">
              Our Showrooms.
            </h2>
            <p className="text-gray-400 text-sm font-light">
              Divisional outlets to experience the catalog quality in person.
            </p>
            <div className="w-12 h-[2px] bg-[#d69a45] mt-5" />
          </div>

          {showroomsLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  className="bg-white border border-gray-100 rounded-2xl p-6 space-y-3 animate-pulse"
                >
                  <div className="h-4 w-32 bg-gray-200 rounded" />
                  <div className="h-3 w-full bg-gray-200 rounded" />
                  <div className="h-3 w-2/3 bg-gray-200 rounded" />
                  <div className="h-3 w-28 bg-gray-200 rounded mt-4" />
                </div>
              ))}
            </div>
          )}

          {!showroomsLoading && showroomsError && (
            <div className="p-5 bg-red-50 border border-red-100 rounded-2xl text-sm text-red-600 max-w-lg">
              {showroomsError}. Please refresh the page.
            </div>
          )}

          {!showroomsLoading && !showroomsError && showrooms.length === 0 && (
            <div className="p-10 bg-white border border-gray-100 rounded-2xl text-center max-w-lg">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#d69a45]/10 flex items-center justify-center">
                <FiMapPin size={20} className="text-[#d69a45]" />
              </div>
              <p className="text-sm font-semibold text-gray-700 mb-1">
                Showroom information coming soon
              </p>
              <p className="text-xs text-gray-400 font-light">
                Please check back shortly or contact us for outlet details.
              </p>
            </div>
          )}

          {!showroomsLoading && !showroomsError && showrooms.length > 0 && (
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-700 ${
                showroomIn
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
            >
              {showrooms.map((s) => (
                <div
                  key={s._id}
                  className="group bg-white border border-gray-100 rounded-2xl p-7 hover:shadow-xl hover:shadow-gray-100 hover:border-[#d69a45]/30 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-[#faf8f5] flex items-center justify-center text-[#d69a45] group-hover:bg-[#d69a45] group-hover:text-white transition-all duration-300">
                      <FiMapPin size={16} />
                    </div>
                    <h3 className="font-extrabold text-base text-[#2e3a2c] group-hover:text-[#d69a45] transition-colors tracking-tight">
                      {s.city} Showroom
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed font-light">
                      {s.address}
                    </p>
                  </div>

                  <a
                    href={`tel:${s.phone.replace(/\s+/g, "")}`}
                    className="inline-flex items-center gap-2 mt-5 text-[11px] font-bold text-[#3a4739] hover:text-[#d69a45] transition-colors uppercase tracking-widest"
                  >
                    <FiPhone size={12} className="text-[#d69a45]" />
                    {s.phone}
                  </a>
                </div>
              ))}
            </div>
          )}
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
                src="/images/side2.jpg"
                alt="Modern living spaces showcase"
                className="w-full h-full object-cover opacity-20"
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
                Our Quality Promise.
              </h2>
              <p className="text-white/70 text-sm leading-relaxed font-light max-w-md mx-auto">
                Every piece that leaves our Barishal workshop is built to look
                beautiful and last a lifetime. Get in touch with our design
                leads to start your layout.
              </p>

              <div className="pt-3">
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
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}