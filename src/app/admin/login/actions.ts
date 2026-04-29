"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function adminLoginAction(formData: {
  email: string;
  password: string;
}) {
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

  redirect("/admin");
}
