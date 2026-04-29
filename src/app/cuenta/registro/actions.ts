"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function registerAction(formData: {
  email: string;
  password: string;
  name: string;
  lastName: string;
  phone?: string;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
    options: {
      data: {
        name: formData.name,
        last_name: formData.lastName,
        phone: formData.phone || null,
      },
    },
  });

  if (error) {
    if (error.message.includes("already registered")) {
      return { ok: false as const, error: "Este email ya está registrado" };
    }
    if (error.message.includes("password")) {
      return { ok: false as const, error: "La contraseña debe tener al menos 6 caracteres" };
    }
    return { ok: false as const, error: "Error al crear la cuenta" };
  }

  if (!data.user) return { ok: false as const, error: "Error al crear la cuenta" };

  // Update profile with name/phone (trigger creates the row, we update it)
  await supabase
    .from("profiles")
    .update({
      name: formData.name,
      last_name: formData.lastName,
      phone: formData.phone || null,
      email: formData.email,
    })
    .eq("id", data.user.id);

  // Claim guest orders: link orders that match this phone number and have no user_id
  if (formData.phone) {
    await supabase
      .from("orders")
      .update({ user_id: data.user.id })
      .eq("customer_phone", formData.phone)
      .is("user_id", null);
  }

  redirect("/cuenta");
}
