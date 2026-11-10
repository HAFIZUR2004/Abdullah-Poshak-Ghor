"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle, Check, ChevronDown, Clock, Edit3, Flame, Image as ImageIcon,
  Layers, PackageOpen, Palette, Plus, Ruler, Save, ShieldCheck, Star,
  Trash2, TrendingUp, X, Box, Search, Grid3X3, List, Award, Shirt,
  Scissors, Users, Tag, Percent,
} from "lucide-react";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import Swal from "sweetalert2";

// ======================================================
// TYPES
// ======================================================
type ProductStatus = "Active" | "Draft" | "Trending" | "Featured" | "OutOfStock";

interface Product {
  _id?: string;
  id: string;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  category: string;
  subCategory?: string;
  brand?: string;
  image: string;
  images?: string[];
  stock: number;
  status: ProductStatus;
  rating?: number;
  discount?: number;
  sizes?: string[];
  colors?: string[];
  fabric?: string;
  fit?: string;
  pattern?: string;
  gender?: string;
  sleeve?: string;
  neckType?: string;
  sizeChart?: { size: string; price?: number; stock?: number; sku?: string }[];
  sizeGuide?: { size: string; chest?: string; waist?: string; length?: string; shoulder?: string }[];
  warrantyInfo?: string;
  returnPolicy?: string;
  note?: string;
  createdAt?: Date;
  isBestSeller?: boolean;
  isTodayDeal?: boolean;
  isNewArrival?: boolean;
  isDealOfTheWeek?: boolean;
  isTopRated?: boolean;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  image: string;
}

// ======================================================
// FASHION PRESETS
// ======================================================
const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL", "3XL", "Free Size"];
const GENDER_OPTIONS = ["Men", "Women", "Unisex", "Kids"];
const FIT_OPTIONS = ["Slim", "Regular", "Oversized", "Relaxed", "Skinny"];
const PATTERN_OPTIONS = ["Solid", "Striped", "Printed", "Checkered", "Embroidered", "Floral", "Graphic"];
const SLEEVE_OPTIONS = ["Full Sleeve", "Half Sleeve", "Sleeveless", "3/4 Sleeve"];
const NECK_OPTIONS = ["Round Neck", "V-Neck", "Collar", "Polo", "Hooded", "Boat Neck"];

const FABRIC_OPTIONS = [
  "Cotton", "Linen", "Silk", "Denim", "Polyester", "Viscose",
  "Rayon", "Wool", "Lycra", "Chiffon", "Georgette", "Khadi", "Terry",
];

const FASHION_COLORS = [
  { name: "Black", hex: "#111111" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Navy", hex: "#1E2A4A" },
  { name: "Grey", hex: "#8E8E8E" },
  { name: "Beige", hex: "#E5D6BD" },
  { name: "Brown", hex: "#6B4A2B" },
  { name: "Maroon", hex: "#7A1E2B" },
  { name: "Red", hex: "#D62828" },
  { name: "Pink", hex: "#F48FB1" },
  { name: "Purple", hex: "#7B3FA0" },
  { name: "Blue", hex: "#2F6FED" },
  { name: "Sky", hex: "#87CEEB" },
  { name: "Teal", hex: "#008080" },
  { name: "Green", hex: "#2E7D32" },
  { name: "Olive", hex: "#6B8E23" },
  { name: "Yellow", hex: "#F4C430" },
  { name: "Orange", hex: "#FB8C00" },
  { name: "Cream", hex: "#FFF4E1" },
];

const createId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const calculateDiscount = (price: number, original: number) => {
  if (!price || !original || original <= price) return 0;
  return Math.round(((original - price) / original) * 100);
};

// ======================================================
// SMALL INPUT
// ======================================================
interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  required?: boolean;
}
const FormInput = React.memo(function FormInput({ label, required, className = "", ...props }: TextInputProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-[#49352D]">
        {label}{required && <span className="ml-1 text-red-500">*</span>}
      </label>
      <input
        {...props}
        className={`w-full rounded-xl border border-[#E7D9CC] bg-[#FFFCF8] px-4 py-3 text-sm text-[#30231E] outline-none transition placeholder:text-[#B6A79E] focus:border-[#B98A5A] focus:ring-4 focus:ring-[#B98A5A]/10 ${className}`}
      />
    </div>
  );
});
FormInput.displayName = "FormInput";

// ======================================================
// STATUS BADGE
// ======================================================
function StatusBadge({ status }: { status: ProductStatus }) {
  const map: Record<ProductStatus, string> = {
    Active: "bg-green-50 text-green-700 border-green-200",
    Draft: "bg-gray-50 text-gray-600 border-gray-200",
    Trending: "bg-orange-50 text-orange-700 border-orange-200",
    Featured: "bg-purple-50 text-purple-700 border-purple-200",
    OutOfStock: "bg-red-50 text-red-700 border-red-200",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold ${map[status]}`}>
      {status}
    </span>
  );
}

// ======================================================
// TOGGLE COLLECTION
// ======================================================
interface ToggleCollectionButtonProps {
  isActive: boolean;
  onClick: () => void;
  label: string;
  icon: React.ReactNode;
  activeColor: string;
}
const ToggleCollectionButton = ({ isActive, onClick, label, icon, activeColor }: ToggleCollectionButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center gap-1 rounded-lg px-2 py-1 text-[9px] font-bold transition ${
      isActive ? `${activeColor} text-white` : "bg-gray-100 text-gray-500 hover:bg-gray-200"
    }`}
  >
    {icon}{label}
  </button>
);

// ======================================================
// MAIN PAGE
// ======================================================
export default function FashionProductEntryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // basic
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState("10");
  const [status, setStatus] = useState<ProductStatus>("Active");
  const [rating, setRating] = useState("5");

  // images
  const [image, setImage] = useState("");
  const [images, setImages] = useState<string[]>([]);

  // fashion specs
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [fabric, setFabric] = useState("");
  const [fit, setFit] = useState("");
  const [pattern, setPattern] = useState("");
  const [gender, setGender] = useState("");
  const [sleeve, setSleeve] = useState("");
  const [neckType, setNeckType] = useState("");

  // per-size stock / price
  const [sizeRows, setSizeRows] = useState<
    { size: string; price: string; stock: string; sku: string }[]
  >([]);

  // size guide measurements
  const [sizeGuide, setSizeGuide] = useState<
    { size: string; chest: string; waist: string; length: string; shoulder: string }[]
  >([]);

  // policies
  const [warrantyInfo, setWarrantyInfo] = useState("7 Days Easy Return");
  const [returnPolicy, setReturnPolicy] = useState("7 Days Easy Return & Exchange");
  const [note, setNote] = useState("");

  // misc
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const multiFileInputRef = useRef<HTMLInputElement>(null);

  // ----- fetch categories -----
  const fetchCategories = useCallback(async () => {
    try {
      setLoadingCategories(true);
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (data.success && Array.isArray(data.categories)) {
        setCategories(data.categories);
        if (data.categories.length > 0 && !category) setCategory(data.categories[0].name);
      } else {
        throw new Error("no categories");
      }
    } catch {
      const fallback = [
        "Men's Fashion", "Women's Fashion", "Kids' Fashion", "Panjabi & Kurta",
        "Shirts & T-Shirts", "Pants & Jeans", "Saree & Three Piece",
        "Hoodies & Jackets", "Shoes & Sneakers", "Bags & Wallets",
        "Watches & Accessories", "Jewelry",
      ];
      setCategories(fallback.map((name, i) => ({
        _id: String(i), name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"), image: "",
      })));
      if (fallback.length) setCategory(fallback[0]);
    } finally {
      setLoadingCategories(false);
    }
  }, [category]);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  // ----- fetch products -----
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/products");
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed");
      const formatted: Product[] = Array.isArray(data)
        ? data.map((p: Product) => ({ ...p, id: p._id || p.id }))
        : [];
      setProducts(formatted);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) &&
        (filterCategory === "all" || p.category === filterCategory) &&
        (filterStatus === "all" || p.status === filterStatus)
      );
    });
  }, [products, searchQuery, filterCategory, filterStatus]);

  // ----- collection toggle -----
  const handleToggleCollection = async (
    productId: string,
    type: "best-seller" | "today-deal" | "new-arrival" | "deal-of-the-week" | "top-rated"
  ) => {
    try {
      const fieldMap = {
        "best-seller": "isBestSeller",
        "today-deal": "isTodayDeal",
        "new-arrival": "isNewArrival",
        "deal-of-the-week": "isDealOfTheWeek",
        "top-rated": "isTopRated",
      } as const;
      const field = fieldMap[type];
      const current = products.find((p) => p.id === productId);
      const value = !current?.[field];

      const res = await fetch("/api/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: productId, field, value }),
      });
      if (!res.ok) throw new Error();
      await fetchProducts();
      Swal.fire({ title: "Updated", icon: "success", timer: 1200, showConfirmButton: false });
    } catch {
      Swal.fire({ title: "Failed", icon: "error" });
    }
  };

  // ----- images -----
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleMultipleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const available = Math.max(0, 5 - images.length);
    const selected = files.slice(0, available);
    Promise.all(
      selected.map(
        (f) =>
          new Promise<string>((resolve) => {
            const r = new FileReader();
            r.onloadend = () => resolve(r.result as string);
            r.readAsDataURL(f);
          })
      )
    ).then((urls) => setImages((prev) => [...prev, ...urls]));
    e.target.value = "";
  };

  const removeImage = (i: number) => setImages((prev) => prev.filter((_, idx) => idx !== i));

  // ----- size toggle (also manages sizeRows) -----
  const toggleSize = (size: string) => {
    setSelectedSizes((prev) => {
      if (prev.includes(size)) {
        setSizeRows((r) => r.filter((x) => x.size !== size));
        setSizeGuide((g) => g.filter((x) => x.size !== size));
        return prev.filter((s) => s !== size);
      }
      setSizeRows((r) => [...r, { size, price: "", stock: "", sku: "" }]);
      setSizeGuide((g) => [...g, { size, chest: "", waist: "", length: "", shoulder: "" }]);
      return [...prev, size];
    });
  };

  const updateSizeRow = (size: string, key: "price" | "stock" | "sku", value: string) => {
    setSizeRows((prev) => prev.map((r) => (r.size === size ? { ...r, [key]: value } : r)));
  };

  const updateSizeGuide = (
    size: string,
    key: "chest" | "waist" | "length" | "shoulder",
    value: string
  ) => {
    setSizeGuide((prev) => prev.map((g) => (g.size === size ? { ...g, [key]: value } : g)));
  };

  // ----- colors -----
  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  // ----- reset / edit -----
  const resetForm = () => {
    setName(""); setDescription(""); setPrice(""); setOriginalPrice("");
    setCategory(categories[0]?.name || ""); setSubCategory(""); setBrand("");
    setStock("10"); setStatus("Active"); setRating("5");
    setImage(""); setImages([]);
    setSelectedSizes([]); setSelectedColors([]);
    setFabric(""); setFit(""); setPattern(""); setGender(""); setSleeve(""); setNeckType("");
    setSizeRows([]); setSizeGuide([]);
    setWarrantyInfo("7 Days Easy Return");
    setReturnPolicy("7 Days Easy Return & Exchange");
    setNote(""); setEditingId(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (multiFileInputRef.current) multiFileInputRef.current.value = "";
  };

  const startEdit = (p: Product) => {
    setEditingId(p.id);
    setName(p.name || ""); setDescription(p.description || "");
    setPrice(p.price?.toString() || ""); setOriginalPrice(p.originalPrice?.toString() || "");
    setCategory(p.category || categories[0]?.name || ""); setSubCategory(p.subCategory || "");
    setBrand(p.brand || "");
    setStock(p.stock?.toString() || "0"); setStatus(p.status || "Active");
    setRating(p.rating?.toString() || "5");
    setImage(p.image || ""); setImages(p.images || []);
    setSelectedSizes(p.sizes || []); setSelectedColors(p.colors || []);
    setFabric(p.fabric || ""); setFit(p.fit || ""); setPattern(p.pattern || "");
    setGender(p.gender || ""); setSleeve(p.sleeve || ""); setNeckType(p.neckType || "");
    setSizeRows(
      (p.sizeChart || []).map((s) => ({
        size: s.size, price: s.price?.toString() || "",
        stock: s.stock?.toString() || "", sku: s.sku || "",
      }))
    );
    setSizeGuide(
      (p.sizeGuide || []).map((s) => ({
        size: s.size, chest: s.chest || "", waist: s.waist || "",
        length: s.length || "", shoulder: s.shoulder || "",
      }))
    );
    setWarrantyInfo(p.warrantyInfo || "7 Days Easy Return");
    setReturnPolicy(p.returnPolicy || "7 Days Easy Return & Exchange");
    setNote(p.note || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteProduct = async (id: string) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      const res = await fetch(`/api/products?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setProducts((prev) => prev.filter((p) => p.id !== id));
      if (editingId === id) resetForm();
    } catch { alert("Delete failed"); }
  };

  // ----- submit -----
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price || (!image && images.length === 0)) {
      alert("Please fill required fields and upload an image.");
      return;
    }
    setUploading(true);
    try {
      let finalImageUrl = image || images[0];
      if (finalImageUrl?.startsWith("data:")) {
        const blob = await (await fetch(finalImageUrl)).blob();
        const file = new File([blob], "main.jpg", { type: blob.type });
        finalImageUrl = await uploadImageToCloudinary(file);
      }
      let finalImages = [...images];
      if (finalImages.some((i) => i.startsWith("data:"))) {
        finalImages = await Promise.all(
          finalImages.map(async (img) => {
            if (!img.startsWith("data:")) return img;
            const blob = await (await fetch(img)).blob();
            const file = new File([blob], "gallery.jpg", { type: blob.type });
            return uploadImageToCloudinary(file);
          })
        );
      }

      const finalPrice = parseFloat(price);
      const finalOriginal = originalPrice ? parseFloat(originalPrice) : undefined;
      const discount =
        finalOriginal && finalOriginal > finalPrice
          ? calculateDiscount(finalPrice, finalOriginal)
          : 0;

      const cleanSizeChart = sizeRows
        .filter((r) => r.size)
        .map((r) => ({
          size: r.size,
          price: r.price ? Number(r.price) : undefined,
          stock: r.stock ? Number(r.stock) : undefined,
          sku: r.sku || undefined,
        }));

      const cleanSizeGuide = sizeGuide
        .filter((g) => g.size && (g.chest || g.waist || g.length || g.shoulder))
        .map((g) => ({
          size: g.size,
          chest: g.chest || "",
          waist: g.waist || "",
          length: g.length || "",
          shoulder: g.shoulder || "",
        }));

      const payload = {
        name: name.trim(),
        description: description.trim(),
        price: finalPrice,
        originalPrice: finalOriginal,
        category,
        subCategory: subCategory.trim(),
        brand: brand.trim(),
        image: finalImageUrl,
        images: finalImages,
        stock: parseInt(stock) || 0,
        status,
        rating: parseFloat(rating) || 0,
        discount,
        sizes: selectedSizes,
        colors: selectedColors.map((c) => {
          const match = FASHION_COLORS.find((x) => x.name === c);
          return match ? `${match.name} (${match.hex})` : c;
        }),
        fabric, fit, pattern, gender, sleeve, neckType,
        sizeChart: cleanSizeChart,
        sizeGuide: cleanSizeGuide,
        warrantyInfo: warrantyInfo.trim(),
        returnPolicy: returnPolicy.trim(),
        note: note.trim(),
      };

      const res = await fetch("/api/products", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingId ? { id: editingId, ...payload } : payload),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result?.error || "Save failed");

      await fetchProducts();
      alert(editingId ? "Product updated!" : "Product added!");
      resetForm();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setUploading(false);
    }
  };

  const liveDiscount =
    price && originalPrice
      ? calculateDiscount(parseFloat(price) || 0, parseFloat(originalPrice) || 0)
      : 0;

  // ======================================================
  // RENDER
  // ======================================================
  return (
    <div className="min-h-screen bg-[#F7F2EC] px-4 py-6 text-[#30231E] md:px-8 md:py-8">
      <div className="mx-auto max-w-[1500px]">
        {/* HEADER */}
        <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#B98A5A] text-white shadow-md">
              <Shirt size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-[#402B22] md:text-3xl">
                Fashion Product Entry
              </h1>
              <p className="text-xs text-[#8C7A6D] md:text-sm">
                Add and manage clothing & accessories
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-[#E5D8CB] bg-white px-4 py-2 shadow-sm">
            <PackageOpen size={17} className="text-[#B98A5A]" />
            <span className="text-sm font-bold text-[#57443A]">{products.length}</span>
            <span className="text-xs text-[#99897E]">Products</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-7 xl:grid-cols-[480px_minmax(0,1fr)]">
          {/* ============ LEFT: FORM ============ */}
          <div className="rounded-3xl border border-[#E6D8CB] bg-white p-5 shadow-[0_15px_50px_rgba(75,50,30,0.08)] md:p-6">
            <div className="mb-6 flex items-center justify-between border-b border-[#EEE4DC] pb-5">
              <div className="flex items-center gap-2">
                {editingId ? <Edit3 size={19} className="text-[#B98A5A]" /> : <Plus size={19} className="text-[#B98A5A]" />}
                <div>
                  <h2 className="text-lg font-black text-[#432E25]">
                    {editingId ? "Update Product" : "Add New Fashion Product"}
                  </h2>
                  <p className="mt-1 text-[11px] text-[#9C8A7E]">Fill in the details below</p>
                </div>
              </div>
              {editingId && (
                <button type="button" onClick={resetForm} className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F7F0E9] text-[#8D7768] hover:bg-red-50 hover:text-red-500">
                  <X size={15} />
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* MAIN IMAGE */}
              <div>
                <label className="mb-2 block text-sm font-bold text-[#49352D]">
                  Main Image <span className="ml-1 text-red-500">*</span>
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="group relative h-52 cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed border-[#DECDBC] bg-[#FCF8F3] transition hover:border-[#B98A5A]"
                >
                  {image ? (
                    <img src={image} alt="preview" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center">
                      <ImageIcon size={26} className="mb-2 text-[#B98A5A]" />
                      <p className="text-sm font-bold text-[#695247]">Upload Main Image</p>
                      <p className="mt-1 text-[10px] text-[#A7988E]">PNG, JPG or WEBP</p>
                    </div>
                  )}
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </div>

              {/* GALLERY */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-bold text-[#49352D]">Gallery Images</label>
                  <span className="text-[10px] font-semibold text-[#A08E81]">{images.length}/5</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {images.map((img, i) => (
                    <div key={`${img}-${i}`} className="group relative h-16 w-16 overflow-hidden rounded-xl border border-[#E5D8CB]">
                      <img src={img} alt="" className="h-full w-full object-cover" />
                      <button type="button" onClick={() => removeImage(i)} className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100">
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                  {images.length < 5 && (
                    <button type="button" onClick={() => multiFileInputRef.current?.click()} className="flex h-16 w-16 items-center justify-center rounded-xl border-2 border-dashed border-[#DECDBC] bg-[#FCF8F3] text-[#B98A5A] hover:border-[#B98A5A]">
                      <Plus size={21} />
                    </button>
                  )}
                </div>
                <input ref={multiFileInputRef} type="file" accept="image/*" multiple onChange={handleMultipleImagesChange} className="hidden" />
              </div>

              {/* BASIC INFO */}
              <div className="rounded-2xl border border-[#EEE4DC] bg-[#FFFCF9] p-4">
                <SectionHeader icon={<Layers size={15} />} title="Basic Information" sub="Product identity and pricing" />
                <div className="space-y-4">
                  <FormInput label="Product Name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Premium Cotton Panjabi" />
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#49352D]">Description</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} placeholder="Enter product description..." className="w-full resize-y rounded-xl border border-[#E7D9CC] bg-white px-4 py-3 text-sm outline-none focus:border-[#B98A5A] focus:ring-4 focus:ring-[#B98A5A]/10" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#49352D]">Price <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-[#A0836E]">৳</span>
                        <input type="text" inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)} required placeholder="1500" className="w-full rounded-xl border border-[#E7D9CC] bg-white py-3 pl-8 pr-3 text-sm outline-none focus:border-[#B98A5A]" />
                      </div>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#49352D]">Original Price</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-[#A0836E]">৳</span>
                        <input type="text" inputMode="decimal" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} placeholder="2000" className="w-full rounded-xl border border-[#E7D9CC] bg-white py-3 pl-8 pr-3 text-sm outline-none focus:border-[#B98A5A]" />
                      </div>
                    </div>
                  </div>

                  {liveDiscount > 0 && (
                    <div className="rounded-xl border border-green-100 bg-green-50 px-3 py-2 text-xs font-bold text-green-700">
                      🎉 Discount: {liveDiscount}%
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#49352D]">Category</label>
                      {loadingCategories ? (
                        <div className="rounded-xl border border-[#E7D9CC] px-3 py-3 text-sm text-gray-400">Loading...</div>
                      ) : (
                        <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-xl border border-[#E7D9CC] bg-white px-3 py-3 text-sm outline-none focus:border-[#B98A5A]">
                          <option value="">Select Category</option>
                          {categories.map((c) => <option key={c._id} value={c.name}>{c.name}</option>)}
                        </select>
                      )}
                    </div>
                    <FormInput label="Sub Category" value={subCategory} onChange={(e) => setSubCategory(e.target.value)} placeholder="e.g. Panjabi" />
                  </div>

                  <FormInput label="Brand" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="e.g. Aarong, Yellow" />
                </div>
              </div>

              {/* FASHION SPECS */}
              <div className="rounded-2xl border border-[#EEE4DC] bg-[#FFFCF9] p-4">
                <SectionHeader icon={<Scissors size={15} />} title="Fashion Specs" sub="Fabric, fit, pattern etc." />
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <SelectField label="Fabric" value={fabric} onChange={setFabric} options={FABRIC_OPTIONS} placeholder="Select fabric" />
                  <SelectField label="Fit" value={fit} onChange={setFit} options={FIT_OPTIONS} placeholder="Select fit" />
                  <SelectField label="Pattern" value={pattern} onChange={setPattern} options={PATTERN_OPTIONS} placeholder="Select pattern" />
                  <SelectField label="Gender" value={gender} onChange={setGender} options={GENDER_OPTIONS} placeholder="Select gender" />
                  <SelectField label="Sleeve" value={sleeve} onChange={setSleeve} options={SLEEVE_OPTIONS} placeholder="Select sleeve" />
                  <SelectField label="Neck Type" value={neckType} onChange={setNeckType} options={NECK_OPTIONS} placeholder="Select neck" />
                </div>
              </div>

              {/* SIZES */}
              <div className="rounded-2xl border border-[#EEE4DC] bg-[#FFFCF9] p-4">
                <SectionHeader icon={<Ruler size={15} />} title="Available Sizes" sub="Tap to select sizes" />
                <div className="flex flex-wrap gap-2">
                  {SIZE_OPTIONS.map((s) => {
                    const active = selectedSizes.includes(s);
                    return (
                      <button key={s} type="button" onClick={() => toggleSize(s)} className={`flex h-10 min-w-[52px] items-center justify-center rounded-xl border-2 px-3 text-xs font-bold transition ${active ? "border-[#B98A5A] bg-[#B98A5A] text-white" : "border-[#E7D9CC] bg-white text-[#5C493F] hover:border-[#C9AA8B]"}`}>
                        {s}
                      </button>
                    );
                  })}
                </div>

                {/* per-size stock / price */}
                {sizeRows.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-[10px] font-bold uppercase text-[#9A8779]">Stock & Price per Size</p>
                    {sizeRows.map((r) => (
                      <div key={r.size} className="grid grid-cols-[56px_1fr_1fr_1fr] items-center gap-2 rounded-xl border border-[#E7D9CC] bg-white p-2">
                        <span className="rounded-lg bg-[#B98A5A]/10 py-2 text-center text-xs font-black text-[#B98A5A]">{r.size}</span>
                        <input value={r.stock} onChange={(e) => updateSizeRow(r.size, "stock", e.target.value)} placeholder="Stock" inputMode="numeric" className="rounded-lg border border-[#E7D9CC] px-2 py-2 text-[11px] outline-none focus:border-[#B98A5A]" />
                        <input value={r.price} onChange={(e) => updateSizeRow(r.size, "price", e.target.value)} placeholder="Price ৳" inputMode="decimal" className="rounded-lg border border-[#E7D9CC] px-2 py-2 text-[11px] outline-none focus:border-[#B98A5A]" />
                        <input value={r.sku} onChange={(e) => updateSizeRow(r.size, "sku", e.target.value)} placeholder="SKU" className="rounded-lg border border-[#E7D9CC] px-2 py-2 text-[11px] outline-none focus:border-[#B98A5A]" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* SIZE GUIDE (measurements) */}
              {selectedSizes.length > 0 && (
                <div className="rounded-2xl border border-[#EEE4DC] bg-[#FFFCF9] p-4">
                  <SectionHeader icon={<Ruler size={15} />} title="Size Guide" sub="Measurements in inches (optional)" />
                  <div className="space-y-2">
                    {sizeGuide.map((g) => (
                      <div key={g.size} className="grid grid-cols-[48px_1fr_1fr_1fr_1fr] items-center gap-2 rounded-xl border border-[#E7D9CC] bg-white p-2">
                        <span className="rounded-lg bg-[#B98A5A]/10 py-2 text-center text-xs font-black text-[#B98A5A]">{g.size}</span>
                        <input value={g.chest} onChange={(e) => updateSizeGuide(g.size, "chest", e.target.value)} placeholder="Chest" className="rounded-lg border border-[#E7D9CC] px-2 py-2 text-[10px] outline-none focus:border-[#B98A5A]" />
                        <input value={g.waist} onChange={(e) => updateSizeGuide(g.size, "waist", e.target.value)} placeholder="Waist" className="rounded-lg border border-[#E7D9CC] px-2 py-2 text-[10px] outline-none focus:border-[#B98A5A]" />
                        <input value={g.length} onChange={(e) => updateSizeGuide(g.size, "length", e.target.value)} placeholder="Length" className="rounded-lg border border-[#E7D9CC] px-2 py-2 text-[10px] outline-none focus:border-[#B98A5A]" />
                        <input value={g.shoulder} onChange={(e) => updateSizeGuide(g.size, "shoulder", e.target.value)} placeholder="Shoulder" className="rounded-lg border border-[#E7D9CC] px-2 py-2 text-[10px] outline-none focus:border-[#B98A5A]" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* COLORS */}
              <div className="rounded-2xl border border-[#EEE4DC] bg-[#FFFCF9] p-4">
                <div className="mb-4 flex items-center justify-between">
                  <SectionHeader icon={<Palette size={15} />} title="Colors" sub="Tap to select" />
                  <span className="rounded-full bg-[#F7EEE5] px-2 py-1 text-[9px] font-bold text-[#96785F]">{selectedColors.length} selected</span>
                </div>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {FASHION_COLORS.map((c) => {
                    const active = selectedColors.includes(c.name);
                    return (
                      <button key={c.name} type="button" onClick={() => toggleColor(c.name)} className={`group overflow-hidden rounded-xl border-2 bg-white text-left transition ${active ? "border-[#B98A5A] ring-2 ring-[#B98A5A]/15" : "border-[#E8DDD4] hover:border-[#C9AA8B]"}`}>
                        <div className="h-12 w-full" style={{ backgroundColor: c.hex }} />
                        <div className="flex items-center justify-between px-2 py-1.5">
                          <span className="text-[9px] font-bold text-[#514139]">{c.name}</span>
                          {active && <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#B98A5A] text-white"><Check size={10} /></span>}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* POLICIES */}
              <div className="rounded-2xl border border-[#EEE4DC] bg-[#FFFCF9] p-4">
                <SectionHeader icon={<ShieldCheck size={15} />} title="Policies" sub="Warranty, return & note" />
                <div className="space-y-3">
                  <FormInput label="Warranty Info" value={warrantyInfo} onChange={(e) => setWarrantyInfo(e.target.value)} />
                  <FormInput label="Return Policy" value={returnPolicy} onChange={(e) => setReturnPolicy(e.target.value)} />
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#49352D]">Note</label>
                    <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} className="w-full resize-y rounded-xl border border-[#E7D9CC] bg-white px-4 py-3 text-sm outline-none focus:border-[#B98A5A]" />
                  </div>
                </div>
              </div>

              {/* STOCK / STATUS / RATING */}
              <div className="grid grid-cols-2 gap-3">
                <FormInput label="Total Stock" inputMode="numeric" value={stock} onChange={(e) => setStock(e.target.value)} />
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#49352D]">Status</label>
                  <select value={status} onChange={(e) => setStatus(e.target.value as ProductStatus)} className="w-full rounded-xl border border-[#E7D9CC] bg-white px-3 py-3 text-sm outline-none focus:border-[#B98A5A]">
                    {["Active", "Draft", "Trending", "Featured", "OutOfStock"].map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <FormInput label="Rating (0-5)" inputMode="decimal" value={rating} onChange={(e) => setRating(e.target.value)} />

              {/* SUBMIT */}
              <div className="border-t border-[#EEE4DC] pt-5">
                <button type="submit" disabled={uploading} className={`flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-black text-white shadow-lg transition disabled:opacity-60 ${editingId ? "bg-[#49332A] hover:bg-[#38251E]" : "bg-[#B98A5A] hover:bg-[#9F754B]"}`}>
                  {uploading ? (
                    <><div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> Processing...</>
                  ) : editingId ? (
                    <><Check size={17} /> Update Product</>
                  ) : (
                    <><Save size={17} /> Add Product</>
                  )}
                </button>
                {editingId && (
                  <button type="button" onClick={resetForm} className="mt-2 w-full rounded-2xl border border-[#E7D9CC] bg-white py-3 text-xs font-bold text-[#735F53] hover:bg-[#FCF7F2]">
                    Cancel Editing
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* ============ RIGHT: LIST ============ */}
          <div className="min-w-0 rounded-3xl border border-[#E6D8CB] bg-white p-5 shadow-[0_15px_50px_rgba(75,50,30,0.08)] md:p-6">
            {/* filters */}
            <div className="mb-6 space-y-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="relative flex-1">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search products..." className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 py-2.5 text-sm focus:border-[#B98A5A] focus:outline-none" />
                </div>
                <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                  <button onClick={() => setViewMode("list")} className={`p-2 rounded-md ${viewMode === "list" ? "bg-white shadow-sm text-[#B98A5A]" : "text-gray-500"}`}><List size={16} /></button>
                  <button onClick={() => setViewMode("grid")} className={`p-2 rounded-md ${viewMode === "grid" ? "bg-white shadow-sm text-[#B98A5A]" : "text-gray-500"}`}><Grid3X3 size={16} /></button>
                </div>
              </div>
              <div className="flex gap-3">
                <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-[#B98A5A]">
                  <option value="all">All Categories</option>
                  {categories.map((c) => <option key={c._id} value={c.name}>{c.name}</option>)}
                </select>
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-[#B98A5A]">
                  <option value="all">All Status</option>
                  {["Active", "Draft", "Trending", "Featured", "OutOfStock"].map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing <span className="font-bold text-[#B98A5A]">{filteredProducts.length}</span> of {products.length}
              </p>
              <button onClick={() => { setSearchQuery(""); setFilterCategory("all"); setFilterStatus("all"); }} className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500">
                <X size={12} /> Clear
              </button>
            </div>

            {loading ? (
              <div className="flex min-h-[400px] items-center justify-center">
                <div className="h-9 w-9 animate-spin rounded-full border-2 border-[#B98A5A] border-t-transparent" />
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#E5D8CB] bg-[#FCF8F3]">
                <PackageOpen size={30} className="mb-3 text-[#B98A5A]" />
                <p className="text-sm font-black text-[#57443A]">No products</p>
                <p className="mt-1 text-xs text-[#9A8A80]">Try a different filter.</p>
              </div>
            ) : viewMode === "list" ? (
              <div className="overflow-x-auto rounded-2xl border border-[#EEE4DC]">
                <table className="w-full min-w-[1100px] text-left">
                  <thead>
                    <tr className="bg-[#FCF8F3] text-[10px] uppercase tracking-wide text-[#89786D]">
                      <th className="px-4 py-4">Product</th>
                      <th className="px-4 py-4">Category</th>
                      <th className="px-4 py-4">Price</th>
                      <th className="px-4 py-4">Sizes / Colors</th>
                      <th className="px-4 py-4">Status</th>
                      <th className="px-4 py-4">Collections</th>
                      <th className="px-4 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EEE4DC]">
                    {filteredProducts.map((p) => {
                      const discount = p.originalPrice && p.originalPrice > p.price ? calculateDiscount(p.price, p.originalPrice) : 0;
                      return (
                        <tr key={p.id} className="hover:bg-[#FFFCF8]">
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <img src={p.image} alt={p.name} className="h-14 w-14 rounded-xl border border-[#E5D8CB] object-cover" />
                              <div className="min-w-0">
                                <h4 className="max-w-[220px] truncate text-sm font-bold text-[#49342B]">{p.name}</h4>
                                <div className="mt-1 flex items-center gap-2 text-[9px]">
                                  <span className="font-mono text-[#A29389]">ID: {p.id.slice(-6)}</span>
                                  {p.rating !== undefined && <span className="flex items-center gap-0.5"><Star size={9} className="fill-yellow-400 text-yellow-400" /> {p.rating}</span>}
                                  {discount > 0 && <span className="rounded bg-red-50 px-1 py-0.5 font-bold text-red-500">-{discount}%</span>}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-[10px] font-bold text-[#766459]">{p.category}</td>
                          <td className="px-4 py-4">
                            <p className="text-sm font-black text-[#49332A]">৳{p.price?.toLocaleString()}</p>
                            {p.originalPrice && p.originalPrice > p.price && <p className="text-[9px] text-[#A29389] line-through">৳{p.originalPrice.toLocaleString()}</p>}
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex flex-wrap gap-1">
                              {p.sizes?.slice(0, 5).map((s) => <span key={s} className="rounded bg-[#B98A5A]/10 px-1.5 py-0.5 text-[9px] font-bold text-[#B98A5A]">{s}</span>)}
                              {p.colors?.length ? <span className="text-[9px] text-gray-400">· {p.colors.length} colors</span> : null}
                            </div>
                          </td>
                          <td className="px-4 py-4"><StatusBadge status={p.status} /></td>
                          <td className="px-4 py-4">
                            <div className="flex flex-col gap-1.5">
                              <ToggleCollectionButton isActive={p.isBestSeller || false} onClick={() => handleToggleCollection(p.id, "best-seller")} label="Best Seller" icon={<Star size={11} />} activeColor="bg-[#F6B400]" />
                              <ToggleCollectionButton isActive={p.isTodayDeal || false} onClick={() => handleToggleCollection(p.id, "today-deal")} label="Today's Deal" icon={<Clock size={11} />} activeColor="bg-[#FF7A00]" />
                              <ToggleCollectionButton isActive={p.isNewArrival || false} onClick={() => handleToggleCollection(p.id, "new-arrival")} label="New Arrival" icon={<TrendingUp size={11} />} activeColor="bg-[#2E7D32]" />
                              <ToggleCollectionButton isActive={p.isDealOfTheWeek || false} onClick={() => handleToggleCollection(p.id, "deal-of-the-week")} label="Deal of Week" icon={<Clock size={11} />} activeColor="bg-[#8B5CF6]" />
                              <ToggleCollectionButton isActive={p.isTopRated || false} onClick={() => handleToggleCollection(p.id, "top-rated")} label="Top Rated" icon={<Award size={11} />} activeColor="bg-[#EC4899]" />
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex justify-end gap-1">
                              <button onClick={() => startEdit(p)} className="flex h-9 w-9 items-center justify-center rounded-xl text-[#9A887B] hover:bg-[#B98A5A]/10 hover:text-[#B98A5A]"><Edit3 size={15} /></button>
                              <button onClick={() => deleteProduct(p.id)} className="flex h-9 w-9 items-center justify-center rounded-xl text-[#9A887B] hover:bg-red-50 hover:text-red-500"><Trash2 size={15} /></button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map((p) => {
                  const discount = p.originalPrice && p.originalPrice > p.price ? calculateDiscount(p.price, p.originalPrice) : 0;
                  return (
                    <div key={p.id} className="group overflow-hidden rounded-2xl border border-[#EEE4DC] bg-white transition hover:shadow-lg">
                      <div className="relative h-44 overflow-hidden bg-[#FCF8F3]">
                        <img src={p.image} alt={p.name} className="h-full w-full object-cover transition group-hover:scale-105" />
                        {discount > 0 && <span className="absolute left-2 top-2 rounded-full bg-red-500 px-2 py-1 text-[10px] font-bold text-white">-{discount}%</span>}
                      </div>
                      <div className="p-4">
                        <h4 className="truncate text-sm font-bold text-[#49342B]">{p.name}</h4>
                        <div className="mt-2 flex items-center justify-between">
                          <p className="text-base font-black text-[#49332A]">৳{p.price?.toLocaleString()}</p>
                          <StatusBadge status={p.status} />
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {p.sizes?.slice(0, 4).map((s) => <span key={s} className="rounded bg-[#B98A5A]/10 px-1.5 py-0.5 text-[9px] font-bold text-[#B98A5A]">{s}</span>)}
                        </div>
                        <div className="mt-3 flex justify-end gap-1 border-t border-[#EEE4DC] pt-3">
                          <button onClick={() => startEdit(p)} className="flex h-8 w-8 items-center justify-center rounded-lg text-[#9A887B] hover:bg-[#B98A5A]/10 hover:text-[#B98A5A]"><Edit3 size={14} /></button>
                          <button onClick={() => deleteProduct(p.id)} className="flex h-8 w-8 items-center justify-center rounded-lg text-[#9A887B] hover:bg-red-50 hover:text-red-500"><Trash2 size={14} /></button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ======================================================
// REUSABLE SECTIONS
// ======================================================
function SectionHeader({ icon, title, sub }: { icon: React.ReactNode; title: string; sub: string }) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#B98A5A]/10 text-[#B98A5A]">{icon}</div>
      <div>
        <h3 className="text-sm font-black text-[#49352D]">{title}</h3>
        <p className="text-[9px] text-[#A09289]">{sub}</p>
      </div>
    </div>
  );
}

function SelectField({
  label, value, onChange, options, placeholder,
}: { label: string; value: string; onChange: (v: string) => void; options: string[]; placeholder?: string }) {
  return (
    <div>
      <label className="mb-2 block text-[11px] font-bold text-[#5C493F]">{label}</label>
      <div className="relative">
        <select value={value} onChange={(e) => onChange(e.target.value)} className="h-10 w-full appearance-none rounded-xl border border-[#E7D9CC] bg-white px-3 pr-9 text-xs font-semibold text-[#30231E] outline-none focus:border-[#B98A5A]">
          <option value="">{placeholder || "Select..."}</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#9C8A7D]" />
      </div>
    </div>
  );
}