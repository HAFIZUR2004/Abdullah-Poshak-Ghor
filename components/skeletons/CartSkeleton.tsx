"use client";

interface CartSkeletonProps {
  variant?: "icon" | "item" | "page" | "checkout";
  count?: number;
}

export default function CartSkeleton({
  variant = "icon",
  count = 1,
}: CartSkeletonProps) {
  // Icon variant - Navbar এর cart icon এর জন্য
  if (variant === "icon") {
    return (
      <div className="animate-pulse relative">
        <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-gray-200 rounded-full"></div>
      </div>
    );
  }

  // Item variant - Cart page এর প্রতিটি item এর জন্য
  if (variant === "item") {
    return (
      <div className="animate-pulse bg-white rounded-lg shadow-sm p-3 md:p-4 flex gap-3 md:gap-4">
        <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-200 rounded-lg"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          <div className="h-5 bg-gray-200 rounded w-24"></div>
        </div>
        <div className="w-16 h-8 bg-gray-200 rounded"></div>
      </div>
    );
  }

  // Page variant - পুরো cart page এর জন্য (মোবাইল অপটিমাইজড)
  if (variant === "page") {
    return (
      <div className="min-h-screen bg-gray-50 py-3 md:py-8">
        <div className="max-w-7xl mx-auto px-3 md:px-4">
          {/* Back Button Skeleton */}
          <div className="w-12 md:w-16 h-3 md:h-4 bg-gray-200 rounded mb-3 md:mb-4 animate-pulse"></div>

          {/* Title Skeleton */}
          <div className="h-6 md:h-8 bg-gray-200 rounded w-32 md:w-40 mb-4 md:mb-6 animate-pulse"></div>

          <div className="grid md:grid-cols-3 gap-3 md:gap-6">
            <div className="md:col-span-2 space-y-2 md:space-y-4">
              {[...Array(count)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg shadow-sm p-2.5 md:p-4 flex gap-2 md:gap-4"
                >
                  <div className="w-14 h-14 md:w-20 md:h-20 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1 space-y-1.5 md:space-y-2">
                    <div className="h-3 md:h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-2 md:h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 md:h-5 bg-gray-200 rounded w-20 md:w-24"></div>
                  </div>
                  <div className="w-12 md:w-16 h-6 md:h-8 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>

            {/* Order Summary Skeleton */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-3 md:p-6">
                <div className="h-4 md:h-6 bg-gray-200 rounded w-24 md:w-32 mb-3 md:mb-4 animate-pulse"></div>
                <div className="space-y-2 md:space-y-3 mb-3 md:mb-4">
                  <div className="h-3 md:h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 md:h-4 bg-gray-200 rounded w-full"></div>
                </div>
                <div className="h-8 md:h-10 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-3 md:h-4 bg-gray-200 rounded w-24 md:w-32 mx-auto mt-2 md:mt-3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Checkout variant - checkout page এর জন্য
  if (variant === "checkout") {
    return (
      <div className="animate-pulse space-y-3 md:space-y-4">
        <div className="h-5 md:h-6 bg-gray-200 rounded w-32 md:w-48"></div>
        <div className="space-y-2 md:space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-2 md:gap-3">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-gray-200 rounded"></div>
              <div className="flex-1">
                <div className="h-3 md:h-4 bg-gray-200 rounded w-3/4 mb-1 md:mb-2"></div>
                <div className="h-2 md:h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}
