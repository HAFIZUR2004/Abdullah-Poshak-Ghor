// app/dashboard/collections/page.tsx

"use client";

import { useState, useEffect, useCallback } from "react";
import { Star, Clock, TrendingUp, Plus, X, Package, Award, Calendar } from "lucide-react";
import CollectionModal from "@/components/dashboard/CollectionModal";
import Swal from "sweetalert2";

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  status: string;
}

export default function CollectionsPage() {
  const [modalOpen, setModalOpen] = useState<
    null | "best-seller" | "today-deal" | "new-arrival" | "deal-of-the-week" | "top-rated"
  >(null);
  const [collections, setCollections] = useState<
    Record<string, Product[]>
  >({
    "best-seller": [],
    "today-deal": [],
    "new-arrival": [],
    "deal-of-the-week": [],
    "top-rated": [],
  });
  const [loading, setLoading] = useState(true);

  const fetchCollections = useCallback(async () => {
    try {
      setLoading(true);

      const types = ["best-seller", "today-deal", "new-arrival", "deal-of-the-week", "top-rated"];
      const results = await Promise.all(
        types.map(async (type) => {
          const res = await fetch(`/api/collections?type=${type}`);
          const data = await res.json();
          return { type, products: Array.isArray(data) ? data : [] };
        })
      );

      const collectionMap: Record<string, Product[]> = {};
      results.forEach((result) => {
        collectionMap[result.type] = result.products;
      });

      setCollections(collectionMap);
    } catch (error) {
      console.error("Failed to fetch collections:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  const handleSave = async (productIds: string[]) => {
    if (!modalOpen) return;

    try {
      const res = await fetch("/api/collections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: modalOpen,
          productIds,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to save collection");
      }

      await fetchCollections();

      Swal.fire({
        title: "Success!",
        text: "Collection saved successfully.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Save error:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to save collection.",
        icon: "error",
      });
    }
  };

  const handleRemoveProduct = async (
    type: string,
    productId: string
  ) => {
    const updatedIds = collections[type]
      .filter((product) => product._id !== productId)
      .map((product) => product._id);

    await handleSave(updatedIds);
  };

  const typeConfigs = {
    "best-seller": {
      title: "Best Sellers",
      icon: Star,
      color: "bg-[#F6B400]",
      description: "Products featured in the Best Sellers section",
    },
    "today-deal": {
      title: "Today's Deals",
      icon: Clock,
      color: "bg-[#FF7A00]",
      description: "Products featured in the Today's Deals section",
    },
    "new-arrival": {
      title: "New Arrivals",
      icon: TrendingUp,
      color: "bg-[#2E7D32]",
      description: "Products featured in the New Arrivals section",
    },
    "deal-of-the-week": {
      title: "Deal of the Week",
      icon: Calendar,
      color: "bg-[#8B5CF6]",
      description: "Products featured in the Deal of the Week section",
    },
    "top-rated": {
      title: "Top Rated Products",
      icon: Award,
      color: "bg-[#EC4899]",
      description: "Products featured in the Top Rated Products section",
    },
  };

  return (
    <div className="min-h-screen bg-[#F7F2EC] px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-[#402B22]">Collections</h1>
          <p className="text-sm text-[#8C7A6D] mt-1">
            Manage your featured product collections
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {Object.entries(typeConfigs).map(([type, config]) => (
            <div
              key={type}
              className="rounded-3xl border border-[#E6D8CB] bg-white p-6 shadow-[0_15px_50px_rgba(75,50,30,0.08)]"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div
                    className={`h-12 w-12 rounded-2xl ${config.color} flex items-center justify-center text-white`}
                  >
                    <config.icon size={24} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-[#30231E]">
                      {config.title}
                    </h2>
                    <p className="text-xs text-gray-500">
                      {config.description}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setModalOpen(type as any)}
                  className="flex items-center gap-1 rounded-xl bg-[#B98A5A] px-3 py-2 text-xs font-bold text-white hover:bg-[#9F754B] transition"
                >
                  <Plus size={14} />
                  Add
                </button>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-10">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#B98A5A] border-t-transparent" />
                </div>
              ) : collections[type]?.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  <Package size={40} className="mx-auto mb-3 text-gray-300" />
                  <p className="text-sm">No products selected yet</p>
                  <button
                    onClick={() => setModalOpen(type as any)}
                    className="mt-2 text-xs font-bold text-[#B98A5A] hover:underline"
                  >
                    + Add products
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {collections[type]?.map((product) => (
                    <div
                      key={product._id}
                      className="flex items-center gap-3 p-2 rounded-xl border border-gray-100 hover:border-gray-200 transition"
                    >
                      <div className="h-10 w-10 rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-[#30231E] truncate">
                          {product.name}
                        </h3>
                        <p className="text-xs text-gray-500">
                          ৳{product.price.toLocaleString()}
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          handleRemoveProduct(type, product._id)
                        }
                        className="h-8 w-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <CollectionModal
          isOpen={true}
          onClose={() => setModalOpen(null)}
          type={modalOpen}
          onSave={handleSave}
        />
      )}
    </div>
  );
}