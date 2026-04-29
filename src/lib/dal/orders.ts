import { createClient } from "@/lib/supabase/server";
import type { DbOrder, OrderItem, OrderStatus } from "@/lib/supabase/types";

/** Create an order: calls get_next_order_number() RPC, then inserts. */
export async function createOrder(data: {
  userId?: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerCity: string;
  notes?: string;
  items: OrderItem[];
  subtotal: number;
  discount?: number;
  couponCode?: string;
  total: number;
}): Promise<{ id: string; orderNumber: string } | null> {
  try {
    const supabase = await createClient();

    // 1. Get next order number via RPC
    const { data: orderNumber, error: rpcError } = await supabase.rpc(
      "get_next_order_number",
    );
    if (rpcError || !orderNumber) return null;

    // 2. Insert the order
    const { data: created, error } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        user_id: data.userId ?? null,
        customer_name: data.customerName,
        customer_phone: data.customerPhone,
        customer_address: data.customerAddress,
        customer_city: data.customerCity,
        notes: data.notes ?? null,
        items: data.items,
        subtotal: data.subtotal,
        discount: data.discount ?? 0,
        coupon_code: data.couponCode ?? null,
        total: data.total,
        status: "pending" as OrderStatus,
      })
      .select("id, order_number")
      .single();

    if (error || !created) {
      console.error("Order insert error:", error?.message);
      // If select failed due to RLS but insert succeeded, return the order number
      if (error?.code === "PGRST116" || error?.message?.includes("rows")) {
        return { id: "unknown", orderNumber };
      }
      return null;
    }
    return { id: created.id, orderNumber: created.order_number };
  } catch (err) {
    console.error("Order creation exception:", err);
    return null;
  }
}

/** Get orders with optional filters (for admin). */
export async function getOrders(filters?: {
  status?: OrderStatus;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
  offset?: number;
}): Promise<{ orders: DbOrder[]; count: number }> {
  try {
    const supabase = await createClient();

    let query = supabase
      .from("orders")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    if (filters?.status) {
      query = query.eq("status", filters.status);
    }

    if (filters?.search) {
      const term = `%${filters.search}%`;
      query = query.or(
        `order_number.ilike.${term},customer_name.ilike.${term},customer_phone.ilike.${term}`,
      );
    }

    if (filters?.dateFrom) {
      query = query.gte("created_at", filters.dateFrom);
    }

    if (filters?.dateTo) {
      query = query.lte("created_at", filters.dateTo);
    }

    const limit = filters?.limit ?? 20;
    const offset = filters?.offset ?? 0;
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error || !data) return { orders: [], count: 0 };
    return { orders: data as DbOrder[], count: count ?? 0 };
  } catch {
    return { orders: [], count: 0 };
  }
}

/** Get a single order by ID. */
export async function getOrderById(id: string): Promise<DbOrder | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) return null;
    return data as DbOrder;
  } catch {
    return null;
  }
}

/** Get orders by user ID (for user account). */
export async function getOrdersByUserId(
  userId: string,
): Promise<DbOrder[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error || !data) return [];
    return data as DbOrder[];
  } catch {
    return [];
  }
}

/** Update order status. */
export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
): Promise<boolean> {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id);

    return !error;
  } catch {
    return false;
  }
}

/** Update admin notes. */
export async function updateAdminNotes(
  id: string,
  notes: string,
): Promise<boolean> {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("orders")
      .update({ admin_notes: notes })
      .eq("id", id);

    return !error;
  } catch {
    return false;
  }
}
