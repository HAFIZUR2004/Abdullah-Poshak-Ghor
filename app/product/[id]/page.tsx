"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingBag,
  Heart,
  Minus,
  Plus,
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
} from "lucide-react";
import { Product } from "@/types";
import ProductCard from "@/components/ProductCard";
import { useCart } from "@/context/CartContext";
import PremiumLoader from "@/components/PremiumLoader";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";

const parseColor = (colorStr: string) => {
  const match = colorStr.match(/^(.+?)\s*\((#\w+)\)$/);
  if (match) {
    return { name: match[1].trim(), hex: match[2] };
  }
  return { name: colorStr, hex: "#CCCCCC" };
};

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
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

  const [openOption, setOpenOption] = useState<string | null>(null);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const productId = params.id as string;

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
          } else if (data?.data && Array.isArray(data.data)) {
            productArray = data.data;
          } else {
            setLoading(false);
            return;
          }

          const numericId = Number(productId);
          const foundProduct = productArray.find(
            (p: Product) =>
              p._id === productId || (p.id !== undefined && p.id === numericId)
          ) as any;

          if (foundProduct) {
            setProduct(foundProduct);
            setCurrentPrice(foundProduct.price);
            setActiveImage(0);

            if (foundProduct.materials?.[0])
              setSelectedMaterial(foundProduct.materials[0]);
            if (foundProduct.colors?.[0])
              setSelectedColor(foundProduct.colors[0]);
            if (foundProduct.sizes?.[0]) setSelectedSize(foundProduct.sizes[0]);

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

  const handleMaterialChange = (material: string) => {
    setSelectedMaterial(material);

    if (product) {
      const priceMatch = material.match(/৳\s*([\d,]+)/);

      if (priceMatch && priceMatch[1]) {
        setCurrentPrice(parseFloat(priceMatch[1].replace(/,/g, "")));
      } else {
        setCurrentPrice(product.price);
      }
    }

    setOpenOption(null);
  };

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

  if (loading) return <PremiumLoader />;

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F9F6F0] flex flex-col items-center justify-center">
        <h1 className="text-xl font-semibold text-[#1E293B] mb-2">
          Product Not Found
        </h1>
        <Link href="/shop" className="text-[#0D9488] underline text-sm">
          Back to Shop
        </Link>
      </div>
    );
  }

  const productAny = product as any;

  const imagesList: string[] =
    productAny.images && productAny.images.length > 0
      ? productAny.images
      : productAny.image
        ? [productAny.image]
        : ["/placeholder.jpg"];

  const materialsList: string[] = productAny.materials?.length
    ? productAny.materials
    : ["VNR Finish", "PVC Finish", "Veneered Red Oak"];

  const colorsList: { name: string; hex: string }[] = productAny.colors?.length
    ? productAny.colors.map(parseColor)
    : [
        { name: "Antique Walnut", hex: "#8B4513" },
        { name: "Natural Teak", hex: "#D2B48C" },
        { name: "Dark Brown", hex: "#654321" },
      ];

  const sizesList: string[] = productAny.sizes?.length
    ? productAny.sizes
    : ["Standard Size", "King Size"];

  return (
    <>
      <Navbar />
      <div className="bg-[#F9F6F0] min-h-screen pb-16">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {showSuccess && (
            <div className="fixed top-20 right-5 z-50 bg-[#0D9488] text-white px-6 py-2.5 rounded shadow-lg text-sm">
              Added to cart successfully! 🛒
            </div>
          )}

          {/* MOBILE ONLY TITLE & PRICE HEADER */}
          <div className="lg:hidden border-b border-[#E2DCD3] pb-3 mb-4">
            <h1 className="text-xl font-bold text-[#1E293B]">
              {product.name}
            </h1>
            <p className="text-xs text-[#94A3B8] mt-0.5 uppercase tracking-wider">
              SARENG-{product._id?.slice(-8)}
            </p>
            <p className="text-lg font-bold text-[#0D9488] mt-1.5">
              {currentPrice.toLocaleString()} BDT
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* LEFT SIDE (PRODUCT IMAGES & DISCLAIMER) */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Image Container Wrap */}
              <div className="flex flex-col lg:flex-row gap-4 items-start">
                
                {/* Desktop Vertical Thumbnails */}
                {imagesList.length > 0 && (
                  <div className="hidden lg:flex flex-col gap-2.5 w-20 shrink-0">
                    {imagesList.map((img: string, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImage(idx)}
                        className={`h-20 w-full rounded border overflow-hidden transition-all ${
                          activeImage === idx
                            ? "border-[#0D9488] ring-1 ring-[#0D9488]"
                            : "border-[#E2DCD3] opacity-70 hover:opacity-100"
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

                {/* Main Big Image - Explicit Width Fix */}
                <div className="w-full bg-[#F0EBE3] border border-[#E2DCD3] rounded h-[320px] sm:h-[460px] md:h-[540px] relative flex items-center justify-center group overflow-hidden">
                  <Image
                    src={imagesList[activeImage]}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                  />
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="absolute top-3 right-3 bg-white/90 border border-[#E2DCD3] hover:bg-white p-2 rounded shadow-sm text-[#1E293B] transition"
                  >
                    <Maximize2 size={16} />
                  </button>
                </div>
              </div>

              {/* Disclaimer Info Box */}
              <div className="border border-[#E2DCD3] rounded lg:ml-24 bg-[#F0EBE3] p-3.5 flex items-start gap-2.5 text-[#64748B] text-[11px] leading-relaxed">
                <Info size={16} className="shrink-0 text-[#0D9488] mt-0.5" />
                <p>
                  Please note: Actual product color, fabric, finish, texture, and appearance may slightly differ from the images shown due to photography, lighting, device display settings, and natural material variations.
                </p>
              </div>

              {/* Mobile Horizontal Thumbnails */}
              {imagesList.length > 0 && (
                <div className="lg:hidden bg-[#F0EBE3] border border-[#E2DCD3] p-2.5 rounded flex gap-2.5 overflow-x-auto scrollbar-none">
                  {imagesList.map((img: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`h-16 w-16 rounded border overflow-hidden shrink-0 transition-all ${
                        activeImage === idx
                          ? "border-[#0D9488] ring-2 ring-[#0D9488]/30"
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

            {/* RIGHT SIDE (OPTIONS & DETAILS) */}
            <div className="lg:col-span-5 space-y-4">
              {/* DESKTOP ONLY TITLE & PRICE HEADER */}
              <div className="hidden lg:block border-b border-[#E2DCD3] pb-3">
                <h1 className="text-xl md:text-2xl font-bold text-[#1E293B]">
                  {product.name}
                </h1>
                <p className="text-xs text-[#94A3B8] mt-0.5 uppercase tracking-wider">
                  SARENG-{product._id?.slice(-8)}
                </p>
                <p className="text-lg font-bold text-[#0D9488] mt-1.5">
                  {currentPrice.toLocaleString()} BDT
                </p>
              </div>

              {/* COLLAPSIBLE OPTIONS */}
              <div className="border border-[#E2DCD3] rounded divide-y divide-[#EEE8E0] bg-white">
                {/* 1. Material Collapsible */}
                <div>
                  <button
                    type="button"
                    onClick={() => setOpenOption(openOption === "material" ? null : "material")}
                    className="w-full p-3.5 flex items-center justify-between text-left hover:bg-[#F9F6F0] transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#0D9488]/10 flex items-center justify-center">
                        <Layers size={16} className="text-[#0D9488]" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#1E293B]">Material</div>
                        <div className="text-[11px] text-[#64748B] font-medium">
                          {selectedMaterial ? selectedMaterial.split("(")[0].trim() : "Select Material"}
                        </div>
                      </div>
                    </div>
                    <ChevronDown
                      size={16}
                      className={`text-[#94A3B8] transition-transform duration-200 ${
                        openOption === "material" ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {openOption === "material" && (
                    <div className="p-3 bg-[#F9F6F0] border-t border-[#EEE8E0] flex flex-wrap gap-2">
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
                                ? "bg-[#0D9488] text-white border-[#0D9488] font-semibold shadow-sm"
                                : "bg-white text-[#1E293B] border-[#E2DCD3] hover:border-[#0D9488] hover:text-[#0D9488]"
                            }`}
                          >
                            {cleanName}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 2. Color Collapsible */}
                <div>
                  <button
                    type="button"
                    onClick={() =>
                      setOpenOption(openOption === "color" ? null : "color")
                    }
                    className="w-full p-3.5 flex items-center justify-between text-left hover:bg-[#F9F6F0] transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#0D9488]/10 flex items-center justify-center">
                        <Palette size={16} className="text-[#0D9488]" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#1E293B]">Color</div>
                      </div>
                    </div>
                    <ChevronDown
                      size={16}
                      className={`text-[#94A3B8] transition-transform duration-200 ${
                        openOption === "color" ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {openOption === "color" && (
                    <div className="p-3 bg-[#F9F6F0] border-t border-[#EEE8E0]">
                      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                        {colorsList.map((c: { name: string; hex: string }, i: number) => {
                          const isSelected = selectedColor.includes(c.name);

                          return (
                            <button
                              key={i}
                              type="button"
                              title={c.name}
                              aria-label={c.name}
                              onClick={() => {
                                const originalColor = productAny.colors?.find((col: string) =>
                                  col.includes(c.name)
                                );

                                setSelectedColor(originalColor || c.name);
                                setOpenOption(null);
                              }}
                              className={`group overflow-hidden rounded-lg bg-white border text-left transition-all duration-200 flex items-center justify-center p-1 ${
                                isSelected
                                  ? "border-[#0D9488] ring-1 ring-[#0D9488] shadow-sm"
                                  : "border-[#E2DCD3] hover:border-[#0D9488]"
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
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Size Collapsible */}
                <div>
                  <button
                    type="button"
                    onClick={() => setOpenOption(openOption === "size" ? null : "size")}
                    className="w-full p-3.5 flex items-center justify-between text-left hover:bg-[#F9F6F0] transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#0D9488]/10 flex items-center justify-center">
                        <Ruler size={16} className="text-[#0D9488]" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#1E293B]">Size</div>
                        <div className="text-[11px] text-[#64748B] font-medium truncate max-w-[200px]">
                          {selectedSize ? selectedSize.split("\n")[0].trim() : "Select Size"}
                        </div>
                      </div>
                    </div>
                    <ChevronDown
                      size={16}
                      className={`text-[#94A3B8] transition-transform duration-200 ${
                        openOption === "size" ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {openOption === "size" && (
                    <div className="p-4 bg-[#F9F6F0] border-t border-[#EEE8E0] space-y-2">
                      {sizesList.map((sz, index) => {
                        const isSelected = selectedSize === sz;

                        let lines: string[] = [];
                        if (typeof sz === "string") {
                          lines = sz.split("\n").filter(Boolean);
                          if (lines.length <= 1 && sz.includes("|")) {
                            lines = sz.split("|").filter(Boolean);
                          }
                        }

                        const label = sz.includes(":") ? sz.split(":")[0].trim() : "";

                        return (
                          <div
                            key={index}
                            className={`rounded-xl border p-3 transition ${
                              isSelected
                                ? "border-[#0D9488] bg-[#0D9488]/5"
                                : "border-[#E2DCD3] bg-white"
                            }`}
                          >
                            {label && (
                              <p className="text-xs font-bold text-[#1E293B] mb-2">
                                {label}
                              </p>
                            )}

                            <div className="space-y-1.5">
                              {lines.map((line, lineIndex) => {
                                const trimmedLine = line.trim();
                                
                                return (
                                  <div
                                    key={lineIndex}
                                    className="flex items-center justify-between bg-[#F9F6F0] rounded-lg px-3 py-2 border border-[#E2DCD3]"
                                  >
                                    <span className="text-xs font-medium text-[#1E293B]">
                                      {trimmedLine}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        navigator.clipboard.writeText(trimmedLine);
                                        toast.success("Copied!");
                                      }}
                                      className="text-[#94A3B8] hover:text-[#0D9488] transition"
                                    >
                                      <Copy size={14} />
                                    </button>
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

              {/* Quantity Counter */}
              <div className="flex items-center justify-between border border-[#E2DCD3] rounded p-2.5 bg-white">
                <span className="text-xs font-semibold text-[#1E293B]">Quantity</span>
                <div className="flex items-center border border-[#E2DCD3] rounded overflow-hidden w-28 h-8">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-full flex items-center justify-center hover:bg-[#F9F6F0] text-[#1E293B]"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="flex-1 text-center text-xs font-semibold text-[#1E293B]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-full flex items-center justify-center hover:bg-[#F9F6F0] text-[#1E293B]"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="bg-[#1E293B] rounded text-white flex items-center overflow-hidden shadow-sm h-12">
                <div className="flex-1 px-3 text-center border-r border-[#334155]">
                  <div className="text-xs font-bold">
                    {(currentPrice * quantity).toLocaleString()} BDT
                  </div>
                  <div className="text-[9px] opacity-90">
                    {currentPrice.toLocaleString()} x {quantity}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-1.5 font-semibold text-xs h-full hover:bg-[#0D9488] transition"
                >
                  <ShoppingBag size={15} /> Add to Cart
                </button>

                <button
                  type="button"
                  onClick={toggleWishlist}
                  className={`px-3.5 h-full flex items-center justify-center border-l border-[#334155] hover:bg-[#0D9488] transition ${
                    liked ? "bg-[#0D9488]" : ""
                  }`}
                >
                  <Heart
                    size={18}
                    className={liked ? "fill-white text-white" : "text-white"}
                  />
                </button>
              </div>

              {/* EMI Banner */}
              <div className="bg-[#0D9488]/10 border border-[#0D9488]/20 text-[#0D9488] rounded p-2.5 text-center text-xs font-bold">
                EMI starts from{" "}
                {Math.round((currentPrice * quantity) / 12).toLocaleString()}{" "}
                BDT/month
              </div>

              {/* Right Side Accordions */}
              <div className="space-y-2 pt-2">
                <div className="border border-[#E2DCD3] rounded bg-white">
                  <button
                    type="button"
                    onClick={() => setOpenAccordion(openAccordion === "pkg" ? null : "pkg")}
                    className="w-full px-3.5 py-2.5 flex items-center justify-between text-xs font-medium text-[#1E293B]"
                  >
                    <span className="flex items-center gap-2">
                      <Package size={14} className="text-[#0D9488]" /> Packaging Information
                    </span>
                    <ChevronDown
                      size={14}
                      className={`transition-transform ${openAccordion === "pkg" ? "rotate-180" : ""}`}
                    />
                  </button>
                  {openAccordion === "pkg" && (
                    <div className="px-3.5 pb-3 text-xs text-[#64748B] border-t border-[#EEE8E0] pt-2">
                      Flat-pack delivery with heavy-duty corrugated cardboard protection.
                    </div>
                  )}
                </div>

                <div className="border border-[#E2DCD3] rounded bg-white">
                  <button
                    type="button"
                    onClick={() => setOpenAccordion(openAccordion === "help" ? null : "help")}
                    className="w-full px-3.5 py-2.5 flex items-center justify-between text-xs font-medium text-[#1E293B]"
                  >
                    <span className="flex items-center gap-2">
                      <HelpCircle size={14} className="text-[#0D9488]" /> Need Help?
                    </span>
                    <ChevronDown
                      size={14}
                      className={`transition-transform ${openAccordion === "help" ? "rotate-180" : ""}`}
                    />
                  </button>
                  {openAccordion === "help" && (
                    <div className="px-3.5 pb-3 text-xs text-[#64748B] border-t border-[#EEE8E0] pt-2">
                      Contact our support hotline or visit our nearest showroom for assistance.
                    </div>
                  )}
                </div>

                {/* Warranty Section */}
                <div className="border border-[#E2DCD3] rounded bg-white">
                  <button
                    type="button"
                    onClick={() => setOpenAccordion(openAccordion === "war" ? null : "war")}
                    className="w-full px-3.5 py-2.5 flex items-center justify-between text-xs font-medium text-[#1E293B]"
                  >
                    <span className="flex items-center gap-2">
                      <ShieldCheck size={14} className="text-[#0D9488]" /> 
                      Warranty
                    </span>
                    <ChevronDown
                      size={14}
                      className={`transition-transform ${openAccordion === "war" ? "rotate-180" : ""}`}
                    />
                  </button>
                  
                  {openAccordion === "war" && (
                    <div className="px-3.5 pb-3 text-xs text-[#64748B] border-t border-[#EEE8E0] pt-2">
                      {productAny.warrantyInfo || "Includes 1-year service warranty covering manufacturing defects."}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ABOUT THIS ITEM */}
          <div className="mt-16 border-t border-[#E2DCD3] pt-10 space-y-10">
            <div>
              <h3 className="text-base font-bold text-[#1E293B] mb-3 uppercase tracking-wider">
                About this item
              </h3>
              <ul className="space-y-2 text-sm text-[#1E293B] leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0D9488] mt-2 shrink-0"></span>
                  <span>
                    {product.description ||
                      "Crafted with precision using top-tier sustainable materials to ensure superior structural stability and long-lasting durability."}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* RELATED PRODUCTS */}
          {relatedProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-base font-bold text-[#1E293B] mb-4">
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