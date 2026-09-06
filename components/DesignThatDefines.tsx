"use client";

import { useRouter } from "next/navigation";
import { Plus_Jakarta_Sans } from "next/font/google";
import { FiArrowRight } from "react-icons/fi";

const modernSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

export default function DesignThatDefines() {
  const router = useRouter();
  const goToShop = () => router.push("/shop");

  return (
    <div className={`${modernSans.variable} font-sans bg-[#FDF6EE] text-[#0B2523] antialiased`}>
      <section className="py-0 bg-[#FDF6EE] px-4 sm:px-6 lg:px-8 pb-10">
        <div className="max-w-[1400px] mx-auto">
          <div className="bg-[#0B2523] rounded-xl overflow-hidden grid grid-cols-1 lg:grid-cols-[1fr_420px] min-h-[220px] shadow-lg">
            <div className="p-8 sm:p-10 flex flex-col justify-center gap-4 relative">
              <div className="absolute top-4 left-4 w-24 h-24 bg-[#DCE8C8]/5 rounded-full blur-2xl" />
              <div className="border-l-4 border-[#FF7A00] pl-3">
                <p className="text-[10px] font-bold text-[#E5D3B3]/60 uppercase tracking-widest">Lifestyle</p>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#E5D3B3] leading-snug">
                Design That Defines<br />Your Lifestyle
              </h3>
              <p className="text-[#E5D3B3]/60 text-sm leading-relaxed max-w-sm">
                Furniture that fits your space, your story, and your style.
              </p>
              <button
                onClick={goToShop}
                className="mt-1 inline-flex items-center gap-2 bg-[#FF7A00] hover:bg-[#E56E00] text-white text-[11px] font-bold uppercase tracking-widest px-5 py-2.5 rounded-sm transition-all w-fit cursor-pointer shadow-md"
              >
                Browse Collection <FiArrowRight size={12} />
              </button>
            </div>
            <div className="relative min-h-[180px] hidden lg:block">
              <img
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=800&auto=format&fit=crop"
                alt="Lifestyle Design"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-[#0B2523] to-transparent opacity-30" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}