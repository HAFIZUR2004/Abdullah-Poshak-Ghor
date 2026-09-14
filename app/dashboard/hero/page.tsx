// app/dashboard/hero/page.tsx
"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";

const DEFAULT_IMAGES = [
  "https://i.ibb.co.com/rfX2KWq3/hero1.webp",
  "https://i.ibb.co.com/rfX2KWq3/hero1.webp",
  "https://i.ibb.co.com/rfX2KWq3/hero1.webp",
];

// ✅ Helper — সবসময় valid 3-length array return করবে
function sanitizeImages(input: unknown): string[] {
  if (Array.isArray(input) && input.length === 3) {
    return input.map((img) => (typeof img === "string" ? img : ""));
  }
  return DEFAULT_IMAGES;
}

export default function HeroManagementPage() {
  const [heroImages, setHeroImages] = useState<string[]>(DEFAULT_IMAGES);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  // ─── Fetch ───────────────────────────────────────────────
  useEffect(() => {
    const fetchHero = async () => {
      try {
        const res = await fetch("/api/hero", { cache: "no-store" });
        const data = await res.json();

        if (data?.success && data?.hero) {
          // ✅ sanitize — সবসময় 3টি valid string
          setHeroImages(sanitizeImages(data.hero.heroImages));
        }
      } catch (error) {
        console.error("Error fetching hero:", error);
        toast.error("Failed to load hero data");
      } finally {
        setFetchLoading(false);
      }
    };

    fetchHero();
  }, []);

  // ─── URL change (per index) ──────────────────────────────
  const handleImageChange = (index: number, value: string) => {
    setHeroImages((prev) => {
      if (!Array.isArray(prev)) return DEFAULT_IMAGES;
      const copy = [...prev];
      copy[index] = value;
      return copy;
    });
  };

  // ─── ImgBB upload ────────────────────────────────────────
  const uploadToImgBB = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
        { method: "POST", body: formData }
      );
      const data = await response.json();
      if (data.success) return data.data.url;
      return null;
    } catch (error) {
      console.error("ImgBB upload error:", error);
      return null;
    }
  };

  // ─── File upload (per index) ─────────────────────────────
  const handleFileUpload = async (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    setUploadingIndex(index);
    try {
      const imageUrl = await uploadToImgBB(file);
      if (imageUrl) {
        handleImageChange(index, imageUrl);
        toast.success(`Slide ${index + 1} image uploaded!`);
      } else {
        // fallback base64
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            handleImageChange(index, event.target.result as string);
            toast.success(`Slide ${index + 1} image loaded (local)`);
          }
        };
        reader.readAsDataURL(file);
      }
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setUploadingIndex(null);
    }
  };

  // ─── Save all 3 ──────────────────────────────────────────
  const handleSave = async () => {
    const valid =
      Array.isArray(heroImages) &&
      heroImages.length === 3 &&
      heroImages.every((img) => typeof img === "string" && img.trim());

    if (!valid) {
      toast.error("All 3 images are required");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ heroImages }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Hero images updated successfully! 🎉");
        if (Array.isArray(data?.hero?.heroImages)) {
          setHeroImages(sanitizeImages(data.hero.heroImages));
        }
      } else {
        toast.error(data.message || "Failed to update hero");
      }
    } catch (error) {
      console.error("Error updating hero:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ─── Reset ───────────────────────────────────────────────
  const handleReset = async () => {
    if (!confirm("Reset all 3 images to default?")) return;

    setLoading(true);
    try {
      const res = await fetch("/api/hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ heroImages: DEFAULT_IMAGES }),
      });

      const data = await res.json();

      if (data.success) {
        if (Array.isArray(data?.hero?.heroImages)) {
          setHeroImages(sanitizeImages(data.hero.heroImages));
        } else {
          setHeroImages(DEFAULT_IMAGES);
        }
        toast.success("Reset to default! 🔄");
      } else {
        toast.error(data.message || "Failed to reset");
      }
    } catch (error) {
      console.error("Error resetting hero:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ─── Loading skeleton ────────────────────────────────────
  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-[#FDF6EE] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#0F3D39] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ✅ Final safety
  const safeImages = sanitizeImages(heroImages);

  return (
    <div className="min-h-screen bg-[#FDF6EE] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-wrap justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#0B2523]">
              Hero Images Management
            </h1>
            <p className="text-[#0F3D39]/70 mt-1">
              Update the 3 hero slider images
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleReset}
              disabled={loading}
              className="px-4 py-2.5 border border-red-300 text-red-600 rounded-lg font-medium hover:bg-red-50 transition disabled:opacity-50 text-sm"
            >
              🔄 Reset
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-6 py-2.5 bg-[#0F3D39] text-white rounded-lg font-bold hover:bg-[#0F3D39]/90 transition disabled:opacity-50 text-sm"
            >
              {loading ? "Saving..." : "💾 Save All"}
            </button>
          </div>
        </div>

        {/* 3 Image cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {safeImages.map((img, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-sm border border-[#E5D3B3]/30 p-5 flex flex-col"
            >
              <h2 className="text-base font-bold text-[#0B2523] mb-3">
                Slide {index + 1}
              </h2>

              {/* Preview */}
              <div className="relative w-full h-44 rounded-xl overflow-hidden border-2 border-[#E5D3B3]/30 bg-[#FDF6EE] mb-4">
                {img ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={img}
                    alt={`Slide ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) =>
                      ((e.target as HTMLImageElement).style.opacity = "0.3")
                    }
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                    No image
                  </div>
                )}
              </div>

              {/* URL input */}
              <label className="block text-xs font-medium text-[#0B2523] mb-1">
                Image URL
              </label>
              <input
                type="url"
                value={img}
                onChange={(e) => handleImageChange(index, e.target.value)}
                className="w-full px-3 py-2 border border-[#E5D3B3]/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F3D39] bg-[#FDF6EE] text-xs mb-3"
                placeholder="https://example.com/slide.jpg"
              />

              {/* File upload */}
              <label className="block text-xs font-medium text-[#0B2523] mb-1">
                Or upload
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(index, e)}
                disabled={uploadingIndex === index || loading}
                className="w-full text-xs file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-[#0F3D39] file:text-white hover:file:bg-[#0F3D39]/90 cursor-pointer disabled:opacity-50"
              />

              {uploadingIndex === index && (
                <p className="text-xs text-[#0F3D39] mt-2">
                  ⏳ Uploading...
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}