export default function CatalogLoading() {
  return (
    <div className="min-h-screen">
      {/* Hero skeleton */}
      <header className="px-5 md:px-8 lg:px-12 pt-14 pb-10 border-b border-border-subtle max-w-7xl mx-auto">
        <div className="h-3 w-20 rounded bg-white/5 animate-pulse mb-4" />
        <div className="h-9 md:h-11 w-72 md:w-96 rounded bg-white/5 animate-pulse" />
        <div className="h-4 w-80 md:w-[28rem] rounded bg-white/5 animate-pulse mt-4" />
      </header>

      {/* Filter pills skeleton */}
      <div className="px-5 md:px-8 lg:px-12 pt-8 pb-2 max-w-7xl mx-auto">
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-7 rounded-full bg-white/5 animate-pulse"
              style={{ width: `${60 + i * 14}px` }}
            />
          ))}
        </div>
      </div>

      {/* Product grid skeleton */}
      <div className="px-5 md:px-8 lg:px-12 py-10 md:py-14 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-border-subtle bg-surface-raised overflow-hidden"
            >
              <div className="aspect-square bg-white/5 animate-pulse" />
              <div className="p-4 space-y-2.5">
                <div className="h-2.5 w-16 rounded bg-white/5 animate-pulse" />
                <div className="h-4 w-3/4 rounded bg-white/5 animate-pulse" />
                <div className="h-3 w-1/2 rounded bg-white/5 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trust banners skeleton */}
      <div className="px-5 md:px-8 lg:px-12 pb-14 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="bg-surface-raised border border-border-subtle rounded-xl p-6 flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-lg bg-white/5 animate-pulse flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3.5 w-40 rounded bg-white/5 animate-pulse" />
                <div className="h-2.5 w-full rounded bg-white/5 animate-pulse" />
                <div className="h-2.5 w-3/4 rounded bg-white/5 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
