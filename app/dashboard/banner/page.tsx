// app/dashboard/banner/page.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "sonner";

interface BannerData {
  _id?: string;
  title: string;
  image: string;
  link: string;
  isActive: boolean;
}

export default function BannerManagementPage() {
  const [banner, setBanner] = useState<BannerData>({
    title: "",
    image: "",
    link: "",
    isActive: true,
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState<string>("");

  // ─── Fetch Banner Data ──────────────────────────────────────────────────────
// ─── Fetch Banner Data ──────────────────────────────────────────────────────
useEffect(() => {
  const fetchBanner = async () => {
    try {
      const res = await fetch("/api/banner", { cache: "no-store" });
      const data = await res.json();

      console.log("🔍 Banner API response:", data);

      // ✅ Safe check
      if (data?.success && data?.banner) {
        setBanner(data.banner);
        setPreviewImage(data.banner.image || "");
      } else {
        // Fallback — default banner দিয়ে দেখাবে
        const fallback = {
          title: "Crafted for Comfort",
          image: "https://i.ibb.co.com/4RCn5y67/discount.webp",
          link: "/shop",
          isActive: true,
        };
        setBanner(fallback);
        setPreviewImage(fallback.image);
        toast.error(data?.message || "Using default banner");
      }
    } catch (error) {
      console.error("🔴 Error fetching banner:", error);
      toast.error("Failed to load banner data");
      // Fallback
      const fallback = {
        title: "Crafted for Comfort",
        image: "https://i.ibb.co.com/4RCn5y67/discount.webp",
        link: "/shop",
        isActive: true,
      };
      setBanner(fallback);
      setPreviewImage(fallback.image);
    } finally {
      setFetchLoading(false);
    }
  };

  fetchBanner();
}, []);
  // ─── Handle Image URL Change ──────────────────────────────────────────────
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setBanner({ ...banner, image: url });
    setPreviewImage(url);
  };

  // ─── Handle File Upload ────────────────────────────────────────────────────
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const imageUrl = event.target.result as string;
        setBanner({ ...banner, image: imageUrl });
        setPreviewImage(imageUrl);
        toast.success("Image loaded successfully!");
      }
    };
    reader.onerror = () => {
      toast.error("Failed to read image file");
    };
    reader.readAsDataURL(file);
  };

  // ─── Upload to ImgBB (Optional) ───────────────────────────────────────────
  const uploadToImgBB = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      if (data.success) {
        return data.data.url;
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("ImgBB upload error:", error);
      return null;
    }
  };

  // ─── Handle Advanced File Upload with ImgBB ──────────────────────────────
  const handleAdvancedUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      // Upload to ImgBB
      const imageUrl = await uploadToImgBB(file);
      if (imageUrl) {
        setBanner({ ...banner, image: imageUrl });
        setPreviewImage(imageUrl);
        toast.success("Image uploaded to ImgBB!");
      } else {
        // Fallback to local base64
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            const imageUrl = event.target.result as string;
            setBanner({ ...banner, image: imageUrl });
            setPreviewImage(imageUrl);
            toast.success("Image loaded successfully!");
          }
        };
        reader.readAsDataURL(file);
      }
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setLoading(false);
    }
  };

  // ─── Save Banner ────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!banner.image) {
      toast.error("Please provide a banner image");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/banner", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(banner),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Banner updated successfully! 🎉");
        setBanner(data.banner);
        setPreviewImage(data.banner.image);
      } else {
        toast.error(data.message || "Failed to update banner");
      }
    } catch (error) {
      console.error("Error updating banner:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ─── Reset to Default ──────────────────────────────────────────────────────
  const handleReset = async () => {
    if (!confirm("Are you sure you want to reset to default banner?")) return;

    setLoading(true);
    try {
      const defaultBanner = {
        title: "Crafted for Comfort",
        image: "https://i.ibb.co.com/4RCn5y67/discount.webp",
        link: "/shop",
        isActive: true,
      };

      const res = await fetch("/api/banner", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(defaultBanner),
      });

      const data = await res.json();

      if (data.success) {
        setBanner(data.banner);
        setPreviewImage(data.banner.image);
        toast.success("Banner reset to default! 🔄");
      } else {
        toast.error(data.message || "Failed to reset banner");
      }
    } catch (error) {
      console.error("Error resetting banner:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-[#FDF6EE] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#0F3D39] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF6EE] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0B2523]">Banner Management</h1>
          <p className="text-[#0F3D39]/70 mt-1">
            Manage your homepage banner image and settings
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Preview */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-[#E5D3B3]/30 p-6 sticky top-24">
              <h2 className="text-lg font-bold text-[#0B2523] mb-4">Live Preview</h2>
              
              <div className="relative w-full rounded-xl overflow-hidden border-2 border-[#E5D3B3]/30 bg-[#FDF6EE]">
                {previewImage ? (
                  <Image
                    src={previewImage}
                    alt={banner.title || "Banner Preview"}
                    width={1200}
                    height={400}
                    className="w-full h-auto object-contain"
                    unoptimized={previewImage.startsWith("data:")}
                  />
                ) : (
                  <div className="h-48 flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm">No banner image set</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Status Badge */}
              <div className="mt-4 flex items-center gap-3">
                <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                  banner.isActive 
                    ? "bg-green-100 text-green-700" 
                    : "bg-gray-100 text-gray-500"
                }`}>
                  {banner.isActive ? "🟢 Active" : "🔴 Inactive"}
                </span>
                {banner.title && (
                  <span className="text-sm text-[#0F3D39]/70">
                    Title: {banner.title}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-[#E5D3B3]/30 p-6">
              <h2 className="text-lg font-bold text-[#0B2523] mb-6">Edit Banner</h2>

              <div className="space-y-5">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-[#0B2523] mb-1.5">
                    Title
                  </label>
                  <input
                    type="text"
                    value={banner.title}
                    onChange={(e) => setBanner({ ...banner, title: e.target.value })}
                    className="w-full px-4 py-2.5 border border-[#E5D3B3]/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F3D39] bg-[#FDF6EE] text-sm"
                    placeholder="Enter banner title"
                  />
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-sm font-medium text-[#0B2523] mb-1.5">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={banner.image}
                    onChange={handleImageChange}
                    className="w-full px-4 py-2.5 border border-[#E5D3B3]/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F3D39] bg-[#FDF6EE] text-sm"
                    placeholder="https://example.com/banner.jpg"
                  />
                  <p className="text-xs text-[#0F3D39]/50 mt-1">
                    Enter direct image URL (ImgBB, Cloudinary, etc.)
                  </p>
                </div>

                {/* OR Upload File */}
                <div>
                  <label className="block text-sm font-medium text-[#0B2523] mb-1.5">
                    Or Upload Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAdvancedUpload}
                    className="w-full px-4 py-2 border border-[#E5D3B3]/40 rounded-lg bg-[#FDF6EE] text-sm file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#0F3D39] file:text-[#E5D3B3] hover:file:bg-[#0F3D39]/90 cursor-pointer"
                    disabled={loading}
                  />
                  <p className="text-xs text-[#0F3D39]/50 mt-1">
                    Max 5MB • JPG, PNG, WebP
                  </p>
                </div>

                {/* Link */}
                <div>
                  <label className="block text-sm font-medium text-[#0B2523] mb-1.5">
                    Click Link
                  </label>
                  <input
                    type="text"
                    value={banner.link}
                    onChange={(e) => setBanner({ ...banner, link: e.target.value })}
                    className="w-full px-4 py-2.5 border border-[#E5D3B3]/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F3D39] bg-[#FDF6EE] text-sm"
                    placeholder="/shop"
                  />
                </div>

                {/* Active Status Toggle */}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm font-medium text-[#0B2523]">Active Status</span>
                  <button
                    onClick={() => setBanner({ ...banner, isActive: !banner.isActive })}
                    className={`relative w-11 h-6 rounded-full transition ${
                      banner.isActive ? "bg-[#0F3D39]" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`absolute top-1 w-4 h-4 rounded-full bg-white transition ${
                        banner.isActive ? "left-6" : "left-1"
                      }`}
                    />
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-4 border-t border-[#E5D3B3]/30">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="w-full py-3 bg-[#0F3D39] text-[#E5D3B3] rounded-xl font-bold hover:bg-[#0F3D39]/90 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </span>
                    ) : (
                      "💾 Save Changes"
                    )}
                  </button>

                  <button
                    onClick={handleReset}
                    disabled={loading}
                    className="w-full py-2.5 border border-red-300 text-red-600 rounded-xl font-medium hover:bg-red-50 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    🔄 Reset to Default
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}