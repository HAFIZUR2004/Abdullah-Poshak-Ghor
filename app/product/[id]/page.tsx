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
  Phone,
  Star,
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
  const [descriptionOpen, setDescriptionOpen] = useState(false);
  const [openOption, setOpenOption] = useState<string | null>(null);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"description" | "specs" | "reviews">("description");

  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const productId = params.id as string;

  // Mock review data
  const mockReviews = [
    { name: "Rahim Ahmed", rating: 5, date: "2024-12-15", comment: "Excellent quality! The wood finish is beautiful and installation was easy." },
    { name: "Nusrat Jahan", rating: 4, date: "2024-11-28", comment: "Very good product for the price. Delivery was slightly delayed though." },
    { name: "Tanvir Hasan", rating: 5, date: "2024-10-10", comment: "Premium feel and finish. Highly recommended for anyone looking for quality furniture." },
  ];

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
      <div className="bg-[#FDF6EE] min-h-screen pb-16">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {showSuccess && (
            <div className="fixed top-20 right-5 z-50 bg-[#0F3D39] text-[#E5D3B3] px-6 py-2.5 rounded shadow-lg text-sm">
              Added to cart successfully! 🛒
            </div>
          )}

          {/* MOBILE ONLY TITLE & PRICE HEADER */}
          <div className="lg:hidden border-b border-[#E5D3B3]/30 pb-3 mb-4">
            <h1 className="text-xl font-bold text-[#0B2523]">
              {product.name}
            </h1>
            <p className="text-xs text-[#0B2523]/50 mt-0.5 uppercase tracking-wider">
              SARENG-{product._id?.slice(-8)}
            </p>
            <p className="text-lg font-bold text-[#0F3D39] mt-1.5">
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

                {/* Main Big Image */}
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

              {/* Disclaimer Info Box */}
              <div className="border border-[#E5D3B3]/30 rounded lg:ml-24 bg-[#FDF6EE] p-3.5 flex items-start gap-2.5 text-[#0B2523]/60 text-[11px] leading-relaxed">
                <Info size={16} className="shrink-0 text-[#0F3D39] mt-0.5" />
                <p>
                  Please note: Actual product color, fabric, finish, texture, and appearance may slightly differ from the images shown due to photography, lighting, device display settings, and natural material variations.
                </p>
              </div>

              {/* Mobile Horizontal Thumbnails */}
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

            {/* RIGHT SIDE (OPTIONS & DETAILS) */}
            <div className="lg:col-span-5 space-y-4">
              {/* DESKTOP ONLY TITLE & PRICE HEADER */}
              <div className="hidden lg:block border-b border-[#E5D3B3]/30 pb-3">
                <h1 className="text-xl md:text-2xl font-bold text-[#0B2523]">
                  {product.name}
                </h1>
                <p className="text-xs text-[#0B2523]/50 mt-0.5 uppercase tracking-wider">
                  SARENG-{product._id?.slice(-8)}
                </p>
                <p className="text-lg font-bold text-[#0F3D39] mt-1.5">
                  {currentPrice.toLocaleString()} BDT
                </p>
              </div>

              {/* COLLAPSIBLE OPTIONS */}
              <div className="border border-[#E5D3B3]/30 rounded divide-y divide-[#E5D3B3]/20 bg-white">
                {/* 1. Material Collapsible */}
                <div>
                  <button
                    type="button"
                    onClick={() => setOpenOption(openOption === "material" ? null : "material")}
                    className="w-full p-3.5 flex items-center justify-between text-left hover:bg-[#FDF6EE] transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#0F3D39]/10 flex items-center justify-center">
                        <Layers size={16} className="text-[#0F3D39]" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#0B2523]">Material</div>
                        <div className="text-[11px] text-[#0B2523]/60 font-medium">
                          {selectedMaterial ? selectedMaterial.split("(")[0].trim() : "Select Material"}
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

                {/* 2. Color Collapsible */}
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
                        <div className="text-xs font-bold text-[#0B2523]">Color</div>
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
                    className="w-full p-3.5 flex items-center justify-between text-left hover:bg-[#FDF6EE] transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#0F3D39]/10 flex items-center justify-center">
                        <Ruler size={16} className="text-[#0F3D39]" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#0B2523]">Size</div>
                        <div className="text-[11px] text-[#0B2523]/60 font-medium truncate max-w-[200px]">
                          {selectedSize ? selectedSize.split("\n")[0].trim() : "Select Size"}
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
                                ? "border-[#0F3D39] bg-[#0F3D39]/5"
                                : "border-[#E5D3B3]/30 bg-white"
                            }`}
                          >
                            {label && (
                              <p className="text-xs font-bold text-[#0B2523] mb-2">
                                {label}
                              </p>
                            )}

                            <div className="space-y-1.5">
                              {lines.map((line, lineIndex) => {
                                const trimmedLine = line.trim();
                                
                                return (
                                  <div
                                    key={lineIndex}
                                    className="flex items-center justify-between bg-[#FDF6EE] rounded-lg px-3 py-2 border border-[#E5D3B3]/20"
                                  >
                                    <span className="text-xs font-medium text-[#0B2523]">
                                      {trimmedLine}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        navigator.clipboard.writeText(trimmedLine);
                                        toast.success("Copied!");
                                      }}
                                      className="text-[#0B2523]/40 hover:text-[#0F3D39] transition"
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
              <div className="flex items-center justify-between bg-white border border-[#E5D3B3]/30 rounded px-4 py-3">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 bg-[#FDF6EE] border border-[#E5D3B3]/30 rounded flex items-center justify-center text-[#0B2523] hover:bg-[#0F3D39] hover:text-[#E5D3B3] transition"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-sm font-bold text-[#0B2523] w-8 text-center">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 bg-[#FDF6EE] border border-[#E5D3B3]/30 rounded flex items-center justify-center text-[#0B2523] hover:bg-[#0F3D39] hover:text-[#E5D3B3] transition"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <div className="text-xs text-[#0B2523]/60 font-medium">Quantity</div>
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
                  onClick={handleAddToCart}
                  className="flex-1 h-full flex items-center justify-center gap-2 hover:bg-[#0B2523] transition"
                >
                  <ShoppingBag size={16} />
                  <span className="text-xs font-bold uppercase tracking-wider">Add to Cart</span>
                </button>

                <button
                  type="button"
                  onClick={toggleWishlist}
                  className={`px-3.5 h-full flex items-center justify-center border-l border-[#E5D3B3]/20 hover:bg-[#0B2523] transition ${
                    liked ? "bg-[#0B2523]" : ""
                  }`}
                >
                  <Heart
                    size={18}
                    className={liked ? "fill-[#E5D3B3] text-[#E5D3B3]" : "text-[#E5D3B3]"}
                  />
                </button>
              </div>

              {/* EMI Banner */}
              <div className="bg-[#FF7A00]/10 border border-[#FF7A00]/30 text-[#0B2523] rounded p-2.5 text-center text-xs font-bold">
                EMI starts from{" "}
                {Math.round((currentPrice * quantity) / 12).toLocaleString()}{" "}
                BDT/month
              </div>

              {/* Right Side Accordions */}
              <div className="space-y-2 pt-2">
                <div className="border border-[#E5D3B3]/30 rounded bg-white">
                  <button
                    type="button"
                    onClick={() => setOpenAccordion(openAccordion === "pkg" ? null : "pkg")}
                    className="w-full px-3.5 py-2.5 flex items-center justify-between text-xs font-medium text-[#0B2523]"
                  >
                    <span className="flex items-center gap-2">
                      <Package size={14} className="text-[#0F3D39]" /> Packaging Information
                    </span>
                    <ChevronDown
                      size={14}
                      className={`transition-transform ${openAccordion === "pkg" ? "rotate-180" : ""}`}
                    />
                  </button>
                  {openAccordion === "pkg" && (
                    <div className="px-3.5 pb-3 text-xs text-[#0B2523]/60 border-t border-[#E5D3B3]/20 pt-2">
                      Flat-pack delivery with heavy-duty corrugated cardboard protection.
                    </div>
                  )}
                </div>

                {/* Need Help Section */}
                <div className="border border-[#E5D3B3]/30 rounded bg-white">
                  <button
                    type="button"
                    onClick={() => setOpenAccordion(openAccordion === "help" ? null : "help")}
                    className="w-full px-3.5 py-2.5 flex items-center justify-between text-xs font-medium text-[#0B2523]"
                  >
                    <span className="flex items-center gap-2">
                      <HelpCircle size={14} className="text-[#0F3D39]" /> Need Help?
                    </span>
                    <ChevronDown
                      size={14}
                      className={`transition-transform ${openAccordion === "help" ? "rotate-180" : ""}`}
                    />
                  </button>
                  
                  {openAccordion === "help" && (
                    <div className="px-3.5 pb-3.5 text-xs text-[#0B2523]/60 border-t border-[#E5D3B3]/20 pt-3.5">
                      
                      {/* Showroom Contact Info */}
                      <p className="mb-3 font-semibold text-[#0B2523]">
                        Contact your nearest showroom:
                      </p>
                      
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between py-1 border-b border-[#FDF6EE] last:border-0">
                          <span className="text-[#0B2523]">1. Dhanmondi Branch</span>
                          <a href="tel:+8801711000001" className="flex items-center gap-1.5 font-semibold text-[#0F3D39] hover:text-[#0B2523] transition-colors">
                            <Phone size={11} /> +880 1711-000001
                          </a>
                        </div>
                        <div className="flex items-center justify-between py-1 border-b border-[#FDF6EE] last:border-0">
                          <span className="text-[#0B2523]">2. Gulshan Branch</span>
                          <a href="tel:+8801711000002" className="flex items-center gap-1.5 font-semibold text-[#0F3D39] hover:text-[#0B2523] transition-colors">
                            <Phone size={11} /> +880 1711-000002
                          </a>
                        </div>
                        <div className="flex items-center justify-between py-1 border-b border-[#FDF6EE] last:border-0">
                          <span className="text-[#0B2523]">3. Uttara Branch</span>
                          <a href="tel:+8801711000003" className="flex items-center gap-1.5 font-semibold text-[#0F3D39] hover:text-[#0B2523] transition-colors">
                            <Phone size={11} /> +880 1711-000003
                          </a>
                        </div>
                        <div className="flex items-center justify-between py-1 border-b border-[#FDF6EE] last:border-0">
                          <span className="text-[#0B2523]">4. Banani Branch</span>
                          <a href="tel:+8801711000004" className="flex items-center gap-1.5 font-semibold text-[#0F3D39] hover:text-[#0B2523] transition-colors">
                            <Phone size={11} /> +880 1711-000004
                          </a>
                        </div>
                        <div className="flex items-center justify-between py-1 border-b border-[#FDF6EE] last:border-0">
                          <span className="text-[#0B2523]">5. Mirpur Branch</span>
                          <a href="tel:+8801711000005" className="flex items-center gap-1.5 font-semibold text-[#0F3D39] hover:text-[#0B2523] transition-colors">
                            <Phone size={11} /> +880 1711-000005
                          </a>
                        </div>
                        <div className="flex items-center justify-between py-1 border-b border-[#FDF6EE] last:border-0">
                          <span className="text-[#0B2523]">6. Chattogram Branch</span>
                          <a href="tel:+8801711000006" className="flex items-center gap-1.5 font-semibold text-[#0F3D39] hover:text-[#0B2523] transition-colors">
                            <Phone size={11} /> +880 1711-000006
                          </a>
                        </div>
                      </div>

                      {/* Bottom Text */}
                      <p className="mt-3 pt-3 border-t border-[#E5D3B3]/20 text-[#0B2523]/60">
                        Or visit our nearest showroom for assistance.
                      </p>
                    </div>
                  )}
                </div>
                {/* Warranty Section */}
                <div className="border border-[#E5D3B3]/30 rounded bg-white">
                  <button
                    type="button"
                    onClick={() => setOpenAccordion(openAccordion === "war" ? null : "war")}
                    className="w-full px-3.5 py-2.5 flex items-center justify-between text-xs font-medium text-[#0B2523]"
                  >
                    <span className="flex items-center gap-2">
                      <ShieldCheck size={14} className="text-[#0F3D39]" /> 
                      Warranty
                    </span>
                    <ChevronDown
                      size={14}
                      className={`transition-transform ${openAccordion === "war" ? "rotate-180" : ""}`}
                    />
                  </button>
                  
                  {openAccordion === "war" && (
                    <div className="px-3.5 pb-3 text-xs text-[#0B2523]/60 border-t border-[#E5D3B3]/20 pt-2">
                      {productAny.warrantyInfo || "Includes 1-year service warranty covering manufacturing defects."}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ABOUT THIS ITEM & FEATURES ACCORDION */}
          <div className="w-full mt-10 border-y border border-[#E5D3B3]/30">
            {/* Accordion Header */}
            <button
              type="button"
              onClick={() => setDescriptionOpen(!descriptionOpen)}
              className="w-full flex items-center justify-between py-4 px-1 text-left transition-colors hover:opacity-80 focus:outline-none"
            >
              <span className="text-sm pl-4 font-semibold text-[#0B2523]">
                Features
              </span>
              <ChevronDown
                size={18}
                className={`text-[#0B2523]/40 transition-transform duration-200 ${
                  descriptionOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Accordion Content */}
            {descriptionOpen && (
              <div className="pb-6 pt-1 px-1 space-y-3 text-sm text-[#0B2523] leading-relaxed">
                {/* Dynamic Data Handling */}
                {Array.isArray(product?.description) ? (
                  <ul className="space-y-2">
                    {product.description.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF7A00] mt-2 shrink-0"></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : typeof product?.description === "string" && product.description.trim() !== "" ? (
                  <div className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF7A00] mt-2 shrink-0"></span>
                    <span>{product.description}</span>
                  </div>
                ) : (
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF7A00] mt-2 shrink-0"></span>
                      <span>
                        Crafted with precision using top-tier sustainable materials to ensure superior structural stability and long-lasting durability.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF7A00] mt-2 shrink-0"></span>
                      <span>Made from high-quality raw materials for superior durability.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF7A00] mt-2 shrink-0"></span>
                      <span>Indoor use only.</span>
                    </li>
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* TABS SECTION */}
          <div className="mt-12 border border-[#E5D3B3]/30 rounded-xl bg-white overflow-hidden">
            {/* Tab Headers */}
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
              <button
                type="button"
                onClick={() => setActiveTab("reviews")}
                className={`flex-1 py-3.5 px-4 text-sm font-semibold transition-colors border-b-2 ${
                  activeTab === "reviews"
                    ? "text-[#0F3D39] border-[#0F3D39] bg-white"
                    : "text-[#0B2523]/50 border-transparent hover:text-[#0F3D39]"
                }`}
              >
                Reviews
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-6 bg-white">
              {/* Description Tab */}
              {activeTab === "description" && (
                <div className="space-y-3 text-sm text-[#0B2523]/80 leading-relaxed">
                  {Array.isArray(product?.description) ? (
                    <ul className="space-y-3">
                      {product.description.map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#FF7A00] mt-2 shrink-0"></span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : typeof product?.description === "string" && product.description.trim() !== "" ? (
                    <div className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF7A00] mt-2 shrink-0"></span>
                      <span>{product.description}</span>
                    </div>
                  ) : (
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF7A00] mt-2 shrink-0"></span>
                        <span>Crafted with precision using top-tier sustainable materials to ensure superior structural stability and long-lasting durability.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF7A00] mt-2 shrink-0"></span>
                        <span>Made from high-quality raw materials for superior durability.</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF7A00] mt-2 shrink-0"></span>
                        <span>Indoor use only.</span>
                      </li>
                    </ul>
                  )}
                </div>
              )}

              {/* Specifications Tab */}
              {activeTab === "specs" && (
                <div className="overflow-hidden rounded-lg border border-[#E5D3B3]/30">
                  <table className="w-full text-sm">
                    <tbody>
                      {[
                        ["Material", selectedMaterial || "Premium Wood"],
                        ["Color", selectedColor || "Multiple Options"],
                        ["Size", selectedSize || "Standard Size"],
                        ["Category", productAny.category || "Furniture"],
                        ["Brand", "Sareng"],
                        ["Warranty", "1 Year Service Warranty"],
                      ].map(([label, value], idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? "bg-[#FDF6EE]" : "bg-[#F4F5F7]"}>
                          <td className="px-4 py-3 font-semibold text-[#0B2523] w-1/3">{label}</td>
                          <td className="px-4 py-3 text-[#0B2523]/70">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Reviews Tab */}
              {activeTab === "reviews" && (
                <div>
                  {/* Rating Summary */}
                  <div className="flex flex-col md:flex-row gap-6 mb-8">
                    <div className="flex-1 bg-[#FDF6EE] rounded-lg p-5 text-center border border-[#E5D3B3]/30">
                      <div className="text-4xl font-bold text-[#0B2523]">4.0</div>
                      <div className="flex items-center justify-center gap-0.5 mt-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={16}
                            className={
                              star <= 4
                                ? "fill-[#E5D3B3] text-[#E5D3B3]"
                                : "fill-[#E5D3B3]/40 text-[#E5D3B3]/40"
                            }
                          />
                        ))}
                      </div>
                      <p className="text-xs text-[#0B2523]/60 mt-2">Based on 12 reviews</p>
                    </div>
                    
                    {/* Rating Breakdown Bars */}
                    <div className="flex-1 space-y-2">
                      {[
                        { stars: 5, percent: 75 },
                        { stars: 4, percent: 50 },
                        { stars: 3, percent: 25 },
                        { stars: 2, percent: 10 },
                        { stars: 1, percent: 5 },
                      ].map((item) => (
                        <div key={item.stars} className="flex items-center gap-3">
                          <span className="text-xs font-medium text-[#0B2523] w-8">{item.stars} Star</span>
                          <div className="flex-1 h-2 bg-[#FDF6EE] rounded-full overflow-hidden border border-[#E5D3B3]/20">
                            <div
                              className="h-full bg-[#0F3D39] rounded-full"
                              style={{ width: `${item.percent}%` }}
                            />
                          </div>
                          <span className="text-xs text-[#0B2523]/60 w-8 text-right">{item.percent}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Review Cards */}
                  <div className="space-y-4">
                    {mockReviews.map((review, idx) => (
                      <div key={idx} className="border border-[#E5D3B3]/30 rounded-lg p-4 bg-white">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[#0B2523] text-sm">{review.name}</span>
                              <span className="text-xs text-[#0B2523]/50">• {review.date}</span>
                            </div>
                            <div className="flex items-center gap-0.5 mt-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  size={12}
                                  className={
                                    star <= review.rating
                                      ? "fill-[#E5D3B3] text-[#E5D3B3]"
                                      : "fill-[#E5D3B3]/30 text-[#E5D3B3]/30"
                                  }
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-[#0B2523]/70 leading-relaxed">{review.comment}</p>
                      </div>
                    ))}
                  </div>
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