// components/CustomerReviews.tsx
"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { FiStar, FiCheck } from "react-icons/fi";
import { BiSolidQuoteRight } from "react-icons/bi";
import Image from "next/image";

interface Review {
  _id: string;
  name: string;
  location: string;
  text: string;
  rating: number;
  verified: boolean;
  isActive: boolean;
  image?: string;
}

export default function CustomerReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch("/api/reviews");
        const data = await res.json();
        if (data.success) {
          setReviews(data.reviews);
        }
      } catch (error) {
        console.error("Error fetching dynamic reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Calculate Average Rating dynamically
  const totalReviews = reviews.length;
  const avgRating =
    totalReviews > 0
      ? (
          reviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews
        ).toFixed(1)
      : "5.0";

  return (
    <section className="py-16 md:py-24 bg-white relative overflow-hidden select-none">
      {/* Background Decorative Elements */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-48 md:w-80 h-auto text-[#1B4D3E]/10 pointer-events-none z-0">
        <svg viewBox="0 0 200 200" fill="currentColor" className="w-full h-full">
          <path d="M40,160 C10,100 30,40 100,20 C80,70 100,120 40,160 Z" />
          <path d="M50,150 C20,110 50,60 110,40 C90,80 110,120 50,150 Z" opacity="0.6" />
        </svg>
      </div>
      <div className="absolute -right-20 top-1/3 w-80 h-80 bg-orange-100/60 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            What Our Customers Say
          </h2>
          <div className="w-12 h-[3px] bg-[#C5A059] mx-auto mt-2 mb-4 rounded-full" />

          <div className="flex items-center justify-center gap-1.5">
            <div className="flex text-amber-400 gap-0.5">
              {[...Array(5)].map((_, i) => (
                <FiStar key={i} className="fill-amber-400 text-amber-400" size={18} />
              ))}
            </div>
            <span className="font-semibold text-gray-900 text-sm ml-1">{avgRating}</span>
            <span className="text-gray-500 text-sm">· {totalReviews} reviews</span>
          </div>
        </div>

        {/* Loading Skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-gray-50 rounded-3xl p-8 h-[300px] animate-pulse border border-gray-100"
              />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center text-gray-500 py-10">No reviews found.</div>
        ) : (
          /* Swiper Slider */
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={24}
            slidesPerView={1}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            pagination={{
              clickable: true,
              el: ".custom-swiper-pagination",
            }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="!pb-14 !pt-2"
          >
            {reviews.map((review) => (
              <SwiperSlide key={review._id} className="!h-auto flex">
                <div className="bg-white rounded-3xl p-7 md:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-gray-100/80 w-full flex flex-col justify-between min-h-[280px] md:min-h-[310px] transition-all duration-300 hover:shadow-[0_15px_35px_rgba(0,0,0,0.08)]">
                  {/* Card Header Info */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      {/* Avatar with Fallback - using next/image */}
                      <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-full p-[3px] bg-[#1B4D3E] flex-shrink-0">
                        <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-white bg-emerald-100 flex items-center justify-center font-bold text-[#1B4D3E] text-lg">
                          {review.image ? (
                            <Image
                              src={review.image}
                              alt={review.name}
                              fill
                              className="object-cover"
                              unoptimized={review.image.startsWith("data:")}
                            />
                          ) : (
                            review.name.charAt(0).toUpperCase()
                          )}
                        </div>
                        {review.verified && (
                          <div className="absolute -bottom-0.5 -right-0.5 bg-[#C5A059] text-white p-1 rounded-full border-2 border-white flex items-center justify-center shadow-sm">
                            <FiCheck size={10} strokeWidth={4} />
                          </div>
                        )}
                      </div>

                      {/* Name & Location */}
                      <div>
                        <h3 className="font-bold text-gray-900 text-base md:text-lg leading-snug">
                          {review.name}
                        </h3>
                        <p className="text-gray-500 text-xs md:text-sm mb-1.5">
                          {review.location}
                        </p>
                        <div className="flex items-center gap-1">
                          <div className="flex text-amber-400 gap-0.5">
                            {[...Array(review.rating)].map((_, i) => (
                              <FiStar key={i} className="fill-amber-400 text-amber-400" size={14} />
                            ))}
                          </div>
                          <span className="text-xs font-bold text-gray-800 ml-1">
                            {review.rating}.0
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Quote Icon */}
                    <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-emerald-50/80 flex items-center justify-center text-[#1B4D3E] flex-shrink-0">
                      <BiSolidQuoteRight size={22} />
                    </div>
                  </div>

                  {/* Review Text */}
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed mt-6 flex-1">
                    {review.text}
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}

        {/* Custom Swiper Pagination */}
        <div className="custom-swiper-pagination flex justify-center items-center gap-1.5 mt-2" />
      </div>

      <style jsx global>{`
        .custom-swiper-pagination .swiper-pagination-bullet {
          width: 28px;
          height: 4px;
          border-radius: 2px;
          background-color: #e5e7eb;
          opacity: 1;
          margin: 0 3px !important;
          transition: all 0.3s ease;
        }
        .custom-swiper-pagination .swiper-pagination-bullet-active {
          background-color: #1b4d3e;
          width: 38px;
        }
      `}</style>
    </section>
  );
}