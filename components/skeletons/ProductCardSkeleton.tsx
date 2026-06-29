export default function ProductCardSkeleton() {
  return (
    <div className="group bg-white rounded-lg md:rounded-xl shadow-sm overflow-hidden animate-pulse">
      {/* Image Skeleton - Mobile এ ছোট */}
      <div className="relative h-48 md:h-64 bg-gray-200" />

      {/* Content Skeleton - Mobile এ ছোট Padding & Text */}
      <div className="p-2 md:p-4 space-y-1.5 md:space-y-3">
        <div className="h-2 md:h-3 bg-gray-200 rounded w-1/3" />
        <div className="h-3 md:h-5 bg-gray-200 rounded w-3/4" />
        <div className="flex items-center gap-1 md:gap-2">
          <div className="h-4 md:h-6 bg-gray-200 rounded w-1/4" />
          <div className="h-3 md:h-4 bg-gray-200 rounded w-1/4" />
        </div>
        <div className="flex items-center gap-0.5 md:gap-1">
          <div className="h-2 md:h-3 bg-gray-200 rounded w-16 md:w-20" />
        </div>
        {/* Button Skeleton */}
        <div className="h-8 md:h-10 bg-gray-200 rounded-lg w-full mt-2 md:mt-3" />
      </div>
    </div>
  );
}
