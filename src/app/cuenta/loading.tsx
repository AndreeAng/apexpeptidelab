export default function CuentaLoading() {
  return (
    <div className="animate-pulse">
      <div className="rounded-xl bg-white/5 p-6 mb-8">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-white/5" />
          <div className="flex-1">
            <div className="h-3 w-24 bg-white/5 rounded mb-2" />
            <div className="h-5 w-48 bg-white/5 rounded mb-2" />
            <div className="h-3 w-36 bg-white/5 rounded" />
          </div>
        </div>
      </div>
      <div className="flex gap-1 mb-6 bg-white/[0.03] rounded-lg p-1">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex-1 h-10 bg-white/5 rounded-md" />
        ))}
      </div>
      <div className="rounded-xl bg-white/5 p-6 space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-10 bg-white/5 rounded" />
        ))}
      </div>
    </div>
  );
}
