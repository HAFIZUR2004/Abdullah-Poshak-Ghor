"use client";

import { useEffect, useState, useRef } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";
import { motion, useInView } from "framer-motion";

const modernSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

// 🟢 কাউন্টার অ্যানিমেশন কম্পোনেন্ট
function NumberCounter({
  end,
  duration = 2000,
  prefix = "",
  suffix = "",
}: {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (time: number) => {
      if (!startTime) startTime = time;

      const progress = Math.min((time - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);

      setCount(Math.floor(eased * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [isInView, end, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function StatsBar({ productCount = 360 }: { productCount?: number }) {
  const stats = [
    { value: 26, suffix: "+", label: "Years Experience" },
    { value: 25, suffix: "K+", label: "Happy Customers" },
    { value: productCount, suffix: "+", label: "Products" },
    { value: 98, suffix: "%", label: "Satisfaction Rate" },
  ];

  return (
    <div className={`${modernSans.variable} font-sans bg-[#0F3D39] text-white antialiased`}>
      <section className="bg-[#0F3D39] text-white py-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#DCE8C8]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FF7A00]/5 rounded-full blur-3xl" />
        
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {stats.map(({ value, suffix, label }, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-[#0B2523]/20 rounded-lg p-4 border border-[#E5D3B3]/10"
              >
                <div className="text-2xl md:text-3xl font-extrabold text-[#E5D3B3]">
                  <NumberCounter end={value} suffix={suffix} duration={2000} />
                </div>
                <div className="text-[11px] text-[#E5D3B3]/60 uppercase tracking-wider mt-1 font-medium">
                  {label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}