import Link from "next/link";
import { FlaskConical } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-5">
      <div className="text-center max-w-md mx-auto">
        {/* Large 404 */}
        <div className="relative mb-6">
          <span className="text-[160px] md:text-[200px] font-mono font-bold text-lime/10 leading-none select-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <FlaskConical size={48} className="text-lime/40" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-white text-2xl md:text-3xl font-medium mb-3">
          Pagina no encontrada
        </h1>

        {/* Subtext */}
        <p className="text-white/50 text-sm md:text-base leading-relaxed mb-8">
          El compuesto que buscas no esta en nuestro catalogo... aun.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="bg-lime text-navy px-7 py-3 rounded-full text-sm font-medium hover:opacity-90 transition-opacity inline-flex items-center justify-center cursor-pointer active:scale-[0.97]"
          >
            Ir al inicio
          </Link>
          <Link
            href="/productos"
            className="border border-lime/30 text-lime px-7 py-3 rounded-full text-sm font-medium hover:border-lime hover:bg-lime/5 transition-all inline-flex items-center justify-center cursor-pointer"
          >
            Ver productos
          </Link>
        </div>
      </div>
    </div>
  );
}
