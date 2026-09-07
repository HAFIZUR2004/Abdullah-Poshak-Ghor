"use client";

import { useRouter } from "next/navigation";
import { Plus_Jakarta_Sans } from "next/font/google";
import { useState, useEffect } from "react";
import Image from "next/image";

// ─── Plus Jakarta Sans Font Setup ────────────────────────────────────────────

const modernSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

// ─── Interface ────────────────────────────────────────────────────────────────

interface BannerData {
  _id?: string;
  title: string;
  image: string;
  link: string;
  isActive: boolean;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CraftedForComfortBanner() {
  const router = useRouter();
  const [banner, setBanner] = useState<BannerData | null>(null);
  const [loading, setLoading] = useState(true);

  // ─── Fetch Banner from API ──────────────────────────────────────────────────
  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const res = await fetch("/api/banner");
        const data = await res.json();
        
        if (data.success && data.banner) {
          setBanner(data.banner);
        } else {
          // Fallback: যদি API fail করে, default banner ব্যবহার করব
          setBanner({
            title: "Crafted for Comfort",
            image: "https://i.ibb.co.com/4RCn5y67/discount.webp",
            link: "/shop",
            isActive: true,
          });
        }
      } catch (error) {
        console.error("Error fetching banner:", error);
        // Fallback: error হলে default banner
        setBanner({
          title: "Crafted for Comfort",
          image: "https://i.ibb.co.com/4RCn5y67/discount.webp",
          link: "/shop",
          isActive: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBanner();
  }, []);

  // ─── Handle Click ───────────────────────────────────────────────────────────
  const handleClick = () => {
    if (banner?.link) {
      router.push(banner.link);
    } else {
      router.push("/shop");
    }
  };

  // ─── Loading State ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className={`${modernSans.variable} font-sans bg-[#FDF6EE] antialiased`}>
        <section className="py-2 bg-[#FDF6EE] px-4 sm:px-6 lg:px-8">
          <div className="max-w-[1400px] mx-auto">
            <div className="relative w-full rounded-2xl bg-gray-200 animate-pulse h-32 sm:h-48 lg:h-64" />
          </div>
        </section>
      </div>
    );
  }

  // ─── No Banner / Inactive ──────────────────────────────────────────────────
  if (!banner || !banner.isActive || !banner.image) {
    return null;
  }

  // ─── Render Banner ──────────────────────────────────────────────────────────
  return (
    <div className={`${modernSans.variable} font-sans bg-[#FDF6EE] text-[#0B2523] antialiased`}>
      <section className="py-2 bg-[#FDF6EE] px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1400px] mx-auto">
          <div 
            className="relative w-full cursor-pointer overflow-hidden rounded-2xl shadow-sm" 
            onClick={handleClick}
          >
            <Image
              src={banner.image}
              alt={banner.title || "Crafted furniture discount banner"}
              width={1400}
              height={400}
              className="w-full h-auto object-contain transition-transform duration-300 hover:scale-[1.01]"
              priority
              unoptimized={banner.image.startsWith("data:")}
            />
          </div>
        </div>
      </section>
    </div>
  );
}