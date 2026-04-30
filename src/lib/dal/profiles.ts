import { createClient } from "@/lib/supabase/server";
import type { DbProfile } from "@/lib/supabase/types";

export async function getProfile(userId: string): Promise<DbProfile | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error || !data) return null;
    return data as DbProfile;
  } catch {
    return null;
  }
}

export async function updateProfile(
  userId: string,
  data: { name?: string; last_name?: string; ci?: string | null; phone?: string | null; email?: string },
): Promise<boolean> {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("profiles")
      .update(data)
      .eq("id", userId);

    return !error;
  } catch {
    return false;
  }
}

export async function updateAddresses(
  userId: string,
  addresses: { label: string; address: string; city: string }[],
): Promise<boolean> {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("profiles")
      .update({ addresses })
      .eq("id", userId);

    return !error;
  } catch {
    return false;
  }
}
