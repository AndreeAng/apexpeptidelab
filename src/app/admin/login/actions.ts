"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { rateLimit } from "@/lib/rate-limit";

export async function adminLoginAction(formData: {
  email: string;
  password: string;
}) {
  const rl = rateLimit(`admin-login:${formData.email}`, 5, 5 * 60 * 1000);
  if (!rl.ok) return { ok: false as const, error: "Demasiados intentos. Espera unos minutos." };

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.email,
    password: formData.password,
  });

  if (error) return { ok: false as const, error: "Credenciales inválidas" };

  // Verify admin role
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { ok: false as const, error: "Error de autenticación" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    await supabase.auth.signOut();
    return { ok: false as const, error: "No tienes permisos de administrador" };
  }

  return { ok: true as const, redirect: "/admin" };
}
