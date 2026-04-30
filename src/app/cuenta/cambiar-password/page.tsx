"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { changePasswordAction } from "./actions";
import { Lock, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function CambiarPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [ready, setReady] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    // Listen for the PASSWORD_RECOVERY event from the URL token
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
        setReady(true);
      }
    });
    // Also check if already has a session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 6) { setError("Mínimo 6 caracteres"); return; }
    if (password !== confirm) { setError("Las contraseñas no coinciden"); return; }

    startTransition(async () => {
      const result = await changePasswordAction(password);
      if (result.ok) {
        setSuccess(true);
        setTimeout(() => router.push("/cuenta"), 2000);
      } else {
        setError(result.error);
      }
    });
  }

  if (success) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm text-center">
          <div className="w-14 h-14 rounded-full bg-lime/20 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-7 h-7 text-lime" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Contraseña actualizada</h2>
          <p className="text-white/50 text-sm">Redirigiendo a tu cuenta...</p>
        </div>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm text-center">
          <Loader2 className="w-8 h-8 text-lime animate-spin mx-auto mb-4" />
          <p className="text-white/50 text-sm">Verificando enlace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-white mb-1">Nueva contraseña</h1>
          <p className="text-white/40 text-sm">Ingresa tu nueva contraseña</p>
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
            <label htmlFor="password" className="text-xs font-medium text-white/60">
              Nueva contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="checkout-input"
                autoComplete="new-password"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="confirm" className="text-xs font-medium text-white/60">
              Confirmar contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                id="confirm"
                type="password"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Repite la contraseña"
                className="checkout-input"
                autoComplete="new-password"
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
                Actualizando...
              </>
            ) : (
              "Cambiar contraseña"
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
