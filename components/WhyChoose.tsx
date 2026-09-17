"use client";

import { useEffect, useState, useRef } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Award, Heart, Users, ThumbsUp } from "lucide-react";
import { motion, useInView } from "framer-motion";

const modernSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

function NumberCounter({
  end,
  duration = 2000,
  suffix = "",
}: {
  end: number;
  duration?: number;
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
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function WhyChoose() {
  const features = [
    {
      icon: Award,
      title: "Premium Material",
      desc: "High-quality, durable & sustainable.",
      count: 100,
      suffix: "%",
      label: "Quality Focus",
    },
    {
      icon: Heart,
      title: "Thoughtful Design",
      desc: "Designed for comfort and style.",
      count: 100,
      suffix: "%",
      label: "Design Focus",
    },
    {
      icon: Users,
      title: "Trusted by Many",
      desc: "Thousands of happy customers.",
      count: 1000,
      suffix: "+",
      label: "Happy Customers",
    },
    {
      icon: ThumbsUp,
      title: "Satisfaction Guaranteed",
      desc: "We stand by our promise.",
      count: 100,
      suffix: "%",
      label: "Satisfaction",
    },
  ];

  return (
    <section
      className={`${modernSans.variable} relative overflow-hidden bg-[#FDF9F3] py-16 font-sans text-[#0B2523] sm:py-20 lg:py-24`}
    >
      <motion.div
        animate={{
          y: [0, -18, 0],
          scale: [1, 1.04, 1],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute -left-32 top-10 h-72 w-72 rounded-full bg-[#DCE8C8]/30 blur-3xl"
      />

      <motion.div
        animate={{
          y: [0, 20, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-[#E5D3B3]/25 blur-3xl"
      />

      <div className="relative mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="mb-12 text-center sm:mb-14"
        >
          <div className="mb-4 flex items-center justify-center gap-3">
            <motion.span
              initial={{ width: 0 }}
              whileInView={{ width: 32 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="h-[3px] rounded-full bg-[#D9B873]"
            />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#68706D]">
              Why Us
            </span>
            <motion.span
              initial={{ width: 0 }}
              whileInView={{ width: 32 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="h-[3px] rounded-full bg-[#D9B873]"
            />
          </div>

          <h2 className="text-[30px] font-extrabold leading-tight tracking-[-1px] text-[#101817] sm:text-[36px] lg:text-[42px]">
            Why Choose{" "}
            <span className="text-[#075B4C]">
              Sareng Furniture?
            </span>
          </h2>

          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 64 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mx-auto mt-5 h-[2px] rounded-full bg-[#D9B873]"
          />

          <p className="mx-auto mt-4 max-w-[550px] text-[12px] leading-6 text-[#707673] sm:text-[13px]">
            We combine quality materials, thoughtful design and reliable service to create furniture you can enjoy for years.
          </p>
        </motion.div>

       
      </div>
    </section>
  );
}