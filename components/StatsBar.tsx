"use client";

import { Plus_Jakarta_Sans } from "next/font/google";

const modernSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

export default function StatsBar({ productCount = 360 }: { productCount?: number }) {
  const stats = [
    { stat: "12+", label: "Years Experience" },
    { stat: "25K+", label: "Happy Customers" },
    { stat: `${productCount}+`, label: "Products" },
    { stat: "98%", label: "Satisfaction Rate" },
  ];

  return (
    <div className={`${modernSans.variable} font-sans bg-[#0F3D39] text-white antialiased`}>
      <section className="bg-[#0F3D39] text-white py-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#DCE8C8]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FF7A00]/5 rounded-full blur-3xl" />
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {stats.map(({ stat, label }, idx) => (
              <div key={idx} className="bg-[#0B2523]/20 rounded-lg p-4 border border-[#E5D3B3]/10">
                <div className="text-2xl md:text-3xl font-extrabold text-[#E5D3B3]">{stat}</div>
                <div className="text-[11px] text-[#E5D3B3]/60 uppercase tracking-wider mt-1 font-medium">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}