"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { rateLimit } from "@/lib/rate-limit";

export async function loginAction(formData: {
  email: string;
  password: string;
}) {
  const rl = rateLimit(`login:${formData.email}`, 5, 5 * 60 * 1000);
  if (!rl.ok) return { ok: false as const, error: "Demasiados intentos. Espera unos minutos." };

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.email,
    password: formData.password,
  });

  if (error) return { ok: false as const, error: "Email o contraseña incorrectos" };

  redirect("/cuenta");
}
