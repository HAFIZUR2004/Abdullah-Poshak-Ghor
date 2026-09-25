"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";

const DEFAULT_IMAGES = [
  "https://i.ibb.co.com/rfX2KWq3/hero1.webp",
  "https://i.ibb.co.com/rfX2KWq3/hero1.webp",
  "https://i.ibb.co.com/rfX2KWq3/hero1.webp",
];

// ==========================================================
// Sanitize
// ==========================================================

function sanitizeImages(input: unknown): string[] {
  if (Array.isArray(input) && input.length === 3) {
    return input.map((img) =>
      typeof img === "string" ? img : ""
    );
  }

  return DEFAULT_IMAGES;
}

// ==========================================================
// Compress image
// ==========================================================

async function compressImage(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();

      img.onload = () => {
        const MAX_WIDTH = 1920;
        const MAX_HEIGHT = 900;

        let width = img.width;
        let height = img.height;

        // Maintain aspect ratio
        if (width > MAX_WIDTH) {
          height = Math.round(
            (height * MAX_WIDTH) / width
          );

          width = MAX_WIDTH;
        }

        if (height > MAX_HEIGHT) {
          width = Math.round(
            (width * MAX_HEIGHT) / height
          );

          height = MAX_HEIGHT;
        }

        const canvas = document.createElement("canvas");

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject(new Error("Canvas not supported"));
          return;
        }

        ctx.drawImage(
          img,
          0,
          0,
          width,
          height
        );

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Compression failed"));
              return;
            }

            const compressedFile = new File(
              [blob],
              "hero.webp",
              {
                type: "image/webp",
                lastModified: Date.now(),
              }
            );

            resolve(compressedFile);
          },
          "image/webp",
          0.78
        );
      };

      img.onerror = () => {
        reject(new Error("Invalid image"));
      };

      img.src = event.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error("Failed to read image"));
    };

    reader.readAsDataURL(file);
  });
}

// ==========================================================
// Component
// ==========================================================

export default function HeroManagementPage() {
  const [heroImages, setHeroImages] =
    useState<string[]>(DEFAULT_IMAGES);

  const [loading, setLoading] =
    useState(false);

  const [fetchLoading, setFetchLoading] =
    useState(true);

  const [uploadingIndex, setUploadingIndex] =
    useState<number | null>(null);

  // ========================================================
  // Fetch
  // ========================================================

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const res = await fetch("/api/hero", {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch hero");
        }

        const data = await res.json();

        if (data?.success && data?.hero) {
          setHeroImages(
            sanitizeImages(data.hero.heroImages)
          );
        }
      } catch (error) {
        console.error(
          "Error fetching hero:",
          error
        );

        toast.error("Failed to load hero data");
      } finally {
        setFetchLoading(false);
      }
    };

    fetchHero();
  }, []);

  // ========================================================
  // Change URL
  // ========================================================

  const handleImageChange = (
    index: number,
    value: string
  ) => {
    setHeroImages((prev) => {
      const copy = [...prev];

      copy[index] = value;

      return copy;
    });
  };

  // ========================================================
  // Upload ImgBB
  // ========================================================

  const uploadToImgBB = async (
    file: File
  ): Promise<string | null> => {
    const apiKey =
      process.env.NEXT_PUBLIC_IMGBB_API_KEY;

    if (!apiKey) {
      toast.error("ImgBB API key is missing");
      return null;
    }

    const formData = new FormData();

    formData.append("image", file);

    try {
      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("ImgBB upload failed");
      }

      const data = await response.json();

      if (data?.success) {
        // ImgBB direct display URL
        return (
          data?.data?.display_url ||
          data?.data?.url ||
          null
        );
      }

      return null;
    } catch (error) {
      console.error(
        "ImgBB upload error:",
        error
      );

      return null;
    }
  };

  // ========================================================
  // File Upload
  // ========================================================

  const handleFileUpload = async (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Reset input
    e.target.value = "";

    // Validate type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    // Original file limit
    if (file.size > 10 * 1024 * 1024) {
      toast.error(
        "Image size should be less than 10MB"
      );

      return;
    }

    setUploadingIndex(index);

    try {
      toast.loading("Optimizing image...", {
        id: "hero-upload",
      });

      // ----------------------------------------------------
      // Compress BEFORE uploading
      // ----------------------------------------------------

      const compressedFile =
        await compressImage(file);

      console.log(
        "Original:",
        (file.size / 1024 / 1024).toFixed(2),
        "MB"
      );

      console.log(
        "Compressed:",
        (compressedFile.size / 1024).toFixed(0),
        "KB"
      );

      toast.loading(
        `Uploading optimized image (${(
          compressedFile.size / 1024
        ).toFixed(0)} KB)...`,
        {
          id: "hero-upload",
        }
      );

      // ----------------------------------------------------
      // Upload
      // ----------------------------------------------------

      const imageUrl =
        await uploadToImgBB(compressedFile);

      if (!imageUrl) {
        toast.error(
          "Image upload failed",
          {
            id: "hero-upload",
          }
        );

        return;
      }

      handleImageChange(
        index,
        imageUrl
      );

      toast.success(
        `Slide ${index + 1} optimized & uploaded!`,
        {
          id: "hero-upload",
        }
      );
    } catch (error) {
      console.error(
        "Image upload error:",
        error
      );

      toast.error(
        "Failed to process image",
        {
          id: "hero-upload",
        }
      );
    } finally {
      setUploadingIndex(null);
    }
  };

  // ========================================================
  // Save
  // ========================================================

  const handleSave = async () => {
    const valid =
      Array.isArray(heroImages) &&
      heroImages.length === 3 &&
      heroImages.every(
        (img) =>
          typeof img === "string" &&
          img.trim().length > 0
      );

    if (!valid) {
      toast.error(
        "All 3 images are required"
      );

      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/hero", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          heroImages,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(
          data?.message ||
            "Failed to update hero"
        );
      }

      if (
        Array.isArray(
          data?.hero?.heroImages
        )
      ) {
        setHeroImages(
          sanitizeImages(
            data.hero.heroImages
          )
        );
      }

      toast.success(
        "Hero images updated successfully! 🎉"
      );
    } catch (error) {
      console.error(
        "Error updating hero:",
        error
      );

      toast.error(
        "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  // ========================================================
  // Reset
  // ========================================================

  const handleReset = async () => {
    if (
      !confirm(
        "Reset all 3 images to default?"
      )
    ) {
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/hero", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          heroImages: DEFAULT_IMAGES,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(
          data?.message ||
            "Failed to reset"
        );
      }

      setHeroImages(
        sanitizeImages(
          data?.hero?.heroImages ||
            DEFAULT_IMAGES
        )
      );

      toast.success(
        "Reset to default! 🔄"
      );
    } catch (error) {
      console.error(
        "Error resetting hero:",
        error
      );

      toast.error(
        "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  // ========================================================
  // Loading
  // ========================================================

  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-[#FDF6EE] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#0F3D39] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const safeImages =
    sanitizeImages(heroImages);

  // ========================================================
  // UI
  // ========================================================

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
              disabled={
                loading ||
                uploadingIndex !== null
              }
              className="px-6 py-2.5 bg-[#0F3D39] text-white rounded-lg font-bold hover:bg-[#0F3D39]/90 transition disabled:opacity-50 text-sm"
            >
              {loading
                ? "Saving..."
                : "💾 Save All"}
            </button>

          </div>
        </div>

        {/* Image Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {safeImages.map(
            (img, index) => (
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
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.opacity =
                          "0.3";
                      }}
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                      No image
                    </div>
                  )}

                </div>

                {/* URL */}
                <label className="block text-xs font-medium text-[#0B2523] mb-1">
                  Image URL
                </label>

                <input
                  type="url"
                  value={img}
                  onChange={(e) =>
                    handleImageChange(
                      index,
                      e.target.value
                    )
                  }
                  className="w-full px-3 py-2 border border-[#E5D3B3]/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F3D39] bg-[#FDF6EE] text-xs mb-3"
                  placeholder="https://example.com/slide.webp"
                />

                {/* Upload */}
                <label className="block text-xs font-medium text-[#0B2523] mb-1">
                  Or upload
                </label>

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  onChange={(e) =>
                    handleFileUpload(
                      index,
                      e
                    )
                  }
                  disabled={
                    uploadingIndex ===
                      index ||
                    loading
                  }
                  className="w-full text-xs file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-[#0F3D39] file:text-white hover:file:bg-[#0F3D39]/90 cursor-pointer disabled:opacity-50"
                />

                {uploadingIndex ===
                  index && (
                  <p className="text-xs text-[#0F3D39] mt-2">
                    ⏳ Optimizing & uploading...
                  </p>
                )}

                {/* Optimization info */}
                <p className="text-[10px] text-gray-500 mt-3">
                  Images are automatically converted
                  to WebP and optimized for faster
                  loading.
                </p>

              </div>
            )
          )}

        </div>
      </div>
    </div>
  );
}