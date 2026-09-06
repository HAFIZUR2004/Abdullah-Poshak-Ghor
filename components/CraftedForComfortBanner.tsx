"use client";

import { useRouter } from "next/navigation";
import { Plus_Jakarta_Sans } from "next/font/google";
import { FiArrowRight } from "react-icons/fi";

// ─── Plus Jakarta Sans Font Setup ────────────────────────────────────────────

const modernSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CraftedForComfortBanner() {
  const router = useRouter();
  const goToShop = () => router.push("/shop");

  return (
    <div className={`${modernSans.variable} font-sans bg-[#FDF6EE] text-[#0B2523] antialiased`}>
      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* Banner - Crafted for Comfort */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section className="py-0 bg-[#FDF6EE] px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1400px] mx-auto">
          <div className="bg-[#0F3D39] rounded-xl overflow-hidden grid grid-cols-1 lg:grid-cols-[1fr_380px] min-h-[240px] shadow-lg">
            <div className="p-8 sm:p-10 lg:p-12 flex flex-col justify-center gap-4 relative">
              <div className="absolute top-4 right-4 w-20 h-20 bg-[#DCE8C8]/10 rounded-full blur-2xl" />
              <div className="border-l-4 border-[#FF7A00] pl-3">
                <p className="text-[10px] font-bold text-[#E5D3B3]/60 uppercase tracking-widest">Premium Quality</p>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold leading-snug">
                <span className="block text-[#E5D3B3]">Crafted for Comfort.</span>
                <span className="block text-[#E5D3B3]">Designed for You.</span>
              </h3>
              <p className="text-[#E5D3B3]/70 text-sm leading-relaxed max-w-sm">
                Sustainable wood. Premium finish. Made to last for generations.
              </p>
              <button
                onClick={goToShop}
                className="mt-2 inline-flex items-center gap-2 bg-[#FF7A00] hover:bg-[#E56E00] text-white text-[11px] font-bold uppercase tracking-widest px-5 py-2.5 rounded-sm transition-all w-fit cursor-pointer shadow-md"
              >
                Discover More <FiArrowRight size={12} />
              </button>
            </div>
            <div className="relative min-h-[200px] lg:min-h-0 hidden lg:block">
              <img
                src="https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=700&auto=format&fit=crop"
                alt="Crafted furniture"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0F3D39] to-transparent opacity-30" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}