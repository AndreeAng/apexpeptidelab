"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  MapPin,
  ShoppingBag,
  LogOut,
  Loader2,
  Plus,
  Trash2,
  CheckCircle,
} from "lucide-react";
import type { DbProfile, DbOrder } from "@/lib/supabase/types";
import { updateProfileAction, updateAddressesAction, logoutAction } from "@/app/cuenta/actions";
import { formatBs } from "@/lib/format";
import Link from "next/link";

type Tab = "datos" | "direcciones" | "pedidos";

interface Props {
  profile: DbProfile | null;
  orders: DbOrder[];
  userEmail: string;
}

export function CuentaContent({ profile, orders, userEmail }: Props) {
  const [tab, setTab] = useState<Tab>("datos");
  const router = useRouter();

  async function handleLogout() {
    await logoutAction();
    router.push("/");
    router.refresh();
  }

  const tabs: { id: Tab; label: string; icon: typeof User }[] = [
    { id: "datos", label: "Mis datos", icon: User },
    { id: "direcciones", label: "Direcciones", icon: MapPin },
    { id: "pedidos", label: "Pedidos", icon: ShoppingBag },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white">Mi cuenta</h1>
          <p className="text-white/40 text-sm mt-1">{userEmail}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 text-sm text-white/50 hover:text-red-400 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Salir
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 border-b border-lime/10 pb-px">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors ${
              tab === t.id
                ? "text-lime border-b-2 border-lime -mb-px"
                : "text-white/40 hover:text-white/70"
            }`}
          >
            <t.icon className="w-4 h-4" />
            {t.label}
          </button>
        ))}
      </div>

      {tab === "datos" && <ProfileTab profile={profile} />}
      {tab === "direcciones" && <AddressTab profile={profile} />}
      {tab === "pedidos" && <OrdersTab orders={orders} />}
    </div>
  );
}

function ProfileTab({ profile }: { profile: DbProfile | null }) {
  const [name, setName] = useState(profile?.name ?? "");
  const [lastName, setLastName] = useState(profile?.last_name ?? "");
  const [phone, setPhone] = useState(profile?.phone ?? "");
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccess(false);
    startTransition(async () => {
      const result = await updateProfileAction({ name, lastName, phone });
      if (result.ok) {
        setSuccess(true);
        router.refresh();
        setTimeout(() => setSuccess(false), 3000);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-white/60">Nombre</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="checkout-input !pl-3"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-white/60">Apellido</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="checkout-input !pl-3"
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-white/60">WhatsApp</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="checkout-input !pl-3"
          placeholder="71234567"
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="px-5 py-2 rounded-lg bg-lime text-navy-deep font-semibold text-sm
            hover:brightness-110 transition-all disabled:opacity-50 flex items-center gap-2"
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          Guardar
        </button>
        {success && (
          <span className="flex items-center gap-1 text-green-400 text-sm">
            <CheckCircle className="w-4 h-4" /> Guardado
          </span>
        )}
      </div>
    </form>
  );
}

function AddressTab({ profile }: { profile: DbProfile | null }) {
  const [addresses, setAddresses] = useState<
    { label: string; address: string; city: string }[]
  >((profile?.addresses as { label: string; address: string; city: string }[]) ?? []);
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  function addAddress() {
    setAddresses([...addresses, { label: "", address: "", city: "" }]);
  }

  function removeAddress(idx: number) {
    setAddresses(addresses.filter((_, i) => i !== idx));
  }

  function updateField(idx: number, field: string, value: string) {
    const updated = [...addresses];
    updated[idx] = { ...updated[idx], [field]: value };
    setAddresses(updated);
  }

  function handleSave() {
    setSuccess(false);
    startTransition(async () => {
      const result = await updateAddressesAction(addresses);
      if (result.ok) {
        setSuccess(true);
        router.refresh();
        setTimeout(() => setSuccess(false), 3000);
      }
    });
  }

  return (
    <div className="max-w-lg space-y-4">
      {addresses.map((addr, idx) => (
        <div
          key={idx}
          className="rounded-lg border border-lime/10 bg-navy-deep/50 p-4 space-y-3"
        >
          <div className="flex items-center justify-between">
            <input
              type="text"
              value={addr.label}
              onChange={(e) => updateField(idx, "label", e.target.value)}
              placeholder="Etiqueta (ej: Casa, Oficina)"
              className="checkout-input !pl-3 flex-1"
            />
            <button
              onClick={() => removeAddress(idx)}
              className="ml-3 p-1.5 text-red-400 hover:bg-red-500/10 rounded transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <input
            type="text"
            value={addr.address}
            onChange={(e) => updateField(idx, "address", e.target.value)}
            placeholder="Dirección completa"
            className="checkout-input !pl-3"
          />
          <input
            type="text"
            value={addr.city}
            onChange={(e) => updateField(idx, "city", e.target.value)}
            placeholder="Ciudad"
            className="checkout-input !pl-3"
          />
        </div>
      ))}

      <button
        onClick={addAddress}
        className="flex items-center gap-2 px-4 py-2 text-sm text-lime hover:bg-lime/5 rounded-lg transition-colors"
      >
        <Plus className="w-4 h-4" />
        Agregar dirección
      </button>

      {addresses.length > 0 && (
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={isPending}
            className="px-5 py-2 rounded-lg bg-lime text-navy-deep font-semibold text-sm
              hover:brightness-110 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Guardar direcciones
          </button>
          {success && (
            <span className="flex items-center gap-1 text-green-400 text-sm">
              <CheckCircle className="w-4 h-4" /> Guardado
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function OrdersTab({ orders }: { orders: DbOrder[] }) {
  if (orders.length === 0) {
    return (
      <div className="text-center py-12 text-white/40">
        <ShoppingBag className="w-10 h-10 mx-auto mb-3 opacity-40" />
        <p>No tienes pedidos aún</p>
        <Link
          href="/productos"
          className="inline-block mt-4 text-sm text-lime hover:underline"
        >
          Ver productos
        </Link>
      </div>
    );
  }

  const statusLabels: Record<string, { label: string; color: string }> = {
    pending: { label: "Pendiente", color: "bg-yellow-500" },
    confirmed: { label: "Confirmado", color: "bg-blue-500" },
    shipped: { label: "Enviado", color: "bg-purple-500" },
    delivered: { label: "Entregado", color: "bg-green-500" },
    cancelled: { label: "Cancelado", color: "bg-red-500" },
  };

  return (
    <div className="space-y-3">
      {orders.map((order) => {
        const s = statusLabels[order.status] ?? statusLabels.pending;
        return (
          <Link
            key={order.id}
            href={`/cuenta/pedidos/${order.id}`}
            className="block rounded-lg border border-lime/10 bg-navy-deep/50 p-4 hover:border-lime/20 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-medium text-sm">
                Pedido #{order.order_number}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-white/60">
                <span className={`w-2 h-2 rounded-full ${s.color}`} />
                {s.label}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-white/40">
              <span>
                {new Date(order.created_at).toLocaleDateString("es-BO", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
              <span className="text-white/70 font-medium">
                {formatBs(order.total)}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
