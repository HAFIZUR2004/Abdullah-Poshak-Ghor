// components/dashboard/CollectionModal.tsx

"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Check, Search, Star, Clock, TrendingUp, Calendar, Award } from "lucide-react";

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  status: string;
}

interface CollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "best-seller" | "today-deal" | "new-arrival" | "deal-of-the-week" | "top-rated";
  onSave: (productIds: string[]) => void;
}

const typeConfig = {
  "best-seller": {
    title: "Best Sellers",
    icon: Star,
    color: "bg-[#F6B400]",
  },
  "today-deal": {
    title: "Today's Deals",
    icon: Clock,
    color: "bg-[#FF7A00]",
  },
  "new-arrival": {
    title: "New Arrivals",
    icon: TrendingUp,
    color: "bg-[#2E7D32]",
  },
  "deal-of-the-week": {
    title: "Deal of the Week",
    icon: Calendar,
    color: "bg-[#8B5CF6]",
  },
  "top-rated": {
    title: "Top Rated Products",
    icon: Award,
    color: "bg-[#EC4899]",
  },
};

export default function CollectionModal({
  isOpen,
  onClose,
  type,
  onSave,
}: CollectionModalProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const config = typeConfig[type];

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/products");
      const data = await res.json();

      if (Array.isArray(data)) {
        setProducts(data);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCurrentSelection = useCallback(async () => {
    try {
      const res = await fetch(`/api/collections?type=${type}`);
      const data = await res.json();

      if (Array.isArray(data)) {
        const ids = data.map((product: any) => product._id || product.id);
        setSelectedIds(ids);
      }
    } catch (error) {
      console.error("Failed to fetch current selection:", error);
    }
  }, [type]);

  useEffect(() => {
    if (isOpen) {
      fetchProducts();
      fetchCurrentSelection();
    }
  }, [isOpen, fetchProducts, fetchCurrentSelection]);

  const toggleProduct = (productId: string) => {
    setSelectedIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await onSave(selectedIds);
      onClose();
    } catch (error) {
      console.error("Failed to save:", error);
    } finally {
      setSaving(false);
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl rounded-3xl bg-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div
              className={`h-10 w-10 rounded-xl ${config.color} flex items-center justify-center text-white`}
            >
              <config.icon size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#30231E]">
                {config.title}
              </h2>
              <p className="text-xs text-gray-500">
                Select products for this collection
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="h-9 w-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#B98A5A] focus:ring-2 focus:ring-[#B98A5A]/10"
            />
          </div>
        </div>

        {/* Product List */}
        <div className="max-h-[400px] overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#B98A5A] border-t-transparent" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              No products found
            </div>
          ) : (
            <div className="space-y-2">
              {filteredProducts.map((product) => {
                const isSelected = selectedIds.includes(product._id);

                return (
                  <button
                    key={product._id}
                    onClick={() => toggleProduct(product._id)}
                    className={`w-full flex items-center gap-4 p-3 rounded-xl border-2 transition-all ${
                      isSelected
                        ? "border-[#B98A5A] bg-[#FFF8EF]"
                        : "border-gray-100 hover:border-gray-200 bg-white"
                    }`}
                  >
                    {/* Checkbox */}
                    <div
                      className={`h-6 w-6 shrink-0 rounded-lg border-2 flex items-center justify-center transition-all ${
                        isSelected
                          ? "bg-[#B98A5A] border-[#B98A5A]"
                          : "border-gray-300"
                      }`}
                    >
                      {isSelected && (
                        <Check size={14} className="text-white" />
                      )}
                    </div>

                    {/* Product Image */}
                    <div className="h-14 w-14 shrink-0 rounded-xl overflow-hidden bg-gray-100">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-[#30231E] truncate">
                        {product.name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {product.category} • ৳
                        {product.price.toLocaleString()}
                      </p>
                    </div>

                    {/* Status Badge */}
                    <span
                      className={`shrink-0 text-[10px] font-bold px-2 py-1 rounded-full ${
                        product.status === "Active"
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {product.status}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
          <div className="text-sm text-gray-600">
            <span className="font-bold text-[#B98A5A]">
              {selectedIds.length}
            </span>{" "}
            products selected
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-200 transition"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#B98A5A] text-white text-sm font-bold hover:bg-[#9F754B] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Check size={16} />
              )}
              Save Selection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}