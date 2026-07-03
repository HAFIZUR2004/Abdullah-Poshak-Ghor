"use client";

import React, { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FiArrowRight,
  FiUpload,
  FiMessageSquare,
  FiTruck,
  FiCheckCircle,
  FiStar,
  FiClock,
  FiShield,
} from "react-icons/fi";

// ─── Custom Icons Type Definition ─────────────────────────────────────────────
interface CustomIconProps {
  className?: string;
  style?: React.CSSProperties;
}

// ─── Custom Icons ─────────────────────────────────────────────────────────────

function IconSketch({ className, style }: CustomIconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 19l7-7 3 3-7 7-3-3z" />
      <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
      <path d="M2 2l7.586 7.586" />
      <circle cx="11" cy="11" r="2" />
    </svg>
  );
}

function IconDiscussion({ className, style }: CustomIconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      <path d="M8 10h.01" />
      <path d="M12 10h.01" />
      <path d="M16 10h.01" />
    </svg>
  );
}

function IconCreation({ className, style }: CustomIconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  );
}

// ─── useInView Hook ────────────────────────────────────────────────────────────

function useInView(ref: React.RefObject<HTMLElement | null>) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.15 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);
  return inView;
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface StepItem {
  id: number;
  icon: React.ComponentType<CustomIconProps>;
  title: string;
  heading: string;
  subText: string;
  description: string;
  features: string[];
  gradient: string;
  iconColor: string;
  delay: number;
}

export default function BringYourDesignSection() {
  const router = useRouter();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef);

  const steps: StepItem[] = [
    {
      id: 1,
      icon: IconSketch,
      title: "The Concept",
      heading: "Share Your Design or Idea",
      subText: "Share any sketch, image from the internet, or 3D model you have in mind.",
      description: "Share your dream furniture concept with us. It can be a hand-drawn sketch, a file created from design software, or just a description of your needs.",
      features: [
        "Your own design concept",
        "Reference images or models",
        "Your preferred style",
      ],
      gradient: "from-[#d69a45]/20 to-[#d69a45]/5",
      iconColor: "#d69a45",
      delay: 0,
    },
    {
      id: 2,
      icon: IconDiscussion,
      title: "The Discussion",
      heading: "Consult with Our Experts",
      subText: "Our team will discuss materials (wood, metal, fabric) and perfect sizing to finalize your design.",
      description: "Sit down with our experienced designers and craftsmen to discuss every aspect of your design. We provide the best solutions keeping your budget, time, and space in mind.",
      features: [
        "Material selection",
        "Size and space measurement",
        "Design finalization",
      ],
      gradient: "from-[#3a4739]/20 to-[#3a4739]/5",
      iconColor: "#3a4739",
      delay: 150,
    },
    {
      id: 3,
      icon: IconCreation,
      title: "The Creation",
      heading: "Transformation & Delivery",
      subText: "Our skilled craftsmen will build your design with 100% perfection and deliver it to your home.",
      description: "Our expert craftsmen will create your finalized design using premium wood and high-quality finishing. Then it will be safely delivered to your home.",
      features: [
        "Premium wood & materials",
        "Perfect finishing",
        "Safe delivery",
      ],
      gradient: "from-[#8B6914]/20 to-[#8B6914]/5",
      iconColor: "#8B6914",
      delay: 300,
    },
  ];

  // Furniture types
  const furnitureTypes = [
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

  // Highlights
  const highlights = [
    { icon: FiStar, text: "Built to Your Exact Requirements" },
    { icon: FiShield, text: "Premium Wood & Quality Materials" },
    { icon: FiClock, text: "Handmade by Skilled Craftsmen" },
    { icon: FiTruck, text: "Delivery Across Bangladesh" },
    { icon: FiMessageSquare, text: "Free Design Consultation" },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative py-16 lg:py-24 bg-white overflow-hidden"
      aria-label="Bring Your Own Design Service"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#d69a45]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#3a4739]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-14 lg:mb-20">
          <div className="inline-flex items-center gap-3 bg-[#d69a45]/10 border border-[#d69a45]/30 rounded-full px-5 py-1.5 mb-4">
            <span className="w-1.5 h-1.5 bg-[#d69a45] rounded-full animate-pulse" />
            <span className="text-[10px] font-bold text-[#d69a45] uppercase tracking-widest">Bring Your Own Design</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-[2.8rem] font-extrabold text-[#1a1a1a] leading-tight tracking-tight">
            Your Vision,{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-[#d69a45] to-[#c0873a] bg-clip-text text-transparent">
                Our Craftsmanship
              </span>
              <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-gradient-to-r from-[#d69a45] to-[#c0873a]/50 rounded-full" />
            </span>
          </h2>
          <p className="text-gray-500 text-sm sm:text-[15px] leading-relaxed max-w-2xl mx-auto mt-3">
            We guide you through 3 simple steps to create your dream furniture. From your design to our craftsmanship expertise.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((step) => {
            const StepIcon = step.icon;
            return (
              <div
                key={step.id}
                className={`group relative bg-[#f8f8f8] border border-gray-200 rounded-2xl p-6 lg:p-8 transition-all duration-700 ease-out hover:border-[#d69a45]/40 hover:bg-white hover:shadow-xl hover:shadow-[#d69a45]/10 ${
                  inView 
                    ? "opacity-100 translate-y-0" 
                    : "opacity-0 translate-y-12"
                }`}
                style={{ transitionDelay: `${step.delay}ms` }}
              >
                {/* Step Number Badge */}
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-[#d69a45] to-[#c0873a] rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
                  {step.id}
                </div>

                {/* Icon */}
                <div className="relative w-16 h-16 mb-5">
                  <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} rounded-full blur-xl transition-all duration-500 group-hover:scale-110`} />
                  <div className="relative w-16 h-16 bg-white border border-gray-200 rounded-full flex items-center justify-center group-hover:border-[#d69a45]/30 transition-all duration-300 shadow-sm">
                    <StepIcon className="w-8 h-8" style={{ color: step.iconColor }} />
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] font-bold text-[#d69a45] uppercase tracking-widest">
                      Step {step.id} — {step.title}
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-[#1a1a1a] mt-1 leading-tight">
                      {step.heading}
                    </h3>
                  </div>

                  <p className="text-sm text-[#d69a45]/90 font-medium leading-relaxed">
                    {step.subText}
                  </p>

                  <p className="text-sm text-gray-500 leading-relaxed">
                    {step.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-2 pt-2">
                    {step.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2.5">
                        <FiCheckCircle size={12} className="text-[#d69a45] shrink-0" />
                        <span className="text-xs text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hover border glow */}
                <div className="absolute inset-0 border border-[#d69a45]/0 rounded-2xl transition-all duration-500 group-hover:border-[#d69a45]/20" />
              </div>
            );
          })}
        </div>

        {/* Furniture Types Pills */}
        <div className="mt-12 flex flex-wrap justify-center gap-2">
          {furnitureTypes.map((type) => (
            <span
              key={type}
              className="text-[11px] font-semibold text-[#3a4739] bg-gray-50 border border-gray-200 rounded-full px-4 py-1.5 shadow-sm hover:bg-[#d69a45]/10 hover:border-[#d69a45]/40 hover:text-[#d69a45] transition-all duration-300 cursor-default"
            >
              {type}
            </span>
          ))}
        </div>

        {/* Additional Highlights */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {highlights.map(({ icon: HighlightIcon, text }) => (
            <div
              key={text}
              className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 hover:bg-white hover:border-[#d69a45]/30 hover:shadow-md transition-all duration-300"
            >
              <HighlightIcon size={14} className="text-[#d69a45] shrink-0" />
              <span className="text-xs text-gray-700 font-medium">{text}</span>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-14 lg:mt-16 text-center">
          <div className="inline-block relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#d69a45] to-[#c0873a] rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-1000" />
            <button
              onClick={() => router.push("/contact")}
              className="relative inline-flex items-center gap-3 bg-gradient-to-r from-[#d69a45] to-[#c0873a] text-white text-[12px] font-black uppercase tracking-widest px-8 py-4 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#d69a45]/25 cursor-pointer group"
            >
              <FiUpload size={16} className="group-hover:translate-y-[-2px] transition-transform duration-300" />
              Upload Your Design
              <FiArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Or contact us to book a free consultation
          </p>
        </div>
      </div>

      {/* Bottom gold accent line */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-[#d69a45]/40 to-transparent mt-12" />
    </section>
  );
}