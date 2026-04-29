"use server";

import { createClient } from "@/lib/supabase/server";
import { updateProfile, updateAddresses } from "@/lib/dal/profiles";
import { revalidatePath } from "next/cache";

export async function updateProfileAction(formData: {
  name: string;
  lastName: string;
  phone: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { ok: false as const, error: "No autenticado" };

  const success = await updateProfile(user.id, {
    name: formData.name,
    last_name: formData.lastName,
    phone: formData.phone || null,
  });

  if (!success) return { ok: false as const, error: "Error al actualizar" };

  revalidatePath("/cuenta");
  return { ok: true as const };
}

export async function updateAddressesAction(
  addresses: { label: string; address: string; city: string }[],
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { ok: false as const, error: "No autenticado" };

  const success = await updateAddresses(user.id, addresses);

  if (!success) return { ok: false as const, error: "Error al actualizar" };

  revalidatePath("/cuenta");
  return { ok: true as const };
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
}
