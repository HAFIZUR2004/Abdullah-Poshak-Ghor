import ProductCardSkeleton from "./ProductCardSkeleton";

export default function ShopPageSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-3 md:px-4 py-4 md:py-8">
        {/* Header Skeleton - Mobile ছোট */}
        <div className="mb-4 md:mb-8">
          <div className="h-6 md:h-8 bg-gray-200 rounded w-32 md:w-48 mb-1 md:mb-2 animate-pulse" />
          <div className="h-3 md:h-4 bg-gray-200 rounded w-48 md:w-64 animate-pulse" />
        </div>

        {/* Filter Bar Skeleton - Mobile অপটিমাইজড */}
        <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-3 md:p-4 mb-4 md:mb-6">
          <div className="flex flex-col md:flex-row gap-3 md:gap-4">
            {/* Search Input Skeleton */}
            <div className="flex-1 h-9 md:h-10 bg-gray-200 rounded-full animate-pulse" />

            {/* Category Filters Skeleton - Mobile 3 columns */}
            <div className="grid grid-cols-3 md:flex gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-9 md:h-10 bg-gray-200 rounded-full animate-pulse"
                />
              ))}
            </div>

            {/* Sort Button Skeleton */}
            <div className="w-32 md:w-40 h-9 md:h-10 bg-gray-200 rounded-full animate-pulse" />
          </div>
        </div>

        {/* Results Count Skeleton - Mobile ছোট */}
        <div className="mb-3 md:mb-4">
          <div className="h-3 md:h-4 bg-gray-200 rounded w-24 md:w-32 animate-pulse" />
        </div>

        {/* Products Grid Skeleton - Mobile 2 columns */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4 lg:gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
