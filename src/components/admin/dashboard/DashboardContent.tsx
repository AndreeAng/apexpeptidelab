"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Download, Loader2 } from "lucide-react";
import type { MonthlyStats, WeeklySale, CityOrders } from "@/lib/dal/analytics";
import type { DbOrder } from "@/lib/supabase/types";
import { formatBs } from "@/lib/format";
import { exportOrdersCSVAction } from "@/app/admin/(dashboard)/actions";

interface DashboardContentProps {
  stats: MonthlyStats;
  prevStats: MonthlyStats;
  weeklySales: WeeklySale[];
  cityData: CityOrders[];
  topProduct: { name: string; units: number } | null;
  recentOrders: DbOrder[];
  projectedRevenue: number;
}

function pctChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

function ChangeIndicator({ current, previous }: { current: number; previous: number }) {
  const pct = pctChange(current, previous);
  const isPositive = pct >= 0;
  return (
    <span className={`text-xs font-medium ${isPositive ? "text-green-400" : "text-red-400"}`}>
      {isPositive ? "\u2191" : "\u2193"} {Math.abs(pct).toFixed(1)}%
    </span>
  );
}

const statusColors: Record<string, string> = {
  pending: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  confirmed: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  shipped: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  delivered: "bg-green-500/20 text-green-300 border-green-500/30",
  cancelled: "bg-red-500/20 text-red-300 border-red-500/30",
};

const statusLabels: Record<string, string> = {
  pending: "Pendiente",
  confirmed: "Confirmado",
  shipped: "Enviado",
  delivered: "Entregado",
  cancelled: "Cancelado",
};

function exportCSV(orders: DbOrder[]) {
  const headers = ["Pedido", "Cliente", "Ciudad", "Total", "Estado", "Fecha"];
  const rows = orders.map((o) => [
    o.order_number,
    o.customer_name,
    o.customer_city ?? "",
    o.total.toFixed(2),
    o.status,
    new Date(o.created_at).toLocaleDateString("es-BO"),
  ]);

  const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `pedidos_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function DashboardContent({
  stats,
  prevStats,
  weeklySales,
  cityData,
  topProduct,
  recentOrders,
  projectedRevenue,
}: DashboardContentProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-white mb-1">
          Dashboard
        </h1>
        <p className="text-sm text-white/40">
          Resumen de ventas y actividad del mes actual.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Ventas del mes"
          value={`Bs ${formatBs(stats.totalSales)}`}
          footer={<ChangeIndicator current={stats.totalSales} previous={prevStats.totalSales} />}
        />
        <StatCard
          label="Pedidos del mes"
          value={String(stats.orderCount)}
          footer={<ChangeIndicator current={stats.orderCount} previous={prevStats.orderCount} />}
        />
        <StatCard
          label="Ticket promedio"
          value={`Bs ${formatBs(stats.avgTicket)}`}
        />
        <StatCard
          label="Producto top"
          value={topProduct?.name ?? "---"}
          footer={
            topProduct ? (
              <span className="text-xs text-white/50">{topProduct.units} uds</span>
            ) : null
          }
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Line chart - weekly sales */}
        <div className="bg-surface-raised border border-border-subtle rounded-xl p-5">
          <h3 className="text-sm font-medium text-white/70 mb-4">
            Ventas por semana
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={weeklySales}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
              <XAxis
                dataKey="week"
                tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
                tickFormatter={(v: string) => v.slice(5)}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  background: "#001a3a",
                  border: "1px solid rgba(184,202,96,0.25)",
                  borderRadius: 8,
                  color: "#fff",
                }}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(value: any) => [`Bs ${formatBs(Number(value))}`, "Ventas"]}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                labelFormatter={(label: any) => `Semana: ${String(label)}`}
              />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#b8ca60"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: "#b8ca60" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bar chart - projected vs current */}
        <div className="bg-surface-raised border border-border-subtle rounded-xl p-5">
          <h3 className="text-sm font-medium text-white/70 mb-4">
            Actual vs. Mes anterior
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={[
                { name: "Mes anterior", value: prevStats.totalSales },
                { name: "Mes actual", value: stats.totalSales },
                { name: "Proyectado", value: projectedRevenue },
              ]}
            >
              <CartesianGrid stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  background: "#001a3a",
                  border: "1px solid rgba(184,202,96,0.25)",
                  borderRadius: 8,
                  color: "#fff",
                }}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(value: any) => [`Bs ${formatBs(Number(value))}`, "Total"]}
              />
              <Bar dataKey="value" fill="#b8ca60" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Horizontal bar - orders by city */}
        <div className="bg-surface-raised border border-border-subtle rounded-xl p-5 lg:col-span-2">
          <h3 className="text-sm font-medium text-white/70 mb-4">
            Pedidos por ciudad
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={cityData} layout="vertical">
              <CartesianGrid stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
              <XAxis
                type="number"
                tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="city"
                tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                width={100}
              />
              <Tooltip
                contentStyle={{
                  background: "#001a3a",
                  border: "1px solid rgba(184,202,96,0.25)",
                  borderRadius: 8,
                  color: "#fff",
                }}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(value: any) => [value, "Pedidos"]}
              />
              <Bar dataKey="count" fill="#b8ca60" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Projected revenue card */}
      <div className="bg-surface-raised border border-border-subtle rounded-xl p-5">
        <h3 className="text-sm font-medium text-white/70 mb-1">
          Ingreso proyectado del mes
        </h3>
        <p className="text-2xl font-semibold text-lime">
          Bs {formatBs(projectedRevenue)}
        </p>
        <p className="text-xs text-white/40 mt-1">
          Basado en el ritmo actual de ventas
        </p>
      </div>

      {/* CSV Export with date range */}
      <CSVExportSection />

      {/* Recent orders */}
      <div className="bg-surface-raised border border-border-subtle rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-white/70">
            Pedidos recientes
          </h3>
          <button
            onClick={() => exportCSV(recentOrders)}
            className="text-xs px-3 py-1.5 rounded-lg bg-lime/10 text-lime border border-lime/20 hover:bg-lime/20 transition-colors cursor-pointer"
          >
            Exportar CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-white/50 text-left border-b border-border-subtle">
                <th className="pb-2 font-medium">Pedido</th>
                <th className="pb-2 font-medium">Cliente</th>
                <th className="pb-2 font-medium">Ciudad</th>
                <th className="pb-2 font-medium text-right">Total</th>
                <th className="pb-2 font-medium">Estado</th>
                <th className="pb-2 font-medium">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-border-subtle/50 last:border-0"
                >
                  <td className="py-2.5 font-mono text-xs text-white/80">
                    {order.order_number}
                  </td>
                  <td className="py-2.5 text-white/80">
                    {order.customer_name}
                  </td>
                  <td className="py-2.5 text-white/60">
                    {order.customer_city ?? "---"}
                  </td>
                  <td className="py-2.5 text-right text-white/80">
                    Bs {formatBs(order.total)}
                  </td>
                  <td className="py-2.5">
                    <span
                      className={`inline-block px-2 py-0.5 text-xs rounded-full border ${statusColors[order.status] ?? ""}`}
                    >
                      {statusLabels[order.status] ?? order.status}
                    </span>
                  </td>
                  <td className="py-2.5 text-white/50 text-xs">
                    {new Date(order.created_at).toLocaleDateString("es-BO")}
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-white/40">
                    No hay pedidos recientes.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function CSVExportSection() {
  const today = new Date().toISOString().slice(0, 10);
  const firstOfMonth = `${today.slice(0, 7)}-01`;

  const [from, setFrom] = useState(firstOfMonth);
  const [to, setTo] = useState(today);
  const [loading, setLoading] = useState(false);

  async function handleExport() {
    if (!from || !to) return;
    setLoading(true);
    try {
      const { csv, count } = await exportOrdersCSVAction(from, to);
      if (count === 0) {
        alert("No hay pedidos en el rango seleccionado");
        return;
      }
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `pedidos_${from}_${to}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-surface-raised border border-border-subtle rounded-xl p-5">
      <h3 className="text-sm font-medium text-white/70 mb-3">
        Exportar pedidos
      </h3>
      <div className="flex flex-wrap items-end gap-3">
        <div className="space-y-1">
          <label className="text-xs text-white/50">Desde</label>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="px-3 py-1.5 text-sm bg-black/30 border border-lime/20 rounded text-white"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-white/50">Hasta</label>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="px-3 py-1.5 text-sm bg-black/30 border border-lime/20 rounded text-white"
          />
        </div>
        <button
          onClick={handleExport}
          disabled={loading || !from || !to}
          className="flex items-center gap-2 px-4 py-1.5 text-sm font-medium bg-lime text-navy-deep rounded-lg hover:brightness-110 transition-all disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          Exportar CSV
        </button>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  footer,
}: {
  label: string;
  value: string;
  footer?: React.ReactNode;
}) {
  return (
    <div className="bg-surface-raised border border-border-subtle rounded-xl p-5">
      <p className="text-xs text-white/50 mb-1">{label}</p>
      <p className="text-xl font-semibold text-white truncate">{value}</p>
      {footer && <div className="mt-1">{footer}</div>}
    </div>
  );
}
