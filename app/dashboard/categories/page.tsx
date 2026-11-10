"use client";

import { useState, useEffect } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiFolder, FiX, FiCheck } from "react-icons/fi";

interface Category {
  _id: string;
  name: string;
  image?: string;
  slug: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [image, setImage] = useState(""); // optional (advanced users)

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (data.success) setCategories(data.categories);
    } catch (err) {
      console.error("Failed to load categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // ✅ শুধু name required
    if (!name.trim()) return alert("Category name is required");

    setSubmitting(true);
    try {
      const url = editingId
        ? `/api/categories/${editingId}`
        : "/api/categories";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), image: image.trim() }),
      });

      const data = await res.json();
      if (data.success) {
        resetForm();
        fetchCategories();
      } else {
        alert(data.message || "Failed to save category");
      }
    } catch (err) {
      console.error("Save Error:", err);
      alert("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingId(category._id);
    setName(category.name);
    setImage(category.image || "");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) fetchCategories();
      else alert(data.message || "Failed to delete");
    } catch (err) {
      console.error("Delete Error:", err);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setImage("");
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <FiFolder className="text-amber-500" /> Category Management
        </h1>
        <p className="text-sm text-gray-300 mt-1">
          Add, update or delete categories — image is optional.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 h-fit">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">
              {editingId ? "Edit Category" : "Add New Category"}
            </h2>
            {editingId && (
              <button
                onClick={resetForm}
                className="text-xs text-red-500 hover:underline flex items-center gap-1"
              >
                <FiX /> Cancel
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* ✅ শুধু Name required */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Men's Fashion, Panjabi"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-gray-800"
                required
              />
            </div>

            {/* ✅ Image optional */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image Path / URL{" "}
                <span className="text-xs font-normal text-gray-400">(optional)</span>
              </label>
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="/images/mens-fashion.png"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-gray-800"
              />
              <p className="mt-1 text-[11px] text-gray-400">
                ফাঁকা রাখলে image ছাড়াই category save হবে।
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-amber-500 text-white font-medium py-2.5 rounded-lg hover:bg-amber-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {editingId ? <FiCheck size={18} /> : <FiPlus size={18} />}
              {submitting
                ? "Saving..."
                : editingId
                ? "Update Category"
                : "Add Category"}
            </button>
          </form>
        </div>

        {/* Table */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">
              Loading categories...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <th className="p-4">Category Name</th>
                    <th className="p-4">Slug</th>
                    <th className="p-4">Image</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {categories.map((cat) => (
                    <tr
                      key={cat._id}
                      className={`hover:bg-gray-50 transition-colors ${
                        editingId === cat._id ? "bg-amber-50/50" : ""
                      }`}
                    >
                      <td className="p-4 font-semibold text-gray-800">
                        {cat.name}
                      </td>
                      <td className="p-4 text-gray-500 font-mono text-xs">
                        {cat.slug}
                      </td>
                      <td className="p-4">
                        {cat.image ? (
                          <img
                            src={cat.image}
                            alt={cat.name}
                            className="w-10 h-10 rounded-lg border object-contain bg-gray-50"
                          />
                        ) : (
                          <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-[10px] font-medium text-gray-500">
                            No image
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => handleEdit(cat)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(cat._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {categories.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="p-8 text-center text-gray-400"
                      >
                        No categories found. Use the form to create one.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}