"use server";

import { createClient } from "@/lib/supabase/server";

export async function changePasswordAction(newPassword: string) {
  if (newPassword.length < 6) {
    return { ok: false as const, error: "La contraseña debe tener al menos 6 caracteres" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: newPassword });

  if (error) return { ok: false as const, error: "Error al cambiar la contraseña" };

  return { ok: true as const };
}
