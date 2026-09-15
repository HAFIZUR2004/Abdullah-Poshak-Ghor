"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FiPenTool, FiMaximize, FiLayout, FiPackage,
  FiCheckCircle, FiArrowRight, FiShield, FiClock
} from "react-icons/fi";

export default function CustomizationSection() {
  const [imageUrl, setImageUrl] = useState<string>("/images/customizesection.jpeg");

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const res = await fetch("/api/custom-section", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data?.imageUrl) {
            setImageUrl(data.imageUrl);
          }
        }
      } catch (error) {
        console.error("Failed to fetch section image:", error);
      }
    };

    fetchImage();
  }, []);

  return (
    <section className="py-20 lg:py-28 bg-[#FDF6EE] relative overflow-hidden font-sans">

      {/* Background Decorative Elements */}
      <div className="absolute top-20 right-0 w-72 h-72 bg-[#DCE8C8] rounded-full opacity-40 blur-3xl -z-10" />
      <div className="absolute bottom-20 left-0 w-96 h-96 bg-[#E5D3B3] rounded-full opacity-20 blur-3xl -z-10" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs font-bold text-[#0F3D39] uppercase tracking-[0.3em] mb-4">
            Customization Services
          </p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-medium text-[#0B2523] leading-[1.1] tracking-tight">
            Your Dream Furniture,
            <span className="block text-[#0F3D39]">Made Your Way</span>
          </h2>
          <p className="mt-6 text-sm sm:text-base text-[#0B2523]/70 leading-relaxed max-w-2xl mx-auto">
            We believe every home is unique. Our expert craftsmen and designers work with you
            to create furniture that perfectly fits your space, style, and needs.
          </p>
        </div>

        {/* Main Customization Banner */}
        {/* ✅ Fix: aspect ratio এবং fill বাদ দিয়ে প্রস্থ অনুযায়ী স্বাভাবিক উচ্চতা দেওয়া হয়েছে যাতে ফাঁকা জায়গা না থাকে */}
        <div className="w-full rounded-2xl overflow-hidden shadow-md border border-[#E5D3B3]/30">
          <Image
            src={imageUrl}
            alt="Custom Furniture Craftsmanship"
            width={1400}
            height={800}
            priority
            className="w-full h-auto block object-cover"
          />
        </div>
      </div>
    </section>
  );
}