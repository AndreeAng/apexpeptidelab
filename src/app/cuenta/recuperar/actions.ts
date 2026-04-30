"use server";

import { createClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";

export async function resetPasswordAction(email: string) {
  const rl = rateLimit(`reset:${email}`, 3, 15 * 60 * 1000);
  if (!rl.ok) return { ok: false as const, error: "Demasiados intentos. Espera unos minutos." };

  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: "https://www.apexpeptidelab.shop/cuenta/cambiar-password",
  });

  if (error) return { ok: false as const, error: "Error al enviar el enlace. Verifica tu email." };

  return { ok: true as const };
}
