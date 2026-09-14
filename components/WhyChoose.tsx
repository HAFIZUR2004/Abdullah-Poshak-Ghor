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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {features.map(
            (
              {
                icon: Icon,
                title,
                desc,
                count,
                suffix,
                label,
              },
              index
            ) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 45 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.65,
                  delay: index * 0.12,
                }}
                whileHover={{ y: -8 }}
                className="group relative overflow-hidden rounded-[18px] border border-[#E8E0D6] bg-white p-6 text-center shadow-[0_5px_25px_rgba(25,45,40,0.035)] transition-shadow duration-300 hover:shadow-[0_18px_45px_rgba(25,45,40,0.10)]"
              >
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.7,
                    delay: index * 0.12 + 0.2,
                  }}
                  className="absolute left-0 right-0 top-0 h-[3px] origin-left bg-[#075B4C]"
                />

                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    type: "spring",
                    stiffness: 180,
                    damping: 12,
                    delay: index * 0.12 + 0.2,
                  }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#075B4C]/15 bg-[#075B4C]/[0.07] text-[#075B4C] transition-all duration-300 group-hover:bg-[#075B4C] group-hover:text-white"
                >
                  <Icon size={23} strokeWidth={1.7} />
                </motion.div>

                <div className="mt-5">
                  <div className="text-[30px] font-extrabold leading-none tracking-[-1px] text-[#075B4C]">
                    <NumberCounter
                      end={count}
                      suffix={suffix}
                      duration={2200}
                    />
                  </div>

                  <p className="mt-2 text-[9px] font-semibold uppercase tracking-[0.13em] text-[#9A9E9C]">
                    {label}
                  </p>
                </div>

                <h4 className="mt-5 text-[14px] font-bold text-[#111817]">
                  {title}
                </h4>

                <p className="mx-auto mt-2 max-w-[220px] text-[11px] leading-[1.7] text-[#737875]">
                  {desc}
                </p>

                <div className="mt-5 flex justify-center gap-1.5">
                  <motion.span
                    initial={{ width: 5 }}
                    whileInView={{ width: 22 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.12 + 0.5,
                    }}
                    className="h-[3px] rounded-full bg-[#075B4C]"
                  />
                  <span className="h-[3px] w-[5px] rounded-full bg-[#D9B873]" />
                  <span className="h-[3px] w-[5px] rounded-full bg-[#D9B873]" />
                </div>
              </motion.div>
            )
          )}
        </div>
      </div>
    </section>
  );
}