"use client";

import { useState, useTransition } from "react";
import type { OrderStatus } from "@/lib/supabase/types";
import {
  updateStatusAction,
  updateNotesAction,
} from "@/app/admin/(dashboard)/pedidos/actions";

const statusOptions: { value: OrderStatus; label: string }[] = [
  { value: "pending", label: "Pendiente" },
  { value: "confirmed", label: "Confirmado" },
  { value: "shipped", label: "Enviado" },
  { value: "delivered", label: "Entregado" },
  { value: "cancelled", label: "Cancelado" },
];

export default function OrderDetailActions({
  orderId,
  currentStatus,
  adminNotes,
}: {
  orderId: string;
  currentStatus: OrderStatus;
  adminNotes: string;
}) {
  const [status, setStatus] = useState<OrderStatus>(currentStatus);
  const [notes, setNotes] = useState(adminNotes);
  const [isPendingStatus, startStatusTransition] = useTransition();
  const [isPendingNotes, startNotesTransition] = useTransition();

  function handleStatusUpdate() {
    startStatusTransition(async () => {
      await updateStatusAction(orderId, status);
    });
  }

  function handleNotesUpdate() {
    startNotesTransition(async () => {
      await updateNotesAction(orderId, notes);
    });
  }

  return (
    <>
      {/* Status change */}
      <div className="bg-surface-raised border border-border-subtle rounded-xl p-5 space-y-3">
        <h2 className="text-sm font-semibold text-white">Cambiar estado</h2>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as OrderStatus)}
          className="w-full bg-white/5 border border-border-subtle rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-lime/40 transition-colors"
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
        <button
          onClick={handleStatusUpdate}
          disabled={isPendingStatus || status === currentStatus}
          className="w-full bg-lime text-navy-deep font-semibold text-sm py-2 rounded-lg hover:bg-lime/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {isPendingStatus ? "Actualizando..." : "Actualizar"}
        </button>
      </div>

      {/* Admin notes */}
      <div className="bg-surface-raised border border-border-subtle rounded-xl p-5 space-y-3">
        <h2 className="text-sm font-semibold text-white">
          Notas del administrador
        </h2>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          placeholder="Notas internas sobre este pedido..."
          className="w-full bg-white/5 border border-border-subtle rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-lime/40 transition-colors resize-none"
        />
        <button
          onClick={handleNotesUpdate}
          disabled={isPendingNotes || notes === adminNotes}
          className="w-full bg-lime text-navy-deep font-semibold text-sm py-2 rounded-lg hover:bg-lime/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {isPendingNotes ? "Guardando..." : "Guardar notas"}
        </button>
      </div>
    </>
  );
}
