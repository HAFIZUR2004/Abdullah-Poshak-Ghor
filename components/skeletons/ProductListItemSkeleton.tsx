export default function ProductListItemSkeleton() {
  return (
    <div className="bg-white rounded-lg md:rounded-xl shadow-md p-3 md:p-4 animate-pulse">
      <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
        {/* Image Skeleton - Mobile ছোট */}
        <div className="w-full sm:w-24 md:w-32 h-24 md:h-32 bg-gray-200 rounded-lg" />

        {/* Content Skeleton - Mobile ছোট টেক্সট */}
        <div className="flex-1 space-y-2 md:space-y-3">
          <div className="h-2 md:h-3 bg-gray-200 rounded w-1/4" />
          <div className="h-4 md:h-5 bg-gray-200 rounded w-2/3" />
          <div className="flex items-center gap-1 md:gap-2">
            <div className="h-4 md:h-6 bg-gray-200 rounded w-1/5" />
            <div className="h-3 md:h-4 bg-gray-200 rounded w-1/5" />
          </div>
          <div className="h-2 md:h-3 bg-gray-200 rounded w-1/3" />
        </div>

        {/* Action Buttons Skeleton - Mobile ছোট */}
        <div className="flex items-center gap-1.5 md:gap-2">
          <div className="w-7 h-7 md:w-8 md:h-8 bg-gray-200 rounded-lg" />
          <div className="w-20 md:w-24 h-8 md:h-9 bg-gray-200 rounded-lg" />
          <div className="w-16 md:w-24 h-8 md:h-9 bg-gray-200 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
