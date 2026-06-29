"use client";

import React, { useState, useRef, useEffect } from "react";
import { Plus, Trash2, Edit3, Image, X, Check, PackageOpen, Star, AlertCircle, Tag, Clock, TrendingUp, Flame } from "lucide-react";
import { uploadImageToCloudinary } from "@/lib/cloudinary";

// Product Data Type Definition
interface Product {
  _id?: string;
  id: string;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  stock: number;
  status: 'Active' | 'Draft' | 'Trending' | 'Featured' | 'OutOfStock';
  rating?: number;
  discount?: number;
  createdAt?: Date;
}

export default function ProductDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Form States
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [category, setCategory] = useState("Electronics");
  const [stock, setStock] = useState("10");
  const [status, setStatus] = useState<Product['status']>("Active");
  const [rating, setRating] = useState("5");
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);

  // Edit State
  const [editingId, setEditingId] = useState<string | null>(null);

  // File Input Ref for Image Upload
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch products from MongoDB
  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (res.ok) {
        const formattedProducts = data.map((p: any) => ({
          ...p,
          id: p._id,
        }));
        setProducts(formattedProducts);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle Image Upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Calculate discount percentage
  const calculateDiscount = (price: number, originalPrice: number) => {
    if (originalPrice > price) {
      return Math.round(((originalPrice - price) / originalPrice) * 100);
    }
    return 0;
  };

  // Add or Update Product in MongoDB
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !image) return alert("Please fill all fields and upload an image!");

    setUploading(true);

    try {
      let finalImageUrl = image;

      if (image.startsWith('data:')) {
        const response = await fetch(image);
        const blob = await response.blob();
        const file = new File([blob], 'product-image.jpg', { type: blob.type });
        finalImageUrl = await uploadImageToCloudinary(file);
      }

      const finalPrice = parseFloat(price);
      const finalOriginalPrice = originalPrice ? parseFloat(originalPrice) : undefined;
      const discount = finalOriginalPrice && finalOriginalPrice > finalPrice
        ? calculateDiscount(finalPrice, finalOriginalPrice)
        : 0;

      const payload = {
        name,
        description: description || "",
        price: finalPrice,
        originalPrice: finalOriginalPrice,
        category,
        image: finalImageUrl,
        stock: parseInt(stock) || 0,
        status,
        rating: parseFloat(rating) || 0,
        discount,
      };

      let res;
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

      if (res.ok) {
        await fetchProducts();
        resetForm();
      } else {
        const errorData = await res.json();
        alert(`Failed to save product: ${errorData.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert("Something went wrong, please try again.");
    } finally {
      setUploading(false);
    }
  };

  // Start Edit
  const startEdit = (product: Product) => {
    setEditingId(product.id);
    setName(product.name);
    setDescription(product.description || "");
    setPrice(product.price.toString());
    setOriginalPrice(product.originalPrice?.toString() || "");
    setCategory(product.category);
    setStock(product.stock.toString());
    setStatus(product.status);
    setRating(product.rating?.toString() || "5");
    setImage(product.image);
  };

  // Delete Product from MongoDB
  const deleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`/api/products?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setProducts(products.filter((p) => p.id !== id));
      } else {
        alert("Failed to delete product from database");
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // Reset Form Fields
  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice("");
    setOriginalPrice("");
    setCategory("Electronics");
    setStock("10");
    setStatus("Active");
    setRating("5");
    setImage("");
    setEditingId(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Status Badge Component
  const StatusBadge = ({ status }: { status: Product['status'] }) => {
    const badges = {
      Active: { color: 'bg-green-500/20 text-green-400 border-green-500/30', icon: <Check className="w-3 h-3" /> },
      Draft: { color: 'bg-gray-500/20 text-gray-400 border-gray-500/30', icon: <Clock className="w-3 h-3" /> },
      Trending: { color: 'bg-orange-500/20 text-orange-400 border-orange-500/30', icon: <TrendingUp className="w-3 h-3" /> },
      Featured: { color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', icon: <Flame className="w-3 h-3" /> },
      OutOfStock: { color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: <AlertCircle className="w-3 h-3" /> },
    };
    const badge = badges[status] || badges.Active;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${badge.color}`}>
        {badge.icon} {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ================= LEFT: FORM (ADD / UPDATE) ================= */}
        <div className="lg:col-span-1 bg-[#151D30] border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md h-fit">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-white">
            {editingId ? (
              <>
                <Edit3 className="w-5 h-5 text-indigo-400" /> Update Product
              </>
            ) : (
              <>
                <Plus className="w-5 h-5 text-emerald-400" /> Add New Product
              </>
            )}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Image Upload Area */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Product Image *</label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition bg-[#0E1524] group relative overflow-hidden h-40"
              >
                {image ? (
                  <>
                    <img src={image} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition rounded-lg">
                      <Image className="w-6 h-6 text-white" />
                    </div>
                  </>
                ) : (
                  <div className="text-center">
                    <Image className="w-8 h-8 text-slate-500 mx-auto mb-2 group-hover:text-indigo-400 transition" />
                    <span className="text-xs text-slate-400">Click to upload image</span>
                  </div>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
            </div>

            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Product Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Mechanical Keyboard"
                className="w-full bg-[#0E1524] border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition text-sm"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter product description..."
                className="w-full bg-[#0E1524] border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition text-sm min-h-[80px] resize-y"
                rows={3}
              />
            </div>

            {/* Price & Original Price Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Price ($) *</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="99"
                  className="w-full bg-[#0E1524] border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Original Price</label>
                <input
                  type="number"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  placeholder="129"
                  className="w-full bg-[#0E1524] border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition text-sm"
                />
              </div>
            </div>

            {/* Category & Stock Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#0E1524] border border-slate-700 rounded-xl px-3 py-3 text-white focus:outline-none focus:border-indigo-500 transition text-sm appearance-none"
                >
                  <option value="Sofa & Sectionals">Sofa & Sectionals (সোফা ও সেকশনাল)</option>
                  <option value="Center & Coffee Tables">Center & Coffee Tables (সেন্টার ও কফি টেবিল)</option>
                  <option value="TV Units & Media Centers">TV Units & Media Centers (টিভি ইউনিট ও মিডিয়া সেন্টার)</option>
                  <option value="Accent Chairs & Ottomans">Accent Chairs & Ottomans (এক্সেন্ট চেয়ার ও অটোম্যান)</option>
                  <option value="Recliner & Rocking Chairs">Recliner & Rocking Chairs (রেকলাইনার ও রকিং চেয়ার)</option>
                  <option value="Wall Shelves & Floating Shelves">Wall Shelves & Floating Shelves (ওয়াল শেল্ভ ও ফ্লোটিং শেল্ভ)</option>
                  <option value="Dining Tables & Chairs">Dining Tables & Chairs (ডাইনিং টেবিল ও চেয়ার)</option>
                  <option value="Beds & Headboards">Beds & Headboards (বেড ও হেডবোর্ড)</option>
                  <option value="Wardrobes & Almirah">Wardrobes & Almirah (ওয়ার্ডরোব ও আলমারি)</option>
                  <option value="Office Chairs">Office Chairs (অফিস চেয়ার)</option>
                  <option value="Study & Computer Desks">Study & Computer Desks (স্টাডি ও কম্পিউটার ডেস্ক)</option>
                  <option value="Outdoor & Garden Furniture">Outdoor & Garden Furniture (আউটডোর ও গার্ডেন ফার্নিচার)</option>
                  <option value="Mattresses & Protectors">Mattresses & Protectors (ম্যাট্রেস ও প্রোটেক্টর)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Stock</label>
                <input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="10"
                  className="w-full bg-[#0E1524] border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition text-sm"
                />
              </div>
            </div>

            {/* Status & Rating Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as Product['status'])}
                  className="w-full bg-[#0E1524] border border-slate-700 rounded-xl px-3 py-3 text-white focus:outline-none focus:border-indigo-500 transition text-sm appearance-none"
                >
                  <option value="Active">Active</option>
                  <option value="Draft">Draft</option>
                  <option value="Trending">Trending</option>
                  <option value="Featured">Featured</option>
                  <option value="OutOfStock">Out of Stock</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Rating (1-5)</label>
                <input
                  type="number"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  min="1"
                  max="5"
                  step="0.1"
                  placeholder="5"
                  className="w-full bg-[#0E1524] border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition text-sm"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={uploading}
                className={`flex-1 py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 shadow-lg transition duration-200 ${editingId
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20"
                  }`}
              >
                {uploading ? (
                  "Processing..."
                ) : editingId ? (
                  <>
                    <Check className="w-4 h-4" /> Update Product
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" /> Add Product
                  </>
                )}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </form>
        </div>

        {/* ================= RIGHT: PRODUCT LIST / TABLE ================= */}
        <div className="lg:col-span-2 bg-[#151D30] border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-white">Products Inventory</h2>
              <p className="text-xs text-slate-400 mt-1">Manage, update, or remove products effortlessly.</p>
            </div>
            <span className="bg-[#1E2943] text-indigo-400 px-3 py-1 rounded-full text-xs font-semibold border border-indigo-500/20">
              Total: {products.length}
            </span>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-500 border-t-transparent mb-3"></div>
              <p className="text-sm">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 border border-dashed border-slate-800 rounded-xl bg-[#0E1524]">
              <PackageOpen className="w-12 h-12 text-slate-600 mb-3" />
              <p className="text-slate-400 text-sm">No products added yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                    <th className="pb-4 font-medium pl-2">Product Info</th>
                    <th className="pb-4 font-medium">Category</th>
                    <th className="pb-4 font-medium">Price</th>
                    <th className="pb-4 font-medium">Stock</th>
                    <th className="pb-4 font-medium">Status</th>
                    <th className="pb-4 font-medium text-right pr-2">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {products.map((product) => {
                    const discount = product.originalPrice && product.originalPrice > product.price
                      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                      : 0;

                    return (
                      <tr key={product.id} className="group hover:bg-[#1E2943]/30 transition">
                        {/* Image & Title */}
                        <td className="py-4 pl-2">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#0E1524] border border-slate-700 flex-shrink-0">
                              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-white group-hover:text-indigo-400 transition line-clamp-1">
                                {product.name}
                              </h4>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] text-slate-500 font-mono">ID: {product.id.slice(-6)}</span>
                                {product.rating && (
                                  <div className="flex items-center gap-0.5">
                                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                    <span className="text-[10px] text-slate-400">{product.rating}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-4">
                          <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md border border-slate-700">
                            {product.category}
                          </span>
                        </td>

                        {/* Price */}
                        <td className="py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-emerald-400 font-mono">
                              ${product.price.toFixed(2)}
                            </span>
                            {product.originalPrice && product.originalPrice > product.price && (
                              <div className="flex items-center gap-1">
                                <span className="text-[10px] text-slate-500 line-through">
                                  ${product.originalPrice.toFixed(2)}
                                </span>
                                <span className="text-[10px] text-red-400 font-medium">
                                  -{discount}%
                                </span>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Stock */}
                        <td className="py-4">
                          <span className={`text-xs font-medium ${product.stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-4">
                          <StatusBadge status={product.status} />
                        </td>

                        {/* Actions */}
                        <td className="py-4 text-right pr-2">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => startEdit(product)}
                              className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition"
                              title="Edit Product"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteProduct(product.id)}
                              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                              title="Delete Product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}