export default function HomePageSkeleton() {
  return (
    <div className="min-h-screen bg-white animate-pulse">
      {/* Hero Skeleton - Mobile Responsive */}
      <div className="bg-linear-to-r from-primary-blue to-primary-gold h-[250px] sm:h-[350px] md:h-[450px] lg:h-[500px] rounded-3xl" />

      {/* Categories Skeleton */}
      <div className="max-w-7xl mx-auto px-4 py-10 md:py-16">
        <div className="text-center mb-8 md:mb-12">
          <div className="h-6 md:h-8 bg-gray-200 rounded w-32 md:w-48 mx-auto mb-2" />
          <div className="h-3 md:h-4 bg-gray-200 rounded w-48 md:w-64 mx-auto" />
        </div>

        {/* Mobile: 3 columns, Desktop: 6 columns */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-gray-100 rounded-xl md:rounded-2xl p-4 md:p-6 h-24 md:h-32"
            />
          ))}
        </div>
      </div>

      {/* Products Section Skeleton */}
      <div className="max-w-7xl mx-auto px-4 py-10 md:py-16">
        <div className="flex justify-between items-center mb-6 md:mb-8">
          <div className="h-5 md:h-6 bg-gray-200 rounded w-32 md:w-48" />
          <div className="h-3 md:h-4 bg-gray-200 rounded w-16 md:w-24" />
        </div>

        {/* Mobile: 2 columns, Desktop: 3-4 columns */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white rounded-lg md:rounded-xl shadow-sm h-64 md:h-96"
            />
          ))}
        </div>
      </div>

      {/* Features Section Skeleton */}
      <div className="max-w-7xl mx-auto px-4 py-10 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-gray-100 rounded-xl md:rounded-2xl p-4 md:p-6 h-24 md:h-32"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
