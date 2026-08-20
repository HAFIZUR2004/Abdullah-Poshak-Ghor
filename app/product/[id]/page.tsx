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
} from "lucide-react";
import { Product } from "@/types";
import ProductCard from "@/components/ProductCard";
import { useCart } from "@/context/CartContext";
import PremiumLoader from "@/components/PremiumLoader";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";

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

  // Variant States & Dropdowns
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [currentPrice, setCurrentPrice] = useState(0);

  // Right Side Accordions
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const productId = params.id as string;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const data = await res.json();
          console.log("📦 API Response:", data); // ডিবাগ করুন

          let productArray: Product[] = [];

          // ✅ ডেটা ফরম্যাট চেক করুন
          if (Array.isArray(data)) {
            productArray = data;
          } else if (data?.success === true && Array.isArray(data.data)) {
            productArray = data.data;
          } else if (data?.data && Array.isArray(data.data)) {
            productArray = data.data;
          } else {
            console.error("❌ Unexpected data format:", data);
            setLoading(false);
            return;
          }

          const numericId = Number(productId);
          const foundProduct = productArray.find(
            (p: Product) =>
              p._id === productId || (p.id !== undefined && p.id === numericId),
          );

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
                  !(p.id !== undefined && p.id === numericId),
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
      let priceAdjustment = 0;
      if (
        material.toLowerCase().includes("premium") ||
        material.toLowerCase().includes("sheesham")
      ) {
        priceAdjustment = 5000;
      }
      setCurrentPrice(product.price + priceAdjustment);
    }
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

  if (loading) {
    return <PremiumLoader />;
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <h1 className="text-xl font-semibold text-gray-800 mb-2">
          Product Not Found
        </h1>
        <Link href="/shop" className="text-red-600 underline text-sm">
          Back to Shop
        </Link>
      </div>
    );
  }

  const imagesList =
    product.images && product.images.length > 0
      ? product.images
      : product.image
        ? [product.image]
        : ["/placeholder.jpg"];

  return (
    <>
      <Navbar />
      <div className="bg-white min-h-screen pb-16">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {showSuccess && (
            <div className="fixed top-20 right-5 z-50 bg-red-600 text-white px-6 py-2.5 rounded shadow-lg text-sm">
              Added to cart successfully! 🛒
            </div>
          )}

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* LEFT SIDE: Thumbnails, Main Image & Dynamic Note */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex gap-4 items-start">
                {/* Vertical Thumbnails List */}
                {imagesList.length > 0 && (
                  <div className="flex flex-col gap-2.5 w-20 flex-shrink-0">
                    {imagesList.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImage(idx)}
                        className={`h-20 w-full rounded border overflow-hidden transition-all ${
                          activeImage === idx
                            ? "border-red-600 ring-1 ring-red-600"
                            : "border-gray-200 opacity-70 hover:opacity-100"
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

                {/* Main Big Image Box */}
                <div className="flex-1 bg-[#F9F9F9] border border-gray-200 rounded h-[460px] md:h-[540px] relative flex items-center justify-center group">
                  <Image
                    src={imagesList[activeImage]}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                  />
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="absolute top-3 right-3 bg-white border border-gray-200 hover:bg-gray-50 p-2 rounded shadow-sm text-gray-700 transition"
                    title="Zoom image"
                  >
                    <Maximize2 size={16} />
                  </button>
                </div>
              </div>

              {/* Dynamic Note */}
              <div className="border border-gray-200 rounded bg-[#FAFAFA] p-3.5 flex items-start gap-2.5 text-gray-500 text-[11px] leading-relaxed">
                <Info size={16} className="shrink-0 text-gray-400 mt-0.5" />
                <p>
                  {product.note ||
                    "Please note: Actual product color, fabric, finish, texture, and appearance may slightly differ from the images shown due to photography, lighting, device display settings, and natural material variations."}
                </p>
              </div>
            </div>

            {/* RIGHT SIDE: Dropdowns, Price & Cart Actions */}
            <div className="lg:col-span-5 space-y-4">
              {/* Product Title & Price Header */}
              <div className="border-b border-gray-200 pb-3">
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                  {product.name}
                </h1>
                <p className="text-xs text-gray-500 mt-0.5">
                  HCL-{product._id?.slice(-8).toUpperCase()}
                </p>
                <p className="text-lg font-bold text-gray-900 mt-1.5">
                  {currentPrice.toLocaleString()} BDT
                </p>
              </div>

              {/* 1. Material Dropdown */}
              <div className="border border-gray-200 rounded p-3 bg-white">
                <div className="text-xs font-semibold text-gray-700 mb-1 flex items-center gap-2">
                  <Package size={15} className="text-gray-400" /> Material
                </div>
                <select
                  value={selectedMaterial}
                  onChange={(e) => handleMaterialChange(e.target.value)}
                  className="w-full text-xs text-gray-600 bg-transparent focus:outline-none cursor-pointer mt-1"
                >
                  {product.materials && product.materials.length > 0 ? (
                    product.materials.map((m, i) => (
                      <option key={i} value={m}>
                        {m}
                      </option>
                    ))
                  ) : (
                    <option value="Kiln-dried imported beech wood and veneered engineered wood">
                      Kiln-dried imported beech wood & veneered wood
                    </option>
                  )}
                </select>
              </div>

              {/* 2. Color Dropdown */}
              <div className="border border-gray-200 rounded p-3 bg-white">
                <div className="text-xs font-semibold text-gray-700 mb-1 flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-sm bg-amber-800 inline-block"></span>{" "}
                  Color Finish
                </div>
                <select
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="w-full text-xs text-gray-600 bg-transparent focus:outline-none cursor-pointer mt-1"
                >
                  {product.colors && product.colors.length > 0 ? (
                    product.colors.map((c, i) => (
                      <option key={i} value={c}>
                        {c}
                      </option>
                    ))
                  ) : (
                    <option value="Antique / Natural Finish">
                      Antique / Natural Finish
                    </option>
                  )}
                </select>
              </div>

              {/* 3. Size Dropdown */}
              <div className="border border-gray-200 rounded p-3 bg-white">
                <div className="text-xs font-semibold text-gray-700 mb-1 flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border border-gray-400 rounded-sm inline-block"></span>{" "}
                  Size Options
                </div>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="w-full text-xs text-gray-600 bg-transparent focus:outline-none cursor-pointer mt-1"
                >
                  {product.sizes && product.sizes.length > 0 ? (
                    product.sizes.map((s, i) => (
                      <option key={i} value={s}>
                        {s}
                      </option>
                    ))
                  ) : (
                    <option value="Standard Queen / King Size">
                      Standard Queen / King Size
                    </option>
                  )}
                </select>
              </div>

              {/* Quantity Counter */}
              <div className="flex items-center justify-between border border-gray-200 rounded p-2.5 bg-white">
                <span className="text-xs font-semibold text-gray-700">
                  Quantity
                </span>
                <div className="flex items-center border border-gray-200 rounded overflow-hidden w-28 h-8">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-full flex items-center justify-center hover:bg-gray-100 text-gray-600"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="flex-1 text-center text-xs font-semibold text-gray-800">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-full flex items-center justify-center hover:bg-gray-100 text-gray-600"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* Split Red Action Bar */}
              <div className="bg-[#E61F26] rounded text-white flex items-center overflow-hidden shadow-sm h-12">
                <div className="flex-1 px-3 text-center border-r border-red-500">
                  <div className="text-xs font-bold">
                    {(currentPrice * quantity).toLocaleString()} BDT
                  </div>
                  <div className="text-[9px] opacity-90">
                    {currentPrice.toLocaleString()} x {quantity}
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-1.5 font-semibold text-xs h-full hover:bg-black/10 transition"
                >
                  <ShoppingBag size={15} /> Add to Cart
                </button>

                <button
                  onClick={toggleWishlist}
                  className={`px-3.5 h-full flex items-center justify-center border-l border-red-500 hover:bg-black/10 transition ${
                    liked ? "bg-red-700" : ""
                  }`}
                  title="Add to Wishlist"
                >
                  <Heart
                    size={18}
                    className={liked ? "fill-white text-white" : "text-white"}
                  />
                </button>
              </div>

              {/* EMI Banner */}
              <div className="bg-[#FCE8E8] border border-[#F5C2C2] text-[#D32F2F] rounded p-2.5 text-center text-xs font-bold">
                EMI starts from{" "}
                {Math.round((currentPrice * quantity) / 12).toLocaleString()}{" "}
                BDT/month
              </div>

              {/* Right Side Accordions */}
              <div className="space-y-2 pt-2">
                <div className="border border-gray-200 rounded bg-white">
                  <button
                    onClick={() =>
                      setOpenAccordion(openAccordion === "pkg" ? null : "pkg")
                    }
                    className="w-full px-3.5 py-2.5 flex items-center justify-between text-xs font-medium text-gray-700"
                  >
                    <span className="flex items-center gap-2">
                      <Package size={14} className="text-gray-400" /> Packaging
                      Information
                    </span>
                    <ChevronDown
                      size={14}
                      className={`transition-transform ${openAccordion === "pkg" ? "rotate-180" : ""}`}
                    />
                  </button>
                  {openAccordion === "pkg" && (
                    <div className="px-3.5 pb-3 text-xs text-gray-500 border-t border-gray-100 pt-2">
                      Flat-pack delivery with heavy-duty corrugated cardboard
                      protection.
                    </div>
                  )}
                </div>

                <div className="border border-gray-200 rounded bg-white">
                  <button
                    onClick={() =>
                      setOpenAccordion(openAccordion === "help" ? null : "help")
                    }
                    className="w-full px-3.5 py-2.5 flex items-center justify-between text-xs font-medium text-gray-700"
                  >
                    <span className="flex items-center gap-2">
                      <HelpCircle size={14} className="text-gray-400" /> Need
                      Help?
                    </span>
                    <ChevronDown
                      size={14}
                      className={`transition-transform ${openAccordion === "help" ? "rotate-180" : ""}`}
                    />
                  </button>
                  {openAccordion === "help" && (
                    <div className="px-3.5 pb-3 text-xs text-gray-500 border-t border-gray-100 pt-2">
                      Contact our support hotline or visit our nearest showroom
                      for assistance.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ABOUT THIS ITEM & TECHNICAL SPECIFICATIONS */}
          <div className="mt-16 border-t border-gray-200 pt-10 space-y-10">
            <div>
              <h3 className="text-base font-bold text-gray-900 mb-3 uppercase tracking-wider">
                About this item
              </h3>
              <ul className="space-y-2 text-sm text-gray-700 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-600 mt-2 shrink-0"></span>
                  <span>
                    {product.description ||
                      "Crafted with precision using top-tier sustainable materials to ensure superior structural stability and long-lasting durability."}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-600 mt-2 shrink-0"></span>
                  <span>
                    Ergonomically designed to blend modern elegance with
                    everyday practicality for home or office environments.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-600 mt-2 shrink-0"></span>
                  <span>
                    Features high-grade protective finishing that resists
                    scratches and simplifies daily maintenance.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-600 mt-2 shrink-0"></span>
                  <span>
                    Eco-friendly raw materials compliant with international
                    safety and quality standards.
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-base font-bold text-gray-900 mb-3 uppercase tracking-wider">
                Product Information
              </h3>
              <div className="border border-gray-200 rounded-lg overflow-hidden max-w-3xl text-xs">
                <div className="grid grid-cols-2 border-b border-gray-200 bg-gray-50">
                  <div className="p-3 font-semibold text-gray-700 border-r border-gray-200">
                    Brand / Manufacturer
                  </div>
                  <div className="p-3 text-gray-600">
                    Grow Business Solutions / Premium Line
                  </div>
                </div>
                <div className="grid grid-cols-2 border-b border-gray-200">
                  <div className="p-3 font-semibold text-gray-700 border-r border-gray-200">
                    Item Category
                  </div>
                  <div className="p-3 text-gray-600 capitalize">
                    {product.category || "General Furniture"}
                  </div>
                </div>
                <div className="grid grid-cols-2 border-b border-gray-200 bg-gray-50">
                  <div className="p-3 font-semibold text-gray-700 border-r border-gray-200">
                    Material & Finish
                  </div>
                  <div className="p-3 text-gray-600">
                    {selectedMaterial || "Standard Grade Material"}
                  </div>
                </div>
                <div className="grid grid-cols-2 border-b border-gray-200">
                  <div className="p-3 font-semibold text-gray-700 border-r border-gray-200">
                    Color Variant
                  </div>
                  <div className="p-3 text-gray-600">
                    {selectedColor || "Standard Finish"}
                  </div>
                </div>
                <div className="grid grid-cols-2 border-b border-gray-200 bg-gray-50">
                  <div className="p-3 font-semibold text-gray-700 border-r border-gray-200">
                    Warranty Coverage
                  </div>
                  <div className="p-3 text-gray-600">
                    {product.warrantyInfo || "1 Year Service Warranty"}
                  </div>
                </div>
                <div className="grid grid-cols-2">
                  <div className="p-3 font-semibold text-gray-700 border-r border-gray-200">
                    Return Policy
                  </div>
                  <div className="p-3 text-gray-600">
                    {product.returnPolicy || "3 Days Easy Return & Replacement"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RELATED PRODUCTS */}
          {relatedProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-base font-bold text-gray-900 mb-4">
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
