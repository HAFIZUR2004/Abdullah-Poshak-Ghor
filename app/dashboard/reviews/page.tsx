// app/dashboard/reviews/page.tsx
"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { FiEdit2, FiTrash2, FiPlus, FiStar, FiX } from "react-icons/fi";
import Image from "next/image";

interface Review {
  _id: string;
  name: string;
  location: string;
  text: string;
  rating: number;
  date: string;
  verified: boolean;
  isActive: boolean;
  order: number;
  image?: string;
}

export default function ReviewManagementPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    text: "",
    rating: 5,
    verified: true,
    image: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  // ─── Fetch Reviews ──────────────────────────────────────────────────────────
  const fetchReviews = async () => {
    try {
      const res = await fetch("/api/reviews");
      const data = await res.json();
      if (data.success) {
        setReviews(data.reviews);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // ─── Open Modal for Add/Edit ──────────────────────────────────────────────
  const openModal = (review?: Review) => {
    if (review) {
      setEditingReview(review);
      setFormData({
        name: review.name,
        location: review.location,
        text: review.text,
        rating: review.rating,
        verified: review.verified,
        image: review.image || "",
      });
      setImagePreview(review.image || "");
    } else {
      setEditingReview(null);
      setFormData({
        name: "",
        location: "",
        text: "",
        rating: 5,
        verified: true,
        image: "",
      });
      setImagePreview("");
    }
    setIsModalOpen(true);
  };

  // ─── Close Modal ────────────────────────────────────────────────────────────
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingReview(null);
    setImagePreview("");
  };

  // ─── Handle Image Upload ────────────────────────────────────────────────────
// ─── Handle Image Upload ────────────────────────────────────────────────────
const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  if (file.size > 5 * 1024 * 1024) {
    toast.error("Image size should be less than 5MB");
    return;
  }

  const reader = new FileReader();
  reader.onload = (event) => {
    const base64String = event.target?.result as string;
    if (base64String) {
      setFormData((prev) => ({ ...prev, image: base64String }));
      setImagePreview(base64String);
    }
  };
  reader.readAsDataURL(file);
};

  // ─── Handle Submit ──────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const url = editingReview
        ? `/api/reviews/${editingReview._id}`
        : "/api/reviews";
      const method = editingReview ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(editingReview ? "Review updated! ✅" : "Review added! 🎉");
        closeModal();
        fetchReviews();
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error saving review:", error);
      toast.error("Failed to save review");
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Delete Review ──────────────────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Review deleted! 🗑️");
        fetchReviews();
      } else {
        toast.error(data.message || "Failed to delete");
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Failed to delete review");
    }
  };

  // ─── Toggle Active Status ──────────────────────────────────────────────────
  const toggleStatus = async (review: Review) => {
    try {
      const res = await fetch(`/api/reviews/${review._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...review, isActive: !review.isActive }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(`Review ${data.review.isActive ? "activated" : "deactivated"}!`);
        fetchReviews();
      } else {
        toast.error(data.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  // ─── Loading State ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDF6EE] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#0F3D39] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF6EE] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#0B2523]">Review Management</h1>
            <p className="text-[#0F3D39]/70 mt-1">
              Manage customer reviews {reviews.length > 0 && `(${reviews.length} total)`}
            </p>
          </div>

          <button
            onClick={() => openModal()}
            className="px-5 py-2.5 bg-[#0F3D39] text-white rounded-lg font-medium hover:bg-[#0F3D39]/90 transition flex items-center gap-2"
          >
            <FiPlus size={18} />
            Add Review
          </button>
        </div>

        {/* Reviews Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E5D3B3]/30 overflow-hidden">
          {reviews.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">No reviews yet</p>
              <p className="text-sm mt-1">Click "Add Review" to create one</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#FDF6EE] border-b border-[#E5D3B3]/30">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#0F3D39]/70 uppercase tracking-wider">#</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#0F3D39]/70 uppercase tracking-wider">Avatar</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#0F3D39]/70 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#0F3D39]/70 uppercase tracking-wider">Review</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#0F3D39]/70 uppercase tracking-wider">Rating</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#0F3D39]/70 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-[#0F3D39]/70 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5D3B3]/20">
                  {reviews.map((review, index) => (
                    <tr key={review._id} className="hover:bg-[#FDF6EE]/50 transition">
                      <td className="px-6 py-4 text-sm text-gray-500">{index + 1}</td>
                      <td className="px-6 py-4">
                        {review.image ? (
                          <Image
                            src={review.image}
                            alt={review.name}
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-full object-cover border-2 border-[#E5D3B3]/30"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-[#0F3D39] flex items-center justify-center text-white font-bold text-sm">
                            {review.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-[#0B2523]">{review.name}</p>
                          <p className="text-xs text-gray-400">{review.location}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600 line-clamp-2 max-w-xs">
                          {review.text}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <FiStar
                              key={i}
                              className={`size-4 ${i < review.rating ? "text-[#d69a45] fill-[#d69a45]" : "text-gray-300"}`}
                            />
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleStatus(review)}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                            review.isActive
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                          }`}
                        >
                          {review.isActive ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openModal(review)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          >
                            <FiEdit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(review._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#0B2523]">
                {editingReview ? "Edit Review" : "Add New Review"}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#0B2523] mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-[#E5D3B3]/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F3D39] bg-[#FDF6EE]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0B2523] mb-1">
                  Location *
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2.5 border border-[#E5D3B3]/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F3D39] bg-[#FDF6EE]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0B2523] mb-1">
                  Review Text *
                </label>
                <textarea
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  className="w-full px-4 py-2.5 border border-[#E5D3B3]/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F3D39] bg-[#FDF6EE] resize-none"
                  rows={4}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0B2523] mb-1">
                  Avatar Image (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full px-4 py-2 border border-[#E5D3B3]/40 rounded-lg bg-[#FDF6EE] text-sm file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#0F3D39] file:text-[#E5D3B3] hover:file:bg-[#0F3D39]/90 cursor-pointer"
                />
                {imagePreview && (
                  <div className="mt-2">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      width={60}
                      height={60}
                      className="w-16 h-16 rounded-full object-cover border-2 border-[#E5D3B3]/30"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0B2523] mb-1">
                  Rating
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: r })}
                      className={`p-1 rounded-lg transition ${
                        formData.rating >= r ? "text-[#d69a45]" : "text-gray-300"
                      }`}
                    >
                      <FiStar className={`size-6 ${formData.rating >= r ? "fill-[#d69a45]" : ""}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-[#0B2523]">Verified:</label>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, verified: !formData.verified })}
                  className={`relative w-11 h-6 rounded-full transition ${
                    formData.verified ? "bg-[#0F3D39]" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white transition ${
                      formData.verified ? "left-6" : "left-1"
                    }`}
                  />
                </button>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-[#0F3D39] text-white rounded-xl font-bold hover:bg-[#0F3D39]/90 transition disabled:opacity-50"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </span>
                ) : (
                  editingReview ? "Update Review" : "Add Review"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}