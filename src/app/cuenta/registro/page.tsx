"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { registerAction } from "./actions";
import { Mail, Lock, User, Phone, AlertCircle, Loader2, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function RegistroPage() {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [confirmEmail, setConfirmEmail] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await registerAction({ email, password, name, lastName, phone });
      if (result?.ok) {
        if ("requiresConfirmation" in result && result.requiresConfirmation) {
          setConfirmEmail(true);
        } else if ("redirect" in result && result.redirect) {
          router.push(result.redirect);
        }
      } else if (result) {
        setError(result.error);
      }
    });
  }

  if (confirmEmail) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm text-center">
          <div className="w-14 h-14 rounded-full bg-lime/20 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-7 h-7 text-lime" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Revisa tu email</h2>
          <p className="text-white/50 text-sm mb-6">
            Te enviamos un enlace de confirmación a <span className="text-white">{email}</span>. Haz click en el enlace para activar tu cuenta.
          </p>
          <Link href="/cuenta/login" className="text-lime text-sm hover:underline">
            Ir a iniciar sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-white mb-1">Crear cuenta</h1>
          <p className="text-white/40 text-sm">
            Registrate para guardar tus pedidos y datos
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

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-xs font-medium text-white/60">
                Nombre
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Juan"
                  className="checkout-input"
                  autoComplete="given-name"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="lastName" className="text-xs font-medium text-white/60">
                Apellido
              </label>
              <input
                id="lastName"
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Pérez"
                className="checkout-input !pl-3"
                autoComplete="family-name"
              />
            </div>
          </div>

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

          <div className="space-y-1.5">
            <label htmlFor="phone" className="text-xs font-medium text-white/60">
              WhatsApp <span className="text-white/30">(opcional)</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="71234567"
                className="checkout-input"
                autoComplete="tel"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="text-xs font-medium text-white/60">
              Contraseña
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
                Creando cuenta...
              </>
            ) : (
              "Crear cuenta"
            )}
          </button>
        </form>

        <p className="text-center text-white/40 text-sm mt-6">
          ¿Ya tienes cuenta?{" "}
          <Link href="/cuenta/login" className="text-lime hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
