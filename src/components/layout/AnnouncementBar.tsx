import { FlaskConical, Truck, ShieldCheck } from "lucide-react";

export function AnnouncementBar() {
  return (
    <div className="bg-lime text-navy text-[11px] md:text-xs font-medium tracking-wide">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-2 flex items-center justify-center gap-4 md:gap-8">
        <span className="flex items-center gap-1.5">
          <ShieldCheck size={13} className="flex-shrink-0" />
          <span className="hidden sm:inline">Pureza 99%+</span>
          <span className="sm:hidden">99%+</span>
        </span>
        <span className="w-1 h-1 rounded-full bg-navy/25 flex-shrink-0" />
        <span className="flex items-center gap-1.5">
          <FlaskConical size={13} className="flex-shrink-0" />
          <span>Stock disponible</span>
        </span>
        <span className="w-1 h-1 rounded-full bg-navy/25 flex-shrink-0" />
        <span className="flex items-center gap-1.5">
          <Truck size={13} className="flex-shrink-0" />
          <span className="hidden sm:inline">Envío a toda Bolivia</span>
          <span className="sm:hidden">Envío nacional</span>
        </span>
      </div>
    </div>
  );
}
