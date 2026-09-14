"use client";

import { useState, useEffect } from "react";
import { FiPlus, FiTrash2, FiMapPin, FiPhone, FiHome, FiRefreshCw } from "react-icons/fi";

interface Showroom {
  _id: string;
  city: string;
  address: string;
  phone: string;
  createdAt?: string;
}

export default function AdminShowroomsPage() {
  const [showrooms, setShowrooms] = useState<Showroom[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    city: "",
    address: "",
    phone: "",
  });

  // Fetch Showrooms
  const fetchShowrooms = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/showrooms");
      const result = await res.json();
      if (result.success) {
        setShowrooms(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch showrooms:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchShowrooms();
  }, []);

  // Handle Create Showroom
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.city || !formData.address || !formData.phone) return;

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/showrooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (result.success) {
        setFormData({ city: "", address: "", phone: "" });
        fetchShowrooms();
      } else {
        alert(result.error || "Failed to create showroom");
      }
    } catch (error) {
      console.error("Error creating showroom:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete Showroom
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this showroom?")) return;

    try {
      setDeletingId(id);
      const res = await fetch(`/api/showrooms/${id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (result.success) {
        setShowrooms((prev) => prev.filter((item) => item._id !== id));
      } else {
        alert(result.error || "Failed to delete showroom");
      }
    } catch (error) {
      console.error("Error deleting showroom:", error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#d69a45]/10 border border-[#d69a45]/30 rounded-full px-3 py-0.5 mb-2">
              <span className="w-1.5 h-1.5 bg-[#d69a45] rounded-full" />
              <span className="text-[10px] font-bold text-[#d69a45] uppercase tracking-wider">Admin Panel</span>
            </div>
            <h1 className="text-2xl font-extrabold text-[#2e3a2c]">Manage Showrooms</h1>
            <p className="text-xs text-gray-400 font-light mt-0.5">Add, edit, or delete dynamic outlets displayed on the website.</p>
          </div>

          <button
            onClick={fetchShowrooms}
            disabled={isLoading}
            className="inline-flex items-center gap-2 self-start sm:self-auto text-xs font-semibold text-[#2e3a2c] bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl hover:bg-gray-100 transition-all"
          >
            <FiRefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            Refresh List
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Add Showroom Form */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5 sticky top-6">
              <div className="flex items-center gap-2">
                <FiPlus className="text-[#d69a45]" size={18} />
                <h2 className="text-base font-bold text-[#2e3a2c]">Add New Outlet</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#2e3a2c] mb-1.5">
                    City Name
                  </label>
                  <div className="relative">
                    <FiHome className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input
                      type="text"
                      placeholder="e.g. Dhaka, Chittagong"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#d69a45] focus:bg-white transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2e3a2c] mb-1.5">
                    Full Address
                  </label>
                  <div className="relative">
                    <FiMapPin className="absolute left-3.5 top-3 text-gray-400" size={14} />
                    <textarea
                      placeholder="House, Road, Block & Area Details"
                      rows={3}
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#d69a45] focus:bg-white transition-all resize-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2e3a2c] mb-1.5">
                    Phone Number
                  </label>
                  <div className="relative">
                    <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input
                      type="text"
                      placeholder="+880 1700-000000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#d69a45] focus:bg-white transition-all"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#2e3a2c] hover:bg-[#3a4739] text-white text-xs font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Saving...</span>
                  ) : (
                    <>
                      <FiPlus size={14} /> Add Showroom
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Showrooms List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-[#2e3a2c]">
                Active Showrooms ({showrooms.length})
              </h2>
            </div>

            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-24 bg-white rounded-2xl animate-pulse border border-gray-100" />
                ))}
              </div>
            ) : showrooms.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center space-y-2">
                <FiHome size={32} className="mx-auto text-gray-300" />
                <p className="text-sm font-semibold text-gray-600">No Showrooms Added Yet</p>
                <p className="text-xs text-gray-400 font-light">
                  Use the form on the left to add your first showroom outlet.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {showrooms.map((showroom) => (
                  <div
                    key={showroom._id}
                    className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:border-[#d69a45]/30 transition-all flex items-start justify-between gap-4"
                  >
                    <div className="space-y-1.5">
                      <div className="inline-flex items-center gap-2">
                        <span className="font-extrabold text-sm text-[#2e3a2c]">
                          {showroom.city} Showroom
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 font-light flex items-center gap-1.5">
                        <FiMapPin className="text-[#d69a45] shrink-0" size={13} />
                        {showroom.address}
                      </p>
                      <p className="text-xs text-[#3a4739] font-medium flex items-center gap-1.5">
                        <FiPhone className="text-[#d69a45] shrink-0" size={13} />
                        {showroom.phone}
                      </p>
                    </div>

                    <button
                      onClick={() => handleDelete(showroom._id)}
                      disabled={deletingId === showroom._id}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all shrink-0"
                      title="Delete Showroom"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}