import { createClient } from "@/lib/supabase/server";
import { getOrderById } from "@/lib/dal/orders";
import { redirect } from "next/navigation";
import { formatBs } from "@/lib/format";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ReorderButton } from "@/components/cuenta/ReorderButton";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/cuenta/login");

  const order = await getOrderById(id);

  if (!order || order.user_id !== user.id) {
    redirect("/cuenta");
  }

  const statusLabels: Record<string, { label: string; color: string }> = {
    pending: { label: "Pendiente", color: "bg-yellow-500" },
    confirmed: { label: "Confirmado", color: "bg-blue-500" },
    shipped: { label: "Enviado", color: "bg-purple-500" },
    delivered: { label: "Entregado", color: "bg-green-500" },
    cancelled: { label: "Cancelado", color: "bg-red-500" },
  };

  const s = statusLabels[order.status] ?? statusLabels.pending;

  return (
    <div>
      <Link
        href="/cuenta"
        className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-lime mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a mi cuenta
      </Link>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold text-white">
            Pedido #{order.order_number}
          </h1>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs text-white/80 bg-white/5 border border-white/10">
            <span className={`w-2 h-2 rounded-full ${s.color}`} />
            {s.label}
          </span>
        </div>
        <ReorderButton items={order.items} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Items */}
        <div className="rounded-lg border border-lime/10 bg-navy-deep/50 p-4">
          <h2 className="text-sm font-medium text-white/60 mb-3">Productos</h2>
          <div className="space-y-2">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span className="text-white/80">
                  {item.name} × {item.quantity}
                </span>
                <span className="text-white/60">{formatBs(item.priceTotal)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-lime/10 mt-3 pt-3 space-y-1">
            <div className="flex justify-between text-sm text-white/60">
              <span>Subtotal</span>
              <span>{formatBs(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-sm text-green-400">
                <span>Descuento{order.coupon_code ? ` (${order.coupon_code})` : ""}</span>
                <span>-{formatBs(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-medium text-white">
              <span>Total</span>
              <span>{formatBs(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="rounded-lg border border-lime/10 bg-navy-deep/50 p-4">
          <h2 className="text-sm font-medium text-white/60 mb-3">Información</h2>
          <dl className="space-y-2 text-sm">
            <div>
              <dt className="text-white/40">Fecha</dt>
              <dd className="text-white/80">
                {new Date(order.created_at).toLocaleDateString("es-BO", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </dd>
            </div>
            {order.customer_address && (
              <div>
                <dt className="text-white/40">Dirección</dt>
                <dd className="text-white/80">{order.customer_address}</dd>
              </div>
            )}
            {order.customer_city && (
              <div>
                <dt className="text-white/40">Ciudad</dt>
                <dd className="text-white/80">{order.customer_city}</dd>
              </div>
            )}
            {order.notes && (
              <div>
                <dt className="text-white/40">Notas</dt>
                <dd className="text-white/80">{order.notes}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>
    </div>
  );
}
