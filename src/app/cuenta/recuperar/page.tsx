"use client";

import { useState, useTransition } from "react";
import { resetPasswordAction } from "./actions";
import { Mail, AlertCircle, Loader2, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function RecuperarPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await resetPasswordAction(email);
      if (result.ok) {
        setSent(true);
      } else {
        setError(result.error);
      }
    });
  }

  if (sent) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm text-center">
          <div className="w-14 h-14 rounded-full bg-lime/20 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-7 h-7 text-lime" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Revisa tu email</h2>
          <p className="text-white/50 text-sm mb-6">
            Si existe una cuenta con <span className="text-white">{email}</span>, recibirás un enlace para restablecer tu contraseña.
          </p>
          <Link href="/cuenta/login" className="text-lime text-sm hover:underline">
            Volver a iniciar sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-white mb-1">Recuperar contraseña</h1>
          <p className="text-white/40 text-sm">
            Ingresa tu email y te enviaremos un enlace
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-lime/10 bg-navy-deep/50 backdrop-blur-sm p-6 space-y-4"
        >
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2.5 text-red-400 text-xs">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="email" className="text-xs font-medium text-white/60">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="checkout-input"
                autoComplete="email"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full mt-2 py-2.5 rounded-lg bg-lime text-navy-deep font-semibold text-sm
              hover:brightness-110 transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
              flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Enviando...
              </>
            ) : (
              "Enviar enlace"
            )}
          </button>
        </form>

        <p className="text-center text-white/40 text-sm mt-6">
          <Link href="/cuenta/login" className="text-lime hover:underline">
            Volver a iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
