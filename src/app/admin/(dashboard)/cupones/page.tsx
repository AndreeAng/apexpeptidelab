import { getCoupons } from "@/lib/dal/coupons";
import { CouponTable } from "@/components/admin/coupons/CouponTable";

export default async function CuponesPage() {
  const coupons = await getCoupons();

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-white mb-1">
        Cupones
      </h1>
      <p className="text-sm text-white/40 mb-6">
        Gestiona cupones de descuento.
      </p>

      <CouponTable coupons={coupons} />
    </div>
  );
}
