"use client";

import { useState, useTransition } from "react";
import { X, Loader2 } from "lucide-react";
import type { DbCoupon } from "@/lib/supabase/types";
import {
  createCouponAction,
  updateCouponAction,
} from "@/app/admin/(dashboard)/cupones/actions";

interface CouponFormProps {
  coupon: DbCoupon | null;
  onClose: () => void;
}

export function CouponForm({ coupon, onClose }: CouponFormProps) {
  const isEdit = !!coupon;
  const [isPending, startTransition] = useTransition();

  const [code, setCode] = useState(coupon?.code ?? "");
  const [type, setType] = useState<"percentage" | "fixed">(
    coupon?.type ?? "percentage",
  );
  const [value, setValue] = useState(coupon?.value?.toString() ?? "");
  const [minOrder, setMinOrder] = useState(
    coupon?.min_order?.toString() ?? "",
  );
  const [maxUses, setMaxUses] = useState(coupon?.max_uses?.toString() ?? "");
  const [expiresAt, setExpiresAt] = useState(
    coupon?.expires_at ? coupon.expires_at.split("T")[0] : "",
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const formData = new FormData();
    formData.set("code", code);
    formData.set("type", type);
    formData.set("value", value);
    formData.set("minOrder", minOrder);
    formData.set("maxUses", maxUses);
    formData.set("expiresAt", expiresAt);

    startTransition(async () => {
      if (isEdit) {
        await updateCouponAction(coupon.id, formData);
      } else {
        await createCouponAction(formData);
      }
      onClose();
    });
  }

  return (
    <div className="mb-6 rounded-lg border border-lime/10 bg-navy-deep/80 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-white">
          {isEdit ? "Editar cupón" : "Nuevo cupón"}
        </h3>
        <button
          onClick={onClose}
          className="p-1 text-white/40 hover:text-white/70 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-white/60">Código</label>
          <input
            type="text"
            required
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="DESCUENTO20"
            className="w-full px-3 py-2 text-sm bg-black/30 border border-lime/20 rounded text-white placeholder:text-white/20"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-white/60">Tipo</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as "percentage" | "fixed")}
            className="w-full px-3 py-2 text-sm bg-black/30 border border-lime/20 rounded text-white"
          >
            <option value="percentage">Porcentaje (%)</option>
            <option value="fixed">Monto fijo (Bs)</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-white/60">
            Valor {type === "percentage" ? "(%)" : "(Bs)"}
          </label>
          <input
            type="number"
            required
            step="0.01"
            min="0"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={type === "percentage" ? "20" : "50"}
            className="w-full px-3 py-2 text-sm bg-black/30 border border-lime/20 rounded text-white placeholder:text-white/20"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-white/60">
            Orden mínima (Bs) <span className="text-white/30">opcional</span>
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={minOrder}
            onChange={(e) => setMinOrder(e.target.value)}
            placeholder="100"
            className="w-full px-3 py-2 text-sm bg-black/30 border border-lime/20 rounded text-white placeholder:text-white/20"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-white/60">
            Usos máximos <span className="text-white/30">opcional</span>
          </label>
          <input
            type="number"
            min="1"
            value={maxUses}
            onChange={(e) => setMaxUses(e.target.value)}
            placeholder="Sin límite"
            className="w-full px-3 py-2 text-sm bg-black/30 border border-lime/20 rounded text-white placeholder:text-white/20"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-white/60">
            Expira <span className="text-white/30">opcional</span>
          </label>
          <input
            type="date"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-black/30 border border-lime/20 rounded text-white"
          />
        </div>

        <div className="md:col-span-2 flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-white/50 hover:text-white/70 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="px-5 py-2 text-sm font-medium bg-lime text-navy-deep rounded-lg hover:brightness-110 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {isEdit ? "Actualizar" : "Crear"}
          </button>
        </div>
      </form>
    </div>
  );
}
