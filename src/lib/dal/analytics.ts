import { createClient } from "@/lib/supabase/server";
import type { DbOrder, OrderItem } from "@/lib/supabase/types";

export interface MonthlyStats {
  totalSales: number;
  orderCount: number;
  avgTicket: number;
}

export interface WeeklySale {
  week: string;
  total: number;
}

export interface CityOrders {
  city: string;
  count: number;
}

/** Monthly stats: total sales, order count, avg ticket for a given month/year */
export async function getMonthlyStats(
  year: number,
  month: number
): Promise<MonthlyStats> {
  try {
    const supabase = await createClient();

    // Handle month overflow (e.g. month=0 means December of previous year)
    const adjustedDate = new Date(year, month - 1, 1);
    const startDate = adjustedDate.toISOString();
    const endDate = new Date(
      adjustedDate.getFullYear(),
      adjustedDate.getMonth() + 1,
      1
    ).toISOString();

    const { data, error } = await supabase
      .from("orders")
      .select("total")
      .neq("status", "cancelled")
      .gte("created_at", startDate)
      .lt("created_at", endDate);

    if (error || !data) return { totalSales: 0, orderCount: 0, avgTicket: 0 };

    const totalSales = data.reduce(
      (sum: number, o: { total: number }) => sum + o.total,
      0
    );
    const orderCount = data.length;
    const avgTicket = orderCount > 0 ? totalSales / orderCount : 0;

    return { totalSales, orderCount, avgTicket };
  } catch {
    return { totalSales: 0, orderCount: 0, avgTicket: 0 };
  }
}

/** Weekly sales for the last N weeks (for line chart) */
export async function getWeeklySales(weeks: number = 12): Promise<WeeklySale[]> {
  try {
    const supabase = await createClient();

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - weeks * 7);

    const { data, error } = await supabase
      .from("orders")
      .select("total, created_at")
      .neq("status", "cancelled")
      .gte("created_at", startDate.toISOString())
      .order("created_at", { ascending: true });

    if (error || !data) return [];

    // Group by week
    const weekMap = new Map<string, number>();

    for (const order of data) {
      const date = new Date(order.created_at);
      // Get the Monday of the week
      const day = date.getDay();
      const diff = date.getDate() - day + (day === 0 ? -6 : 1);
      const monday = new Date(date);
      monday.setDate(diff);
      const weekKey = monday.toISOString().slice(0, 10);

      weekMap.set(weekKey, (weekMap.get(weekKey) ?? 0) + order.total);
    }

    return Array.from(weekMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([week, total]) => ({ week, total }));
  } catch {
    return [];
  }
}

/** Orders grouped by city (for bar chart) */
export async function getOrdersByCity(
  limit: number = 5
): Promise<CityOrders[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("orders")
      .select("customer_city")
      .neq("status", "cancelled");

    if (error || !data) return [];

    // Group by city using JS
    const cityMap = new Map<string, number>();

    for (const order of data) {
      const city = (order.customer_city as string) || "Sin ciudad";
      cityMap.set(city, (cityMap.get(city) ?? 0) + 1);
    }

    return Array.from(cityMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([city, count]) => ({ city, count }));
  } catch {
    return [];
  }
}

/** Top selling product this month */
export async function getTopProduct(
  year: number,
  month: number
): Promise<{ name: string; units: number } | null> {
  try {
    const supabase = await createClient();

    const startDate = new Date(year, month - 1, 1).toISOString();
    const endDate = new Date(year, month, 1).toISOString();

    const { data, error } = await supabase
      .from("orders")
      .select("items")
      .neq("status", "cancelled")
      .gte("created_at", startDate)
      .lt("created_at", endDate);

    if (error || !data || data.length === 0) return null;

    // Count product occurrences
    const productMap = new Map<string, number>();

    for (const order of data) {
      const items = order.items as OrderItem[];
      if (!Array.isArray(items)) continue;
      for (const item of items) {
        const current = productMap.get(item.name) ?? 0;
        productMap.set(item.name, current + item.quantity);
      }
    }

    if (productMap.size === 0) return null;

    let topName = "";
    let topUnits = 0;
    for (const [name, units] of productMap) {
      if (units > topUnits) {
        topName = name;
        topUnits = units;
      }
    }

    return { name: topName, units: topUnits };
  } catch {
    return null;
  }
}

/** Orders by date range (for CSV export) */
export async function getOrdersByDateRange(
  from: string,
  to: string,
): Promise<DbOrder[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .gte("created_at", `${from}T00:00:00`)
      .lte("created_at", `${to}T23:59:59.999`)
      .order("created_at", { ascending: false });

    if (error || !data) return [];
    return data as DbOrder[];
  } catch {
    return [];
  }
}

/** Recent orders (last N) */
export async function getRecentOrders(limit: number = 10): Promise<DbOrder[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error || !data) return [];
    return data as DbOrder[];
  } catch {
    return [];
  }
}
