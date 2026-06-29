"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { FiStar } from "react-icons/fi";

// ─── Data ──────────────────────────────────────────────────────────────────────

const reviews = [
  {
    name: "Fatima Akter",
    location: "Dhaka",
    text: "এত সুন্দর product! I love it 😍 The lipstick shade is absolutely gorgeous and the packaging is premium.",
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
    text: "Best beauty store in Bangladesh! Affordable prices and 100% genuine. Already ordered 3 times!",
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
    text: "Face serum টা use করার পর skin একদম glow করছে! Must try product 🌟 Customer service is great.",
    rating: 5,
    date: "1 week ago",
    verified: true,
  },
];

// ─── Helper ─────────────────────────────────────────────────────────────────────

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

// Deterministic gradient per name
const avatarGradients = [
  "from-orange-400 to-amber-500",
  "from-amber-400 to-yellow-500",
  "from-orange-500 to-red-500",
  "from-yellow-400 to-orange-400",
  "from-amber-500 to-orange-600",
];

// ─── Component ─────────────────────────────────────────────────────────────────

export default function Reviews() {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-white to-amber-50/40 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-orange-100/40 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-100/50 rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* ── Section Header ── */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-100 px-4 py-1.5 rounded-full mb-4">
            <FiStar className="text-orange-500 fill-orange-500" size={14} />
            <span className="text-xs font-semibold text-orange-600 tracking-wide uppercase">
              Customer Reviews
            </span>
          </div>
          <h2 className="text-2xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
            What Our Customers{" "}
            <span className="bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent">
              Say About Us
            </span>
          </h2>
          <p className="mt-3 text-sm md:text-base text-gray-500 max-w-lg mx-auto">
            Real reviews from verified buyers across Bangladesh
          </p>
          {/* Summary stats */}
          <div className="flex items-center justify-center gap-1.5 mt-4">
            {[1, 2, 3, 4, 5].map((s) => (
              <FiStar
                key={s}
                className="text-amber-400 fill-amber-400"
                size={18}
              />
            ))}
            <span className="ml-2 font-bold text-gray-800">5.0</span>
            <span className="text-gray-400 text-sm">
              · {reviews.length * 40}+ reviews
            </span>
          </div>
        </div>

        {/* ── Swiper ── */}
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={20}
          slidesPerView={1}
          pagination={{
            clickable: true,
            bulletClass: "swiper-bullet-custom",
            bulletActiveClass: "swiper-bullet-active-custom",
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
                {/* Large decorative quote */}
                <span className="absolute top-4 right-5 text-6xl font-serif text-orange-100 leading-none select-none">
                  "
                </span>

                {/* Stars */}
                <div className="flex items-center gap-0.5">
                  {[...Array(review.rating)].map((_, i) => (
                    <FiStar
                      key={i}
                      size={14}
                      className="text-amber-400 fill-amber-400"
                    />
                  ))}
                </div>

                {/* Review text */}
                <p className="text-gray-600 text-sm leading-relaxed flex-1">
                  "{review.text}"
                </p>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-orange-100 via-amber-100 to-transparent" />

                {/* Author row */}
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div
                    className={`w-10 h-10 rounded-full bg-gradient-to-br ${
                      avatarGradients[index % avatarGradients.length]
                    } flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm`}
                  >
                    {getInitials(review.name)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-bold text-gray-800 truncate">
                        {review.name}
                      </p>
                      {review.verified && (
                        <span className="shrink-0 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
                          <svg
                            viewBox="0 0 10 10"
                            className="w-2.5 h-2.5 fill-white"
                          >
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

        {/* Custom pagination style — injected inline */}
        <style>{`
          .swiper-bullet-custom {
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 9999px;
            background: #fed7aa;
            margin: 0 4px;
            cursor: pointer;
            transition: all 0.3s;
          }
          .swiper-bullet-active-custom {
            width: 24px;
            background: #f97316;
          }
          .swiper-pagination-bullet { display: none; }
        `}</style>
      </div>
    </section>
  );
}
