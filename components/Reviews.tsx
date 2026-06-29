"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { FiStar } from "react-icons/fi";

// ─── Data (original dynamic reviews array) ─────────────────────────────────────

const reviews = [
  {
    name: "Fatima Akter",
    location: "Dhaka",
    text: "এত সুন্দর product! I love it 😍 The craftsmanship is absolutely gorgeous and the packaging is premium.",
    rating: 5,
    date: "2 days ago",
    verified: true,
  },
  {
    name: "Nusrat Jahan",
    location: "Chittagong",
    text: "Dhaka তে ২ দিনে ডেলিভারি পেয়েছি! Product quality অসাধারণ 💖 Will definitely order again!",
    rating: 5,
    date: "1 week ago",
    verified: true,
  },
  {
    name: "Sadia Rahman",
    location: "Sylhet",
    text: "Best furniture store in Bangladesh! Affordable prices and 100% genuine. Already ordered 3 times!",
    rating: 5,
    date: "3 days ago",
    verified: true,
  },
  {
    name: "Tasnim Haque",
    location: "Rajshahi",
    text: "Cash on Delivery option টা খুবই convenient! Products are amazing quality ✨ Highly recommended.",
    rating: 5,
    date: "5 days ago",
    verified: true,
  },
  {
    name: "Mim Sultana",
    location: "Khulna",
    text: "The sofa I ordered feels so luxurious! Must try furniture 🌟 Customer service is great.",
    rating: 5,
    date: "1 week ago",
    verified: true,
  },
  {
    name: "Arif Hossain",
    location: "Dhaka",
    text: "The craftsmanship is outstanding, and the pieces feel both elegant and comfortable. Delivery was smooth, and the team made sure everything was set up perfectly. Truly a five-star experience!",
    rating: 5,
    date: "2 weeks ago",
    verified: true,
  },
];

// ─── Helpers ────────────────────────────────────────────────────────────────────

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

// Deterministic gradient per reviewer index — using warm beige/green palette
const avatarColors = [
  "bg-[#3a4739]",
  "bg-[#d69a45]",
  "bg-[#2e3a2c]",
  "bg-[#c0873a]",
  "bg-[#4a5c48]",
  "bg-[#3a4739]",
];

// ─── Component ─────────────────────────────────────────────────────────────────

export default function Reviews() {
  return (
    <section className="py-16 md:py-20 bg-[#faf8f5] relative overflow-hidden border-t border-gray-100">

      {/* Decorative leaf/plant pattern on the left */}
      <div className="absolute left-0 bottom-0 w-40 md:w-64 h-64 md:h-96 opacity-10 pointer-events-none select-none">
        <svg viewBox="0 0 100 100" className="w-full h-full text-[#3a4739]" fill="currentColor">
          <path d="M10,90 Q30,60 50,80 T90,50 Q70,40 50,60 T10,90 Z" />
          <path d="M20,80 Q40,50 60,70 T100,40 Q80,30 60,50 T20,80 Z" opacity="0.5" />
        </svg>
      </div>

      {/* Decorative peach circle on the bottom right */}
      <div className="absolute -right-16 -bottom-16 w-64 h-64 md:w-96 md:h-96 bg-[#e8c4b4]/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ── Section Header ── */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#2e3a2c] tracking-tight">
            What Our Customers Say
          </h2>
          <div className="w-12 h-[2px] bg-[#d69a45] mx-auto mt-3 mb-4" />
          {/* Summary stars */}
          <div className="flex items-center justify-center gap-1 mt-4">
            {[1, 2, 3, 4, 5].map((s) => (
              <FiStar key={s} className="text-[#d69a45] fill-[#d69a45]" size={18} />
            ))}
            <span className="ml-2 font-bold text-[#2e3a2c] text-sm">5.0</span>
            <span className="text-gray-400 text-xs ml-1">
              · {reviews.length * 40}+ reviews
            </span>
          </div>
        </div>

        {/* ── Swiper Carousel (original loop structure) ── */}
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={20}
          slidesPerView={1}
          pagination={{
            clickable: true,
            bulletClass: "swiper-bullet-furniture",
            bulletActiveClass: "swiper-bullet-furniture-active",
          }}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          loop
          breakpoints={{
            640: { slidesPerView: 2, spaceBetween: 20 },
            1024: { slidesPerView: 3, spaceBetween: 24 },
          }}
          className="!pb-12"
        >
          {reviews.map((review, index) => (
            <SwiperSlide key={index}>
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 h-full flex flex-col gap-4 relative">

                {/* Large decorative quote mark */}
                <span className="absolute top-4 right-5 text-6xl font-serif text-[#3a4739]/10 leading-none select-none">
                  "
                </span>

                {/* Star rating */}
                <div className="flex items-center gap-0.5">
                  {[...Array(review.rating)].map((_, i) => (
                    <FiStar
                      key={i}
                      size={14}
                      className="text-[#d69a45] fill-[#d69a45]"
                    />
                  ))}
                </div>

                {/* Review text */}
                <p className="text-gray-600 text-sm leading-relaxed flex-1">
                  "{review.text}"
                </p>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-[#d69a45]/20 via-[#d69a45]/10 to-transparent" />

                {/* Author row */}
                <div className="flex items-center gap-3">
                  {/* Avatar with initials */}
                  <div
                    className={`w-10 h-10 rounded-full ${avatarColors[index % avatarColors.length]} flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm`}
                  >
                    {getInitials(review.name)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-bold text-[#2e3a2c] truncate">
                        {review.name}
                      </p>
                      {review.verified && (
                        <span className="shrink-0 w-4 h-4 bg-[#d69a45] rounded-full flex items-center justify-center">
                          <svg viewBox="0 0 10 10" className="w-2.5 h-2.5 fill-white">
                            <path
                              d="M2 5l2 2 4-4"
                              stroke="white"
                              strokeWidth="1.5"
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400">
                      {review.location} · {review.date}
                    </p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom pagination styles */}
        <style>{`
          .swiper-bullet-furniture {
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 9999px;
            background: #d69a45;
            opacity: 0.3;
            margin: 0 4px;
            cursor: pointer;
            transition: all 0.3s;
          }
          .swiper-bullet-furniture-active {
            width: 24px;
            opacity: 1;
            background: #d69a45;
          }
          .swiper-pagination-bullet { display: none; }
        `}</style>

      </div>
    </section>
  );
}
