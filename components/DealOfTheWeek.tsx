"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Plus_Jakarta_Sans } from "next/font/google";
import {
  FiArrowRight,
  FiClock,
  FiStar,
  FiShoppingBag,
  FiHeart,
} from "react-icons/fi";
import { Product } from "@/types";

const modernSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

/* =========================================================
   COUNTDOWN
========================================================= */

function useCountdown(targetDate: string | Date) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculate = () => {
      const difference =
        new Date(targetDate).getTime() - Date.now();

      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / 86400000),

        hours: Math.floor(
          (difference % 86400000) / 3600000
        ),

        minutes: Math.floor(
          (difference % 3600000) / 60000
        ),

        seconds: Math.floor(
          (difference % 60000) / 1000
        ),
      });
    };

    calculate();

    const timer = setInterval(calculate, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function DealOfTheWeek() {
  const router = useRouter();

  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  /* =======================================================
     DEAL END DATE
  ======================================================= */

  const dealEndDate = useMemo(() => {
    const date = new Date();

    date.setDate(date.getDate() + 14);

    return date.toISOString();
  }, []);

  const countdown = useCountdown(dealEndDate);

  /* =======================================================
     FETCH PRODUCTS
  ======================================================= */

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products", {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await res.json();

        const products: Product[] = Array.isArray(data)
          ? data
          : Array.isArray(data?.products)
          ? data.products
          : Array.isArray(data?.data)
          ? data.data
          : [];

        const activeProducts = products.filter(
          (product) =>
            product.status?.toLowerCase() === "active"
        );

        setDbProducts(activeProducts);
      } catch (error) {
        console.error(
          "Error fetching products:",
          error
        );

        setDbProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  /* =======================================================
     FIND BEST DEAL
  ======================================================= */

  const specialDeals = useMemo(() => {
    return dbProducts
      .filter(
        (product) =>
          Number(product.discount || 0) > 0
      )
      .sort(
        (a, b) =>
          Number(b.discount || 0) -
          Number(a.discount || 0)
      );
  }, [dbProducts]);

  const dealProduct = useMemo(() => {
    return (
      specialDeals[0] ||
      dbProducts[0] ||
      null
    );
  }, [specialDeals, dbProducts]);

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <section className="bg-[#FDF9F3] py-14 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">

            <div className="mb-3 h-4 w-32 rounded bg-[#E8E2D9]" />

            <div className="mb-10 h-10 w-72 rounded bg-[#E8E2D9]" />

            <div className="h-[420px] rounded-[24px] bg-[#EEE9E1]" />

          </div>
        </div>
      </section>
    );
  }

  /* =======================================================
     EMPTY
  ======================================================= */

  if (!dealProduct) {
    return null;
  }

  /* =======================================================
     PRODUCT DATA
  ======================================================= */

  const productId =
    dealProduct._id || dealProduct.id;

  const productImage =
    dealProduct.image ||
    dealProduct.images?.[0] ||
    "/placeholder-product.png";

  const discount = Number(
    dealProduct.discount || 0
  );

  const price = Number(
    dealProduct.price || 0
  );

  const originalPrice =
    Number(dealProduct.originalPrice || 0) ||
    (discount > 0
      ? price / (1 - discount / 100)
      : 0);

  const rating = Number(
    dealProduct.rating || 5
  );

  /* =======================================================
     TIME BOX
  ======================================================= */

  const timeBoxes = [
    {
      value: countdown.days,
      label: "Days",
    },
    {
      value: countdown.hours,
      label: "Hours",
    },
    {
      value: countdown.minutes,
      label: "Min",
    },
    {
      value: countdown.seconds,
      label: "Sec",
    },
  ];

  /* =======================================================
     UI
  ======================================================= */

  return (
    <section
      className={`${modernSans.variable} relative overflow-hidden bg-[#FDF9F3] py-14 font-sans text-[#0B2523] sm:py-16 lg:py-20`}
    >
      {/* ===================================================
          BACKGROUND DECORATION
      =================================================== */}

      <div className="pointer-events-none absolute -right-32 top-10 h-72 w-72 rounded-full bg-[#DCE8C8]/30 blur-3xl" />

      <div className="pointer-events-none absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-[#E5D3B3]/20 blur-3xl" />

      {/* ===================================================
          CONTAINER
      =================================================== */}

      <div className="relative mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">

        {/* =================================================
            SECTION HEADER
        ================================================= */}

        <div className="mb-8 flex flex-col justify-between gap-5 sm:mb-10 md:flex-row md:items-end">

          <div>

            {/* Small Label */}
            <div className="mb-3 flex items-center gap-3">

              <span className="h-[3px] w-8 rounded-full bg-[#D9B873]" />

              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#626866]">
                Limited Time Offer
              </span>

            </div>

            {/* Heading */}
            <h2 className="text-[32px] font-extrabold leading-tight tracking-[-1.2px] text-[#101817] sm:text-[38px] lg:text-[44px]">

              Deal Of The{" "}
              <span className="text-[#075B4C]">
                Week
              </span>

            </h2>

          </div>

          {/* Small description */}
          <p className="max-w-[430px] text-[12px] leading-6 text-[#6A706D] md:text-right">
            Enjoy an exclusive offer on one of our
            favorite pieces. Hurry up before this
            special deal ends.
          </p>

        </div>

        {/* =================================================
            MAIN DEAL CARD
        ================================================= */}

        <div className="relative overflow-hidden rounded-[24px] border border-[#E6DED3] bg-white shadow-[0_15px_50px_rgba(25,45,40,0.07)]">

          {/* Top decorative line */}
          <div className="absolute left-0 right-0 top-0 h-[3px] bg-[#075B4C]" />

          <div className="grid grid-cols-1 lg:grid-cols-[46%_54%]">

            {/* =================================================
                IMAGE SECTION
            ================================================= */}

            <div className="relative p-3 sm:p-5 lg:p-6">

              <div
                onClick={() =>
                  router.push(
                    `/product/${productId}`
                  )
                }
                className="group relative flex min-h-[330px] cursor-pointer items-center justify-center overflow-hidden rounded-[19px] bg-[#F7F5F1] sm:min-h-[390px] lg:min-h-[450px]"
              >

                {/* Soft circle */}
                <div className="absolute left-1/2 top-1/2 h-[260px] w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/70 blur-[1px] sm:h-[330px] sm:w-[330px]" />

                {/* Discount badge */}
                {discount > 0 && (
                  <div className="absolute left-5 top-5 z-20 rounded-full bg-[#075B4C] px-5 py-2 text-[11px] font-bold tracking-wide text-white shadow-md">
                    {discount}% OFF
                  </div>
                )}

                {/* Product Image */}
                <img
                  src={productImage}
                  alt={dealProduct.name}
                  className="relative z-10 max-h-[300px] w-[88%] object-contain mix-blend-multiply transition-transform duration-700 ease-out group-hover:scale-[1.07] sm:max-h-[370px] lg:max-h-[420px]"
                />

                {/* Wishlist */}
                <button
                  type="button"
                  onClick={(e) =>
                    e.stopPropagation()
                  }
                  className="absolute right-5 top-5 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#26312E] shadow-[0_4px_18px_rgba(0,0,0,0.08)] transition-all duration-300 hover:bg-[#075B4C] hover:text-white"
                  aria-label="Add to wishlist"
                >
                  <FiHeart
                    size={17}
                    strokeWidth={1.8}
                  />
                </button>

                {/* Image bottom label */}
                <div className="absolute bottom-5 left-5 z-20 rounded-full border border-white/80 bg-white/85 px-4 py-2 text-[10px] font-semibold text-[#075B4C] backdrop-blur-sm">
                  Premium Collection
                </div>

              </div>

            </div>

            {/* =================================================
                CONTENT SECTION
            ================================================= */}

            <div className="flex flex-col justify-center px-6 pb-8 pt-3 sm:px-8 sm:pb-10 lg:px-12 lg:py-10">

              {/* Category */}
              <div className="mb-3 flex items-center gap-2">

                <span className="h-[6px] w-[6px] rounded-full bg-[#D9B873]" />

                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7B807D]">
                  {dealProduct.category ||
                    "Furniture"}
                </span>

              </div>

              {/* Product Name */}
              <h3
                onClick={() =>
                  router.push(
                    `/product/${productId}`
                  )
                }
                className="max-w-[550px] cursor-pointer text-[27px] font-extrabold leading-[1.2] tracking-[-0.8px] text-[#101817] transition-colors duration-300 hover:text-[#075B4C] sm:text-[32px] lg:text-[37px]"
              >
                {dealProduct.name}
              </h3>

              {/* Rating */}
              <div className="mt-4 flex items-center gap-2">

                <div className="flex items-center gap-1">

                  <FiStar
                    size={17}
                    className="fill-[#F4B400] text-[#F4B400]"
                  />

                  <span className="text-[13px] font-bold text-[#202624]">
                    {rating.toFixed(1)}
                  </span>

                </div>

                <span className="h-4 w-px bg-[#DAD7D1]" />

                <span className="text-[11px] text-[#7A7F7C]">
                  Premium Quality
                </span>

              </div>

              {/* Description */}
              <p className="mt-5 max-w-[550px] text-[13px] leading-[1.8] text-[#69706D] sm:text-[14px]">
                {dealProduct.description ||
                  "Premium quality furniture designed with comfort, elegance and durability in mind. Perfect for creating a beautiful and relaxing space."}
              </p>

              {/* Price */}
              <div className="mt-6 flex items-end gap-3">

                <span className="text-[30px] font-extrabold tracking-[-1px] text-[#075B4C] sm:text-[34px]">
                  ৳{price.toLocaleString()}
                </span>

                {originalPrice > price && (
                  <span className="mb-1 text-[15px] font-medium text-[#A1A5A3] line-through">
                    ৳
                    {Math.round(
                      originalPrice
                    ).toLocaleString()}
                  </span>
                )}

              </div>

              {/* =================================================
                  COUNTDOWN
              ================================================= */}

              <div className="mt-7">

                <div className="mb-3 flex items-center gap-2">

                  <FiClock
                    size={14}
                    className="text-[#075B4C]"
                  />

                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#626866]">
                    Offer Ends In
                  </span>

                </div>

                <div className="flex gap-2 sm:gap-3">

                  {timeBoxes.map(
                    ({ value, label }) => (
                      <div
                        key={label}
                        className="flex min-w-[55px] flex-col items-center rounded-[10px] border border-[#E3DDD4] bg-[#FAF8F4] px-2 py-2.5 sm:min-w-[65px] sm:px-3"
                      >

                        <span className="text-[18px] font-extrabold leading-none tabular-nums text-[#075B4C] sm:text-[20px]">
                          {String(value).padStart(
                            2,
                            "0"
                          )}
                        </span>

                        <span className="mt-1 text-[8px] font-semibold uppercase tracking-wider text-[#858A87]">
                          {label}
                        </span>

                      </div>
                    )
                  )}

                </div>

              </div>

              {/* =================================================
                  BUTTONS
              ================================================= */}

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">

                {/* Shop Now */}
                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      `/product/${productId}`
                    )
                  }
                  className="group flex items-center justify-center gap-3 rounded-[7px] bg-[#075B4C] px-7 py-3.5 text-[11px] font-bold uppercase tracking-[0.13em] text-white shadow-[0_8px_20px_rgba(7,91,76,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#064D41] hover:shadow-[0_12px_25px_rgba(7,91,76,0.25)]"
                >
                  Shop Now

                  <FiArrowRight
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </button>

                {/* Cart */}
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 rounded-[7px] border border-[#DCD8D0] bg-white px-6 py-3.5 text-[11px] font-bold uppercase tracking-[0.13em] text-[#075B4C] transition-all duration-300 hover:border-[#075B4C] hover:bg-[#F5F9F7]"
                >
                  <FiShoppingBag size={15} />

                  Add To Cart
                </button>

              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}