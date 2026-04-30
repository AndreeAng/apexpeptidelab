import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrderById } from "@/lib/dal/orders";
import { formatBs } from "@/lib/format";
import StatusBadge from "@/components/admin/orders/StatusBadge";
import OrderDetailActions from "@/components/admin/orders/OrderDetailActions";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) notFound();

  const createdAt = new Date(order.created_at);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin/pedidos"
          className="text-white/40 hover:text-white/70 transition-colors"
        >
          &larr; Pedidos
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          Orden #{order.order_number}
        </h1>
        <StatusBadge status={order.status} size="lg" />
        {order.user_id && (
          <span className="inline-flex items-center rounded-full border border-lime/30 bg-lime/10 px-2.5 py-0.5 text-xs font-medium text-lime">
            Usuario registrado
          </span>
        )}
      </div>

      <p className="text-sm text-white/40">
        {createdAt.toLocaleDateString("es-BO", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}{" "}
        a las{" "}
        {createdAt.toLocaleTimeString("es-BO", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items table */}
          <div className="bg-surface-raised border border-border-subtle rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border-subtle">
              <h2 className="text-sm font-semibold text-white">Productos</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border-subtle text-white/40 text-xs uppercase tracking-wider">
                    <th className="text-left px-5 py-3 font-medium">
                      Producto
                    </th>
                    <th className="text-left px-5 py-3 font-medium">Dosis</th>
                    <th className="text-center px-5 py-3 font-medium">Cant.</th>
                    <th className="text-right px-5 py-3 font-medium">
                      P. Unit.
                    </th>
                    <th className="text-right px-5 py-3 font-medium">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {order.items.map((item, i) => (
                    <tr
                      key={i}
                      className="hover:bg-white/[0.03] transition-colors"
                    >
                      <td className="px-5 py-3 text-white">{item.name}</td>
                      <td className="px-5 py-3 text-white/60">
                        {item.doseLabel}
                      </td>
                      <td className="px-5 py-3 text-center text-white/60">
                        {item.quantity}
                      </td>
                      <td className="px-5 py-3 text-right text-white/60">
                        Bs. {formatBs(item.priceUnit)}
                      </td>
                      <td className="px-5 py-3 text-right text-white font-medium">
                        Bs. {formatBs(item.priceTotal)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary */}
            <div className="border-t border-border-subtle px-5 py-4 space-y-2">
              <div className="flex justify-between text-sm text-white/60">
                <span>Subtotal</span>
                <span>Bs. {formatBs(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-sm text-green-400">
                  <span>
                    Descuento
                    {order.coupon_code ? ` (${order.coupon_code})` : ""}
                  </span>
                  <span>-Bs. {formatBs(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-semibold text-white pt-2 border-t border-border-subtle">
                <span>Total</span>
                <span>Bs. {formatBs(order.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Customer info */}
          <div className="bg-surface-raised border border-border-subtle rounded-xl p-5 space-y-3">
            <h2 className="text-sm font-semibold text-white">
              Datos del cliente
            </h2>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-white/40">Nombre:</span>{" "}
                <span className="text-white">{order.customer_name}</span>
              </div>
              {order.customer_ci && (
                <div>
                  <span className="text-white/40">CI:</span>{" "}
                  <span className="text-white">{order.customer_ci}</span>
                </div>
              )}
              <div>
                <span className="text-white/40">Tel&eacute;fono:</span>{" "}
                <span className="text-white">{order.customer_phone}</span>
              </div>
              <div>
                <span className="text-white/40">Ciudad:</span>{" "}
                <span className="text-white">
                  {order.customer_city || "—"}
                </span>
              </div>
              <div>
                <span className="text-white/40">Direcci&oacute;n:</span>{" "}
                <span className="text-white">
                  {order.customer_address || "—"}
                </span>
              </div>
              {order.notes && (
                <div>
                  <span className="text-white/40">Notas del cliente:</span>
                  <p className="text-white/70 mt-1">{order.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Status change + Admin notes (client component) */}
          <OrderDetailActions
            orderId={order.id}
            currentStatus={order.status}
            adminNotes={order.admin_notes || ""}
          />
        </div>
      </div>
    </div>
  );
}
