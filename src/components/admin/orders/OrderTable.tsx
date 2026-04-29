"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import Link from "next/link";
import type { DbOrder, OrderStatus } from "@/lib/supabase/types";
import { formatBs } from "@/lib/format";
import StatusBadge from "./StatusBadge";

const PAGE_SIZE = 20;

const statusOptions: { value: string; label: string }[] = [
  { value: "", label: "Todos" },
  { value: "pending", label: "Pendiente" },
  { value: "confirmed", label: "Confirmado" },
  { value: "shipped", label: "Enviado" },
  { value: "delivered", label: "Entregado" },
  { value: "cancelled", label: "Cancelado" },
];

export default function OrderTable({
  orders,
  count,
  currentPage,
  currentStatus,
  currentSearch,
  currentDateFrom,
  currentDateTo,
}: {
  orders: DbOrder[];
  count: number;
  currentPage: number;
  currentStatus: string;
  currentSearch: string;
  currentDateFrom: string;
  currentDateTo: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      }
      // Reset page when filters change (unless page itself is being set)
      if (!("page" in updates)) {
        params.delete("page");
      }
      router.push(`/admin/pedidos?${params.toString()}`);
    },
    [router, searchParams],
  );

  const totalPages = Math.ceil(count / PAGE_SIZE);

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="bg-surface-raised border border-border-subtle rounded-xl p-4">
        <input
          type="text"
          placeholder="Buscar por # orden, nombre o tel\u00e9fono..."
          defaultValue={currentSearch}
          onChange={(e) => {
            const value = e.target.value;
            // Debounce-like: update on blur or enter
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              updateParams({ search: (e.target as HTMLInputElement).value });
            }
          }}
          onBlur={(e) => {
            if (e.target.value !== currentSearch) {
              updateParams({ search: e.target.value });
            }
          }}
          className="w-full bg-white/5 border border-border-subtle rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-lime/40 transition-colors"
        />
      </div>

      {/* Filters row */}
      <div className="bg-surface-raised border border-border-subtle rounded-xl p-4 flex flex-wrap gap-3 items-end">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-white/40 font-medium">Estado</label>
          <select
            value={currentStatus}
            onChange={(e) => updateParams({ status: e.target.value })}
            className="bg-white/5 border border-border-subtle rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-lime/40 transition-colors"
          >
            {statusOptions.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                className="bg-navy-deep text-white"
              >
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-white/40 font-medium">Desde</label>
          <input
            type="date"
            value={currentDateFrom}
            onChange={(e) => updateParams({ dateFrom: e.target.value })}
            className="bg-white/5 border border-border-subtle rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-lime/40 transition-colors"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-white/40 font-medium">Hasta</label>
          <input
            type="date"
            value={currentDateTo}
            onChange={(e) => updateParams({ dateTo: e.target.value })}
            className="bg-white/5 border border-border-subtle rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-lime/40 transition-colors"
          />
        </div>

        {(currentStatus || currentSearch || currentDateFrom || currentDateTo) && (
          <button
            onClick={() =>
              updateParams({
                status: "",
                search: "",
                dateFrom: "",
                dateTo: "",
              })
            }
            className="text-xs text-white/40 hover:text-white/70 underline transition-colors py-2"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-surface-raised border border-border-subtle rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-subtle text-white/40 text-xs uppercase tracking-wider">
                <th className="text-left px-4 py-3 font-medium"># Orden</th>
                <th className="text-left px-4 py-3 font-medium">Cliente</th>
                <th className="text-left px-4 py-3 font-medium">Ciudad</th>
                <th className="text-right px-4 py-3 font-medium">Total</th>
                <th className="text-left px-4 py-3 font-medium">Estado</th>
                <th className="text-left px-4 py-3 font-medium">Fecha</th>
                <th className="text-left px-4 py-3 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {orders.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-12 text-center text-white/30"
                  >
                    No se encontraron pedidos.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-white/[0.03] transition-colors"
                  >
                    <td className="px-4 py-3 font-mono text-lime">
                      {order.order_number}
                    </td>
                    <td className="px-4 py-3 text-white">
                      {order.customer_name}
                    </td>
                    <td className="px-4 py-3 text-white/60">
                      {order.customer_city || "—"}
                    </td>
                    <td className="px-4 py-3 text-right text-white font-medium">
                      Bs. {formatBs(order.total)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-4 py-3 text-white/60">
                      {new Date(order.created_at).toLocaleDateString("es-BO", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/pedidos/${order.id}`}
                        className="text-lime hover:text-lime/80 text-sm font-medium transition-colors"
                      >
                        Ver
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-1">
          <p className="text-sm text-white/40">
            Mostrando {(currentPage - 1) * PAGE_SIZE + 1}–
            {Math.min(currentPage * PAGE_SIZE, count)} de {count} pedidos
          </p>
          <div className="flex gap-2">
            <button
              disabled={currentPage <= 1}
              onClick={() =>
                updateParams({ page: String(currentPage - 1) })
              }
              className="px-3 py-1.5 text-sm rounded-lg border border-border-subtle text-white/60 hover:text-white hover:border-lime/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Anterior
            </button>
            <button
              disabled={currentPage >= totalPages}
              onClick={() =>
                updateParams({ page: String(currentPage + 1) })
              }
              className="px-3 py-1.5 text-sm rounded-lg border border-border-subtle text-white/60 hover:text-white hover:border-lime/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
