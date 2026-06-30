"use client";

/**
 * ═══════════════════════════════════════════════════════════════════
 *  ABOUT US PAGE — sareng furniture
 *  ─────────────────────────────────────────────────────────────────
 *  ⚠️  PLACEHOLDER CONTENT NOTICE
 *  All company names, numbers, team members, branch addresses, and
 *  descriptive texts below are TEMPORARY PLACEHOLDERS.
 *  Replace with actual client data before production launch.
 *  Search for "// TODO: REPLACE" comments to find every placeholder.
 * ═══════════════════════════════════════════════════════════════════
 */

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
//  DATA  — Replace every TODO comment with actual client information
// ══════════════════════════════════════════════════════════════════════════════

// TODO: REPLACE — Company highlights/statistics
const STATS = [
  { value: 2018,  suffix: "",   label: "Established",         icon: "🏛️" },
  { value: 6,     suffix: "+",  label: "Showrooms",           icon: "🏪" },
  { value: 10000, suffix: "+",  label: "Happy Customers",     icon: "😊" },
  { value: 5000,  suffix: "+",  label: "Completed Projects",  icon: "🛋️" },
  { value: 150,   suffix: "+",  label: "Furniture Designs",   icon: "✏️" },
  { value: 50,    suffix: "+",  label: "Skilled Craftsmen",   icon: "🔨" },
];

// TODO: REPLACE — Why choose us cards
const WHY_CHOOSE = [
  { icon: "🪵", title: "Premium Materials",         desc: "We source only the finest hardwoods and materials, ensuring lasting durability and beauty in every piece." },
  { icon: "🔨", title: "Expert Craftsmanship",      desc: "Our master craftsmen bring decades of experience, combining traditional techniques with modern precision." },
  { icon: "✏️", title: "Custom Furniture",          desc: "Every order is built to your exact specifications — size, color, material, and design are fully customizable." },
  { icon: "💰", title: "Affordable Pricing",        desc: "We offer factory-direct pricing with no middlemen, giving you premium quality at competitive prices." },
  { icon: "🎨", title: "Modern Designs",            desc: "Our design team curates contemporary styles that blend seamlessly with any interior aesthetic." },
  { icon: "🚚", title: "Timely Delivery",           desc: "We respect your time. Our dedicated logistics team ensures on-time delivery to your doorstep." },
  { icon: "🤝", title: "Customer Support",          desc: "Our friendly support team is available 6 days a week to assist with orders, queries, and after-sales care." },
  { icon: "🛡️", title: "Warranty & After-Sales",   desc: "All our furniture comes with a manufacturer's warranty, and we stand behind every product we make." },
];

// TODO: REPLACE — Custom furniture types and customization options
const FURNITURE_TYPES = [
  "Dining Tables", "Office Tables", "Beds", "Wardrobes",
  "Cabinets", "TV Units", "Shelves", "Wooden Doors",
  "Office Furniture", "Home Furniture",
];
const CUSTOM_OPTIONS = ["Size", "Color", "Material", "Finish", "Dimensions", "Design"];

// TODO: REPLACE — Manufacturing process steps
const PROCESS_STEPS = [
  { step: "01", title: "Consultation",       desc: "We start by understanding your exact requirements, space dimensions, and design preferences." },
  { step: "02", title: "Design Approval",    desc: "Our designers create detailed sketches and 3D renderings for your review and approval." },
  { step: "03", title: "Material Selection", desc: "Choose from our curated range of premium woods, laminates, hardware, and finishes." },
  { step: "04", title: "Production",         desc: "Our skilled craftsmen begin building your furniture using precision tools and time-tested techniques." },
  { step: "05", title: "Quality Inspection", desc: "Every piece undergoes rigorous quality checks to ensure it meets our exacting standards." },
  { step: "06", title: "Delivery",           desc: "We carefully pack and deliver your furniture, with optional assembly and installation services." },
];

// TODO: REPLACE — Company values
const VALUES = [
  { icon: "⚖️", title: "Integrity",              desc: "We operate with complete transparency and honesty in every customer interaction." },
  { icon: "💎", title: "Quality",                desc: "Uncompromising standards in materials, craftsmanship, and finish at every stage." },
  { icon: "💡", title: "Innovation",             desc: "Continuously evolving our designs and processes to meet modern needs." },
  { icon: "❤️", title: "Customer Satisfaction", desc: "Your happiness is our measure of success — we go above and beyond to deliver it." },
  { icon: "🌱", title: "Sustainability",         desc: "Responsibly sourced materials and eco-friendly practices guide our production." },
  { icon: "🤝", title: "Trust",                  desc: "Built through consistent quality, fair pricing, and long-term relationships." },
];

// TODO: REPLACE — Showroom locations with actual addresses and phone numbers
const SHOWROOMS = [
  { city: "Dhaka",        address: "House 12, Road 5, Gulshan-1, Dhaka-1212",       phone: "+880 1700-000001" },
  { city: "Chattogram",   address: "45 Agrabad Commercial Area, Chattogram-4100",    phone: "+880 1700-000002" },
  { city: "Rajshahi",     address: "72 Shaheb Bazar Road, Rajshahi-6000",           phone: "+880 1700-000003" },
  { city: "Khulna",       address: "18 KDA Avenue, Khulna-9000",                    phone: "+880 1700-000004" },
  { city: "Sylhet",       address: "33 Zindabazar, Sylhet-3100",                    phone: "+880 1700-000005" },
  { city: "Rangpur",      address: "60 Station Road, Rangpur-5400",                 phone: "+880 1700-000006" },
];

// TODO: REPLACE — Team members with actual names, titles, and photos
const TEAM = [
  { name: "Abdullah Al Mamun", title: "Founder & CEO",          initials: "AM", color: "bg-[#3a4739]", desc: "Visionary leader with 15 years of experience in premium furniture design and manufacturing." },
  { name: "Razia Begum",       title: "Head of Design",         initials: "RB", color: "bg-[#d69a45]", desc: "Award-winning interior consultant specializing in functional and aesthetic space solutions." },
  { name: "Kamal Hossain",     title: "Production Manager",     initials: "KH", color: "bg-[#2e3a2c]", desc: "Master craftsman overseeing quality control and production efficiency across all workshops." },
  { name: "Nasrin Sultana",    title: "Customer Experience",    initials: "NS", color: "bg-[#c0873a]", desc: "Dedicated to ensuring every customer interaction exceeds expectations from order to delivery." },
];

// TODO: REPLACE — FAQ questions and answers
const FAQS = [
  { q: "Do you offer custom furniture?",           a: "Yes! We manufacture furniture to your exact specifications. You can customize size, color, material, finish, dimensions, and design. Contact us for a free consultation." },
  { q: "What materials do you use?",               a: "We use premium hardwoods (teak, mahogany, sheesham), engineered wood, MDF, and high-quality laminates — sourced responsibly from certified suppliers." },
  { q: "How long does delivery take?",             a: "Standard items ship within 7-14 days. Custom furniture takes 3-6 weeks depending on complexity. We'll give you an accurate timeline at the time of order." },
  { q: "Do you provide installation?",             a: "Yes, our team provides professional installation and assembly for all furniture delivered within our service areas." },
  { q: "Is there a warranty on your furniture?",   a: "All furniture comes with a minimum 1-year structural warranty. Custom orders carry a 2-year warranty on craftsmanship and materials." },
  { q: "How can I place an order?",                a: "You can order through our website, visit any showroom, or contact us via phone or WhatsApp. Our team will guide you through the entire process." },
];

// ══════════════════════════════════════════════════════════════════════════════
//  SECTION COMPONENTS
// ══════════════════════════════════════════════════════════════════════════════

// ─── FAQ Accordion ────────────────────────────────────────────────────────────
function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="space-y-3">
      {FAQS.map((faq, i) => (
        <div key={i} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-6 py-4 text-left cursor-pointer group"
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

// ─── Section Heading helper ───────────────────────────────────────────────────
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
  const valuesRef  = useRef<HTMLElement>(null);
  const teamRef    = useRef<HTMLElement>(null);

  const storyIn   = useInView(storyRef);
  const statsIn   = useInView(statsRef);
  const whyIn     = useInView(whyRef);
  const customIn  = useInView(customRef);
  const processIn = useInView(processRef);
  const valuesIn  = useInView(valuesRef);
  const teamIn    = useInView(teamRef);

  return (
    <>
      <Navbar />

      {/* ════════════════════════════════════════════════════════════════
           1. HERO SECTION
          ════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[540px] sm:min-h-[600px] lg:min-h-[680px] flex items-center overflow-hidden">
        {/* Background image */}
        {/* TODO: REPLACE — swap with actual company hero/showroom image */}
        <div className="absolute inset-0 -z-20">
          <img
            src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1600&auto=format&fit=crop"
            alt="Premium furniture showroom interior"
            className="w-full h-full object-cover object-center"
          />
        </div>
        {/* Dark overlay */}
        <div className="absolute inset-0 -z-10 bg-[#1e2a1e]/75" />
        {/* Gold accent line at bottom */}
        <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#d69a45] to-transparent z-10" />

        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-white/60 text-xs mb-8">
            <Link href="/" className="hover:text-[#d69a45] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#d69a45]">About Us</span>
          </nav>

          <div className="max-w-2xl space-y-6">
            {/* Label */}
            <div className="inline-flex items-center gap-2 bg-[#d69a45]/20 border border-[#d69a45]/40 rounded-full px-4 py-1.5">
              <span className="w-1.5 h-1.5 bg-[#d69a45] rounded-full animate-pulse" />
              <span className="text-[11px] font-bold text-[#d69a45] uppercase tracking-widest">Our Story</span>
            </div>

            {/* TODO: REPLACE — Main hero headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold text-white leading-tight tracking-tight">
              Crafting Spaces,<br />
              <span className="text-[#d69a45]">Building Dreams.</span>
            </h1>

            {/* TODO: REPLACE — Hero subtext */}
            <p className="text-white/75 text-sm sm:text-base leading-relaxed max-w-xl">
              Since 2018, sareng furniture has been dedicated to creating premium handcrafted furniture that transforms houses into homes across Bangladesh.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => router.push("/shop")}
                className="inline-flex items-center gap-2 bg-[#d69a45] hover:bg-[#c0873a] text-white text-[11px] font-black uppercase tracking-widest px-7 py-3.5 rounded-sm transition-all shadow-md cursor-pointer group"
              >
                Explore Collection
                <FiArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => router.push("/contact")}
                className="inline-flex items-center gap-2 border border-white/40 hover:border-[#d69a45] text-white text-[11px] font-bold uppercase tracking-widest px-7 py-3.5 rounded-sm transition-all cursor-pointer"
              >
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
           2. COMPANY STORY
          ════════════════════════════════════════════════════════════════ */}
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
                {/* TODO: REPLACE — swap with actual workshop/origin photo */}
                <img
                  src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800&auto=format&fit=crop"
                  alt="Our furniture workshop"
                  className="w-full h-[400px] lg:h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1e2a1e]/50 to-transparent" />
                {/* Floating card */}
                <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm rounded-xl px-5 py-4 shadow-lg">
                  {/* TODO: REPLACE — Actual founding year */}
                  <p className="text-[11px] text-gray-400 uppercase tracking-widest mb-1">Established</p>
                  <p className="text-2xl font-black text-[#2e3a2c]">2018</p>
                  <p className="text-xs text-[#d69a45] font-semibold mt-0.5">Serving Bangladesh</p>
                </div>
              </div>
              {/* Decorative second image */}
              <div className="absolute -bottom-6 -right-6 w-36 h-36 rounded-xl overflow-hidden shadow-xl border-4 border-white hidden lg:block">
                {/* TODO: REPLACE — swap with actual product/detail shot */}
                <img
                  src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=300&auto=format&fit=crop"
                  alt="Furniture detail"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Right — Content */}
            <div className={`space-y-6 transition-all duration-700 ease-out delay-150 ${storyIn ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}>
              <SectionHeading
                center={false}
                label="Our Story"
                title={<>Our Journey of<br /><span className="text-[#d69a45]">Craftsmanship</span></>}
              />

              {/* TODO: REPLACE — Company story paragraphs */}
              <div className="space-y-4 text-gray-500 text-sm leading-relaxed">
                <p>
                  <strong className="text-[#2e3a2c]">sareng furniture</strong> was founded in 2018 as a small local workshop in Bangladesh with a simple but powerful mission: to craft furniture that combines lasting quality with timeless beauty.
                </p>
                <p>
                  What started as a modest workshop with a handful of skilled craftsmen has grown into one of Bangladesh's most trusted furniture brands, serving thousands of homes and offices nationwide.
                </p>
                <p>
                  Our vision is to be the region's leading custom furniture manufacturer — where every customer can walk in with an idea and walk away with a masterpiece built precisely to their specifications.
                </p>
              </div>

              {/* Mission & Vision cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* TODO: REPLACE — Mission & Vision text */}
                {[
                  { label: "Our Mission", text: "To deliver premium, handcrafted furniture that enriches everyday living through exceptional quality and design.", icon: "🎯" },
                  { label: "Our Vision",  text: "To become Bangladesh's most trusted and innovative furniture brand, known for bespoke craftsmanship and customer care.", icon: "🔭" },
                ].map((item) => (
                  <div key={item.label} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-[#d69a45]/30 transition-all">
                    <div className="text-2xl mb-2">{item.icon}</div>
                    <h4 className="font-bold text-sm text-[#2e3a2c] mb-1">{item.label}</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>

              {/* Commitment list */}
              <div className="space-y-2 pt-1">
                {/* TODO: REPLACE — Key commitment points */}
                {[
                  "100% genuine premium materials",
                  "Handcrafted by skilled artisans",
                  "Custom orders to your specification",
                  "Nationwide delivery & installation",
                ].map((point) => (
                  <div key={point} className="flex items-center gap-2.5">
                    <FiCheckCircle size={14} className="text-[#d69a45] shrink-0" />
                    <span className="text-sm text-[#2e3a2c] font-medium">{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
           3. COMPANY HIGHLIGHTS / STATS
          ════════════════════════════════════════════════════════════════ */}
      <section ref={statsRef} className="py-16 bg-[#3a4739] relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-[#d69a45]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-[#d69a45]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-[#d69a45]/20 border border-[#d69a45]/30 rounded-full px-4 py-1.5 mb-4">
              <span className="text-[11px] font-bold text-[#d69a45] uppercase tracking-widest">By The Numbers</span>
            </div>
            {/* TODO: REPLACE — Section heading */}
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Our Growth in Numbers</h2>
            <div className="w-12 h-[3px] bg-[#d69a45] mx-auto mt-4 rounded-full" />
          </div>

          <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 transition-all duration-700 ${statsIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            {/* TODO: REPLACE — Actual statistics */}
            {STATS.map((s, i) => (
              <div
                key={i}
                className="group bg-white/5 border border-white/10 rounded-2xl p-5 text-center hover:bg-[#d69a45]/10 hover:border-[#d69a45]/40 transition-all duration-300"
              >
                <div className="text-3xl mb-2">{s.icon}</div>
                <div className="text-2xl sm:text-3xl font-black text-[#d69a45]">
                  {statsIn ? <AnimatedNumber target={s.value} suffix={s.suffix} /> : "0"}
                </div>
                <div className="text-[11px] text-white/60 uppercase tracking-wider mt-1 font-semibold">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
           4. WHY CHOOSE US
          ════════════════════════════════════════════════════════════════ */}
      <section ref={whyRef} className="py-16 lg:py-24 bg-[#faf8f5]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="Why Choose Us"
            title={<>What Sets Us <span className="text-[#d69a45]">Apart</span></>}
            subtitle="We are committed to excellence in every aspect of our business, from the materials we source to the support we provide after delivery."
          />

          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 transition-all duration-700 ${whyIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            {/* TODO: REPLACE — Why choose us content */}
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

      {/* ════════════════════════════════════════════════════════════════
           5. CUSTOM FURNITURE SERVICE
          ════════════════════════════════════════════════════════════════ */}
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
              {/* TODO: REPLACE — Custom service heading */}
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight">
                Furniture Crafted<br /><span className="text-[#d69a45]">Exactly Your Way</span>
              </h2>
              <p className="text-white/65 text-sm leading-relaxed max-w-lg">
                {/* TODO: REPLACE — Custom service description */}
                We accept custom orders for all types of wooden furniture. Share your requirements and our team will design and build a piece that perfectly matches your vision and space.
              </p>

              {/* Furniture types */}
              <div>
                <p className="text-[11px] font-bold text-white/50 uppercase tracking-widest mb-3">We Build</p>
                <div className="flex flex-wrap gap-2">
                  {/* TODO: REPLACE — Furniture type list */}
                  {FURNITURE_TYPES.map((t) => (
                    <span key={t} className="text-[11px] font-semibold text-white bg-white/10 border border-white/15 rounded-full px-3 py-1 hover:border-[#d69a45]/60 hover:bg-[#d69a45]/10 transition-all cursor-default">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Customization options */}
              <div>
                <p className="text-[11px] font-bold text-white/50 uppercase tracking-widest mb-3">Customize</p>
                <div className="grid grid-cols-3 gap-3">
                  {/* TODO: REPLACE — Customization option list */}
                  {CUSTOM_OPTIONS.map((opt) => (
                    <div key={opt} className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2.5 border border-white/10">
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
                {/* TODO: REPLACE — swap with actual workshop/custom work photo */}
                <img
                  src="/images/customfur.avif"
                  alt="Custom furniture workshop"
                  className="w-full h-[420px] lg:h-[500px] object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1563298723-dcfebaa392e3?q=80&w=800&auto=format&fit=crop";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1e2a1e]/40 to-transparent" />
                {/* Badge */}
                <div className="absolute top-5 left-5 bg-[#d69a45] text-white rounded-lg px-4 py-2.5 shadow-md">
                  <p className="text-xs font-black uppercase tracking-wider">Free</p>
                  <p className="text-[10px] font-semibold opacity-90">Design Consultation</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
           6. MANUFACTURING PROCESS
          ════════════════════════════════════════════════════════════════ */}
      <section ref={processRef} className="py-16 lg:py-24 bg-[#faf8f5]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="How We Work"
            title={<>Our Manufacturing <span className="text-[#d69a45]">Process</span></>}
            subtitle="From your first consultation to final delivery, we follow a meticulous process that guarantees quality at every step."
          />

          {/* Timeline grid */}
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-700 ${processIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            {/* TODO: REPLACE — Process step descriptions */}
            {PROCESS_STEPS.map((step, i) => (
              <div key={i} className="group relative bg-white border border-gray-100 rounded-2xl p-7 shadow-sm hover:shadow-lg hover:border-[#d69a45]/30 hover:-translate-y-1 transition-all duration-300">
                {/* Step number */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 bg-[#3a4739] group-hover:bg-[#d69a45] rounded-xl flex items-center justify-center text-white font-black text-sm transition-colors duration-300">
                    {step.step}
                  </div>
                  {/* Connector line (not on last in row) */}
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

      {/* ════════════════════════════════════════════════════════════════
           7. OUR VALUES
          ════════════════════════════════════════════════════════════════ */}
      <section ref={valuesRef} className="py-16 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="What We Stand For"
            title={<>Our Core <span className="text-[#d69a45]">Values</span></>}
            subtitle="These principles guide every decision we make, every product we build, and every customer relationship we nurture."
          />

          <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 transition-all duration-700 ${valuesIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            {/* TODO: REPLACE — Company values */}
            {VALUES.map((v, i) => (
              <div
                key={i}
                className="group text-center bg-[#faf8f5] border border-gray-100 rounded-2xl p-6 hover:bg-[#3a4739] hover:border-[#3a4739] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="text-3xl mb-3">{v.icon}</div>
                <h3 className="font-extrabold text-xs text-[#2e3a2c] group-hover:text-[#d69a45] transition-colors mb-2 uppercase tracking-wide">{v.title}</h3>
                <p className="text-[10px] text-gray-400 group-hover:text-white/60 leading-relaxed transition-colors">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
           8. SHOWROOMS / OUTLETS
          ════════════════════════════════════════════════════════════════ */}
      <section className="py-16 lg:py-24 bg-[#faf8f5]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="Find Us"
            title={<>Our <span className="text-[#d69a45]">Showrooms</span></>}
            subtitle="Visit any of our showrooms across Bangladesh to experience our furniture firsthand. Our team is ready to assist you."
          />

          {/* Disclaimer */}
          {/* TODO: REPLACE — Remove this note and update with real branch data */}
          <div className="mb-8 p-4 bg-[#d69a45]/10 border border-[#d69a45]/30 rounded-xl text-center">
            <p className="text-xs text-[#d69a45] font-semibold">
              ⚠️ Placeholder branch data — replace with actual showroom addresses before launch.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* TODO: REPLACE — Actual showroom locations and contact info */}
            {SHOWROOMS.map((s, i) => (
              <div
                key={i}
                className="group bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:border-[#d69a45]/30 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#3a4739] group-hover:bg-[#d69a45] rounded-xl flex items-center justify-center shrink-0 transition-colors duration-300">
                    <FiMapPin size={16} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-[#2e3a2c] group-hover:text-[#d69a45] transition-colors">{s.city}</h3>
                    <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">{s.address}</p>
                    <a
                      href={`tel:${s.phone.replace(/\s/g, "")}`}
                      className="inline-flex items-center gap-1.5 mt-3 text-[11px] font-semibold text-[#3a4739] hover:text-[#d69a45] transition-colors"
                    >
                      <FiPhone size={11} />
                      {s.phone}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
           9. MEET OUR TEAM
          ════════════════════════════════════════════════════════════════ */}
      <section ref={teamRef} className="py-16 lg:py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="The People Behind"
            title={<>Meet Our <span className="text-[#d69a45]">Team</span></>}
            subtitle="A passionate group of designers, craftsmen, and customer champions united by a love for beautiful, quality furniture."
          />

          {/* Disclaimer */}
          {/* TODO: REPLACE — Remove this note and update with actual team photos/bios */}
          <div className="mb-8 p-4 bg-[#d69a45]/10 border border-[#d69a45]/30 rounded-xl text-center">
            <p className="text-xs text-[#d69a45] font-semibold">
              ⚠️ Placeholder team data — replace with actual member names, photos, and bios before launch.
            </p>
          </div>

          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-700 ${teamIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            {/* TODO: REPLACE — Actual team members */}
            {TEAM.map((member, i) => (
              <div
                key={i}
                className="group text-center bg-[#faf8f5] border border-gray-100 rounded-2xl p-7 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-[#d69a45]/30 transition-all duration-300"
              >
                {/* Avatar */}
                <div className={`w-20 h-20 ${member.color} rounded-full flex items-center justify-center text-white text-xl font-black mx-auto mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {member.initials}
                </div>
                {/* Stars */}
                <div className="flex justify-center gap-0.5 mb-3">
                  {[1,2,3,4,5].map(s => <FiStar key={s} size={10} className="text-[#d69a45] fill-[#d69a45]" />)}
                </div>
                <h3 className="font-extrabold text-sm text-[#2e3a2c] group-hover:text-[#d69a45] transition-colors">{member.name}</h3>
                <p className="text-[11px] text-[#d69a45] font-semibold uppercase tracking-wider mt-1 mb-3">{member.title}</p>
                <p className="text-[11px] text-gray-400 leading-relaxed">{member.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
           10. CUSTOMER TESTIMONIALS — reuse existing Reviews component
          ════════════════════════════════════════════════════════════════ */}
      <Reviews />

      {/* ════════════════════════════════════════════════════════════════
           11. FAQ SECTION
          ════════════════════════════════════════════════════════════════ */}
      <section className="py-16 lg:py-24 bg-[#faf8f5]">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="Got Questions?"
            title={<>Frequently Asked <span className="text-[#d69a45]">Questions</span></>}
            subtitle="Find answers to the most common questions about our products, services, and processes."
          />
          {/* TODO: REPLACE — FAQ content with actual client FAQs */}
          <FaqAccordion />
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
           12. FINAL CTA
          ════════════════════════════════════════════════════════════════ */}
      <section className="py-0 bg-[#faf8f5] px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-[1400px] mx-auto">
          <div className="relative bg-[#3a4739] rounded-2xl overflow-hidden">
            {/* Background image */}
            {/* TODO: REPLACE — swap with actual showroom/lifestyle photo */}
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1600&auto=format&fit=crop"
                alt="Premium furniture interior"
                className="w-full h-full object-cover opacity-20"
              />
            </div>
            {/* Content */}
            <div className="relative z-10 py-16 px-8 sm:px-12 lg:px-16 text-center">
              <div className="inline-flex items-center gap-2 bg-[#d69a45]/20 border border-[#d69a45]/30 rounded-full px-4 py-1.5 mb-6">
                <span className="text-[11px] font-bold text-[#d69a45] uppercase tracking-widest">Let's Get Started</span>
              </div>
              {/* TODO: REPLACE — CTA headline */}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-5">
                Let's Build Your<br /><span className="text-[#d69a45]">Dream Space Together</span>
              </h2>
              <p className="text-white/65 text-sm sm:text-base leading-relaxed max-w-xl mx-auto mb-8">
                {/* TODO: REPLACE — CTA subtext */}
                Whether you have a clear vision or just a rough idea, our team will work with you to create furniture that perfectly fits your space and lifestyle.
              </p>
              <div className="flex flex-wrap justify-center items-center gap-4">
                <button
                  onClick={() => router.push("/contact")}
                  className="inline-flex items-center gap-2 bg-[#d69a45] hover:bg-[#c0873a] text-white text-[11px] font-black uppercase tracking-widest px-8 py-4 rounded-sm transition-all shadow-md cursor-pointer group"
                >
                  Contact Us
                  <FiArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => router.push("/shop")}
                  className="inline-flex items-center gap-2 border border-white/40 hover:border-[#d69a45] text-white text-[11px] font-bold uppercase tracking-widest px-8 py-4 rounded-sm transition-all cursor-pointer"
                >
                  Browse Collection
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
