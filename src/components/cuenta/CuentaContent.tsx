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
  FileText,
  Phone,
  Mail,
  Tag,
  ChevronRight,
  Package,
  Home,
  Building,
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

function getInitials(profile: DbProfile | null, email: string): string {
  if (profile?.name && profile?.last_name) {
    return `${profile.name[0]}${profile.last_name[0]}`.toUpperCase();
  }
  if (profile?.name) return profile.name[0].toUpperCase();
  return email[0].toUpperCase();
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Buenos días";
  if (hour < 19) return "Buenas tardes";
  return "Buenas noches";
}

export function CuentaContent({ profile, orders, userEmail }: Props) {
  const [tab, setTab] = useState<Tab>("datos");
  const router = useRouter();

  async function handleLogout() {
    await logoutAction();
    router.push("/");
    router.refresh();
  }

  const tabs: { id: Tab; label: string; icon: typeof User; count?: number }[] = [
    { id: "datos", label: "Mis datos", icon: User },
    { id: "direcciones", label: "Direcciones", icon: MapPin },
    { id: "pedidos", label: "Pedidos", icon: ShoppingBag, count: orders.length },
  ];

  const initials = getInitials(profile, userEmail);
  const displayName = profile?.name
    ? `${profile.name}${profile.last_name ? ` ${profile.last_name}` : ""}`
    : userEmail;

  return (
    <div>
      {/* Profile header */}
      <div className="rounded-xl border border-lime/10 bg-gradient-to-br from-navy-deep/80 to-navy-deep/40 p-6 mb-8">
        <div className="flex items-center gap-5">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-full bg-lime/15 border-2 border-lime/30 flex items-center justify-center shrink-0">
            <span className="text-lime font-semibold text-lg">{initials}</span>
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-white/40 text-xs mb-0.5">{getGreeting()}</p>
            <h1 className="text-xl font-semibold text-white truncate">{displayName}</h1>
            <div className="flex items-center gap-1.5 mt-1">
              <Mail className="w-3 h-3 text-white/30" />
              <span className="text-white/40 text-xs truncate">{userEmail}</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-white/40 hover:text-red-400
              border border-white/10 hover:border-red-500/30 hover:bg-red-500/5
              rounded-lg transition-all duration-200 shrink-0"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Cerrar sesión</span>
          </button>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 gap-3 mt-5 pt-5 border-t border-white/5">
          <div className="text-center">
            <p className="text-lg font-semibold text-white">{orders.length}</p>
            <p className="text-[11px] text-white/40">Pedidos</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-white">
              {orders.length > 0
                ? new Date(orders[0].created_at).toLocaleDateString("es-BO", { day: "numeric", month: "short" })
                : "—"}
            </p>
            <p className="text-[11px] text-white/40">Último pedido</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-white/[0.03] rounded-lg p-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center justify-center gap-2 flex-1 px-4 py-2.5 text-sm font-medium rounded-md transition-all duration-200 ${
              tab === t.id
                ? "bg-lime/15 text-lime shadow-sm"
                : "text-white/40 hover:text-white/60 hover:bg-white/[0.03]"
            }`}
          >
            <t.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{t.label}</span>
            {t.count !== undefined && t.count > 0 && (
              <span
                className={`ml-1 text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 ${
                  tab === t.id
                    ? "bg-lime/20 text-lime"
                    : "bg-white/10 text-white/40"
                }`}
              >
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="min-h-[300px]">
        {tab === "datos" && <ProfileTab profile={profile} userEmail={userEmail} />}
        {tab === "direcciones" && <AddressTab profile={profile} />}
        {tab === "pedidos" && <OrdersTab orders={orders} />}
      </div>
    </div>
  );
}

function ProfileTab({ profile, userEmail }: { profile: DbProfile | null; userEmail: string }) {
  const [name, setName] = useState(profile?.name ?? "");
  const [lastName, setLastName] = useState(profile?.last_name ?? "");
  const [ci, setCi] = useState(profile?.ci ?? "");
  const [phone, setPhone] = useState(profile?.phone ?? "");
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccess(false);
    startTransition(async () => {
      const result = await updateProfileAction({ name, lastName, ci, phone });
      if (result.ok) {
        setSuccess(true);
        router.refresh();
        setTimeout(() => setSuccess(false), 3000);
      }
    });
  }

  return (
    <div className="rounded-xl border border-lime/10 bg-navy-deep/30 p-5 md:p-6">
      <h2 className="text-sm font-medium text-white/70 mb-5">Información personal</h2>

      <form onSubmit={handleSubmit} className="space-y-5 max-w-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-white/50">Nombre</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre"
                className="checkout-input"
                autoComplete="given-name"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-white/50">Apellido</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Tu apellido"
                className="checkout-input"
                autoComplete="family-name"
              />
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-white/50">Carnet de identidad (CI)</label>
          <div className="relative">
            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
            <input
              type="text"
              value={ci}
              onChange={(e) => setCi(e.target.value)}
              placeholder="12345678"
              className="checkout-input"
            />
          </div>
          <p className="text-white/25 text-[11px]">Requerido para encomiendas</p>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-white/50">WhatsApp</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="checkout-input"
              placeholder="71234567"
              autoComplete="tel"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-white/50">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
            <input
              type="email"
              value={userEmail}
              disabled
              className="checkout-input opacity-50 cursor-not-allowed"
            />
          </div>
          <p className="text-[11px] text-white/30">El email no se puede cambiar</p>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="px-6 py-2.5 rounded-lg bg-lime text-navy-deep font-semibold text-sm
              hover:brightness-110 active:scale-[0.98] transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
            Guardar cambios
          </button>
          {success && (
            <span className="flex items-center gap-1.5 text-green-400 text-sm animate-fade-in">
              <CheckCircle className="w-4 h-4" /> Guardado
            </span>
          )}
        </div>
      </form>
    </div>
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

  const labelIcons: Record<string, typeof Home> = {
    casa: Home,
    oficina: Building,
    trabajo: Building,
  };

  return (
    <div className="space-y-4">
      {addresses.length === 0 && (
        <div className="rounded-xl border border-dashed border-lime/15 bg-navy-deep/20 py-12 text-center">
          <MapPin className="w-10 h-10 mx-auto mb-3 text-white/15" />
          <p className="text-white/40 text-sm mb-1">No tienes direcciones guardadas</p>
          <p className="text-white/25 text-xs mb-4">Agrega una para agilizar tus compras</p>
          <button
            onClick={addAddress}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-lime
              bg-lime/10 hover:bg-lime/15 border border-lime/20 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Agregar dirección
          </button>
        </div>
      )}

      {addresses.map((addr, idx) => {
        const LabelIcon = labelIcons[addr.label.toLowerCase()] ?? MapPin;
        return (
          <div
            key={idx}
            className="rounded-xl border border-lime/10 bg-navy-deep/30 overflow-hidden"
          >
            {/* Card header */}
            <div className="flex items-center justify-between px-5 py-3 bg-white/[0.02] border-b border-white/5">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-md bg-lime/10 flex items-center justify-center">
                  <LabelIcon className="w-3.5 h-3.5 text-lime/70" />
                </div>
                <span className="text-xs font-medium text-white/50">
                  Dirección {idx + 1}
                </span>
              </div>
              <button
                onClick={() => removeAddress(idx)}
                className="p-1.5 text-white/25 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-all duration-200"
                aria-label="Eliminar dirección"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card body */}
            <div className="p-5 space-y-3.5">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-white/50">Etiqueta</label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                  <input
                    type="text"
                    value={addr.label}
                    onChange={(e) => updateField(idx, "label", e.target.value)}
                    placeholder="Casa, Oficina, etc."
                    className="checkout-input"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-white/50">Dirección</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                  <input
                    type="text"
                    value={addr.address}
                    onChange={(e) => updateField(idx, "address", e.target.value)}
                    placeholder="Calle, número, zona"
                    className="checkout-input"
                    autoComplete="street-address"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-white/50">Ciudad</label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                  <input
                    type="text"
                    value={addr.city}
                    onChange={(e) => updateField(idx, "city", e.target.value)}
                    placeholder="Santa Cruz, La Paz, etc."
                    className="checkout-input"
                    autoComplete="address-level2"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {addresses.length > 0 && (
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={addAddress}
            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-lime/70 hover:text-lime
              hover:bg-lime/5 rounded-lg transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Agregar otra
          </button>

          <div className="flex items-center gap-3">
            {success && (
              <span className="flex items-center gap-1.5 text-green-400 text-xs">
                <CheckCircle className="w-3.5 h-3.5" /> Guardado
              </span>
            )}
            <button
              onClick={handleSave}
              disabled={isPending}
              className="px-5 py-2.5 rounded-lg bg-lime text-navy-deep font-semibold text-sm
                hover:brightness-110 active:scale-[0.98] transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
              Guardar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function OrdersTab({ orders }: { orders: DbOrder[] }) {
  if (orders.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-lime/15 bg-navy-deep/20 py-16 text-center">
        <div className="w-14 h-14 rounded-2xl bg-lime/10 flex items-center justify-center mx-auto mb-4">
          <Package className="w-7 h-7 text-lime/40" />
        </div>
        <p className="text-white/50 font-medium mb-1">No tienes pedidos aún</p>
        <p className="text-white/25 text-sm mb-5">Explora nuestro catálogo y haz tu primer pedido</p>
        <Link
          href="/productos"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium
            bg-lime text-navy-deep rounded-lg hover:brightness-110 active:scale-[0.98] transition-all"
        >
          Ver productos
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
    pending: { label: "Pendiente", color: "text-amber-400", bg: "bg-amber-500/15 border-amber-500/20" },
    confirmed: { label: "Confirmado", color: "text-blue-400", bg: "bg-blue-500/15 border-blue-500/20" },
    shipped: { label: "Enviado", color: "text-purple-400", bg: "bg-purple-500/15 border-purple-500/20" },
    delivered: { label: "Entregado", color: "text-green-400", bg: "bg-green-500/15 border-green-500/20" },
    cancelled: { label: "Cancelado", color: "text-red-400", bg: "bg-red-500/15 border-red-500/20" },
  };

  return (
    <div className="space-y-3">
      {orders.map((order) => {
        const s = statusConfig[order.status] ?? statusConfig.pending;
        const itemCount = order.items.reduce((sum, i) => sum + i.quantity, 0);
        return (
          <Link
            key={order.id}
            href={`/cuenta/pedidos/${order.id}`}
            className="group block rounded-xl border border-lime/10 bg-navy-deep/30
              hover:border-lime/25 hover:bg-navy-deep/50 transition-all duration-200"
          >
            <div className="p-4 sm:p-5">
              {/* Top row */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-lime/8 flex items-center justify-center">
                    <Package className="w-4 h-4 text-lime/50" />
                  </div>
                  <div>
                    <span className="text-white font-medium text-sm">
                      #{order.order_number}
                    </span>
                    <p className="text-white/30 text-[11px] mt-0.5">
                      {itemCount} {itemCount === 1 ? "producto" : "productos"}
                    </p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium border ${s.bg} ${s.color}`}>
                  {s.label}
                </span>
              </div>

              {/* Bottom row */}
              <div className="flex items-center justify-between pl-12">
                <span className="text-white/35 text-xs">
                  {new Date(order.created_at).toLocaleDateString("es-BO", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-medium text-white/80">
                    Bs {formatBs(order.total)}
                  </span>
                  <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-lime/50 transition-colors" />
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
