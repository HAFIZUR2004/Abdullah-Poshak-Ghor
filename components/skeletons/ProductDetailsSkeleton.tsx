export default function ProductDetailsSkeleton() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-4 md:py-8">
        {/* Back Button Skeleton - Mobile ছোট */}
        <div className="flex items-center gap-1 mb-3 md:mb-6">
          <div className="w-3 h-3 md:w-4 md:h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-10 md:w-12 h-3 md:h-4 bg-gray-200 rounded animate-pulse"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 md:gap-12">
          {/* LEFT - Image Gallery Skeleton - Mobile ছোট */}
          <div className="space-y-3 md:space-y-4">
            <div className="bg-gray-200 rounded-xl md:rounded-2xl h-[300px] md:h-[500px] animate-pulse"></div>
            <div className="flex gap-2 md:gap-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-14 h-14 md:w-20 md:h-20 bg-gray-200 rounded-lg animate-pulse"
                ></div>
              ))}
            </div>
          </div>

          {/* RIGHT - Product Info Skeleton - Mobile ছোট */}
          <div className="space-y-3 md:space-y-5">
            {/* Header Skeleton */}
            <div className="flex items-start justify-between">
              <div className="space-y-2 md:space-y-3">
                <div className="flex gap-1 md:gap-2">
                  <div className="w-12 md:w-16 h-4 md:h-6 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="w-12 md:w-16 h-4 md:h-6 bg-gray-200 rounded-full animate-pulse"></div>
                </div>
                <div className="w-48 md:w-64 h-6 md:h-8 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-36 md:w-48 h-6 md:h-8 bg-gray-200 rounded animate-pulse"></div>
                <div className="flex gap-0.5 md:gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="w-3 h-3 md:w-4 md:h-4 bg-gray-200 rounded animate-pulse"
                    ></div>
                  ))}
                  <div className="w-16 md:w-20 h-3 md:h-4 bg-gray-200 rounded animate-pulse ml-1 md:ml-2"></div>
                </div>
              </div>
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-200 rounded-full animate-pulse"></div>
            </div>

            {/* Price Skeleton */}
            <div className="bg-white rounded-xl p-3 md:p-4 border border-gray-100">
              <div className="w-24 md:w-32 h-6 md:h-8 bg-gray-200 rounded animate-pulse"></div>
            </div>

            {/* Description Skeleton */}
            <div className="space-y-1.5 md:space-y-2">
              <div className="w-full h-3 md:h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-3/4 h-3 md:h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-1/2 h-3 md:h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>

            {/* Quantity Skeleton */}
            <div className="space-y-2 md:space-y-3">
              <div className="w-12 md:w-16 h-4 md:h-5 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-[120px] md:w-[140px] h-[40px] md:h-[48px] bg-gray-200 rounded-full animate-pulse"></div>
            </div>

            {/* Buttons Skeleton */}
            <div className="flex gap-2 md:gap-3">
              <div className="flex-1 h-[40px] md:h-[48px] bg-gray-200 rounded-full animate-pulse"></div>
              <div className="flex-1 h-[40px] md:h-[48px] bg-gray-200 rounded-full animate-pulse"></div>
            </div>

            {/* Delivery Info Skeleton */}
            <div className="space-y-2 md:space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-[55px] md:h-[70px] bg-gray-200 rounded-xl animate-pulse"
                ></div>
              ))}
            </div>

            {/* Feature Icons Skeleton */}
            <div className="grid grid-cols-3 gap-2 md:gap-3 pt-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-gray-200 rounded-md h-16 md:h-20 animate-pulse"
                ></div>
              ))}
            </div>

            {/* Social Share Skeleton */}
            <div className="flex items-center gap-2 md:gap-3 pt-2">
              <div className="w-10 md:w-12 h-3 md:h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-20 md:w-24 h-7 md:h-8 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="w-20 md:w-24 h-7 md:h-8 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Related Products Skeleton - Mobile 2 columns */}
        <div className="mt-12 md:mt-20">
          <div className="text-center mb-6 md:mb-8">
            <div className="w-36 md:w-48 h-6 md:h-8 bg-gray-200 rounded animate-pulse mx-auto mb-2"></div>
            <div className="w-12 md:w-16 h-0.5 bg-gray-200 rounded-full mx-auto animate-pulse"></div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white rounded-lg md:rounded-xl overflow-hidden shadow-sm"
              >
                <div className="bg-gray-200 h-[150px] md:h-[220px] animate-pulse"></div>
                <div className="p-2 md:p-4 space-y-1.5 md:space-y-2">
                  <div className="w-3/4 h-3 md:h-5 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-1/2 h-4 md:h-6 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
