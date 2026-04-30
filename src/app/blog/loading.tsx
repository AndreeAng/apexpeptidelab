export default function BlogLoading() {
  return (
    <div className="min-h-screen animate-pulse">
      <header className="pb-10">
        <div className="h-3 w-16 bg-white/5 rounded mb-3" />
        <div className="h-10 w-72 bg-white/5 rounded mb-3" />
        <div className="h-4 w-96 bg-white/5 rounded" />
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white/5 rounded-xl p-6 space-y-3">
            <div className="h-3 w-20 bg-white/5 rounded" />
            <div className="h-5 w-full bg-white/5 rounded" />
            <div className="h-4 w-full bg-white/5 rounded" />
            <div className="h-4 w-3/4 bg-white/5 rounded" />
            <div className="h-3 w-32 bg-white/5 rounded mt-4" />
          </div>
        ))}
      </div>
    </div>
  );
}
