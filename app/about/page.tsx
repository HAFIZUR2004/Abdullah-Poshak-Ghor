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
  FiCompass,
  FiHome,
  FiLayers,
  FiBriefcase,
  FiBox,
} from "react-icons/fi";

// ─── Scroll-trigger hook ──────────────────────────────────────────────────────
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
//  DATA DEFINITIONS — Realistic Placeholders (Easily Replaceable)
// ══════════════════════════════════════════════════════════════════════════════

// Highlights / Stats
const HIGHLIGHTS = [
  { value: 2018,  suffix: "",   label: "Established",         icon: "🏛️" },
  { value: 6,     suffix: "",   label: "Showrooms",           icon: "🏪" },
  { value: 10000, suffix: "+",  label: "Happy Customers",     icon: "😊" },
  { value: 150,   suffix: "+",  label: "Furniture Designs",   icon: "📐" },
  { value: 50,    suffix: "+",  label: "Skilled Craftsmen",   icon: "🔨" },
];

// What We Do Cards
const WHAT_WE_DO = [
  { icon: FiHome,       title: "Home Furniture",    desc: "Luxury dining tables, beds, cabinets, and wardrobes designed for everyday warmth and style." },
  { icon: FiBriefcase,  title: "Office Furniture",  desc: "Ergonomic tables, display shelves, and custom desks built to optimize modern workflows." },
  { icon: FiCompass,    title: "Interior Furniture",desc: "Aesthetic space-defining accent pieces, TV units, and decorative wooden paneling." },
  { icon: FiLayers,     title: "Custom Furniture",  desc: "Direct-to-workshop bespoke builds constructed according to your specific space blueprints." },
  { icon: FiBox,        title: "Wooden Doors",      desc: "Premium seasoned teak and hardwood doors crafted with elegant carvings or modern flush designs." },
];

// Why Choose Us Cards
const WHY_CHOOSE = [
  { icon: "🪵", title: "Premium Materials",       desc: "We exclusively use high-grade seasoned Chittagong Teak (সেগুন), Mahogany, and Silkoroi timber." },
  { icon: "🔨", title: "Expert Craftsmanship",    desc: "Every joint, curve, and lacquer finish is hand-perfected by legacy local artisans." },
  { icon: "🎨", title: "Modern Designs",          desc: "Our collection balances contemporary minimalism with the timeless elegance of natural wood grains." },
  { icon: "💰", title: "Affordable Pricing",      desc: "By manufacturing locally and bypassing retailers, we provide direct workshop rates." },
  { icon: "🚚", title: "Timely Delivery",         desc: "Our logistics team ensures secure packaging, prompt dispatch, and direct home installation." },
  { icon: "🤝", title: "Customer Satisfaction",   desc: "We stand behind our carpentry with dedicated customer care and structural wood warranties." },
];

// Outlets / Showrooms Placeholders
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

  // Scroll triggers
  const storyRef   = useRef<HTMLElement>(null);
  const statsRef   = useRef<HTMLElement>(null);
  const whatRef    = useRef<HTMLElement>(null);
  const customRef  = useRef<HTMLElement>(null);
  const whyRef     = useRef<HTMLElement>(null);
  const showroomRef= useRef<HTMLElement>(null);

  const storyIn   = useInView(storyRef);
  const statsIn   = useInView(statsRef);
  const whatIn    = useInView(whatRef);
  const customIn  = useInView(customRef);
  const whyIn     = useInView(whyRef);
  const showroomIn = useInView(showroomRef);

  return (
    <>
      <Navbar />

      {/* ─── 1. HERO SECTION ────────────────────────────────────────────────── */}
      <section className="relative min-h-[380px] sm:min-h-[440px] flex items-center overflow-hidden">
        {/* Background room image */}
        <div className="absolute inset-0 -z-20">
          <img
            src="/images/side.jpg"
            alt="Luxury room interior design"
            className="w-full h-full object-cover object-center"
          />
        </div>
        {/* Warm overlay */}
        <div className="absolute inset-0 -z-10 bg-[#1e2a1e]/85" />
        <div className="absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#d69a45] to-transparent z-10" />

        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
          {/* Breadcrumb navigation */}
          <nav className="flex items-center gap-2 text-white/50 text-xs mb-6">
            <Link href="/" className="hover:text-[#d69a45] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#d69a45]">About Us</span>
          </nav>

          <div className="max-w-xl space-y-4">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              About Us
            </h1>
            <p className="text-white/70 text-sm sm:text-base leading-relaxed font-light">
              Crafting premium solid wood furniture since 2018. Discover our story of local heritage, design commitment, and quality craftsmanship.
            </p>
          </div>
        </div>
      </section>

      {/* ─── 2. OUR STORY ───────────────────────────────────────────────────── */}
      <section
        ref={storyRef}
        className="py-16 lg:py-24 bg-[#faf8f5]"
        aria-label="Our Story"
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Left: Image */}
            <div className={`relative transition-all duration-700 ease-out ${storyIn ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}>
              <div className="absolute -top-4 -left-4 w-40 h-40 bg-[#d69a45]/10 rounded-full blur-2xl pointer-events-none" />
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-gray-100 bg-white p-3">
                <img
                  src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800&auto=format&fit=crop"
                  alt="Crafting furniture logs in raw workshop setting"
                  className="w-full h-[360px] sm:h-[420px] object-cover rounded-xl"
                />
              </div>
            </div>

            {/* Right: Content */}
            <div className={`space-y-6 transition-all duration-700 ease-out delay-150 ${storyIn ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}>
              <div className="inline-flex items-center gap-2 bg-[#d69a45]/10 border border-[#d69a45]/30 rounded-full px-3.5 py-1">
                <span className="w-1.5 h-1.5 bg-[#d69a45] rounded-full" />
                <span className="text-[10px] font-bold text-[#d69a45] uppercase tracking-wider">The Journey</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2e3a2c] leading-tight">
                Our Story of Wooden Heritage
              </h2>
              
              <div className="text-gray-500 text-sm leading-relaxed space-y-4">
                <p>
                  Sareng Furniture started as a humble local woodworking shop in Bagerhat, Bangladesh. Guided by a core principle of using only genuine, seasoned hardwood timber, we quickly earned the trust of homeowners seeking heirloom-quality dining tables, beds, and solid doors.
                </p>
                <p>
                  Over the years, we grew our workshop and brought together some of the region's finest carpenters. Today, we handle orders from customers nationwide, focusing on custom dimension work and direct-to-home logistics.
                </p>
              </div>

              {/* Vision & Mission Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-gray-200/60">
                <div>
                  <h4 className="font-extrabold text-xs text-[#2e3a2c] uppercase tracking-wider mb-1">Our Mission</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">To deliver seasoned solid wood furniture crafted with care, straight from the workshop floor to your space.</p>
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-[#2e3a2c] uppercase tracking-wider mb-1">Our Vision</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">To preserve traditional carpentry skills in Bangladesh while adapting designs to match modern homes.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── 3. COMPANY HIGHLIGHTS ──────────────────────────────────────────── */}
      <section
        ref={statsRef}
        className="py-14 bg-[#3a4739] relative overflow-hidden"
        aria-label="Highlights"
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className={`grid grid-cols-2 lg:grid-cols-5 gap-6 text-center transition-all duration-700 ${statsIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            {HIGHLIGHTS.map((h, i) => (
              <div
                key={i}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-[#d69a45]/10 hover:border-[#d69a45]/30 transition-all duration-300"
              >
                <div className="text-2xl mb-1">{h.icon}</div>
                <div className="text-2xl sm:text-3xl font-black text-[#d69a45]">
                  {statsIn ? <AnimatedNumber target={h.value} suffix={h.suffix} /> : "0"}
                </div>
                <p className="text-[10px] text-white/70 uppercase tracking-widest mt-1 font-semibold">{h.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 4. WHAT WE DO ──────────────────────────────────────────────────── */}
      <section
        ref={whatRef}
        className="py-16 lg:py-24 bg-white"
        aria-label="What We Do"
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-xl mx-auto mb-12 space-y-3">
            <div className="inline-flex items-center gap-2 bg-[#d69a45]/10 border border-[#d69a45]/30 rounded-full px-3.5 py-1">
              <span className="w-1.5 h-1.5 bg-[#d69a45] rounded-full" />
              <span className="text-[10px] font-bold text-[#d69a45] uppercase tracking-wider">Our Offerings</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2e3a2c]">What We Offer</h2>
            <p className="text-gray-400 text-xs sm:text-sm">We construct elegant interior woodwork that blends comfort, design, and structural integrity.</p>
            <div className="w-10 h-[2px] bg-[#d69a45] mx-auto mt-4" />
          </div>

          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 transition-all duration-700 ${whatIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            {WHAT_WE_DO.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="group bg-[#faf8f5] border border-gray-100 rounded-2xl p-6 hover:bg-white hover:border-[#d69a45]/35 hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center"
                >
                  <div className="w-10 h-10 bg-[#3a4739] text-[#d69a45] group-hover:bg-[#d69a45] group-hover:text-white rounded-xl flex items-center justify-center shrink-0 mb-4 transition-colors duration-300">
                    <Icon size={20} />
                  </div>
                  <h3 className="font-extrabold text-sm text-[#2e3a2c] mb-2">{item.title}</h3>
                  <p className="text-[11px] text-gray-400 leading-relaxed flex-1">{item.desc}</p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ─── 5. CUSTOM FURNITURE SECTION ────────────────────────────────────── */}
      <section
        ref={customRef}
        className="py-16 lg:py-24 bg-[#2e3a2c] relative overflow-hidden"
        aria-label="Custom Order Showcase"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#d69a45]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#d69a45]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Left: Content */}
            <div className={`space-y-6 transition-all duration-700 ${customIn ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}>
              <div className="inline-flex items-center gap-2 bg-[#d69a45]/20 border border-[#d69a45]/30 rounded-full px-3.5 py-1">
                <span className="w-1.5 h-1.5 bg-[#d69a45] rounded-full animate-pulse" />
                <span className="text-[10px] font-bold text-[#d69a45] uppercase tracking-wider">Tailor-Made</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                Bespoke Design, Manufactured to Order
              </h2>
              <p className="text-white/70 text-sm leading-relaxed max-w-lg">
                We manufacture custom wood furniture matching your preferred aesthetic and physical sizing. Send us your requirements to start building.
              </p>

              {/* Feature Checklist */}
              <div className="grid grid-cols-2 gap-3 max-w-md pt-2">
                {["Custom Size", "Custom Material", "Custom Color", "Custom Finish", "Custom Design"].map((opt) => (
                  <div key={opt} className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2 border border-white/10">
                    <FiCheckCircle size={13} className="text-[#d69a45] shrink-0" />
                    <span className="text-xs text-white/80 font-medium">{opt}</span>
                  </div>
                ))}
              </div>

              {/* Request CTA */}
              <button
                onClick={() => router.push("/contact")}
                className="inline-flex items-center gap-2 bg-[#d69a45] hover:bg-[#c0873a] text-white text-[11px] font-black uppercase tracking-widest px-7 py-3.5 rounded-sm transition-all shadow-md cursor-pointer group"
              >
                Request a Custom Order
                <FiArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Right: Image */}
            <div className={`transition-all duration-700 delay-150 ${customIn ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/images/customfur.avif"
                  alt="Carpentry craftsman table with blueprints"
                  className="w-full h-[360px] sm:h-[440px] object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1563298723-dcfebaa392e3?q=80&w=800&auto=format&fit=crop";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1e2a1e]/40 to-transparent" />
                <div className="absolute top-4 left-4 bg-[#d69a45] text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded shadow-md">
                  Direct Factory Build
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── 6. WHY CHOOSE US ────────────────────────────────────────────────── */}
      <section
        ref={whyRef}
        className="py-16 lg:py-24 bg-[#faf8f5]"
        aria-label="Why Choose Us"
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-xl mx-auto mb-12 space-y-3">
            <div className="inline-flex items-center gap-2 bg-[#d69a45]/10 border border-[#d69a45]/30 rounded-full px-3.5 py-1">
              <span className="w-1.5 h-1.5 bg-[#d69a45] rounded-full" />
              <span className="text-[10px] font-bold text-[#d69a45] uppercase tracking-wider">Quality Assurance</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2e3a2c]">Why Choose Us</h2>
            <p className="text-gray-400 text-xs sm:text-sm">We maintain solid joinery standards to deliver long-lasting value to your interior.</p>
            <div className="w-10 h-[2px] bg-[#d69a45] mx-auto mt-4" />
          </div>

          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 transition-all duration-700 ${whyIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            {WHY_CHOOSE.map((item, i) => (
              <div
                key={i}
                className="group bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-[#d69a45]/30 transition-all duration-300"
              >
                <div className="text-3xl mb-3.5">{item.icon}</div>
                <h3 className="font-bold text-sm text-[#2e3a2c] mb-1.5 group-hover:text-[#d69a45] transition-colors">{item.title}</h3>
                <p className="text-[12px] text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ─── 7. OUR SHOWROOMS ───────────────────────────────────────────────── */}
      <section
        ref={showroomRef}
        className="py-16 lg:py-24 bg-white"
        aria-label="Showrooms"
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-xl mx-auto mb-10 space-y-3">
            <div className="inline-flex items-center gap-2 bg-[#d69a45]/10 border border-[#d69a45]/30 rounded-full px-3.5 py-1">
              <span className="w-1.5 h-1.5 bg-[#d69a45] rounded-full" />
              <span className="text-[10px] font-bold text-[#d69a45] uppercase tracking-wider">Outlets</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2e3a2c]">Our Showrooms</h2>
            <p className="text-gray-400 text-xs sm:text-sm">Visit our showrooms across major divisions to experience our catalog items in person.</p>
            <div className="w-10 h-[2px] bg-[#d69a45] mx-auto mt-4" />
          </div>

          {/* Placeholder Disclaimer */}
          <div className="mb-8 p-3.5 bg-[#d69a45]/10 border border-[#d69a45]/35 rounded-xl text-center max-w-md mx-auto">
            <p className="text-[11px] text-[#d69a45] font-semibold">
              ⚠️ Showroom addresses are temporary placeholders until final details are confirmed.
            </p>
          </div>

          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 transition-all duration-700 ${showroomIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            {OUTLETS.map((s, i) => (
              <div
                key={i}
                className="group bg-[#faf8f5] border border-gray-100 rounded-2xl p-6 hover:bg-white hover:border-[#d69a45]/30 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-[#3a4739] group-hover:bg-[#d69a45] rounded-xl flex items-center justify-center shrink-0 transition-colors duration-300">
                    <FiMapPin size={15} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-[#2e3a2c] group-hover:text-[#d69a45] transition-colors">{s.city} Outlet</h3>
                    <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">{s.address}</p>
                    <a
                      href={`tel:${s.phone}`}
                      className="inline-flex items-center gap-1.5 mt-2.5 text-[10px] font-semibold text-[#3a4739] hover:text-[#d69a45] transition-colors"
                    >
                      <FiPhone size={10} />
                      {s.phone}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ─── 8. CLOSING SECTION ─────────────────────────────────────────────── */}
      <section
        className="py-0 bg-[#faf8f5] px-4 sm:px-6 lg:px-8 pb-16"
        aria-label="Contact Section"
      >
        <div className="max-w-[1400px] mx-auto">
          <div className="relative bg-[#3a4739] rounded-3xl overflow-hidden shadow-xl">
            {/* Overlay room display */}
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1200&auto=format&fit=crop"
                alt="Living room couch setup"
                className="w-full h-full object-cover opacity-15"
              />
            </div>
            
            {/* Content panel */}
            <div className="relative z-10 py-14 sm:py-16 px-6 sm:px-12 text-center max-w-xl mx-auto space-y-5">
              <div className="inline-flex items-center gap-2 bg-[#d69a45]/20 border border-[#d69a45]/30 rounded-full px-3.5 py-1">
                <span className="text-[10px] font-bold text-[#d69a45] uppercase tracking-wider">Quality Guarantee</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                Our Commitment to Quality
              </h2>
              <p className="text-white/70 text-xs sm:text-sm leading-relaxed font-light">
                We are dedicated to producing durable, hand-jointed solid wood furniture that complements your lifestyle. Visit our workshops or contact us today.
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
