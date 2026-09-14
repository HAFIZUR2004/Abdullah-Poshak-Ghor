"use client";

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";

import {
  AlertCircle,
  Check,
  ChevronDown,
  Clock,
  Edit3,
  Flame,
  Image as ImageIcon,
  Layers,
  PackageOpen,
  Palette,
  Plus,
  PlusCircle,
  Ruler,
  Save,
  ShieldCheck,
  Star,
  Trash2,
  TrendingUp,
  X,
  Box,
  Calendar,
  Award,
  Search,
  Filter,
  Grid3X3,
  List,
  // Alias for collection buttons
  Star as StarIcon,
  Clock as ClockIcon,
  TrendingUp as TrendingUpIcon,
  Calendar as CalendarIcon,
  Award as AwardIcon,
} from "lucide-react";

import { uploadImageToCloudinary } from "@/lib/cloudinary";
import Swal from "sweetalert2";

// ======================================================
// TYPES
// ======================================================

type ProductStatus =
  | "Active"
  | "Draft"
  | "Trending"
  | "Featured"
  | "OutOfStock";

type Unit = "M" | "FT" | "INC" | "CM" | "MM";

type DimensionType = "width" | "depth" | "height";

interface Product {
  _id?: string;
  id: string;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  images?: string[];
  stock: number;
  status: ProductStatus;
  rating?: number;
  discount?: number;
  materials?: string[];
  colors?: string[];
  sizes?: string[];
  warrantyInfo?: string;
  returnPolicy?: string;
  note?: string;
  createdAt?: Date;
  // নতুন ফিল্ড
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

interface SizeValues {
  M: string;
  FT: string;
  INC: string;
  CM: string;
  MM: string;
}

interface DimensionValues {
  width: SizeValues;
  depth: SizeValues;
  height: SizeValues;
}

interface SizeOption {
  id: string;
  label: string;
  primaryUnit: Unit;
  dimensions: DimensionValues;
  price: string;
}

interface MaterialOption {
  id: string;
  label: string;
  description: string;
  basePrice: string;
  enabled: boolean;
}

// ======================================================
// UNIT CONVERSION
// ======================================================

const unitConversions: Record<
  Unit,
  {
    toMM: number;
    label: string;
  }
> = {
  M: { toMM: 1000, label: "Meter" },
  FT: { toMM: 304.8, label: "Feet" },
  INC: { toMM: 25.4, label: "Inch" },
  CM: { toMM: 10, label: "Centimeter" },
  MM: { toMM: 1, label: "Millimeter" },
};

const unitOrder: Unit[] = ["FT", "INC", "M", "CM"];

const convertUnit = (value: number, from: Unit, to: Unit): number => {
  const mm = value * unitConversions[from].toMM;
  return mm / unitConversions[to].toMM;
};

const formatNumber = (value: number): string => {
  if (!Number.isFinite(value)) return "";
  if (Number.isInteger(value)) return String(value);
  return value.toFixed(2).replace(/\.?0+$/, "");
};

const createEmptySizeValues = (): SizeValues => ({
  M: "",
  FT: "",
  INC: "",
  CM: "",
  MM: "",
});

const createEmptyDimensions = (): DimensionValues => ({
  width: createEmptySizeValues(),
  depth: createEmptySizeValues(),
  height: createEmptySizeValues(),
});

// ======================================================
// COLOR SAMPLES
// ======================================================

const colorOptions = [
  { name: "শ্যাম্পেন গোল্ড", value: "শ্যাম্পেন গোল্ড", hex: "#D0B798" },
  { name: "রোজ গোল্ড", value: "রোজ গোল্ড", hex: "#D8CAC1" },
  { name: "পার্ল হোয়াইট", value: "পার্ল হোয়াইট", hex: "#EEF0EA" },
  { name: "ডকু সাদা", value: "ডকু সাদা", hex: "#ECF0F9" },
  { name: "লেকার ১নং", value: "লেকার ১নং", hex: "#9F4010" },
  { name: "লেকার ২নং", value: "লেকার ২নং", hex: "#421917" },
  { name: "লেকার ৩নং", value: "লেকার ৩নং", hex: "#311919" },
  { name: "লেকার ৩নং", value: "লেকার ৩নং", hex: "#1B1515" },
  { name: "ভিনি: ১নং", value: "ভিনি: ১নং", hex: "#B06F2B" },
  { name: "ভিনি: ২নং", value: "ভিনি: ২নং", hex: "#813B0A" },
  { name: "ভিনি: ৩নং", value: "ভিনি: ৩নং", hex: "#360D09" },
  { name: "MDF ও ভিনি: ১নং", value: "MDF ও ভিনি: ১নং", hex: "#320C01" },
];

// ======================================================
// MATERIAL OPTIONS
// ======================================================

const defaultMaterials: MaterialOption[] = [
  { id: "mdf-18", label: "MDF - 18 mm", description: "Medium Density Fiberboard - 18mm", basePrice: "", enabled: false },
  { id: "mdf-classic-15", label: "MDF - Classic - 15 mm", description: "Medium Density Fiberboard Classic - 15mm", basePrice: "", enabled: false },
  { id: "vnr-18", label: "VNR - 18 mm", description: "Veneer - 18mm", basePrice: "", enabled: false },
  { id: "vnr-classic-15", label: "VNR - Classic - 15 mm", description: "Veneer Classic - 15mm", basePrice: "", enabled: false },
  { id: "partical-melamine", label: "Partical Melamine Board", description: "Particle Board with Melamine Finish", basePrice: "", enabled: false },
  { id: "uv-board", label: "UV Board", description: "UV Coated Board", basePrice: "", enabled: false },
  { id: "pvc-board", label: "PVC Board", description: "Polyvinyl Chloride Board", basePrice: "", enabled: false },
];

// ======================================================
// HELPERS
// ======================================================

const createEmptySize = (id: string): SizeOption => ({
  id,
  label: "",
  primaryUnit: "FT",
  dimensions: createEmptyDimensions(),
  price: "",
});

const calculateDiscount = (currentPrice: number, originalPrice: number) => {
  if (!currentPrice || !originalPrice || originalPrice <= currentPrice) return 0;
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
};

// ======================================================
// INPUT COMPONENT
// ======================================================

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  required?: boolean;
}

const FormInput = React.memo(function FormInput({ label, required, className = "", ...props }: TextInputProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-[#49352D]">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
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
// DIMENSION INPUT
// ======================================================

interface DimensionInputProps {
  label: string;
  dimensionType: DimensionType;
  values: SizeValues;
  primaryUnit: Unit;
  onChange: (dimensionType: DimensionType, values: SizeValues) => void;
}

const DimensionInput = React.memo(function DimensionInput({
  label,
  dimensionType,
  values,
  primaryUnit,
  onChange,
}: DimensionInputProps) {
  const handleValueChange = (unit: Unit, value: string) => {
    const nextValues: SizeValues = { ...values, [unit]: value };

    if (value === "") {
      const emptyValues = createEmptySizeValues();
      emptyValues[unit] = "";
      onChange(dimensionType, emptyValues);
      return;
    }

    const numericValue = Number(value);
    if (!Number.isFinite(numericValue) || numericValue <= 0) {
      onChange(dimensionType, nextValues);
      return;
    }

    const converted = createEmptySizeValues();
    converted[unit] = value;

    unitOrder.forEach((targetUnit) => {
      if (targetUnit === unit) return;
      converted[targetUnit] = formatNumber(convertUnit(numericValue, unit, targetUnit));
    });

    onChange(dimensionType, converted);
  };

  return (
    <div className="rounded-xl border border-[#E7D9CC] bg-white p-3">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#B98A5A]/10">
          <Ruler size={12} className="text-[#B98A5A]" />
        </div>
        <p className="text-xs font-bold text-[#49352D]">{label}</p>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {unitOrder.map((unit) => {
          const isPrimary = unit === primaryUnit;
          return (
            <div key={unit}>
              <label className="mb-1 block text-[9px] font-bold text-[#6A584E]">{unit}</label>
              <input
                type="text"
                inputMode="decimal"
                value={values[unit]}
                onChange={(e) => handleValueChange(unit, e.target.value)}
                placeholder="0"
                className={`h-8 w-full rounded-lg border px-2 text-[10px] font-semibold outline-none transition ${
                  isPrimary
                    ? "border-[#B98A5A] bg-[#FFF7ED] text-[#4A3021]"
                    : "border-[#E7D9CC] bg-gray-50 text-[#514139] focus:border-[#B98A5A]"
                }`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
});

DimensionInput.displayName = "DimensionInput";

// ======================================================
// SIZE ROW
// ======================================================

interface SizeOptionRowProps {
  size: SizeOption;
  onChange: (id: string, field: keyof SizeOption, value: string | DimensionValues) => void;
  onRemove: (id: string) => void;
  canRemove: boolean;
}

const SizeOptionRow = React.memo(function SizeOptionRow({
  size,
  onChange,
  onRemove,
  canRemove,
}: SizeOptionRowProps) {
  const [label, setLabel] = useState(size.label);
  const [primaryUnit, setPrimaryUnit] = useState<Unit>(size.primaryUnit);
  const [dimensions, setDimensions] = useState<DimensionValues>(size.dimensions);
  const [price, setPrice] = useState(size.price);

  useEffect(() => setLabel(size.label), [size.label]);
  useEffect(() => setPrimaryUnit(size.primaryUnit), [size.primaryUnit]);
  useEffect(() => setDimensions(size.dimensions), [size.dimensions]);
  useEffect(() => setPrice(size.price), [size.price]);

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = e.target.value;
    setLabel(nextValue);
    onChange(size.id, "label", nextValue);
  };

  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextUnit = e.target.value as Unit;
    setPrimaryUnit(nextUnit);
    onChange(size.id, "primaryUnit", nextUnit);
  };

  const handleDimensionChange = (dimensionType: DimensionType, values: SizeValues) => {
    const nextDimensions = { ...dimensions, [dimensionType]: values };
    setDimensions(nextDimensions);
    onChange(size.id, "dimensions", nextDimensions);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = e.target.value;
    setPrice(nextValue);
    onChange(size.id, "price", nextValue);
  };

  return (
    <div className="rounded-2xl border border-[#E7D9CC] bg-gradient-to-br from-[#FFFCF8] to-[#FBF5EE] p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#B98A5A]/10">
            <Ruler size={15} className="text-[#B98A5A]" />
          </div>
          <div>
            <p className="text-xs font-bold text-[#4A342A]">Size Option</p>
            <p className="text-[10px] text-[#9B8C82]">Width × Depth × Height - সব unit auto convert</p>
          </div>
        </div>

        {canRemove && (
          <button
            type="button"
            onClick={() => onRemove(size.id)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-red-100 bg-white text-red-400 transition hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-[11px] font-bold text-[#5C493F]">Size Name</label>
          <input
            type="text"
            value={label}
            onChange={handleLabelChange}
            placeholder="e.g. Large, 3 Seater"
            className="h-10 w-full rounded-xl border border-[#E7D9CC] bg-white px-3 text-xs text-[#30231E] outline-none transition placeholder:text-[#B6A79E] focus:border-[#B98A5A] focus:ring-4 focus:ring-[#B98A5A]/10"
          />
        </div>

        <div>
          <label className="mb-2 block text-[11px] font-bold text-[#5C493F]">Primary Unit</label>
          <div className="relative">
            <select
              value={primaryUnit}
              onChange={handleUnitChange}
              className="h-10 w-full appearance-none rounded-xl border border-[#E7D9CC] bg-white px-3 pr-9 text-xs font-semibold text-[#30231E] outline-none focus:border-[#B98A5A] focus:ring-4 focus:ring-[#B98A5A]/10"
            >
              <option value="M">M — Meter</option>
              <option value="FT">FT — Feet</option>
              <option value="INC">INC — Inch</option>
              <option value="CM">CM — Centimeter</option>
              <option value="MM">MM — Millimeter</option>
            </select>
            <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#9C8A7D]" />
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <DimensionInput label="Width (প্রস্থ)" dimensionType="width" values={dimensions.width} primaryUnit={primaryUnit} onChange={handleDimensionChange} />
        <DimensionInput label="Depth (গভীরতা)" dimensionType="depth" values={dimensions.depth} primaryUnit={primaryUnit} onChange={handleDimensionChange} />
        <DimensionInput label="Height (উচ্চতা)" dimensionType="height" values={dimensions.height} primaryUnit={primaryUnit} onChange={handleDimensionChange} />
      </div>

      <div className="mt-3 flex items-center gap-2 rounded-lg bg-[#B98A5A]/5 px-3 py-2">
        <Ruler size={12} className="shrink-0 text-[#B98A5A]" />
        <p className="text-[10px] leading-relaxed text-[#89776C]">
          যেকোনো একটি unit-এ value লিখলেই অন্যগুলো automatically convert হবে। Width, Depth, Height - তিনটাই আলাদা করে দিন।
        </p>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
  <div>
    <label className="mb-2 block text-[11px] font-bold text-[#5C493F]">
      Extra Size Price
    </label>
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-[#9A806D]">
        ৳
      </span>
      <input
        type="text"
        inputMode="decimal"
        value={price}
        onChange={handlePriceChange}
        placeholder="Optional"
        className="h-10 w-full rounded-xl border border-[#E7D9CC] bg-white pl-8 pr-3 text-xs text-[#30231E] outline-none focus:border-[#B98A5A] focus:ring-4 focus:ring-[#B98A5A]/10"
      />
    </div>
  </div>

  {/* Secondary info panel — grid-এর দ্বিতীয় কলাম */}
  <div className="flex items-center gap-2 rounded-lg bg-[#B98A5A]/5 px-3 py-2 h-10 mt-[26px]">
    <Ruler size={12} className="shrink-0 text-[#B98A5A]" />
    <p className="text-[10px] leading-tight text-[#89776C]">
      এই size-এর জন্য অতিরিক্ত মূল্য (ঐচ্ছিক)
    </p>
  </div>
</div>
    </div>
  );
});

SizeOptionRow.displayName = "SizeOptionRow";

// ======================================================
// STATUS BADGE
// ======================================================

function StatusBadge({ status }: { status: ProductStatus }) {
  const badges: Record<ProductStatus, { className: string; icon: React.ReactNode }> = {
    Active: { className: "bg-green-50 text-green-700 border-green-200", icon: <Check size={12} /> },
    Draft: { className: "bg-gray-50 text-gray-600 border-gray-200", icon: <Clock size={12} /> },
    Trending: { className: "bg-orange-50 text-orange-700 border-orange-200", icon: <TrendingUp size={12} /> },
    Featured: { className: "bg-purple-50 text-purple-700 border-purple-200", icon: <Flame size={12} /> },
    OutOfStock: { className: "bg-red-50 text-red-700 border-red-200", icon: <AlertCircle size={12} /> },
  };

  const badge = badges[status] || badges.Active;

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold ${badge.className}`}>
      {badge.icon}
      {status}
    </span>
  );
}

// ======================================================
// TOGGLE COLLECTION BUTTON
// ======================================================

interface ToggleCollectionButtonProps {
  isActive: boolean;
  onClick: () => void;
  label: string;
  icon: React.ReactNode;
  activeColor: string;
}

const ToggleCollectionButton = ({ isActive, onClick, label, icon, activeColor }: ToggleCollectionButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1 rounded-lg px-2 py-1 text-[9px] font-bold transition ${
        isActive ? `${activeColor} text-white` : "bg-gray-100 text-gray-500 hover:bg-gray-200"
      }`}
    >
      {icon}
      {label}
    </button>
  );
};

// ======================================================
// MAIN COMPONENT
// ======================================================

export default function ProductEntryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Dynamic Categories
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("10");
  const [status, setStatus] = useState<ProductStatus>("Active");
  const [rating, setRating] = useState("5");

  const [image, setImage] = useState("");
  const [images, setImages] = useState<string[]>([]);

  const [materials, setMaterials] = useState("");
  const [solidWoodPrice, setSolidWoodPrice] = useState("");
  const [materialOptions, setMaterialOptions] = useState<MaterialOption[]>(defaultMaterials);

  const [colors, setColors] = useState("");
  const [sizeOptions, setSizeOptions] = useState<SizeOption[]>([createEmptySize("size-1")]);

  const [warrantyInfo, setWarrantyInfo] = useState("1 Year Service Warranty");
  const [returnPolicy, setReturnPolicy] = useState("3 Days Easy Return & Replacement");
  const [note, setNote] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const multiFileInputRef = useRef<HTMLInputElement>(null);

  // Fetch Categories
  const fetchCategories = useCallback(async () => {
    try {
      setLoadingCategories(true);
      const res = await fetch("/api/categories");
      const data = await res.json();

      if (data.success && Array.isArray(data.categories)) {
        setCategories(data.categories);
        // Set default category if available
        if (data.categories.length > 0 && !category) {
          setCategory(data.categories[0].name);
        }
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      // Fallback to default categories
      const fallbackCategories = [
        "Sofa & Sectionals",
        "Center & Coffee Tables",
        "TV Units & Media Centers",
        "Accent Chairs & Ottomans",
        "Recliner & Rocking Chairs",
        "Wall Shelves & Floating Shelves",
        "Dining Tables & Chairs",
        "Beds & Headboards",
        "Wardrobes & Almirah",
        "Office Chairs",
        "Study & Computer Desks",
        "Outdoor & Garden Furniture",
        "Mattresses & Protectors",
      ];
      setCategories(fallbackCategories.map((name, index) => ({
        _id: String(index),
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        image: "",
      })));
      if (fallbackCategories.length > 0) {
        setCategory(fallbackCategories[0]);
      }
    } finally {
      setLoadingCategories(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/products");
      const data = await res.json();

      if (!res.ok) throw new Error(data?.error || "Failed to fetch products");

      const formatted: Product[] = Array.isArray(data)
        ? data.map((product: Product) => ({ ...product, id: product._id || product.id }))
        : [];

      setProducts(formatted);
    } catch (error) {
      console.error("Fetch products error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // ======================================================
  // SEARCH & FILTER
  // ======================================================

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === "all" || product.category === filterCategory;
      const matchesStatus = filterStatus === "all" || product.status === filterStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, searchQuery, filterCategory, filterStatus]);

  // ======================================================
  // COLLECTION TOGGLE HANDLER
  // ======================================================

 const handleToggleCollection = async (
  productId: string,
  collectionType: "best-seller" | "today-deal" | "new-arrival" | "deal-of-the-week" | "top-rated"
) => {
  try {
    // আপডেট করার আগে বর্তমান প্রোডাক্টের অবস্থা চেক করুন
    const currentProduct = products.find((p) => p.id === productId);
    
    const shouldAdd = !currentProduct?.[
      collectionType === "best-seller" ? "isBestSeller" :
      collectionType === "today-deal" ? "isTodayDeal" :
      collectionType === "new-arrival" ? "isNewArrival" :
      collectionType === "deal-of-the-week" ? "isDealOfTheWeek" :
      "isTopRated"
    ];

    const res = await fetch("/api/collections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: collectionType,
        productIds: [productId],
        action: shouldAdd ? "add" : "remove", // add বা remove নির্ধারণ
      }),
    });

    if (!res.ok) throw new Error("Failed to update collection");

    await fetchProducts();

    Swal.fire({
      title: "Success!",
      text: shouldAdd ? "Product added to collection." : "Product removed from collection.",
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    });
  } catch (error) {
    console.error("Toggle collection error:", error);
    Swal.fire({
      title: "Error!",
      text: "Failed to update collection.",
      icon: "error",
    });
  }
};

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

    const readers = selected.map(
      (file) =>
        new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        })
    );

    Promise.all(readers).then((newImages) => {
      setImages((prev) => [...prev, ...newImages]);
    });

    e.target.value = "";
  };

  const removeImage = (index: number) => setImages((prev) => prev.filter((_, i) => i !== index));

  const addSize = () => setSizeOptions((prev) => [...prev, createEmptySize(`size-${Date.now()}`)]);

  const removeSize = (id: string) => setSizeOptions((prev) => prev.filter((item) => item.id !== id));

  const updateSize = (id: string, field: keyof SizeOption, value: string | DimensionValues) => {
    setSizeOptions((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const toggleMaterial = (id: string) => {
    setMaterialOptions((prev) => prev.map((item) => (item.id === id ? { ...item, enabled: !item.enabled } : item)));
  };

  const updateMaterialPrice = (id: string, value: string) => {
    setMaterialOptions((prev) => prev.map((item) => (item.id === id ? { ...item, basePrice: value } : item)));
  };

  const getSelectedColors = () => colors.split(",").map((item) => item.trim()).filter(Boolean);

  const toggleColor = (color: string) => {
    const selected = getSelectedColors();
    if (selected.includes(color)) {
      setColors(selected.filter((item) => item !== color).join(", "));
    } else {
      setColors([...selected, color].join(", "));
    }
  };

  const removeSelectedColor = (color: string) => {
    setColors(getSelectedColors().filter((item) => item !== color).join(", "));
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice("");
    setOriginalPrice("");
    setCategory(categories[0]?.name || "");
    setStock("10");
    setStatus("Active");
    setRating("5");
    setImage("");
    setImages([]);
    setMaterials("");
    setColors("");
    setSolidWoodPrice("");
    setMaterialOptions(defaultMaterials.map((item) => ({ ...item, basePrice: "", enabled: false })));
    setSizeOptions([createEmptySize("size-1")]);
    setWarrantyInfo("1 Year Service Warranty");
    setReturnPolicy("3 Days Easy Return & Replacement");
    setNote("");
    setEditingId(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (multiFileInputRef.current) multiFileInputRef.current.value = "";
  };

  const startEdit = (product: Product) => {
    setEditingId(product.id);
    setName(product.name || "");
    setDescription(product.description || "");
    setPrice(product.price?.toString() || "");
    setOriginalPrice(product.originalPrice?.toString() || "");
    setCategory(product.category || categories[0]?.name || "");
    setStock(product.stock?.toString() || "0");
    setStatus(product.status || "Active");
    setRating(product.rating?.toString() || "5");
    setImage(product.image || "");
    setImages(product.images || []);
    setMaterials(product.materials?.join(", ") || "");
    setColors(product.colors?.join(", ") || "");
    setWarrantyInfo(product.warrantyInfo || "1 Year Service Warranty");
    setReturnPolicy(product.returnPolicy || "3 Days Easy Return & Replacement");
    setNote(product.note || "");

    if (product.sizes && product.sizes.length) {
      const parsedSizes = product.sizes.map((sizeText, index) => {
        const match = sizeText.match(/^(.+?):\s*(.*?)\s+(M|FT|INC|CM|MM)/);
        if (match) {
          const label = match[1]?.trim() || "";
          const value = match[2]?.trim() || "";
          const unit = match[3] as Unit;
          const numeric = Number(value);
          const values: SizeValues = createEmptySizeValues();
          if (Number.isFinite(numeric)) {
            unitOrder.forEach((target) => {
              values[target] = formatNumber(convertUnit(numeric, unit, target));
            });
          }
          return {
            id: `edit-${index}`,
            label,
            primaryUnit: unit,
            dimensions: { width: { ...values }, depth: { ...values }, height: { ...values } },
            price: sizeText.match(/-\s*৳([\d.]+)/)?.[1] || "",
          };
        }
        return createEmptySize(`edit-${index}`);
      });
      setSizeOptions(parsedSizes);
    } else {
      setSizeOptions([createEmptySize("size-1")]);
    }
  };

  const deleteProduct = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this product?");
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/products?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete product");
      setProducts((prev) => prev.filter((product) => product.id !== id));
      if (editingId === id) resetForm();
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete product.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price || (!image && images.length === 0)) {
      alert("Please fill required fields and upload an image.");
      return;
    }

    setUploading(true);

    try {
      let finalImageUrl = image;
      if (!finalImageUrl && images.length) finalImageUrl = images[0];

      if (finalImageUrl.startsWith("data:")) {
        const response = await fetch(finalImageUrl);
        const blob = await response.blob();
        const file = new File([blob], "product-main-image.jpg", { type: blob.type });
        finalImageUrl = await uploadImageToCloudinary(file);
      }

      let finalImages = [...images];
      if (finalImages.some((img) => img.startsWith("data:"))) {
        finalImages = await Promise.all(
          finalImages.map(async (img) => {
            if (!img.startsWith("data:")) return img;
            const response = await fetch(img);
            const blob = await response.blob();
            const file = new File([blob], "product-gallery-image.jpg", { type: blob.type });
            return await uploadImageToCloudinary(file);
          })
        );
      }

      const finalPrice = parseFloat(price);
      const finalOriginalPrice = originalPrice ? parseFloat(originalPrice) : undefined;
      const discount = finalOriginalPrice && finalOriginalPrice > finalPrice ? calculateDiscount(finalPrice, finalOriginalPrice) : 0;

      const formattedSizes = sizeOptions
        .filter((size) => {
          const widthValue = size.dimensions.width[size.primaryUnit];
          return widthValue && Number(widthValue) > 0;
        })
        .map((size) => {
          const getDimensionValues = (dimensionType: DimensionType) => {
            const primaryValue = size.dimensions[dimensionType][size.primaryUnit];
            const numeric = Number(primaryValue);
            if (!primaryValue || !Number.isFinite(numeric) || numeric <= 0) return null;
            return {
              mm: formatNumber(convertUnit(numeric, size.primaryUnit, "MM")),
              cm: formatNumber(convertUnit(numeric, size.primaryUnit, "CM")),
              m: formatNumber(convertUnit(numeric, size.primaryUnit, "M")),
              in: formatNumber(convertUnit(numeric, size.primaryUnit, "INC")),
              ft: formatNumber(convertUnit(numeric, size.primaryUnit, "FT")),
            };
          };

          const L = getDimensionValues("depth");
          const W = getDimensionValues("width");
          const H = getDimensionValues("height");
          if (!L || !W || !H) return "";

          const sizeString = `${size.label ? size.label + ": " : ""}
L${L.mm} X W${W.mm} X H${H.mm} mm
L${L.cm} X W${W.cm} X H${H.cm} cm
L${L.m} X W${W.m} X H${H.m} m
L${L.in} X W${W.in} X H${H.in} in
L${L.ft} X W${W.ft} X H${H.ft} ft`;

          return size.price ? `${sizeString} - ৳${size.price}` : sizeString;
        })
        .filter(Boolean);

      const materialStrings: string[] = [];
      if (materials.trim()) {
        const customMaterials = materials.split(",").map((item) => item.trim()).filter(Boolean);
        materialStrings.push(...customMaterials);
      }
      materialOptions.forEach((material) => {
        if (material.enabled) {
          const priceStr = material.basePrice ? ` (৳${material.basePrice})` : "";
          materialStrings.push(`${material.label}${priceStr}`);
        }
      });

      const selectedColorObjects = getSelectedColors().map((colorName) => {
        const colorOption = colorOptions.find((c) => c.value === colorName);
        return colorOption ? `${colorName} (${colorOption.hex})` : colorName;
      });

      const payload = {
        name: name.trim(),
        description: description.trim(),
        price: finalPrice,
        originalPrice: finalOriginalPrice,
        category,
        image: finalImageUrl,
        images: finalImages,
        stock: parseInt(stock) || 0,
        status,
        rating: parseFloat(rating) || 0,
        discount,
        materials: materialStrings,
        colors: selectedColorObjects,
        sizes: formattedSizes,
        warrantyInfo: warrantyInfo.trim(),
        returnPolicy: returnPolicy.trim(),
        note: note.trim(),
      };

      let res: Response;
      if (editingId) {
        res = await fetch("/api/products", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingId, ...payload }),
        });
      } else {
        res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const result = await res.json();
      if (!res.ok) throw new Error(result?.error || "Failed to save product");

      await fetchProducts();
      alert(editingId ? "Product updated successfully!" : "Product added successfully!");
      resetForm();
    } catch (error) {
      console.error("Submit error:", error);
      alert(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setUploading(false);
    }
  };

  const liveDiscount = price && originalPrice ? calculateDiscount(parseFloat(price) || 0, parseFloat(originalPrice) || 0) : 0;
  const selectedColors = getSelectedColors();

  return (
    <div className="min-h-screen bg-[#F7F2EC] px-4 py-6 text-[#30231E] md:px-8 md:py-8">
      <div className="mx-auto max-w-[1500px]">
        {/* Header */}
        <div className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#B98A5A] text-white shadow-md">
                <Box size={20} />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-[#402B22] md:text-3xl">Product Entry</h1>
                <p className="text-xs text-[#8C7A6D] md:text-sm">Add and manage your furniture products</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-[#E5D8CB] bg-white px-4 py-2 shadow-sm">
            <PackageOpen size={17} className="text-[#B98A5A]" />
            <span className="text-sm font-bold text-[#57443A]">{products.length}</span>
            <span className="text-xs text-[#99897E]">Products</span>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[480px_minmax(0,1fr)] gap-7">
          {/* LEFT: Form */}
          <div className="rounded-3xl border border-[#E6D8CB] bg-white p-5 shadow-[0_15px_50px_rgba(75,50,30,0.08)] md:p-6">
            <div className="mb-6 flex items-center justify-between border-b border-[#EEE4DC] pb-5">
              <div>
                <div className="flex items-center gap-2">
                  {editingId ? <Edit3 size={19} className="text-[#B98A5A]" /> : <Plus size={19} className="text-[#B98A5A]" />}
                  <h2 className="text-lg font-black text-[#432E25]">{editingId ? "Update Product" : "Add New Product"}</h2>
                </div>
                <p className="mt-1 text-[11px] text-[#9C8A7E]">Fill in the product details below</p>
              </div>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F7F0E9] text-[#8D7768] transition hover:bg-red-50 hover:text-red-500"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* IMAGE */}
              <div>
                <label className="mb-2 block text-sm font-bold text-[#49352D]">
                  Main Product Image <span className="ml-1 text-red-500">*</span>
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="group relative h-52 cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed border-[#DECDBC] bg-[#FCF8F3] transition hover:border-[#B98A5A]"
                >
                  {image ? (
                    <>
                      <img src={image} alt="Product preview" className="h-full w-full object-cover" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition group-hover:opacity-100">
                        <div className="rounded-full bg-white p-3 text-[#6D503D]"><ImageIcon size={20} /></div>
                      </div>
                    </>
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center">
                      <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#B98A5A]/10">
                        <ImageIcon size={26} className="text-[#B98A5A]" />
                      </div>
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
                  {images.map((img, index) => (
                    <div key={`${img}-${index}`} className="group relative h-16 w-16 overflow-hidden rounded-xl border border-[#E5D8CB] bg-[#FCF8F3]">
                      <img src={img} alt={`Gallery ${index + 1}`} className="h-full w-full object-cover" />
                      <button type="button" onClick={() => removeImage(index)} className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition group-hover:opacity-100">
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                  {images.length < 5 && (
                    <button type="button" onClick={() => multiFileInputRef.current?.click()} className="flex h-16 w-16 items-center justify-center rounded-xl border-2 border-dashed border-[#DECDBC] bg-[#FCF8F3] text-[#B98A5A] transition hover:border-[#B98A5A] hover:bg-[#FFF7ED]">
                      <Plus size={21} />
                    </button>
                  )}
                </div>
                <input ref={multiFileInputRef} type="file" accept="image/*" multiple onChange={handleMultipleImagesChange} className="hidden" />
              </div>

              {/* BASIC INFO */}
              <div className="rounded-2xl border border-[#EEE4DC] bg-[#FFFCF9] p-4">
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#B98A5A]/10">
                    <Layers size={15} className="text-[#B98A5A]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-[#49352D]">Basic Information</h3>
                    <p className="text-[9px] text-[#A09289]">Product identity and pricing</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <FormInput label="Product Name" required type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Modern Luxury Sofa" />
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#49352D]">Description</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter product description..." rows={4} className="w-full resize-y rounded-xl border border-[#E7D9CC] bg-white px-4 py-3 text-sm text-[#30231E] outline-none transition placeholder:text-[#B6A79E] focus:border-[#B98A5A] focus:ring-4 focus:ring-[#B98A5A]/10" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#49352D]">Price <span className="ml-1 text-red-500">*</span></label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-[#A0836E]">৳</span>
                        <input type="text" inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="15000" className="w-full rounded-xl border border-[#E7D9CC] bg-white py-3 pl-8 pr-3 text-sm outline-none focus:border-[#B98A5A] focus:ring-4 focus:ring-[#B98A5A]/10" required />
                      </div>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-[#49352D]">Original Price</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-[#A0836E]">৳</span>
                        <input type="text" inputMode="decimal" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} placeholder="18000" className="w-full rounded-xl border border-[#E7D9CC] bg-white py-3 pl-8 pr-3 text-sm outline-none focus:border-[#B98A5A] focus:ring-4 focus:ring-[#B98A5A]/10" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#49352D]">Materials</label>
                    <input type="text" value={materials} onChange={(e) => setMaterials(e.target.value)} placeholder="e.g. Solid Wood, Fabric, Glass..." className="w-full rounded-xl border border-[#E7D9CC] bg-white px-4 py-3 text-sm outline-none focus:border-[#B98A5A] focus:ring-4 focus:ring-[#B98A5A]/10" />
                  </div>

                  {liveDiscount > 0 && (
                    <div className="rounded-xl border border-green-100 bg-green-50 px-3 py-2 text-xs font-bold text-green-700">🎉 Discount: {liveDiscount}%</div>
                  )}

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#49352D]">Category</label>
                    {loadingCategories ? (
                      <div className="w-full rounded-xl border border-[#E7D9CC] bg-white px-3 py-3 text-sm text-gray-400">Loading categories...</div>
                    ) : (
                      <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-xl border border-[#E7D9CC] bg-white px-3 py-3 text-sm outline-none focus:border-[#B98A5A] focus:ring-4 focus:ring-[#B98A5A]/10">
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                          <option key={cat._id} value={cat.name}>{cat.name}</option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              </div>

              {/* MATERIAL OPTIONS */}
<div className="rounded-2xl border border-[#EEE4DC] bg-[#FFFCF9] p-4">
  <div className="mb-4 flex items-center gap-2">
    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#B98A5A]/10">
      <Layers size={15} className="text-[#B98A5A]" />
    </div>
    <div>
      <h3 className="text-sm font-black text-[#49352D]">Material Options</h3>
      <p className="text-[9px] text-[#A09289]">Select materials with optional prices</p>
    </div>
  </div>

  <div className="space-y-3">
    {materialOptions.map((material) => (
      <div key={material.id} className={`rounded-xl border p-3 transition ${material.enabled ? "border-[#C8A77F] bg-[#FFF8EF]" : "border-[#E7D9CC] bg-white"}`}>
        <div className="flex items-center justify-between gap-3">
          <label className="flex min-w-0 cursor-pointer items-center gap-3">
            <input type="checkbox" checked={material.enabled} onChange={() => toggleMaterial(material.id)} className="h-4 w-4 accent-[#B98A5A]" />
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#4A352B]">{material.label}</p>
              <p className="truncate text-[9px] text-[#9D8C81]">{material.description}</p>
            </div>
          </label>
          {material.enabled && (
            <div className="relative w-28 shrink-0">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-[#9A806D]">৳</span>
              <input type="text" inputMode="decimal" value={material.basePrice} onChange={(e) => updateMaterialPrice(material.id, e.target.value)} placeholder="Price" className="w-full rounded-lg border border-[#E7D9CC] bg-white py-2 pl-6 pr-2 text-[11px] outline-none focus:border-[#B98A5A]" />
            </div>
          )}
        </div>
      </div>
    ))}
  </div>
</div>

              {/* COLORS */}
              <div className="rounded-2xl border border-[#EEE4DC] bg-[#FFFCF9] p-4">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#B98A5A]/10">
                      <Palette size={15} className="text-[#B98A5A]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-[#49352D]">Color & Finish</h3>
                      <p className="text-[9px] text-[#A09289]">Click a sample to select</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-[#F7EEE5] px-2 py-1 text-[9px] font-bold text-[#96785F]">{selectedColors.length} Selected</span>
                </div>

                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {colorOptions.map((color) => {
                    const selected = selectedColors.includes(color.value);
                    return (
                      <button key={color.value} type="button" onClick={() => toggleColor(color.value)} className={`group relative overflow-hidden rounded-xl border-2 bg-white text-left transition ${selected ? "border-[#B98A5A] shadow-md ring-2 ring-[#B98A5A]/15" : "border-[#E8DDD4] hover:border-[#C9AA8B]"}`}>
                        <div className="h-16 w-full transition group-hover:scale-[1.02]" style={{ backgroundColor: color.hex }} />
                        <div className="flex min-h-[42px] items-center justify-between gap-1 px-2 py-1.5">
                          <span className="text-[9px] font-bold leading-tight text-[#514139]">{color.name}</span>
                          {selected && (
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#B98A5A] text-white"><Check size={11} /></span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {selectedColors.length > 0 && (
                  <div className="mt-4 rounded-xl border border-[#E7D9CC] bg-white p-3">
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-[#9A8779]">Selected Colors</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedColors.map((color) => {
                        const option = colorOptions.find((item) => item.value === color);
                        return (
                          <button type="button" key={color} onClick={() => removeSelectedColor(color)} className="flex items-center gap-1.5 rounded-full border border-[#E7D9CC] bg-[#FCF8F3] px-2 py-1 text-[9px] font-bold text-[#5C493F]">
                            <span className="h-3 w-3 rounded-full border border-black/10" style={{ backgroundColor: option?.hex || "#ddd" }} />
                            {color}
                            <X size={10} className="text-red-400" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="mt-4">
                  <label className="mb-2 block text-[10px] font-bold text-[#6A584E]">Custom Color</label>
                  <input type="text" value={colors} onChange={(e) => setColors(e.target.value)} placeholder="Or type custom colors..." className="w-full rounded-xl border border-[#E7D9CC] bg-white px-3 py-3 text-xs outline-none focus:border-[#B98A5A] focus:ring-4 focus:ring-[#B98A5A]/10" />
                </div>
              </div>

              {/* SIZES */}
              <div className="rounded-2xl border border-[#EEE4DC] bg-[#FFFCF9] p-4">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#B98A5A]/10">
                      <Ruler size={15} className="text-[#B98A5A]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-[#49352D]">Size Options</h3>
                      <p className="text-[9px] text-[#A09289]">Width × Depth × Height - সব unit auto convert</p>
                    </div>
                  </div>
                  <button type="button" onClick={addSize} className="flex items-center gap-1 rounded-lg bg-[#B98A5A] px-3 py-2 text-[10px] font-bold text-white transition hover:bg-[#9F754B]">
                    <Plus size={12} /> Add Size
                  </button>
                </div>
                <div className="space-y-3">
                  {sizeOptions.map((size) => (
                    <SizeOptionRow key={size.id} size={size} onChange={updateSize} onRemove={removeSize} canRemove={sizeOptions.length > 1} />
                  ))}
                </div>
              </div>

              {/* POLICIES */}
              <div className="rounded-2xl border border-[#EEE4DC] bg-[#FFFCF9] p-4">
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#B98A5A]/10">
                    <ShieldCheck size={15} className="text-[#B98A5A]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-[#49352D]">Product Policies</h3>
                    <p className="text-[9px] text-[#A09289]">Warranty, return and notes</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <FormInput label="Warranty Information" type="text" value={warrantyInfo} onChange={(e) => setWarrantyInfo(e.target.value)} placeholder="1 Year Service Warranty" />
                  <FormInput label="Return Policy" type="text" value={returnPolicy} onChange={(e) => setReturnPolicy(e.target.value)} placeholder="3 Days Easy Return & Replacement" />
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#49352D]">Note</label>
                    <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder="Additional product information..." className="w-full resize-y rounded-xl border border-[#E7D9CC] bg-white px-4 py-3 text-sm outline-none focus:border-[#B98A5A] focus:ring-4 focus:ring-[#B98A5A]/10" />
                  </div>
                </div>
              </div>

              {/* STOCK STATUS */}
              <div className="grid grid-cols-2 gap-3">
                <FormInput label="Stock" type="text" inputMode="numeric" value={stock} onChange={(e) => setStock(e.target.value)} placeholder="10" />
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#49352D]">Status</label>
                  <select value={status} onChange={(e) => setStatus(e.target.value as ProductStatus)} className="w-full rounded-xl border border-[#E7D9CC] bg-white px-3 py-3 text-sm outline-none focus:border-[#B98A5A] focus:ring-4 focus:ring-[#B98A5A]/10">
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                    <option value="Trending">Trending</option>
                    <option value="Featured">Featured</option>
                    <option value="OutOfStock">Out of Stock</option>
                  </select>
                </div>
              </div>

              <FormInput label="Rating" type="text" inputMode="decimal" value={rating} onChange={(e) => setRating(e.target.value)} placeholder="5" />

              {/* SUBMIT */}
              <div className="border-t border-[#EEE4DC] pt-5">
                <button type="submit" disabled={uploading} className={`flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-black text-white shadow-lg transition disabled:cursor-not-allowed disabled:opacity-60 ${editingId ? "bg-[#49332A] hover:bg-[#38251E]" : "bg-[#B98A5A] hover:bg-[#9F754B]"}`}>
                  {uploading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> Processing...
                    </>
                  ) : editingId ? (
                    <>
                      <Check size={17} /> Update Product
                    </>
                  ) : (
                    <>
                      <Save size={17} /> Add Product
                    </>
                  )}
                </button>
                {editingId && (
                  <button type="button" onClick={resetForm} className="mt-2 w-full rounded-2xl border border-[#E7D9CC] bg-white py-3 text-xs font-bold text-[#735F53] transition hover:bg-[#FCF7F2]">
                    Cancel Editing
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* RIGHT: Inventory */}
          <div className="min-w-0 rounded-3xl border border-[#E6D8CB] bg-white p-5 shadow-[0_15px_50px_rgba(75,50,30,0.08)] md:p-6">
            {/* Search & Filter Bar */}
            <div className="mb-6 space-y-4">
              {/* Search Bar */}
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="flex-1 relative">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products by name..."
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#B98A5A] focus:ring-2 focus:ring-[#B98A5A]/10"
                  />
                </div>

                {/* View Toggle */}
                <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-md transition ${viewMode === "list" ? "bg-white shadow-sm text-[#B98A5A]" : "text-gray-500"}`}
                    title="List View"
                  >
                    <List size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-md transition ${viewMode === "grid" ? "bg-white shadow-sm text-[#B98A5A]" : "text-gray-500"}`}
                    title="Grid View"
                  >
                    <Grid3X3 size={16} />
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-col gap-3 sm:flex-row">
                {/* Category Filter - Dynamic */}
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:border-[#B98A5A] focus:ring-2 focus:ring-[#B98A5A]/10"
                >
                  <option value="all">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>

                {/* Status Filter */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:border-[#B98A5A] focus:ring-2 focus:ring-[#B98A5A]/10"
                >
                  <option value="all">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Draft">Draft</option>
                  <option value="Trending">Trending</option>
                  <option value="Featured">Featured</option>
                  <option value="OutOfStock">Out of Stock</option>
                </select>
              </div>
            </div>

            {/* Product Count */}
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing <span className="font-bold text-[#B98A5A]">{filteredProducts.length}</span> of {products.length} products
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setFilterCategory("all");
                  setFilterStatus("all");
                }}
                className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1"
              >
                <X size={12} /> Clear Filters
              </button>
            </div>

            {loading ? (
              <div className="flex min-h-[400px] flex-col items-center justify-center">
                <div className="h-9 w-9 animate-spin rounded-full border-2 border-[#B98A5A] border-t-transparent" />
                <p className="mt-3 text-sm text-[#96857A]">Loading products...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#E5D8CB] bg-[#FCF8F3]">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#B98A5A]/10">
                  <PackageOpen size={30} className="text-[#B98A5A]" />
                </div>
                <h3 className="text-sm font-black text-[#57443A]">No Products Found</h3>
                <p className="mt-1 text-xs text-[#9A8A80]">Try adjusting your search or filters.</p>
              </div>
            ) : viewMode === "list" ? (
              /* LIST VIEW */
              <div className="overflow-x-auto rounded-2xl border border-[#EEE4DC]">
                <table className="w-full min-w-[1200px] border-collapse text-left">
                  <thead>
                    <tr className="bg-[#FCF8F3] text-[10px] uppercase tracking-wide text-[#89786D]">
                      <th className="px-4 py-4 font-bold">Product</th>
                      <th className="px-4 py-4 font-bold">Category</th>
                      <th className="px-4 py-4 font-bold">Price</th>
                      <th className="px-4 py-4 font-bold">Stock</th>
                      <th className="px-4 py-4 font-bold">Status</th>
                      <th className="px-4 py-4 font-bold">Collections</th>
                      <th className="px-4 py-4 text-right font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EEE4DC]">
                    {filteredProducts.map((product) => {
                      const discount = product.originalPrice && product.originalPrice > product.price ? calculateDiscount(product.price, product.originalPrice) : 0;
                      return (
                        <tr key={product.id} className="group transition hover:bg-[#FFFCF8]">
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-[#E5D8CB] bg-[#FCF8F3]">
                                <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                              </div>
                              <div className="min-w-0">
                                <h4 className="max-w-[220px] truncate text-sm font-bold text-[#49342B]">{product.name}</h4>
                                <div className="mt-1 flex items-center gap-2">
                                  <span className="text-[9px] font-mono text-[#A29389]">ID: {product.id.slice(-6)}</span>
                                  {product.rating !== undefined && (
                                    <span className="flex items-center gap-0.5 text-[9px] text-[#806F63]">
                                      <Star size={10} className="fill-yellow-400 text-yellow-400" /> {product.rating}
                                    </span>
                                  )}
                                  {discount > 0 && <span className="rounded bg-red-50 px-1.5 py-0.5 text-[9px] font-bold text-red-500">-{discount}%</span>}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className="rounded-lg border border-[#E7D9CC] bg-[#FCF8F3] px-2.5 py-1.5 text-[9px] font-bold text-[#766459]">{product.category}</span>
                          </td>
                          <td className="px-4 py-4">
                            <div>
                              <p className="text-sm font-black text-[#49332A]">৳{product.price?.toLocaleString()}</p>
                              {product.originalPrice && product.originalPrice > product.price && (
                                <p className="text-[9px] text-[#A29389] line-through">৳{product.originalPrice.toLocaleString()}</p>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`text-xs font-bold ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}>
                              {product.stock > 0 ? `${product.stock} in stock` : "Out of Stock"}
                            </span>
                          </td>
                          <td className="px-4 py-4"><StatusBadge status={product.status} /></td>
                          <td className="px-4 py-4">
                            <div className="flex flex-col gap-1.5">
                              <ToggleCollectionButton isActive={product.isBestSeller || false} onClick={() => handleToggleCollection(product.id, "best-seller")} label="Best Seller" icon={<StarIcon size={11} />} activeColor="bg-[#F6B400]" />
                              <ToggleCollectionButton isActive={product.isTodayDeal || false} onClick={() => handleToggleCollection(product.id, "today-deal")} label="Today's Deal" icon={<ClockIcon size={11} />} activeColor="bg-[#FF7A00]" />
                              <ToggleCollectionButton isActive={product.isNewArrival || false} onClick={() => handleToggleCollection(product.id, "new-arrival")} label="New Arrival" icon={<TrendingUpIcon size={11} />} activeColor="bg-[#2E7D32]" />
                              <ToggleCollectionButton isActive={product.isDealOfTheWeek || false} onClick={() => handleToggleCollection(product.id, "deal-of-the-week")} label="Deal of Week" icon={<CalendarIcon size={11} />} activeColor="bg-[#8B5CF6]" />
                              <ToggleCollectionButton isActive={product.isTopRated || false} onClick={() => handleToggleCollection(product.id, "top-rated")} label="Top Rated" icon={<AwardIcon size={11} />} activeColor="bg-[#EC4899]" />
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center justify-end gap-1">
                              <button type="button" onClick={() => startEdit(product)} className="flex h-9 w-9 items-center justify-center rounded-xl text-[#9A887B] transition hover:bg-[#B98A5A]/10 hover:text-[#B98A5A]" title="Edit">
                                <Edit3 size={15} />
                              </button>
                              <button type="button" onClick={() => deleteProduct(product.id)} className="flex h-9 w-9 items-center justify-center rounded-xl text-[#9A887B] transition hover:bg-red-50 hover:text-red-500" title="Delete">
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              /* GRID VIEW */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts.map((product) => {
                  const discount = product.originalPrice && product.originalPrice > product.price ? calculateDiscount(product.price, product.originalPrice) : 0;
                  return (
                    <div key={product.id} className="group rounded-2xl border border-[#EEE4DC] bg-white overflow-hidden transition hover:shadow-lg hover:border-[#B98A5A]/30">
                      <div className="relative h-40 bg-[#FCF8F3] overflow-hidden">
                        <img src={product.image} alt={product.name} className="h-full w-full object-cover transition group-hover:scale-105" />
                        {discount > 0 && (
                          <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">-{discount}%</span>
                        )}
                        <span className="absolute top-2 right-2 bg-white/90 text-[#49332A] text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                          {product.category}
                        </span>
                      </div>
                      <div className="p-4">
                        <h4 className="text-sm font-bold text-[#49342B] truncate">{product.name}</h4>
                        <div className="mt-2 flex items-center justify-between">
                          <div>
                            <p className="text-base font-black text-[#49332A]">৳{product.price?.toLocaleString()}</p>
                            {product.originalPrice && product.originalPrice > product.price && (
                              <p className="text-[10px] text-[#A29389] line-through">৳{product.originalPrice.toLocaleString()}</p>
                            )}
                          </div>
                          <StatusBadge status={product.status} />
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <span className={`text-[10px] font-bold ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}>
                            {product.stock > 0 ? `${product.stock} in stock` : "Out of Stock"}
                          </span>
                          {product.rating !== undefined && (
                            <span className="flex items-center gap-0.5 text-[10px] text-[#806F63]">
                              <Star size={10} className="fill-yellow-400 text-yellow-400" /> {product.rating}
                            </span>
                          )}
                        </div>
                        <div className="mt-3 flex flex-wrap gap-1">
                          <ToggleCollectionButton isActive={product.isBestSeller || false} onClick={() => handleToggleCollection(product.id, "best-seller")} label="Best Seller" icon={<StarIcon size={10} />} activeColor="bg-[#F6B400]" />
                          <ToggleCollectionButton isActive={product.isTodayDeal || false} onClick={() => handleToggleCollection(product.id, "today-deal")} label="Today's Deal" icon={<ClockIcon size={10} />} activeColor="bg-[#FF7A00]" />
                          <ToggleCollectionButton isActive={product.isNewArrival || false} onClick={() => handleToggleCollection(product.id, "new-arrival")} label="New Arrival" icon={<TrendingUpIcon size={10} />} activeColor="bg-[#2E7D32]" />
                          <ToggleCollectionButton isActive={product.isDealOfTheWeek || false} onClick={() => handleToggleCollection(product.id, "deal-of-the-week")} label="Deal of Week" icon={<CalendarIcon size={10} />} activeColor="bg-[#8B5CF6]" />
                          <ToggleCollectionButton isActive={product.isTopRated || false} onClick={() => handleToggleCollection(product.id, "top-rated")} label="Top Rated" icon={<AwardIcon size={10} />} activeColor="bg-[#EC4899]" />
                        </div>
                        <div className="mt-3 flex items-center justify-end gap-2 border-t border-[#EEE4DC] pt-3">
                          <button type="button" onClick={() => startEdit(product)} className="flex h-8 w-8 items-center justify-center rounded-lg text-[#9A887B] transition hover:bg-[#B98A5A]/10 hover:text-[#B98A5A]" title="Edit">
                            <Edit3 size={14} />
                          </button>
                          <button type="button" onClick={() => deleteProduct(product.id)} className="flex h-8 w-8 items-center justify-center rounded-lg text-[#9A887B] transition hover:bg-red-50 hover:text-red-500" title="Delete">
                            <Trash2 size={14} />
                          </button>
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