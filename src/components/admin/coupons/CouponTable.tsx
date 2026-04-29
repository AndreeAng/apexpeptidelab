"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { DbCoupon } from "@/lib/supabase/types";
import {
  deleteCouponAction,
  toggleCouponActiveAction,
} from "@/app/admin/(dashboard)/cupones/actions";
import { CouponForm } from "./CouponForm";
import { Plus } from "lucide-react";

interface CouponTableProps {
  coupons: DbCoupon[];
}

function getCouponStatus(coupon: DbCoupon): {
  label: string;
  color: string;
} {
  if (!coupon.is_active) return { label: "Inactivo", color: "bg-white/30" };
  if (coupon.expires_at && new Date(coupon.expires_at) < new Date())
    return { label: "Expirado", color: "bg-red-500" };
  if (coupon.max_uses && coupon.used_count >= coupon.max_uses)
    return { label: "Agotado", color: "bg-yellow-500" };
  return { label: "Activo", color: "bg-green-500" };
}

export function CouponTable({ coupons }: CouponTableProps) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editCoupon, setEditCoupon] = useState<DbCoupon | null>(null);

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => {
            setEditCoupon(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-lime text-navy-deep rounded-lg hover:brightness-110 transition-all"
        >
          <Plus className="w-4 h-4" />
          Nuevo cupón
        </button>
      </div>

      {(showForm || editCoupon) && (
        <CouponForm
          coupon={editCoupon}
          onClose={() => {
            setShowForm(false);
            setEditCoupon(null);
            router.refresh();
          }}
        />
      )}

      <div className="overflow-x-auto rounded-lg border border-lime/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-lime/10 bg-black/20">
              <th className="px-4 py-3 text-left text-white/60 font-medium">
                Código
              </th>
              <th className="px-4 py-3 text-left text-white/60 font-medium">
                Tipo
              </th>
              <th className="px-4 py-3 text-left text-white/60 font-medium">
                Valor
              </th>
              <th className="px-4 py-3 text-center text-white/60 font-medium">
                Usos
              </th>
              <th className="px-4 py-3 text-center text-white/60 font-medium">
                Estado
              </th>
              <th className="px-4 py-3 text-center text-white/60 font-medium">
                Activo
              </th>
              <th className="px-4 py-3 text-right text-white/60 font-medium">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon) => (
              <CouponRow
                key={coupon.id}
                coupon={coupon}
                onEdit={() => {
                  setEditCoupon(coupon);
                  setShowForm(true);
                }}
                onMutation={() => router.refresh()}
              />
            ))}
            {coupons.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-8 text-center text-white/40"
                >
                  No hay cupones
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CouponRow({
  coupon,
  onEdit,
  onMutation,
}: {
  coupon: DbCoupon;
  onEdit: () => void;
  onMutation: () => void;
}) {
  const [toggleLoading, setToggleLoading] = useState(false);
  const status = getCouponStatus(coupon);

  async function handleToggle() {
    setToggleLoading(true);
    await toggleCouponActiveAction(coupon.id, !coupon.is_active);
    setToggleLoading(false);
    onMutation();
  }

  async function handleDelete() {
    if (!window.confirm(`¿Eliminar el cupón "${coupon.code}"?`)) return;
    await deleteCouponAction(coupon.id);
    onMutation();
  }

  return (
    <tr className="border-b border-lime/5 hover:bg-white/[0.02] transition-colors">
      <td className="px-4 py-3 font-mono text-lime text-xs font-bold">
        {coupon.code}
      </td>
      <td className="px-4 py-3 text-white/80">
        {coupon.type === "percentage" ? "Porcentaje" : "Fijo (Bs)"}
      </td>
      <td className="px-4 py-3 text-white/80">
        {coupon.type === "percentage" ? `${coupon.value}%` : `${coupon.value} Bs`}
      </td>
      <td className="px-4 py-3 text-center text-white/60">
        {coupon.used_count} / {coupon.max_uses ?? "∞"}
      </td>
      <td className="px-4 py-3 text-center">
        <span className="inline-flex items-center gap-1.5 text-xs text-white/60">
          <span className={`w-2 h-2 rounded-full ${status.color}`} />
          {status.label}
        </span>
      </td>
      <td className="px-4 py-3 text-center">
        <button
          onClick={handleToggle}
          disabled={toggleLoading}
          className={`relative w-10 h-5 rounded-full transition-colors ${
            coupon.is_active ? "bg-lime/60" : "bg-white/10"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
              coupon.is_active ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </td>
      <td className="px-4 py-3 text-right">
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={onEdit}
            className="px-3 py-1 text-xs bg-white/5 border border-white/10 rounded hover:bg-white/10 text-white/70 transition-colors"
          >
            Editar
          </button>
          <button
            onClick={handleDelete}
            className="px-3 py-1 text-xs bg-red-500/10 border border-red-500/20 rounded hover:bg-red-500/20 text-red-400 transition-colors"
          >
            Eliminar
          </button>
        </div>
      </td>
    </tr>
  );
}
