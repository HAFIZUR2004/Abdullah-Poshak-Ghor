"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus_Jakarta_Sans } from "next/font/google";
import {
  FiHeart,
  FiShoppingBag,
  FiStar,
  FiArrowRight,
  FiMaximize2,
} from "react-icons/fi";

const modernSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

/* =========================================================
   Product Type
========================================================= */

interface DealProduct {
  _id?: string;
  id?: string;

  name?: string;
  title?: string;

  category?: string;

  price?: number | string;
  originalPrice?: number | string;
  oldPrice?: number | string;
  regularPrice?: number | string;

  discount?: number | string;
  discountPercentage?: number | string;
  discountPercent?: number | string;

  rating?: number | string;
  averageRating?: number | string;

  description?: string;

  image?: string;
  imageUrl?: string;
  thumbnail?: string;
  images?: string[];

  status?: string;

  stock?: number;
}

/* =========================================================
   Helpers
========================================================= */

const getNumber = (
  value: number | string | undefined | null
): number => {
  if (typeof value === "number") return value;

  if (typeof value === "string") {
    const parsed = parseFloat(value.replace(/[^\d.]/g, ""));
    return Number.isNaN(parsed) ? 0 : parsed;
  }

  return 0;
};

const getProductId = (product: DealProduct) => {
  return product._id || product.id || "";
};

const getProductName = (product: DealProduct) => {
  return product.name || product.title || "Product";
};

const getProductImage = (product: DealProduct) => {
  if (product.image) return product.image;

  if (product.imageUrl) return product.imageUrl;

  if (product.thumbnail) return product.thumbnail;

  if (Array.isArray(product.images) && product.images.length > 0) {
    return product.images[0];
  }

  return "/placeholder-product.png";
};

const getProductPrice = (product: DealProduct) => {
  return getNumber(product.price);
};

const getOriginalPrice = (product: DealProduct) => {
  const original =
    getNumber(product.originalPrice) ||
    getNumber(product.oldPrice) ||
    getNumber(product.regularPrice);

  return original;
};

const getDiscount = (product: DealProduct) => {
  const directDiscount =
    getNumber(product.discountPercentage) ||
    getNumber(product.discountPercent) ||
    getNumber(product.discount);

  if (directDiscount > 0) {
    return Math.round(directDiscount);
  }

  const price = getProductPrice(product);
  const originalPrice = getOriginalPrice(product);

  if (originalPrice > price && price > 0) {
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  }

  return 0;
};

const getRating = (product: DealProduct) => {
  const rating =
    getNumber(product.rating) ||
    getNumber(product.averageRating);

  return rating > 0 ? rating : 5.0;
};

/* =========================================================
   Main Component
========================================================= */

export default function TodayDeals() {
  const router = useRouter();

  const [products, setProducts] = useState<DealProduct[]>([]);
  const [loading, setLoading] = useState(true);

  /* =======================================================
     Fetch Dynamic Products
  ======================================================= */

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const res = await fetch("/api/products", {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await res.json();

        /*
          API response যদি সরাসরি array হয়
          অথবা { products: [] } হয়
          অথবা { data: [] } হয় — সব handle করবে।
        */

        const productList: DealProduct[] = Array.isArray(data)
          ? data
          : Array.isArray(data?.products)
          ? data.products
          : Array.isArray(data?.data)
          ? data.data
          : [];

        const activeProducts = productList.filter(
          (product) =>
            !product.status ||
            product.status.toLowerCase() === "active"
        );

        setProducts(activeProducts);
      } catch (error) {
        console.error("Error fetching today's deals:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  /* =======================================================
     Today's Deals
  ======================================================= */

  const todayDeals = useMemo(() => {
    return products
      .filter((product) => {
        const price = getProductPrice(product);
        const originalPrice = getOriginalPrice(product);
        const discount = getDiscount(product);

        /*
          Product-এর discount থাকলে
          অথবা original price > current price হলে
          Today Deals-এ দেখাবে।
        */

        return (
          discount > 0 ||
          (originalPrice > price && price > 0)
        );
      })
      .sort((a, b) => {
        return getDiscount(b) - getDiscount(a);
      })
      .slice(0, 2);
  }, [products]);

  /* =======================================================
     Loading
  ======================================================= */

  if (loading) {
    return (
      <section
        className={`${modernSans.variable} bg-[#FDF9F3] py-14 font-sans sm:py-16 lg:py-[72px]`}
      >
        <div className="mx-auto max-w-[1450px] px-4 sm:px-6 lg:px-8 xl:px-10">
          <div className="mb-9">
            <div className="mb-3 flex items-center gap-3">
              <span className="h-[4px] w-8 bg-[#D9B873]" />

              <span className="text-[14px] font-medium text-[#4B514F]">
                Today Deals
              </span>
            </div>

            <div className="h-12 w-80 animate-pulse rounded bg-[#eee8df]" />
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            {[1, 2].map((item) => (
              <div
                key={item}
                className="h-[330px] animate-pulse rounded-[18px] bg-white"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  /* =======================================================
     Empty State
  ======================================================= */

  if (todayDeals.length === 0) {
    return (
      <section
        className={`${modernSans.variable} bg-[#FDF9F3] py-14 font-sans sm:py-16 lg:py-[72px]`}
      >
        <div className="mx-auto max-w-[1450px] px-4 text-center sm:px-6 lg:px-8">
          <div className="mb-3 flex items-center justify-center gap-3">
            <span className="h-[4px] w-8 bg-[#D9B873]" />

            <span className="text-[14px] font-medium text-[#4B514F]">
              Today Deals
            </span>
          </div>

          <h2 className="text-3xl font-extrabold text-[#111817]">
            Deals of the Day
          </h2>

          <p className="mt-3 text-sm text-[#777]">
            No discounted products available right now.
          </p>
        </div>
      </section>
    );
  }

  /* =======================================================
     Main UI
  ======================================================= */

  return (
    <section
      className={`${modernSans.variable} bg-[#FDF9F3] py-14 font-sans text-[#111817] sm:py-16 lg:py-[72px]`}
    >
      <div className="mx-auto max-w-[1450px] px-4 sm:px-6 lg:px-8 xl:px-10">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-9 flex flex-col gap-5 lg:mb-11 lg:flex-row lg:items-start lg:justify-between">

          {/* Left */}
          <div>
            <div className="mb-3 flex items-center gap-3">
              <span className="h-[4px] w-8 bg-[#D9B873]" />

              <span className="text-[14px] font-medium tracking-wide text-[#4B514F]">
                Today Deals
              </span>
            </div>

            <h2 className="text-[38px] font-extrabold leading-[1.08] tracking-[-1.5px] text-[#101817] sm:text-[44px] lg:text-[48px]">
              <span className="text-[#075B4C]">
                Deals
              </span>{" "}
              <span className="text-[#101817]">
                of the Day
              </span>
            </h2>
          </div>

          {/* Description */}
          <p className="max-w-[500px] pt-1 text-[13px] leading-[1.75] text-[#5E6260] lg:pt-[10px]">
            Discover our best offers and enjoy exclusive deals
            on selected products. Grab your favorite products
            before the offer ends.
          </p>
        </div>

        {/* =================================================
            DEALS
        ================================================= */}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 xl:gap-7">

          {todayDeals.map((deal) => {
            const id = getProductId(deal);
            const name = getProductName(deal);
            const image = getProductImage(deal);

            const price = getProductPrice(deal);
            const originalPrice = getOriginalPrice(deal);
            const discount = getDiscount(deal);
            const rating = getRating(deal);

            return (
              <div
                key={id || name}
                className="group overflow-hidden rounded-[18px] border border-[#E7E1D8] bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_45px_rgba(20,35,30,0.08)]"
              >
                <div className="flex min-h-[330px] flex-col sm:flex-row">

                  {/* =========================================
                      IMAGE AREA
                  ========================================= */}

                  <div className="relative m-2.5 flex min-h-[285px] shrink-0 items-center justify-center overflow-hidden rounded-[14px] bg-[#F8F6F3] sm:m-3 sm:w-[44%]">

                    {/* Discount */}
                    {discount > 0 && (
                      <div className="absolute left-4 top-3 z-20 rounded-full bg-[#006B4F] px-4 py-[7px] text-[11px] font-bold text-white sm:left-5 sm:top-4">
                        {discount}% off
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="absolute right-3 top-3 z-20 flex flex-col gap-2.5 sm:right-4 sm:top-4">

                      {/* Wishlist */}
                      <button
                        type="button"
                        aria-label="Add to wishlist"
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#303534] shadow-[0_3px_12px_rgba(0,0,0,0.07)] transition-all duration-300 hover:bg-[#006B4F] hover:text-white"
                      >
                        <FiHeart
                          size={17}
                          strokeWidth={1.8}
                        />
                      </button>

                      {/* View */}
                      <button
                        type="button"
                        aria-label="View product"
                        onClick={() =>
                          router.push(`/product/${id}`)
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#303534] shadow-[0_3px_12px_rgba(0,0,0,0.07)] transition-all duration-300 hover:bg-[#006B4F] hover:text-white"
                      >
                        <FiMaximize2
                          size={16}
                          strokeWidth={1.8}
                        />
                      </button>

                      {/* Shopping Bag */}
                      <button
                        type="button"
                        aria-label="Add to cart"
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#303534] shadow-[0_3px_12px_rgba(0,0,0,0.07)] transition-all duration-300 hover:bg-[#006B4F] hover:text-white"
                      >
                        <FiShoppingBag
                          size={17}
                          strokeWidth={1.8}
                        />
                      </button>
                    </div>

                    {/* Product Image */}
                    <img
                      src={image}
                      alt={name}
                      className="h-[245px] w-[92%] object-contain mix-blend-multiply transition-transform duration-500 ease-out group-hover:scale-[1.04] sm:h-[270px]"
                    />
                  </div>

                  {/* =========================================
                      PRODUCT DETAILS
                  ========================================= */}

                  <div className="flex flex-1 flex-col justify-center px-5 pb-6 pt-4 sm:px-5 sm:py-6 lg:px-6">

                    {/* Category */}
                    <p className="mb-1 text-[11px] font-medium text-[#737875]">
                      {deal.category || "Product"}
                    </p>

                    {/* Product Name */}
                    <h3
                      onClick={() =>
                        router.push(`/product/${id}`)
                      }
                      className="mb-2 cursor-pointer text-[17px] font-bold leading-[1.3] tracking-[-0.3px] text-[#111817] transition-colors duration-300 group-hover:text-[#006B4F] sm:text-[18px]"
                    >
                      {name}
                    </h3>

                    {/* Price */}
                    <div className="mb-3 flex items-center gap-2.5">

                      <span className="text-[21px] font-extrabold tracking-[-0.5px] text-[#111817]">
                        ${price.toFixed(2)}
                      </span>

                      {originalPrice > price && (
                        <span className="text-[14px] font-medium text-[#A3A5A4] line-through">
                          ${originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>

                    {/* Rating */}
                    <div className="mb-3 flex items-center gap-2">

                      <FiStar
                        size={18}
                        className="fill-[#F6B400] text-[#F6B400]"
                      />

                      <span className="text-[14px] font-semibold text-[#222625]">
                        {rating.toFixed(1)}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="mb-5 max-w-[285px] text-[12px] leading-[1.65] text-[#6B706E] sm:text-[11.5px]">
                      {deal.description ||
                        "Discover this amazing product with a special limited-time offer."}
                    </p>

                    {/* Shop Now */}
                    <button
                      type="button"
                      onClick={() =>
                        router.push(`/product/${id}`)
                      }
                      className="group/shop flex w-fit items-center gap-2 text-[12px] font-bold text-[#075B4C] transition-colors duration-300 hover:text-[#004B3F]"
                    >
                      <span>Shop Now</span>

                      <FiArrowRight
                        size={17}
                        strokeWidth={2}
                        className="transition-transform duration-300 group-hover/shop:translate-x-1"
                      />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}