import type { OrderStatus } from "@/lib/supabase/types";

const statusConfig: Record<
  OrderStatus,
  { label: string; classes: string }
> = {
  pending: {
    label: "Pendiente",
    classes: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  },
  confirmed: {
    label: "Confirmado",
    classes: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  },
  shipped: {
    label: "Enviado",
    classes: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  },
  delivered: {
    label: "Entregado",
    classes: "bg-green-500/15 text-green-400 border-green-500/30",
  },
  cancelled: {
    label: "Cancelado",
    classes: "bg-red-500/15 text-red-400 border-red-500/30",
  },
};

export default function StatusBadge({
  status,
  size = "sm",
}: {
  status: OrderStatus;
  size?: "sm" | "lg";
}) {
  const { label, classes } = statusConfig[status];
  const sizeClasses =
    size === "lg" ? "px-3 py-1.5 text-sm" : "px-2 py-0.5 text-xs";

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium ${classes} ${sizeClasses}`}
    >
      {label}
    </span>
  );
}
