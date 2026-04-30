"use client";

import { useCart } from "@/store/cart";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  User,
  Phone,
  MapPin,
  FileText,
  MessageCircle,
  ShoppingBag,
  ArrowRight,
  Tag,
  CheckCircle,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { buildWhatsAppMessage } from "@/lib/whatsapp";
import { formatBs } from "@/lib/format";
import { createOrderAction, validateCouponAction } from "./actions";
import type { OrderItem } from "@/lib/supabase/types";
import { useState, useCallback, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

const checkoutSchema = z.object({
  nombre: z.string().min(2, "Ingresa tu nombre"),
  apellido: z.string().min(2, "Ingresa tu apellido"),
  whatsapp: z.string().min(7, "Numero invalido"),
  direccion: z.string().min(5, "Ingresa la direccion"),
  ciudad: z.string().min(2, "Ingresa la ciudad"),
  notas: z.string().optional(),
});
type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const items = useCart((s) => s.items);
  const subtotal = useCart((s) => s.subtotal);
  const clear = useCart((s) => s.clear);

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
  } | null>(null);
  const [couponError, setCouponError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [orderResult, setOrderResult] = useState<{
    orderNumber: string;
    whatsappUrl: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    mode: "onChange",
  });

  const [savedAddresses, setSavedAddresses] = useState<
    { label: string; address: string; city: string }[]
  >([]);

  useEffect(() => {
    async function prefill() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("name, last_name, phone, addresses")
        .eq("id", user.id)
        .single();

      if (!profile) return;

      if (profile.name) setValue("nombre", profile.name, { shouldValidate: true });
      if (profile.last_name) setValue("apellido", profile.last_name, { shouldValidate: true });
      if (profile.phone) setValue("whatsapp", profile.phone, { shouldValidate: true });

      const addrs = (profile.addresses as { label: string; address: string; city: string }[]) ?? [];
      if (addrs.length > 0) {
        setSavedAddresses(addrs);
        setValue("direccion", addrs[0].address, { shouldValidate: true });
        setValue("ciudad", addrs[0].city, { shouldValidate: true });
      }
    }
    prefill();
  }, [setValue]);

  const discount = appliedCoupon?.discount ?? 0;
  const total = Math.max(0, subtotal() - discount);

  const handleApplyCoupon = useCallback(async () => {
    if (!couponCode.trim()) return;
    setCouponError("");
    setCouponLoading(true);
    try {
      const result = await validateCouponAction(couponCode.trim(), subtotal());
      if (result.ok) {
        setAppliedCoupon({
          code: couponCode.trim().toUpperCase(),
          discount: result.discount,
        });
        setCouponError("");
      } else {
        setAppliedCoupon(null);
        setCouponError(result.error);
      }
    } catch {
      setCouponError("Error al validar el cupon");
    } finally {
      setCouponLoading(false);
    }
  }, [couponCode, subtotal]);

  if (orderResult) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          {/* Success card */}
          <div className="rounded-xl border border-lime/20 bg-navy-deep/50 overflow-hidden">
            {/* Green header */}
            <div className="bg-lime/10 border-b border-lime/15 px-6 py-5 text-center">
              <div className="w-14 h-14 rounded-full bg-lime/20 flex items-center justify-center mx-auto mb-3">
                <CheckCircle size={28} className="text-lime" />
              </div>
              <h2 className="text-white text-lg font-semibold">
                ¡Pedido confirmado!
              </h2>
              <p className="text-white/45 text-sm mt-1">
                Tu orden ha sido registrada exitosamente
              </p>
            </div>

            {/* Order number */}
            <div className="px-6 py-5 text-center border-b border-white/5">
              <p className="text-white/40 text-[11px] uppercase tracking-widest font-medium mb-1">
                Número de pedido
              </p>
              <p className="font-mono text-lime text-2xl font-bold">
                {orderResult.orderNumber}
              </p>
            </div>

            {/* WhatsApp CTA */}
            <div className="px-6 py-5">
              <a
                href={orderResult.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3.5 rounded-lg text-sm font-semibold transition-all inline-flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <MessageCircle size={18} />
                Enviar pedido por WhatsApp
              </a>
              <p className="text-white/35 text-xs text-center mt-2">
                Toca el botón para enviarnos tu pedido y coordinar el pago
              </p>
            </div>

            {/* Next steps */}
            <div className="px-6 py-5 border-t border-white/5 space-y-3">
              <p className="text-white/50 text-xs font-medium uppercase tracking-wider mb-3">
                Próximos pasos
              </p>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-lime/15 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-lime text-[11px] font-bold">1</span>
                </div>
                <p className="text-white/60 text-sm">
                  Toca el botón verde para enviarnos tu pedido por WhatsApp
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-lime/15 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-lime text-[11px] font-bold">2</span>
                </div>
                <p className="text-white/60 text-sm">
                  Confirmaremos tu pedido y coordinaremos el envío
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-lime/15 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-lime text-[11px] font-bold">3</span>
                </div>
                <p className="text-white/60 text-sm">
                  Recibirás tu pedido protegido y respetando la cadena de frío
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="px-6 pb-6 flex flex-col gap-2.5">
              <Link
                href="/productos"
                className="w-full bg-lime text-navy-deep py-3 rounded-lg text-sm font-semibold hover:brightness-110 transition-all inline-flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
              >
                Seguir comprando
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-lime/10 flex items-center justify-center">
          <ShoppingBag size={28} className="text-lime/50" />
        </div>
        <div>
          <p className="text-white text-lg font-medium mb-1">
            Tu carrito esta vacio
          </p>
          <p className="text-white/45 text-sm">
            Agrega productos para continuar
          </p>
        </div>
        <Link
          href="/productos"
          className="bg-lime text-navy px-6 py-3 rounded-full text-sm font-medium hover:opacity-90 transition-opacity inline-flex items-center gap-2 cursor-pointer active:scale-[0.97]"
        >
          Ver productos
          <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  const onSubmit = async (data: CheckoutForm) => {
    setSubmitting(true);

    const orderItems: OrderItem[] = items.map(({ product, quantity }) => ({
      productId: product.id ?? product.slug,
      name: product.name,
      doseLabel: product.doseLabel,
      quantity,
      priceUnit: product.priceBs,
      priceTotal: product.priceBs * quantity,
    }));

    // Build WhatsApp message BEFORE the async call so we can open it immediately
    const message = buildWhatsAppMessage({
      customer: data,
      items,
      total,
      discount,
      couponCode: appliedCoupon?.code,
      subtotal: subtotal(),
    });
    const whatsappUrl = `https://wa.me/59172201700?text=${encodeURIComponent(message)}`;

    // Open WhatsApp immediately (before await) so iOS doesn't block it
    window.location.href = whatsappUrl;

    // Create order in background
    try {
      const result = await createOrderAction({
        nombre: data.nombre,
        apellido: data.apellido,
        whatsapp: data.whatsapp,
        direccion: data.direccion,
        ciudad: data.ciudad,
        notas: data.notas,
        couponCode: appliedCoupon?.code,
        items: orderItems,
        subtotal: subtotal(),
        discount,
        total,
      });

      if (result.ok) {
        clear();
        setOrderResult({ orderNumber: result.orderNumber, whatsappUrl });
      } else {
        setSubmitting(false);
        alert(result.error || "Hubo un error al registrar tu pedido.");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 md:px-6">
      <div className="max-w-xl mx-auto">
        <div className="bg-navy border border-border-default rounded-xl overflow-hidden">
          {/* Header */}
          <header className="flex items-center gap-2.5 px-5 py-4 border-b border-border-subtle">
            <FileText size={16} className="text-lime" />
            <span className="text-white text-[11px] font-medium tracking-widest uppercase">
              Pagar y recibir
            </span>
          </header>

          <div className="p-5 space-y-5">
            {/* Items */}
            <div className="space-y-2">
              {items.map(({ product, quantity }) => (
                <div
                  key={product.slug}
                  className="flex gap-3 items-center bg-surface-deep border border-border-subtle rounded-lg p-3"
                >
                  <div
                    className="w-1.5 h-8 rounded-full flex-shrink-0"
                    style={{ backgroundColor: product.accentColor }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm font-medium truncate">
                      {product.name}
                    </div>
                    <div className="text-white/45 text-xs">
                      {product.doseLabel} · x{quantity}
                    </div>
                  </div>
                  <div className="font-mono text-lime text-sm flex-shrink-0">
                    Bs {formatBs(product.priceBs * quantity)}
                  </div>
                </div>
              ))}
            </div>

            {/* Coupon */}
            <div>
              <div className="text-[11px] text-white/50 uppercase tracking-wider font-medium mb-1.5">
                Cupon de descuento
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Tag size={13} className="text-white/30" />
                  </div>
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Codigo de cupon"
                    disabled={!!appliedCoupon}
                    className="checkout-input w-full"
                  />
                </div>
                {appliedCoupon ? (
                  <button
                    type="button"
                    onClick={() => {
                      setAppliedCoupon(null);
                      setCouponCode("");
                      setCouponError("");
                    }}
                    className="px-4 py-2 rounded-lg text-xs font-medium bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors cursor-pointer"
                  >
                    Quitar
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={couponLoading || !couponCode.trim()}
                    className="px-4 py-2 rounded-lg text-xs font-medium bg-lime/10 text-lime hover:bg-lime/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    {couponLoading ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      "Aplicar"
                    )}
                  </button>
                )}
              </div>
              {couponError && (
                <p className="text-red-400 text-[11px] mt-1">{couponError}</p>
              )}
              {appliedCoupon && (
                <p className="text-lime text-[11px] mt-1">
                  Cupon {appliedCoupon.code} aplicado: -Bs{" "}
                  {formatBs(appliedCoupon.discount)}
                </p>
              )}
            </div>

            {/* Summary */}
            <div className="bg-surface-deep border border-border-subtle rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-white/50">Subtotal</span>
                <span className="font-mono text-white">
                  Bs {formatBs(subtotal())}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-xs">
                  <span className="text-white/50">
                    Descuento{" "}
                    {appliedCoupon?.code && `(${appliedCoupon.code})`}
                  </span>
                  <span className="font-mono text-red-400">
                    -Bs {formatBs(discount)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-xs">
                <span className="text-white/50">Envio</span>
                <span className="text-white/50">A coordinar</span>
              </div>
              <div className="pt-2 border-t border-border-subtle flex justify-between">
                <span className="text-white font-medium text-sm">Total</span>
                <span className="font-mono text-lime text-base font-medium">
                  Bs {formatBs(total)}
                </span>
              </div>
            </div>

            {/* Shipping method */}
            <div>
              <div className="text-[11px] text-white/50 uppercase tracking-wider font-medium mb-2">
                Metodo de envio
              </div>
              <div className="border border-lime rounded-lg px-4 py-3 flex items-center gap-3 bg-lime-soft">
                <div className="w-3.5 h-3.5 border border-lime rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-lime rounded-full" />
                </div>
                <span className="text-white text-sm font-medium flex-1">
                  Envio gratis
                </span>
                <span className="text-white/50 text-xs">A coordinar</span>
              </div>
            </div>

            {/* Saved addresses */}
            {savedAddresses.length > 1 && (
              <div>
                <div className="text-[11px] text-white/50 uppercase tracking-wider font-medium mb-1.5">
                  Direcciones guardadas
                </div>
                <div className="flex flex-wrap gap-2">
                  {savedAddresses.map((addr, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setValue("direccion", addr.address, { shouldValidate: true });
                        setValue("ciudad", addr.city, { shouldValidate: true });
                      }}
                      className="px-3 py-1.5 text-xs rounded-lg border border-lime/20 text-white/70 hover:bg-lime/5 hover:text-lime transition-colors cursor-pointer"
                    >
                      {addr.label || `Dirección ${idx + 1}`}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <FormField
                label="Nombre"
                required
                id="checkout-nombre"
                icon={<User size={13} className="text-white/30" />}
                error={errors.nombre?.message}
              >
                <input
                  {...register("nombre")}
                  id="checkout-nombre"
                  placeholder="Tu nombre"
                  autoComplete="given-name"
                  className="checkout-input"
                />
              </FormField>

              <FormField
                label="Apellido"
                required
                id="checkout-apellido"
                icon={<User size={13} className="text-white/30" />}
                error={errors.apellido?.message}
              >
                <input
                  {...register("apellido")}
                  id="checkout-apellido"
                  placeholder="Tu apellido"
                  autoComplete="family-name"
                  className="checkout-input"
                />
              </FormField>

              <FormField
                label="WhatsApp"
                required
                id="checkout-whatsapp"
                icon={<Phone size={13} className="text-white/30" />}
                error={errors.whatsapp?.message}
              >
                <input
                  {...register("whatsapp")}
                  id="checkout-whatsapp"
                  placeholder="+591 7..."
                  type="tel"
                  autoComplete="tel"
                  className="checkout-input"
                />
              </FormField>

              <FormField
                label="Direccion"
                required
                id="checkout-direccion"
                icon={<MapPin size={13} className="text-white/30" />}
                error={errors.direccion?.message}
              >
                <input
                  {...register("direccion")}
                  id="checkout-direccion"
                  placeholder="Calle y numero, zona"
                  autoComplete="street-address"
                  className="checkout-input"
                />
              </FormField>

              <FormField
                label="Ciudad"
                required
                id="checkout-ciudad"
                icon={<MapPin size={13} className="text-white/30" />}
                error={errors.ciudad?.message}
              >
                <input
                  {...register("ciudad")}
                  id="checkout-ciudad"
                  placeholder="La Paz, Santa Cruz, Cochabamba..."
                  autoComplete="address-level2"
                  className="checkout-input"
                />
              </FormField>

              <FormField
                label="Notas (opcional)"
                id="checkout-notas"
                icon={<FileText size={13} className="text-white/30" />}
              >
                <textarea
                  {...register("notas")}
                  id="checkout-notas"
                  placeholder="Instrucciones de entrega..."
                  rows={2}
                  className="checkout-input"
                />
              </FormField>

              <button
                type="submit"
                disabled={!isValid || submitting}
                className="w-full bg-whatsapp hover:bg-whatsapp-hover disabled:opacity-50 disabled:cursor-not-allowed text-white py-3.5 rounded-full text-sm font-medium flex items-center justify-center gap-2 mt-4 transition-all cursor-pointer active:scale-[0.97]"
              >
                {submitting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <MessageCircle size={16} />
                )}
                {submitting
                  ? "Procesando..."
                  : `Completa tu compra · Bs ${formatBs(total)}`}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function FormField({
  label,
  required,
  icon,
  error,
  id,
  children,
}: {
  label: string;
  required?: boolean;
  icon?: React.ReactNode;
  error?: string;
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-[11px] text-white/50 uppercase tracking-wider font-medium mb-1.5"
      >
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            {icon}
          </div>
        )}
        {children}
      </div>
      {error && (
        <p className="text-red-400 text-[11px] mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
