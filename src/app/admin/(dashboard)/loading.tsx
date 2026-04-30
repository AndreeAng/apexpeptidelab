export default function AdminLoading() {
  return (
    <div className="animate-pulse space-y-6">
      <div>
        <div className="h-7 w-40 bg-white/5 rounded mb-2" />
        <div className="h-4 w-64 bg-white/5 rounded" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white/5 rounded-xl p-5 space-y-2">
            <div className="h-3 w-24 bg-white/5 rounded" />
            <div className="h-6 w-32 bg-white/5 rounded" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white/5 rounded-xl h-64" />
        <div className="bg-white/5 rounded-xl h-64" />
      </div>
    </div>
  );
}
