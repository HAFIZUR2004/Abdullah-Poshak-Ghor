"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { 
  Upload, 
  Trash2, 
  RefreshCw, 
  CheckCircle2, 
  ImageIcon, 
  Link as LinkIcon,
  Sparkles,
  Eye
} from "lucide-react";
import { toast } from "sonner";

export default function CustomSectionDashboard() {
  const [imageUrl, setImageUrl] = useState("");
  const [title, setTitle] = useState("Your Dream Furniture, Made Your Way");
  const [subtitle, setSubtitle] = useState("Customization Services");
  const [description, setDescription] = useState(
    "We believe every home is unique. Our expert craftsmen and designers work with you to create furniture that perfectly fits your space, style, and needs."
  );

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Database Fetch
  const fetchData = async () => {
    try {
      setFetching(true);
      const res = await fetch("/api/custom-section", { cache: "no-store" });
      const data = await res.json();
      if (data) {
        if (data.imageUrl) setImageUrl(data.imageUrl);
        if (data.title) setTitle(data.title);
        if (data.subtitle) setSubtitle(data.subtitle);
        if (data.description) setDescription(data.description);
      }
    } catch (error) {
      toast.error("Failed to load custom section settings");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Direct File Upload to Cloudinary (or local upload route)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      // Your existing upload endpoint (e.g. /api/upload or Cloudinary upload)
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setImageUrl(data.url);
        toast.success("Image uploaded successfully!");
      } else {
        toast.error(data.error || "Failed to upload image file");
      }
    } catch (error) {
      toast.error("An error occurred during file upload");
    } finally {
      setUploading(false);
    }
  };

  // Submit / Save Function
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/custom-section", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl,
          title,
          subtitle,
          description,
        }),
      });

      if (res.ok) {
        toast.success("Custom section updated successfully!");
        fetchData();
      } else {
        toast.error("Failed to save changes");
      }
    } catch (error) {
      toast.error("An error occurred while saving");
    } finally {
      setLoading(false);
    }
  };

  // Reset to Default
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to reset all custom section settings?")) return;
    setLoading(true);

    try {
      const res = await fetch("/api/custom-section", { method: "DELETE" });
      if (res.ok) {
        toast.success("Reset to default configuration");
        setImageUrl("/images/customizesection.jpeg");
        setTitle("Your Dream Furniture, Made Your Way");
        setSubtitle("Customization Services");
        setDescription(
          "We believe every home is unique. Our expert craftsmen and designers work with you to create furniture that perfectly fits your space, style, and needs."
        );
      } else {
        toast.error("Failed to reset section");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <RefreshCw className="w-8 h-8 text-amber-500 animate-spin" />
        <p className="text-sm font-medium text-gray-500">Loading Section Configuration...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8 font-sans">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-gradient-to-r from-[#0F3D39] to-[#1a5751] p-6 rounded-2xl text-white shadow-lg">
        <div>
          <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" /> Content Management
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Custom Order Section</h1>
          <p className="text-white/80 text-sm mt-1 max-w-xl">
            Customize the title, descriptive copy, and banner image displayed on the landing page customization section.
          </p>
        </div>
        
        <button
          onClick={handleDelete}
          disabled={loading}
          className="self-start md:self-auto flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-400/30 px-4 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer disabled:opacity-50"
        >
          <Trash2 className="w-4 h-4" />
          Reset Default Settings
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Settings Panel */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <form onSubmit={handleUpdate} className="space-y-6">
            
            {/* Title & Subtitle Group */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b pb-2">
                Section Headlines
              </h3>
              
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Tagline / Subtitle
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="CUSTOMIZATION SERVICES"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#0F3D39] focus:outline-none text-sm transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Main Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Your Dream Furniture, Made Your Way"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#0F3D39] focus:outline-none text-sm font-medium transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Description Paragraph
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Write a brief overview of customization features..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#0F3D39] focus:outline-none text-sm transition"
                />
              </div>
            </div>

            {/* Banner Image Group */}
            <div className="space-y-4 pt-2">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b pb-2">
                Banner Image Configuration
              </h3>

              {/* Upload Dropzone */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Upload Image File
                </label>
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 hover:border-[#0F3D39] bg-gray-50 hover:bg-emerald-50/30 rounded-xl cursor-pointer transition">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-6 h-6 text-gray-400 mb-2" />
                    <p className="text-xs text-gray-600 font-medium">
                      {uploading ? "Uploading File..." : "Click to upload or drag & drop"}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1">PNG, JPG, WEBP (Max 5MB)</p>
                  </div>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileUpload} 
                    disabled={uploading} 
                    className="hidden" 
                  />
                </label>
              </div>

              {/* URL Input */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Or Image Direct URL
                </label>
                <div className="relative">
                  <LinkIcon className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://res.cloudinary.com/..."
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#0F3D39] focus:outline-none text-sm transition"
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              disabled={loading || uploading}
              className="w-full flex items-center justify-center gap-2 bg-[#0F3D39] hover:bg-[#072c29] text-white px-6 py-3.5 rounded-xl text-sm font-bold shadow-lg shadow-[#0F3D39]/20 hover:shadow-none transition-all cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              {loading ? "Saving Changes..." : "Save Customization Settings"}
            </button>
          </form>
        </div>

        {/* Live Preview Panel */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500">
            <Eye className="w-4 h-4 text-[#0F3D39]" /> Live Desktop Preview
          </div>

          <div className="bg-[#FDF6EE] p-6 rounded-2xl border border-amber-200/50 shadow-sm relative overflow-hidden font-sans">
            <div className="text-center space-y-3 mb-6">
              <span className="text-[10px] font-bold text-[#0F3D39] uppercase tracking-[0.25em]">
                {subtitle || "CUSTOMIZATION SERVICES"}
              </span>
              <h4 className="text-xl font-bold text-[#0B2523] leading-tight">
                {title || "Your Dream Furniture, Made Your Way"}
              </h4>
              <p className="text-xs text-[#0B2523]/70 line-clamp-3 leading-relaxed">
                {description}
              </p>
            </div>

            <div className="relative w-full h-[220px] rounded-xl overflow-hidden border border-[#E5D3B3]/40 bg-gray-200 shadow-md">
              <Image
                src={imageUrl || "/images/customizesection.jpeg"}
                alt="Live Section Preview"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}