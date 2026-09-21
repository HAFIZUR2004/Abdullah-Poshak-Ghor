"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  Maximize2,
  X,
  ChevronDown,
  Package,
  HelpCircle,
  Info,
  Palette,
  Layers,
  Ruler,
  ShieldCheck,
  Copy,
  Phone,
} from "lucide-react";
import { Product } from "@/types";
import ProductCard from "@/components/ProductCard";
import { useCart } from "@/context/CartContext";
import PremiumLoader from "@/components/PremiumLoader";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";

interface Showroom {
  _id: string;
  city: string;
  address: string;
  phone: string;
  location?: string;
}

// ─────────────────────────────────────────────
// Parse Color
// ─────────────────────────────────────────────

const parseColor = (colorStr: string) => {
  const match = colorStr.match(/^(.+?)\s*\((#[A-Fa-f0-9]{3,8})\)$/);

  if (match) {
    return {
      name: match[1].trim(),
      hex: match[2],
    };
  }

  return {
    name: colorStr,
    hex: "#CCCCCC",
  };
};

// ─────────────────────────────────────────────
// Discount Calculation Helper (FIXED)
// ─────────────────────────────────────────────

const getDiscountInfo = (
  product: any,
  currentPrice: number,
  basePrice: number
) => {
  const price = Number(currentPrice) || 0;
  const originalFromDB = Number(product.originalPrice) || 0;
  const discountPercentFromDB = Number(product.discount) || 0;

  // Case 1: DB তে originalPrice আছে — ratio scale করি
  if (originalFromDB > basePrice && basePrice > 0) {
    const ratio = originalFromDB / basePrice;
    const scaledOriginal = Math.round(price * ratio);
    const scaledDiscountPercent = Math.round(
      ((scaledOriginal - price) / scaledOriginal) * 100
    );

    return {
      hasDiscount: true,
      discountPercent: scaledDiscountPercent,
      originalPrice: scaledOriginal,
    };
  }

  // Case 2: DB তে discount % আছে
  if (discountPercentFromDB > 0 && discountPercentFromDB < 100) {
    const originalPrice = Math.round(
      price / (1 - discountPercentFromDB / 100)
    );

    return {
      hasDiscount: true,
      discountPercent: discountPercentFromDB,
      originalPrice,
    };
  }

  // Case 3: কোনো discount নেই
  return {
    hasDiscount: false,
    discountPercent: 0,
    originalPrice: price,
  };
};

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────

export default function ProductDetailsPage() {
  const params = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const [quantity, setQuantity] = useState(1);
  const [liked, setLiked] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  const [currentPrice, setCurrentPrice] = useState(0);
  const [basePrice, setBasePrice] = useState(0); // ✅ NEW: base price track করে

  const [openOption, setOpenOption] = useState<string | null>(null);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<
    "description" | "specs" | "reviews"
  >("description");

  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  const [showrooms, setShowrooms] = useState<Showroom[]>([]);
  const [showroomsLoading, setShowroomsLoading] = useState(true);

  const productId = params.id as string;

  // ─────────────────────────────────────────────
  // Fetch Product
  // ─────────────────────────────────────────────

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch("/api/products");

        if (res.ok) {
          const data = await res.json();

          let productArray: Product[] = [];

          if (Array.isArray(data)) {
            productArray = data;
          } else if (data?.success === true && Array.isArray(data.data)) {
            productArray = data.data;
          } else if (Array.isArray(data?.data)) {
            productArray = data.data;
          } else {
            setLoading(false);
            return;
          }

          const numericId = Number(productId);

          const foundProduct = productArray.find(
            (p: Product) =>
              p._id === productId ||
              (p.id !== undefined && p.id === numericId)
          ) as any;

          if (foundProduct) {
            setProduct(foundProduct);

            const baseP = Number(foundProduct.price) || 0;
            setBasePrice(baseP); // ✅ base price সেভ
            setCurrentPrice(baseP); // ✅ current price
            setActiveImage(0);

            if (foundProduct.materials?.[0]) {
              setSelectedMaterial(foundProduct.materials[0]);
            }

            if (foundProduct.colors?.[0]) {
              setSelectedColor(foundProduct.colors[0]);
            }

            if (foundProduct.sizes?.[0]) {
              setSelectedSize(foundProduct.sizes[0]);
            }

            const related = productArray
              .filter(
                (p: Product) =>
                  p.category === foundProduct.category &&
                  p._id !== productId &&
                  !(p.id !== undefined && p.id === numericId)
              )
              .slice(0, 4);

            setRelatedProducts(related);
          }
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  // ─────────────────────────────────────────────
  // Fetch Showrooms
  // ─────────────────────────────────────────────

  useEffect(() => {
    const fetchShowrooms = async () => {
      try {
        const res = await fetch("/api/showrooms", {
          cache: "no-store",
        });

        const data = await res.json();

        if (data?.success && Array.isArray(data.data)) {
          setShowrooms(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch showrooms:", error);
      } finally {
        setShowroomsLoading(false);
      }
    };

    fetchShowrooms();
  }, []);

  // ─────────────────────────────────────────────
  // Wishlist
  // ─────────────────────────────────────────────

  useEffect(() => {
    if (productId && typeof window !== "undefined") {
      const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
      setLiked(wishlist.includes(productId));
    }
  }, [productId]);

  const toggleWishlist = () => {
    if (!productId) return;

    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");

    let updatedWishlist;

    if (liked) {
      updatedWishlist = wishlist.filter((id: string) => id !== productId);
      setLiked(false);
      toast.success("Removed from wishlist");
    } else {
      updatedWishlist = [...wishlist, productId];
      setLiked(true);
      toast.success("Added to wishlist ❤️");
    }

    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
  };

  // ─────────────────────────────────────────────
  // Material Change (FIXED)
  // ─────────────────────────────────────────────

  const handleMaterialChange = (material: string) => {
    setSelectedMaterial(material);

    if (product) {
      const priceMatch = material.match(/৳\s*([\d,]+)/);

      if (priceMatch && priceMatch[1]) {
        const newPrice = parseFloat(priceMatch[1].replace(/,/g, ""));
        setCurrentPrice(newPrice);
      } else {
        // ✅ Base price এ ফিরে যাই — discount ও apply হবে
        setCurrentPrice(basePrice);
      }
    }

    setOpenOption(null);
  };

  // ─────────────────────────────────────────────
  // Add To Cart
  // ─────────────────────────────────────────────

  const handleAddToCart = () => {
    if (product) {
      const productToAdd = {
        ...product,
        price: currentPrice,
        selectedOptions: {
          material: selectedMaterial,
          color: selectedColor,
          size: selectedSize,
        },
        id: product.id ?? undefined,
      };

      addToCart(productToAdd, quantity);

      setShowSuccess(true);
      toast.success(`${quantity} item(s) added to cart!`);

      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  // ─────────────────────────────────────────────
  // Loading / Not Found
  // ─────────────────────────────────────────────

  if (loading) {
    return <PremiumLoader />;
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FDF6EE] flex flex-col items-center justify-center">
        <h1 className="text-xl font-semibold text-[#0B2523] mb-2">
          Product Not Found
        </h1>

        <Link href="/shop" className="text-[#0F3D39] underline text-sm">
          Back to Shop
        </Link>
      </div>
    );
  }

  // ─────────────────────────────────────────────
  // Product Data
  // ─────────────────────────────────────────────

  const productAny = product as any;

  // ✅ FIXED: main image first, then gallery (deduped)
  const imagesList: string[] = (() => {
    const main = productAny.image ? [productAny.image] : [];
    const gallery = Array.isArray(productAny.images)
      ? productAny.images.filter(
          (img: string) => img && img !== productAny.image
        )
      : [];
    const all = [...main, ...gallery];
    return all.length > 0 ? all : ["/placeholder.jpg"];
  })();

  const materialsList: string[] = productAny.materials?.length
    ? productAny.materials
    : ["VNR Finish", "PVC Finish", "Veneered Red Oak"];

  const colorsList: {
    name: string;
    hex: string;
  }[] = productAny.colors?.length
    ? productAny.colors.map(parseColor)
    : [
        { name: "Antique Walnut", hex: "#8B4513" },
        { name: "Natural Teak", hex: "#D2B48C" },
        { name: "Dark Brown", hex: "#654321" },
      ];

  const sizesList: string[] = productAny.sizes?.length
    ? productAny.sizes
    : ["Standard Size", "King Size"];

  // ✅ basePrice pass করা হচ্ছে
  const { hasDiscount, discountPercent, originalPrice } = getDiscountInfo(
    productAny,
    currentPrice,
    basePrice
  );

  return (
    <>
      <Navbar />

      <div className="bg-[#FDF6EE] min-h-screen pb-16">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Success Message */}
          {showSuccess && (
            <div className="fixed top-20 right-5 z-50 bg-[#0F3D39] text-[#E5D3B3] px-6 py-2.5 rounded shadow-lg text-sm">
              Added to cart successfully! 🛒
            </div>
          )}

          {/* MOBILE ONLY TITLE & PRICE HEADER */}
          <div className="lg:hidden border-b border-[#E5D3B3]/30 pb-3 mb-4">
            <h1 className="text-xl font-bold text-[#0B2523]">{product.name}</h1>

            <p className="text-xs text-[#0B2523]/50 mt-0.5 uppercase tracking-wider">
              SARENG-{product._id?.slice(-8)}
            </p>

            <div className="mt-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xl font-extrabold text-[#0F3D39]">
                  ৳ {currentPrice.toLocaleString("en-BD")}
                </span>

                {hasDiscount && (
                  <span className="bg-[#FF7A00] text-white text-[10px] font-bold px-2 py-1 rounded">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>

              {hasDiscount && (
                <div className="text-sm text-[#0F3D39]/50 line-through mt-1">
                  ৳ {originalPrice.toLocaleString("en-BD")}
                </div>
              )}
            </div>
          </div>

          {/* MAIN GRID */}
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* LEFT SIDE */}
            <div className="lg:col-span-7 space-y-4">
              {/* Image Container */}
              <div className="flex flex-col lg:flex-row gap-4 items-start">
                {/* Desktop Thumbnails */}
                {imagesList.length > 0 && (
                  <div className="hidden lg:flex flex-col gap-2.5 w-20 shrink-0">
                    {imagesList.map((img: string, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImage(idx)}
                        className={`h-20 w-full rounded border overflow-hidden transition-all ${
                          activeImage === idx
                            ? "border-2 border-[#0F3D39]"
                            : "border-[#E5D3B3]/30 opacity-70 hover:opacity-100"
                        }`}
                      >
                        <Image
                          src={img}
                          alt="Thumbnail"
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* Main Image */}
                <div className="w-full bg-[#FDF6EE] border border-[#E5D3B3]/30 rounded h-[320px] sm:h-[460px] md:h-[540px] relative flex items-center justify-center group overflow-hidden">
                  <Image
                    src={imagesList[activeImage]}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                  />

                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="absolute top-3 right-3 bg-white/90 border border-[#E5D3B3]/30 hover:bg-white p-2 rounded shadow-sm text-[#0B2523] transition"
                  >
                    <Maximize2 size={16} />
                  </button>
                </div>
                
              </div>

              {/* Disclaimer */}
              <div className="border border-[#E5D3B3]/30 rounded lg:ml-24 bg-[#FDF6EE] p-3.5 flex items-start gap-2.5 text-[#0B2523]/60 text-[11px] leading-relaxed">
                <Info size={16} className="shrink-0 text-[#0F3D39] mt-0.5" />

                <p>
                  Please note: Actual product color, fabric, finish, texture,
                  and appearance may slightly differ from the images shown due
                  to photography, lighting, device display settings, and natural
                  material variations.
                </p>
              </div>

              {/* Mobile Thumbnails */}
              {imagesList.length > 0 && (
                <div className="lg:hidden bg-[#FDF6EE] border border-[#E5D3B3]/30 p-2.5 rounded flex gap-2.5 overflow-x-auto scrollbar-none">
                  {imagesList.map((img: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`h-16 w-16 rounded border overflow-hidden shrink-0 transition-all ${
                        activeImage === idx
                          ? "border-2 border-[#0F3D39]"
                          : "border-white opacity-80 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`Thumbnail ${idx}`}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT SIDE */}
            <div className="lg:col-span-5 space-y-4">
              {/* DESKTOP ONLY TITLE & PRICE */}
              <div className="hidden lg:block border-b border-[#E5D3B3]/30 pb-3">
                <h1 className="text-xl md:text-2xl font-bold text-[#0B2523]">
                  {product.name}
                </h1>

                <p className="text-xs text-[#0B2523]/50 mt-0.5 uppercase tracking-wider">
                  SARENG-{product._id?.slice(-8)}
                </p>

                <div className="mt-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-2xl font-extrabold text-[#0F3D39]">
                      ৳ {currentPrice.toLocaleString("en-BD")}
                    </span>

                    {hasDiscount && (
                      <span className="bg-[#FF7A00] text-white text-xs font-bold px-2.5 py-1 rounded">
                        {discountPercent}% OFF
                      </span>
                    )}
                  </div>

                  {hasDiscount && (
                    <div className="text-sm text-[#0F3D39]/50 line-through mt-1">
                      ৳ {originalPrice.toLocaleString("en-BD")}
                    </div>
                  )}
                </div>
              </div>

              {/* COLLAPSIBLE OPTIONS */}
              <div className="border border-[#E5D3B3]/30 rounded divide-y divide-[#E5D3B3]/20 bg-white">
                {/* 1. Material */}
                <div>
                  <button
                    type="button"
                    onClick={() =>
                      setOpenOption(
                        openOption === "material" ? null : "material"
                      )
                    }
                    className="w-full p-3.5 flex items-center justify-between text-left hover:bg-[#FDF6EE] transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#0F3D39]/10 flex items-center justify-center">
                        <Layers size={16} className="text-[#0F3D39]" />
                      </div>

                      <div>
                        <div className="text-xs font-bold text-[#0B2523]">
                          Material
                        </div>

                        <div className="text-[11px] text-[#0B2523]/60 font-medium">
                          {selectedMaterial
                            ? selectedMaterial.split("(")[0].trim()
                            : "Select Material"}
                        </div>
                      </div>
                    </div>

                    <ChevronDown
                      size={16}
                      className={`text-[#0B2523]/40 transition-transform duration-200 ${
                        openOption === "material" ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {openOption === "material" && (
                    <div className="p-3 bg-[#FDF6EE] border-t border-[#E5D3B3]/20 flex flex-wrap gap-2">
                      {materialsList.map((m, i) => {
                        const cleanName = m.split("(")[0].trim();
                        const isSelected = selectedMaterial === m;

                        return (
                          <button
                            key={i}
                            type="button"
                            onClick={() => handleMaterialChange(m)}
                            className={`px-3 py-1.5 rounded text-xs transition border ${
                              isSelected
                                ? "bg-[#0F3D39] text-[#E5D3B3] border-[#0F3D39] font-semibold shadow-sm"
                                : "bg-white text-[#0B2523] border-[#E5D3B3]/40 hover:border-[#0F3D39] hover:text-[#0F3D39]"
                            }`}
                          >
                            {cleanName}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 2. Color */}
                <div>
                  <button
                    type="button"
                    onClick={() =>
                      setOpenOption(openOption === "color" ? null : "color")
                    }
                    className="w-full p-3.5 flex items-center justify-between text-left hover:bg-[#FDF6EE] transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#0F3D39]/10 flex items-center justify-center">
                        <Palette size={16} className="text-[#0F3D39]" />
                      </div>

                      <div>
                        <div className="text-xs font-bold text-[#0B2523]">
                          Color
                        </div>
                      </div>
                    </div>

                    <ChevronDown
                      size={16}
                      className={`text-[#0B2523]/40 transition-transform duration-200 ${
                        openOption === "color" ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {openOption === "color" && (
                    <div className="p-3 bg-[#FDF6EE] border-t border-[#E5D3B3]/20">
                      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                        {colorsList.map(
                          (c: { name: string; hex: string }, i: number) => {
                            const isSelected = selectedColor.includes(c.name);

                            return (
                              <button
                                key={i}
                                type="button"
                                title={c.name}
                                aria-label={c.name}
                                onClick={() => {
                                  const originalColor =
                                    productAny.colors?.find((col: string) =>
                                      col.includes(c.name)
                                    );

                                  setSelectedColor(originalColor || c.name);
                                  setOpenOption(null);
                                }}
                                className={`group overflow-hidden rounded-lg bg-white border text-left transition-all duration-200 flex items-center justify-center p-1 ${
                                  isSelected
                                    ? "border-2 border-[#0F3D39] shadow-sm"
                                    : "border-[#E5D3B3]/30 hover:border-[#0F3D39]"
                                }`}
                              >
                                <div
                                  className="w-full h-9 rounded-md border border-black/5"
                                  style={{
                                    backgroundColor: c.hex,
                                  }}
                                />
                              </button>
                            );
                          }
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Size */}
                <div>
                  <button
                    type="button"
                    onClick={() =>
                      setOpenOption(openOption === "size" ? null : "size")
                    }
                    className="w-full p-3.5 flex items-center justify-between text-left hover:bg-[#FDF6EE] transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#0F3D39]/10 flex items-center justify-center">
                        <Ruler size={16} className="text-[#0F3D39]" />
                      </div>

                      <div>
                        <div className="text-xs font-bold text-[#0B2523]">
                          Size
                        </div>

                        <div className="text-[11px] text-[#0B2523]/60 font-medium truncate max-w-[200px]">
                          {selectedSize
                            ? selectedSize.split("\n")[0].trim()
                            : "Select Size"}
                        </div>
                      </div>
                    </div>

                    <ChevronDown
                      size={16}
                      className={`text-[#0B2523]/40 transition-transform duration-200 ${
                        openOption === "size" ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {openOption === "size" && (
                    <div className="p-4 bg-[#FDF6EE] border-t border-[#E5D3B3]/20 space-y-2">
                      {sizesList.map((sz, index) => {
                        const isSelected = selectedSize === sz;

                        let rawLines: string[] = [];

                        if (typeof sz === "string") {
                          rawLines = sz
                            .split(/[\n|-]/)
                            .map((item) => item.trim())
                            .filter(Boolean);
                        }

                        const label = sz.includes(":")
                          ? sz.split(":")[0].trim()
                          : "";

                        return (
                          <div
                            key={index}
                            onClick={() => setSelectedSize(sz)}
                            className={`cursor-pointer rounded-xl border p-3 transition ${
                              isSelected
                                ? "border-[#0F3D39] bg-[#0F3D39]/5"
                                : "border-[#E5D3B3]/30 bg-white hover:border-[#0F3D39]/40"
                            }`}
                          >
                            {label && (
                              <p className="text-xs font-bold text-[#0B2523] mb-2">
                                {label}
                              </p>
                            )}

                            <div className="space-y-1.5">
                              {rawLines.map((lineItem, lineIndex) => {
                                const trimmedLine = lineItem.trim();

                                const unitMatch = trimmedLine.match(
                                  /(.*?)\s+(cm|mm|in|ft|m)$/i
                                );

                                let mainContent = trimmedLine;
                                let unitBadge = "";

                                if (unitMatch) {
                                  mainContent = unitMatch[1].trim();
                                  unitBadge = unitMatch[2].trim().toUpperCase();
                                }

                                return (
                                  <div
                                    key={lineIndex}
                                    className="flex items-center justify-between gap-3 bg-[#FDF6EE] rounded-lg px-3 py-2 border border-[#E5D3B3]/20"
                                  >
                                    <span className="text-xs font-medium text-[#0B2523] truncate min-w-0">
                                      {mainContent}
                                    </span>

                                    <div className="flex items-center gap-2 shrink-0">
                                      {unitBadge && (
                                        <span className="text-[11px] font-semibold text-[#0F3D39]/70 uppercase">
                                          {unitBadge}
                                        </span>
                                      )}

                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();

                                          navigator.clipboard.writeText(
                                            trimmedLine
                                          );

                                          toast.success("Copied!");
                                        }}
                                        className="text-[#0B2523]/40 hover:text-[#0F3D39] transition p-1"
                                      >
                                        <Copy size={14} />
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="bg-[#0F3D39] rounded text-[#E5D3B3] flex items-center overflow-hidden shadow-sm h-12">
                <div className="flex-1 px-3 text-center border-r border-[#E5D3B3]/20">
                  <div className="text-xs font-bold">
                    {(currentPrice * quantity).toLocaleString()} BDT
                  </div>
                </div>

                <button
                  type="button"
                  onClick={toggleWishlist}
                  className={`px-3.5 h-full flex items-center justify-center border-l border-[#E5D3B3]/20 hover:bg-[#0B2523] transition ${
                    liked ? "bg-[#0B2523]" : ""
                  }`}
                >
                  <Heart
                    size={18}
                    className={
                      liked ? "fill-[#E5D3B3] text-[#E5D3B3]" : "text-[#E5D3B3]"
                    }
                  />
                </button>
              </div>

              {/* Right Side Accordions */}
              <div className="space-y-2 pt-2">
                {/* Packaging */}
                <div className="border border-[#E5D3B3]/30 rounded bg-white">
                  <button
                    type="button"
                    onClick={() =>
                      setOpenAccordion(openAccordion === "pkg" ? null : "pkg")
                    }
                    className="w-full px-3.5 py-2.5 flex items-center justify-between text-xs font-medium text-[#0B2523]"
                  >
                    <span className="flex items-center gap-2">
                      <Package size={14} className="text-[#0F3D39]" />
                      Packaging Information
                    </span>

                    <ChevronDown
                      size={14}
                      className={`transition-transform ${
                        openAccordion === "pkg" ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {openAccordion === "pkg" && (
                    <div className="px-3.5 pb-3 text-xs text-[#0B2523]/60 border-t border-[#E5D3B3]/20 pt-2 whitespace-pre-line">
                      Delivered in secure packaging, with direct home delivery
                      and expert setup provided by our skilled technicians.
                    </div>
                  )}
                </div>

                {/* Need Help */}
                <div className="border border-[#E5D3B3]/30 rounded bg-white">
                  <button
                    type="button"
                    onClick={() =>
                      setOpenAccordion(openAccordion === "help" ? null : "help")
                    }
                    className="w-full px-3.5 py-2.5 flex items-center justify-between text-xs font-medium text-[#0B2523]"
                  >
                    <span className="flex items-center gap-2">
                      <HelpCircle size={14} className="text-[#0F3D39]" />
                      Need Help?
                    </span>

                    <ChevronDown
                      size={14}
                      className={`transition-transform ${
                        openAccordion === "help" ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {openAccordion === "help" && (
                    <div className="px-3.5 pb-3.5 text-xs text-[#0B2523]/60 border-t border-[#E5D3B3]/20 pt-3.5">
                      <p className="mb-3 font-semibold text-[#0B2523]">
                        Contact your nearest showroom:
                      </p>

                      {showroomsLoading ? (
                        <p className="text-[#0B2523]/50 text-xs py-2">
                          Loading showrooms...
                        </p>
                      ) : showrooms.length === 0 ? (
                        <p className="text-[#0B2523]/50 text-xs py-2">
                          No showrooms available.
                        </p>
                      ) : (
                        <div className="space-y-1.5">
                          {showrooms.map((room, index) => (
                            <div
                              key={room._id}
                              className="flex items-center justify-between py-1 border-b border-[#FDF6EE] last:border-0"
                            >
                              <span className="text-[#0B2523] font-medium">
                                {index + 1}. {room.city} Showroom
                              </span>

                              <a
                                href={`tel:${room.phone.replace(
                                  /[^\d+]/g,
                                  ""
                                )}`}
                                className="flex items-center gap-1.5 font-semibold text-[#0F3D39] hover:text-[#0B2523] transition-colors"
                              >
                                <Phone size={11} />
                                {room.phone}
                              </a>
                            </div>
                          ))}
                        </div>
                      )}

                      <p className="mt-3 pt-3 border-t border-[#E5D3B3]/20 text-[#0B2523]/60">
                        Or visit our nearest showroom for assistance.
                      </p>
                    </div>
                  )}
                </div>

                {/* Warranty */}
                <div className="border border-[#E5D3B3]/30 rounded bg-white">
                  <button
                    type="button"
                    onClick={() =>
                      setOpenAccordion(openAccordion === "war" ? null : "war")
                    }
                    className="w-full px-3.5 py-2.5 flex items-center justify-between text-xs font-medium text-[#0B2523]"
                  >
                    <span className="flex items-center gap-2">
                      <ShieldCheck size={14} className="text-[#0F3D39]" />
                      Warranty
                    </span>

                    <ChevronDown
                      size={14}
                      className={`transition-transform ${
                        openAccordion === "war" ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {openAccordion === "war" && (
                    <div className="px-3.5 pb-3 text-xs text-[#0B2523]/60 border-t border-[#E5D3B3]/20 pt-2 whitespace-pre-line">
                      {productAny.warrantyInfo?.trim() ||
                        "Includes 1-year service warranty covering manufacturing defects."}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* TABS SECTION */}
          <div className="mt-12 border border-[#E5D3B3]/30 rounded-xl bg-white overflow-hidden">
            <div className="flex border-b border-[#E5D3B3]/30 bg-[#FDF6EE]">
              <button
                type="button"
                onClick={() => setActiveTab("description")}
                className={`flex-1 py-3.5 px-4 text-sm font-semibold transition-colors border-b-2 ${
                  activeTab === "description"
                    ? "text-[#0F3D39] border-[#0F3D39] bg-white"
                    : "text-[#0B2523]/50 border-transparent hover:text-[#0F3D39]"
                }`}
              >
                Description
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("specs")}
                className={`flex-1 py-3.5 px-4 text-sm font-semibold transition-colors border-b-2 ${
                  activeTab === "specs"
                    ? "text-[#0F3D39] border-[#0F3D39] bg-white"
                    : "text-[#0B2523]/50 border-transparent hover:text-[#0F3D39]"
                }`}
              >
                Specifications
              </button>
            </div>

            <div className="p-6 bg-white">
              {/* ✅ DESCRIPTION — whitespace-pre-line দিয়ে space preserve */}
              {activeTab === "description" && (
                <div className="space-y-3 text-sm text-[#0B2523]/80 leading-relaxed">
                  {Array.isArray(product?.description) ? (
                    <ul className="space-y-3">
                      {product.description.map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#FF7A00] mt-2 shrink-0" />
                          <span className="whitespace-pre-line">{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : typeof product?.description === "string" &&
                    product.description.trim() !== "" ? (
                    <div className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF7A00] mt-2 shrink-0" />
                      <span className="whitespace-pre-line">
                        {product.description}
                      </span>
                    </div>
                  ) : (
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF7A00] mt-2 shrink-0" />
                        <span>
                          Crafted with precision using top-tier sustainable
                          materials to ensure superior structural stability and
                          long-lasting durability.
                        </span>
                      </li>

                      <li className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF7A00] mt-2 shrink-0" />
                        <span>
                          Made from high-quality raw materials for superior
                          durability.
                        </span>
                      </li>

                      <li className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF7A00] mt-2 shrink-0" />
                        <span>Indoor use only.</span>
                      </li>
                    </ul>
                  )}
                </div>
              )}

              {/* ✅ SPECIFICATIONS — Warranty dynamic */}
              {activeTab === "specs" && (
                <div className="overflow-hidden rounded-lg border border-[#E5D3B3]/30">
                  <table className="w-full text-sm">
                    <tbody>
                      {[
                        ["Material", selectedMaterial || "Premium Wood"],
                        [
                          "Color",
                          selectedColor
                            ? selectedColor
                                .replace(/\s*\(#[A-Fa-f0-9]{3,8}\)\s*$/, "")
                                .trim()
                            : "Multiple Options",
                        ],
                        ["Size", selectedSize || "Standard Size"],
                        ["Category", productAny.category || "Furniture"],
                        ["Brand", "Sareng"],
                        // ✅ Dynamic Warranty
                        [
                          "Warranty",
                          productAny.warrantyInfo?.trim() ||
                            "1 Year Service Warranty",
                        ],
                      ].map(([label, value], idx) => (
                        <tr
                          key={idx}
                          className={
                            idx % 2 === 0 ? "bg-[#FDF6EE]" : "bg-[#F4F5F7]"
                          }
                        >
                          <td className="w-1/3 px-4 py-3 font-semibold text-[#0B2523]">
                            {label}
                          </td>

                          <td className="px-4 py-3 text-[#0B2523]/70 whitespace-pre-line">
                            {value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* RELATED PRODUCTS */}
          {relatedProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-base font-bold text-[#0B2523] mb-4">
                Related Products in {product.category || "Same Category"}
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {relatedProducts.map((item) => (
                  <ProductCard key={item._id || item.id} product={item} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FULLSCREEN IMAGE ZOOM MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            className="absolute top-5 right-5 text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition"
          >
            <X size={20} />
          </button>

          <div className="relative w-full max-w-4xl h-[80vh]">
            <Image
              src={imagesList[activeImage]}
              alt={product.name}
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}