"use client";

import { AlertCircle } from "lucide-react";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-5">
      <div className="text-center max-w-md">
        <div className="w-14 h-14 rounded-full bg-red-500/15 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-7 h-7 text-red-400" />
        </div>
        <h2 className="text-white text-xl font-medium mb-2">
          Algo salió mal
        </h2>
        <p className="text-white/50 text-sm mb-6">
          Ocurrió un error inesperado. Por favor intenta de nuevo.
        </p>
        <button
          onClick={reset}
          className="bg-lime text-navy-deep px-6 py-2.5 rounded-lg text-sm font-semibold hover:brightness-110 transition-all cursor-pointer active:scale-[0.98]"
        >
          Intentar de nuevo
        </button>
      </div>
    </div>
  );
}
