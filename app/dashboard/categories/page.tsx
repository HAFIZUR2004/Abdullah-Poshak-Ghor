"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FiPlus, FiEdit2, FiTrash2, FiFolder, FiX, FiCheck } from "react-icons/fi";

interface Category {
  _id: string;
  name: string;
  image: string;
  slug: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");

  // Load Categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error("Failed to load categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Form Submit (Create & Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !image) return alert("Please fill all fields");

    setSubmitting(true);
    try {
      const url = editingId ? `/api/categories/${editingId}` : "/api/categories";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, image }),
      });

      const data = await res.json();
      if (data.success) {
        resetForm();
        fetchCategories();
      } else {
        alert(data.message || "Failed to save category");
      }
    } catch (error) {
      console.error("Save Error:", error);
      alert("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  // Edit Button Click handler
  const handleEdit = (category: Category) => {
    setEditingId(category._id);
    setName(category.name);
    setImage(category.image);
  };

  // Delete Handler
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        fetchCategories();
      } else {
        alert(data.message || "Failed to delete");
      }
    } catch (error) {
      console.error("Delete Error:", error);
    }
  };

  // Reset Form
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
          Add new categories or update/delete existing ones.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Add / Edit Form */}
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Chair, Sofa"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-gray-800"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image Path / URL
              </label>
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="/images/chair.png"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-gray-800"
                required
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-amber-500 text-white font-medium py-2.5 rounded-lg hover:bg-amber-600 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {editingId ? <FiCheck size={18} /> : <FiPlus size={18} />}
                {submitting ? "Saving..." : editingId ? "Update Category" : "Add Category"}
              </button>
            </div>
          </form>
        </div>

        {/* Right Side: Categories Table */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading categories...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <th className="p-4">Image</th>
                    <th className="p-4">Category Name</th>
                    <th className="p-4">Slug</th>
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
                      <td className="p-4">
                        <div className="w-12 h-12 relative rounded-lg border bg-gray-50 overflow-hidden">
                          <Image
                            src={cat.image}
                            alt={cat.name}
                            fill
                            className="object-contain p-1"
                          />
                        </div>
                      </td>
                      <td className="p-4 font-semibold text-gray-800">{cat.name}</td>
                      <td className="p-4 text-gray-500 font-mono text-xs">{cat.slug}</td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => handleEdit(cat)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(cat._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {categories.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-gray-400">
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