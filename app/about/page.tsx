"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Reviews from "@/components/Reviews";
import {
  FiArrowRight,
  FiCheckCircle,
  FiChevronDown,
  FiChevronUp,
  FiMapPin,
  FiPhone,
  FiStar,
  FiMessageSquare,
} from "react-icons/fi";

// ─── Scroll-trigger hook ──────────────────────────────────────────────────────
function useInView(ref: React.RefObject<HTMLElement | null>, threshold = 0.12) {
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

// ─── Animated counter ────────────────────────────────────────────────────────
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
        const step = Math.ceil(target / 60);
        const timer = setInterval(() => {
          start += step;
          if (start >= target) { setCount(target); clearInterval(timer); }
          else setCount(start);
        }, 20);
      }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// ══════════════════════════════════════════════════════════════════════════════
//  DATA  — Tailored for Sareng Furniture (Bespoke Solid Wood Factory)
// ══════════════════════════════════════════════════════════════════════════════

const STATS = [
  { value: 2018,  suffix: "",   label: "Established",         icon: "🏛️" },
  { value: 8,     suffix: "+",  label: "Years of Trust",      icon: "⏳" },
  { value: 3500,  suffix: "+",  label: "Bespoke Pieces Built",icon: "🛋️" },
  { value: 25,    suffix: "+",  label: "Master Artisans",     icon: "🔨" },
  { value: 10,    suffix: " Yrs",label: "Timber Warranty",    icon: "🛡️" },
];

const WHY_CHOOSE = [
  { icon: "🪵", title: "100% Solid Hardwood",       desc: "We exclusively use seasoned Chittagong Teak (সেগুন), Mahogany (মেহগনি), and Silkoroi. No cheap board materials." },
  { icon: "🔨", title: "Heritage Carpentry",        desc: "Our furniture is built by local master artisans using time-tested jointing techniques like mortise and tenon." },
  { icon: "✏️", title: "Bespoke Customization",     desc: "You have complete creative control — from custom wood selection down to precise dimensions and finish shades." },
  { icon: "🎨", title: "Natural & Premium Finishes",desc: "Available in elegant Italian lacquer, natural hand-rubbed wood oils, or matte wood stains." },
  { icon: "💰", title: "Factory Direct Prices",     desc: "Because we manufacture everything in our own local Bagerhat workshop, we provide premium wood quality without retail markups." },
  { icon: "🚚", title: "Careful Nationwide Shipping",desc: "Secure transport and professional assembly service right in your home anywhere in Bangladesh." },
  { icon: "🛡️", title: "10-Year Timber Warranty",   desc: "We stand behind the quality of our seasoned wood with a structural guarantee against warping and pests." },
  { icon: "💬", title: "Personal Consultation",     desc: "Chat directly with our workshop leads to refine your custom ideas, with free design sketches." },
];

const FURNITURE_TYPES = [
  "Teak Dining Tables", "Luxury Beds", "Handcrafted Wardrobes",
  "Classic Cabinets", "Modern TV Units", "Solid Wood Doors",
  "Bespoke Office Tables", "Premium Wall Shelves", "Living Room Sofas",
];

const CUSTOM_OPTIONS = [
  "Timber Source", "Lacquer Tone", "Custom Length/Width", "Joint Types", "Leg Style", "Engravings"
];

const PROCESS_STEPS = [
  { step: "01", title: "Concept & Consult", desc: "Share your requirements or sketches. We detail dimensions and choose wood species." },
  { step: "02", title: "Timber Selection",  desc: "We select the highest grade wood logs from our seasoned inventory at the workshop." },
  { step: "03", title: "Precision Sawing",  desc: "The logs are cut and kiln-seasoned to lock out moisture and prevent future warping." },
  { step: "04", title: "Artisan Joinery",   desc: "Our master carpenters hand-joint the pieces to ensure seamless structural strength." },
  { step: "05", title: "Premium Polish",    desc: "We apply multiple coats of lacquer finish to protect and highlight the natural wood grains." },
  { step: "06", title: "Safe Delivery",     desc: "We deliver and fully install the custom furniture in your home with our dedicated crew." },
];

const FAQS = [
  { q: "Can I choose the specific type of wood for my custom order?", a: "Yes, absolutely! We primarily work with premium seasoned Chittagong Teak (সেগুন), Mahogany (মেহগনি), and Silkoroi. You can visit our workshop to see and choose the raw logs for your order." },
  { q: "Where is your manufacturing workshop located?", a: "Our main factory and workshop are located at Jirantola, Gangni, Mollarhat, Bagerhat, Khulna. We source our wood and manufacture every piece locally." },
  { q: "Do you deliver all over Bangladesh?", a: "Yes, we ship nationwide. Our team handles packing, loading, and offers home delivery with professional installation inside Dhaka, Khulna, and other major divisions." },
  { q: "How long does a custom order take to build?", a: "Depending on design complexity, custom furniture usually takes between 3 to 5 weeks from design approval to delivery." },
  { q: "Is there a warranty on solid wood furniture?", a: "Yes! Sareng Furniture provides a 10-year structural warranty against natural timber warping, splitting, and wood pests, as we use only properly dried wood." },
  { q: "How can I submit my custom requirements?", a: "Click 'Request a Custom Order' or contact us on WhatsApp (+880 1797-312699). Send us your design references, dimensions, and wood preferences for a free quote." },
];

// ══════════════════════════════════════════════════════════════════════════════
//  SECTION COMPONENTS
// ══════════════════════════════════════════════════════════════════════════════

function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="space-y-3.5">
      {FAQS.map((faq, i) => (
        <div key={i} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-6 py-4.5 text-left cursor-pointer group"
          >
            <span className="font-bold text-sm text-[#2e3a2c] group-hover:text-[#d69a45] transition-colors pr-4">{faq.q}</span>
            <span className="shrink-0 text-[#d69a45]">
              {open === i ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
            </span>
          </button>
          {open === i && (
            <div className="px-6 pb-5">
              <div className="h-px bg-gradient-to-r from-[#d69a45]/30 to-transparent mb-4" />
              <p className="text-gray-500 text-sm leading-relaxed">{faq.a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function SectionHeading({ label, title, subtitle, center = true }: {
  label: string; title: React.ReactNode; subtitle?: string; center?: boolean;
}) {
  return (
    <div className={`mb-12 ${center ? "text-center" : ""}`}>
      <div className={`inline-flex items-center gap-2 bg-[#d69a45]/10 border border-[#d69a45]/30 rounded-full px-4 py-1.5 mb-4 ${center ? "mx-auto" : ""}`}>
        <span className="w-1.5 h-1.5 bg-[#d69a45] rounded-full" />
        <span className="text-[11px] font-bold text-[#d69a45] uppercase tracking-widest">{label}</span>
      </div>
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#2e3a2c] leading-tight tracking-tight">{title}</h2>
      {subtitle && <p className={`mt-4 text-gray-500 text-sm sm:text-base leading-relaxed ${center ? "max-w-2xl mx-auto" : "max-w-xl"}`}>{subtitle}</p>}
      <div className={`w-12 h-[3px] bg-[#d69a45] mt-5 rounded-full ${center ? "mx-auto" : ""}`} />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
//  MAIN PAGE COMPONENT
// ══════════════════════════════════════════════════════════════════════════════

export default function AboutPage() {
  const router = useRouter();

  // Refs for scroll animations
  const storyRef   = useRef<HTMLElement>(null);
  const statsRef   = useRef<HTMLElement>(null);
  const whyRef     = useRef<HTMLElement>(null);
  const customRef  = useRef<HTMLElement>(null);
  const processRef = useRef<HTMLElement>(null);

  const storyIn   = useInView(storyRef);
  const statsIn   = useInView(statsRef);
  const whyIn     = useInView(whyRef);
  const customIn  = useInView(customRef);
  const processIn = useInView(processRef);

  return (
    <>
      <Navbar />

      {/* ─── 1. HERO SECTION ────────────────────────────────────────────────── */}
      <section className="relative min-h-[500px] sm:min-h-[580px] lg:min-h-[640px] flex items-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 -z-20">
          <img
            src="/images/side.jpg"
            alt="Handcrafted teak wood furniture detail in a warm room"
            className="w-full h-full object-cover object-center"
          />
        </div>
        {/* Dark overlay */}
        <div className="absolute inset-0 -z-10 bg-[#1e2a1e]/80" />
        {/* Gold accent line at bottom */}
        <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#d69a45] to-transparent z-10" />

        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-white/50 text-xs mb-8">
            <Link href="/" className="hover:text-[#d69a45] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#d69a45]">About Us</span>
          </nav>

          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 bg-[#d69a45]/20 border border-[#d69a45]/40 rounded-full px-4 py-1.5">
              <span className="w-1.5 h-1.5 bg-[#d69a45] rounded-full animate-pulse" />
              <span className="text-[11px] font-bold text-[#d69a45] uppercase tracking-widest">Heritage Woodworks</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-extrabold text-white leading-tight tracking-tight">
              Honest Materials.<br />
              <span className="text-[#d69a45]">Genuine Teak.</span>
            </h1>

            <p className="text-white/75 text-sm sm:text-base leading-relaxed max-w-xl font-light">
              Since 2018, sareng furniture has crafted heirloom-quality solid wood furniture in our Bagerhat workshop, delivered straight to homes across Bangladesh.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => router.push("/shop")}
                className="inline-flex items-center gap-2 bg-[#d69a45] hover:bg-[#c0873a] text-white text-[11px] font-black uppercase tracking-widest px-7 py-3.5 rounded-sm transition-all shadow-md cursor-pointer group"
              >
                Shop Collection
                <FiArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => router.push("/contact")}
                className="inline-flex items-center gap-2 border border-white/40 hover:border-[#d69a45] text-white text-[11px] font-bold uppercase tracking-widest px-7 py-3.5 rounded-sm transition-all cursor-pointer"
              >
                Get in Touch
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 2. THE STORY OF SARENG FURNITURE ───────────────────────────────── */}
      <section
        ref={storyRef}
        className="py-16 lg:py-24 bg-[#faf8f5]"
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Left — Image */}
            <div className={`relative transition-all duration-700 ease-out ${storyIn ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}>
              <div className="absolute -top-4 -left-4 w-40 h-40 bg-[#d69a45]/10 rounded-full blur-2xl pointer-events-none" />
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800&auto=format&fit=crop"
                  alt="Premium timber logs ready for cutting in the workshop"
                  className="w-full h-[380px] lg:h-[480px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1e2a1e]/40 to-transparent" />
                <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm rounded-xl px-5 py-4 shadow-lg">
                  <p className="text-[11px] text-gray-400 uppercase tracking-widest mb-1">Local Craft</p>
                  <p className="text-xl font-black text-[#2e3a2c]">Mollarhat, Bagerhat</p>
                  <p className="text-xs text-[#d69a45] font-semibold mt-0.5">Khulna Division</p>
                </div>
              </div>
            </div>

            {/* Right — Content */}
            <div className={`space-y-6 transition-all duration-700 ease-out delay-150 ${storyIn ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}>
              <SectionHeading
                center={false}
                label="Our Story"
                title={<>Our Roots in<br /><span className="text-[#d69a45]">Authentic Woodworking</span></>}
              />

              <div className="space-y-4 text-gray-500 text-sm leading-relaxed">
                <p>
                  At <strong className="text-[#2e3a2c]">sareng furniture</strong>, we believe that premium furniture should not be mass-produced in assembly lines. It belongs in the hands of master craftsmen who understand the grain, character, and soul of natural timber.
                </p>
                <p>
                  Founded in 2018 in Jirantola, Gangni, Bagerhat, we began as a dedicated local workshop building bespoke doors and dining sets. Through word-of-mouth regarding our commitment to using only fully seasoned solid wood, we expanded to serving homes, offices, and apartments nationwide.
                </p>
                <p>
                  We control our entire supply chain. From direct sourcing of premium timber logs to seasoning, jointing, and lacquered finishing, every step is executed locally in our own workshop.
                </p>
              </div>

              {/* Timber Highlight */}
              <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:border-[#d69a45]/30 transition-all flex gap-4">
                <span className="text-3xl shrink-0">🪵</span>
                <div>
                  <h4 className="font-extrabold text-sm text-[#2e3a2c] mb-1">Sourced Responsibly</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    We specialize in premium Chittagong Teak (সেগুন), prized for its beautiful natural grain and lifelong resistance to decay.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3. STATS HIGHLIGHTS ────────────────────────────────────────────── */}
      <section ref={statsRef} className="py-14 bg-[#3a4739] relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className={`grid grid-cols-2 lg:grid-cols-5 gap-6 text-center transition-all duration-700 ${statsIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            {STATS.map((s, i) => (
              <div
                key={i}
                className="group bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-[#d69a45]/10 hover:border-[#d69a45]/40 transition-all duration-300"
              >
                <div className="text-3xl mb-2">{s.icon}</div>
                <div className="text-2xl sm:text-3xl font-black text-[#d69a45]">
                  {statsIn ? <AnimatedNumber target={s.value} suffix={s.suffix} /> : "0"}
                </div>
                <div className="text-[11px] text-white/70 uppercase tracking-wider mt-1 font-semibold">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 4. WHY CHOOSE US (Craftsmanship Focus) ─────────────────────────── */}
      <section ref={whyRef} className="py-16 lg:py-24 bg-[#faf8f5]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="Workshop Standards"
            title={<>What Defines <span className="text-[#d69a45]">Sareng Quality</span></>}
            subtitle="Unlike standard commercial furniture, we focus purely on structural integrity, timber selection, and factory-direct pricing."
          />

          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 transition-all duration-700 ${whyIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            {WHY_CHOOSE.map((item, i) => (
              <div
                key={i}
                className="group bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-[#d69a45]/30 transition-all duration-300"
              >
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="font-bold text-sm text-[#2e3a2c] mb-2 group-hover:text-[#d69a45] transition-colors">{item.title}</h3>
                <p className="text-[12px] text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 5. CUSTOM FURNITURE SERVICE ────────────────────────────────────── */}
      <section ref={customRef} className="py-16 lg:py-24 bg-[#2e3a2c] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#d69a45]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#d69a45]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Left — content */}
            <div className={`space-y-7 transition-all duration-700 ${customIn ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}>
              <div className="inline-flex items-center gap-2 bg-[#d69a45]/20 border border-[#d69a45]/30 rounded-full px-4 py-1.5">
                <span className="w-1.5 h-1.5 bg-[#d69a45] rounded-full animate-pulse" />
                <span className="text-[11px] font-bold text-[#d69a45] uppercase tracking-widest">Custom Orders</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight">
                Your Dimensions.<br /><span className="text-[#d69a45]">Built to Order.</span>
              </h2>
              <p className="text-white/70 text-sm leading-relaxed max-w-lg">
                Send us your layout, catalog references, or exact room measurements. We build customized tables, cabinets, beds, and decorative wooden paneling matching your specification.
              </p>

              {/* Furniture types */}
              <div>
                <p className="text-[11px] font-bold text-white/50 uppercase tracking-widest mb-3">Popular Custom Projects</p>
                <div className="flex flex-wrap gap-2">
                  {FURNITURE_TYPES.map((t) => (
                    <span key={t} className="text-[11px] font-semibold text-white bg-white/10 border border-white/15 rounded-full px-3 py-1 hover:border-[#d69a45]/60 hover:bg-[#d69a45]/10 transition-all cursor-default">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Customization options */}
              <div>
                <p className="text-[11px] font-bold text-white/50 uppercase tracking-widest mb-3">Bespoke Adjustments</p>
                <div className="grid grid-cols-3 gap-3">
                  {CUSTOM_OPTIONS.map((opt) => (
                    <div key={opt} className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2 border border-white/10">
                      <FiCheckCircle size={12} className="text-[#d69a45] shrink-0" />
                      <span className="text-xs font-semibold text-white/80">{opt}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={() => router.push("/contact")}
                className="inline-flex items-center gap-2 bg-[#d69a45] hover:bg-[#c0873a] text-white text-[11px] font-black uppercase tracking-widest px-7 py-3.5 rounded-sm transition-all shadow-md cursor-pointer group"
              >
                Request a Custom Order
                <FiArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Right — image */}
            <div className={`transition-all duration-700 delay-150 ${customIn ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/images/customfur.avif"
                  alt="Custom furniture workshop"
                  className="w-full h-[400px] lg:h-[480px] object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1563298723-dcfebaa392e3?q=80&w=800&auto=format&fit=crop";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1e2a1e]/40 to-transparent" />
                <div className="absolute top-5 left-5 bg-[#d69a45] text-white rounded-lg px-4 py-2.5 shadow-md">
                  <p className="text-xs font-black uppercase tracking-wider">Free</p>
                  <p className="text-[10px] font-semibold opacity-90">Design Consultation & Sketches</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6. MANUFACTURING PROCESS ───────────────────────────────────────── */}
      <section ref={processRef} className="py-16 lg:py-24 bg-[#faf8f5]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="Our Craft Flow"
            title={<>The Handcrafting <span className="text-[#d69a45]">Process</span></>}
            subtitle="We follow a systematic seasoning, cutting, jointing, and polishing flow to guarantee that the wood stands strong for decades."
          />

          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-700 ${processIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            {PROCESS_STEPS.map((step, i) => (
              <div key={i} className="group relative bg-white border border-gray-100 rounded-2xl p-7 shadow-sm hover:shadow-lg hover:border-[#d69a45]/30 hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 bg-[#3a4739] group-hover:bg-[#d69a45] rounded-xl flex items-center justify-center text-white font-black text-sm transition-colors duration-300">
                    {step.step}
                  </div>
                  {i < PROCESS_STEPS.length - 1 && (
                    <div className="hidden lg:block flex-1 h-px bg-gradient-to-r from-[#d69a45]/40 to-transparent" />
                  )}
                </div>
                <h3 className="font-extrabold text-base text-[#2e3a2c] mb-2 group-hover:text-[#d69a45] transition-colors">{step.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 7. MAIN WORKSHOP & SHOWROOM (Replacing Showrooms/Outlets) ──────── */}
      <section className="py-16 lg:py-24 bg-white border-t border-gray-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Left Content */}
            <div className="space-y-6">
              <SectionHeading
                center={false}
                label="Visit Us"
                title={<>Our Workshop & <span className="text-[#d69a45]">Showroom</span></>}
                subtitle="We keep our operations fully transparent. Customers are welcome to visit our local workshop in Bagerhat to see the wood seasoning yards, discuss specifications, and view ongoing joinery projects."
              />

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-5 bg-[#faf8f5] rounded-2xl border border-gray-50">
                  <div className="w-10 h-10 bg-[#3a4739] rounded-xl flex items-center justify-center shrink-0">
                    <FiMapPin size={18} className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-[#2e3a2c]">Factory Address</h4>
                    <p className="text-[12px] text-gray-400 mt-1 leading-relaxed">
                      Jirantola, Gangni, Mollarhat, Bagerhat, Khulna Division, Bangladesh (9384)
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-5 bg-[#faf8f5] rounded-2xl border border-gray-50">
                  <div className="w-10 h-10 bg-[#3a4739] rounded-xl flex items-center justify-center shrink-0">
                    <FiPhone size={18} className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-[#2e3a2c]">Direct Contact</h4>
                    <p className="text-[12px] text-gray-400 mt-0.5">+880 1797 312699</p>
                    <p className="text-[10px] text-gray-400">Saturday - Thursday, 9:00 AM - 10:00 PM</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <a
                  href="https://maps.google.com/?q=Jirantola+Gangni+Mollarhat+Bagerhat+Khulna+9384"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#3a4739] hover:bg-[#2e3a2c] text-white text-[11px] font-black uppercase tracking-widest px-6 py-3.5 rounded-sm transition-all shadow-md cursor-pointer"
                >
                  <FiMapPin size={14} />
                  View on Google Maps
                </a>
                <a
                  href="https://wa.me/8801797312699"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-[#d69a45] text-[#d69a45] hover:bg-[#d69a45] hover:text-white text-[11px] font-bold uppercase tracking-widest px-6 py-3.5 rounded-sm transition-all cursor-pointer"
                >
                  <FiMessageSquare size={14} />
                  Chat on WhatsApp
                </a>
              </div>
            </div>

            {/* Right Map Image/View */}
            <div className="relative rounded-2xl overflow-hidden shadow-lg h-[320px] sm:h-[400px]">
              <img
                src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=800&auto=format&fit=crop"
                alt="Showroom display space with solid wood table"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1e2a1e]/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-5 right-5 bg-white/95 backdrop-blur-sm rounded-lg px-4 py-2 text-xs font-semibold text-[#2e3a2c] shadow-md">
                📍 Mollarhat, Bagerhat
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── 8. THE HAND OF THE ARTISAN (Replacing Corporate Team) ─────────── */}
      <section className="py-16 lg:py-20 bg-[#faf8f5] overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#3a4739] rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden text-center text-white">
            <div className="absolute -top-12 -left-12 w-64 h-64 bg-[#d69a45]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-[#d69a45]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <span className="text-[11px] font-black text-[#d69a45] uppercase tracking-widest">Artisanal Heritage</span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold">The Legacy of Local Carpentry</h2>
              <p className="text-white/70 text-sm leading-relaxed font-light">
                Our workshop supports and employs skilled carpenters and joiners from Bagerhat and the surrounding Khulna districts. These artisans have inherited traditional timber joinery techniques from generations past, blending legacy knowledge with modern kiln-seasoning processes.
              </p>
              <div className="w-12 h-[2px] bg-[#d69a45] mx-auto rounded-full mt-2" />
              <p className="text-[10px] text-white/50 font-bold uppercase tracking-wider">
                Sareng Furniture • Handcrafted Woodworks
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 9. TESTIMONIALS (Reviews Component) ────────────────────────────── */}
      <Reviews />

      {/* ─── 10. FAQ SECTION ────────────────────────────────────────────────── */}
      <section className="py-16 lg:py-24 bg-[#faf8f5] border-t border-gray-100">
        <div className="max-w-[840px] mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="Got Questions?"
            title={<>Frequently Asked <span className="text-[#d69a45]">Questions</span></>}
            subtitle="Find answers to common questions about solid wood selection, shipping, custom dimensions, and warranties."
          />
          <FaqAccordion />
        </div>
      </section>

      {/* ─── 11. FINAL CTA ──────────────────────────────────────────────────── */}
      <section className="py-0 bg-[#faf8f5] px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-[1400px] mx-auto">
          <div className="relative bg-[#3a4739] rounded-2xl overflow-hidden shadow-xl">
            {/* Background image */}
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1600&auto=format&fit=crop"
                alt="Premium furniture interior"
                className="w-full h-full object-cover opacity-15"
              />
            </div>
            {/* Content */}
            <div className="relative z-10 py-16 px-8 sm:px-12 lg:px-16 text-center">
              <div className="inline-flex items-center gap-2 bg-[#d69a45]/20 border border-[#d69a45]/30 rounded-full px-4 py-1.5 mb-6">
                <span className="text-[11px] font-bold text-[#d69a45] uppercase tracking-widest">Let's Get Started</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-5">
                Let's Build Your<br /><span className="text-[#d69a45]">Dream Space Together</span>
              </h2>
              <p className="text-white/65 text-sm sm:text-base leading-relaxed max-w-xl mx-auto mb-8 font-light">
                Whether you have a complete sketch design or just need custom adjustments, our workshop team will bring your ideas to life with solid seasoned wood.
              </p>
              <div className="flex flex-wrap justify-center items-center gap-4">
                <button
                  onClick={() => router.push("/contact")}
                  className="inline-flex items-center gap-2 bg-[#d69a45] hover:bg-[#c0873a] text-white text-[11px] font-black uppercase tracking-widest px-8 py-4 rounded-sm transition-all shadow-md cursor-pointer group"
                >
                  Contact Our Lead Designer
                  <FiArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => router.push("/shop")}
                  className="inline-flex items-center gap-2 border border-white/40 hover:border-[#d69a45] text-white text-[11px] font-bold uppercase tracking-widest px-8 py-4 rounded-sm transition-all cursor-pointer"
                >
                  Browse Catalog
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
