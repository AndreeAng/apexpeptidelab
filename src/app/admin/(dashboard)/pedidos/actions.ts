"use server";

import { updateOrderStatus, updateAdminNotes } from "@/lib/dal/orders";
import type { OrderStatus } from "@/lib/supabase/types";
import { revalidatePath } from "next/cache";

export async function updateStatusAction(id: string, status: OrderStatus) {
  await updateOrderStatus(id, status);
  revalidatePath("/admin/pedidos");
  revalidatePath(`/admin/pedidos/${id}`);
}

export async function updateNotesAction(id: string, notes: string) {
  await updateAdminNotes(id, notes);
  revalidatePath(`/admin/pedidos/${id}`);
}
