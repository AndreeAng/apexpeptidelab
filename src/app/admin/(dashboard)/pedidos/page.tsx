import { Suspense } from "react";
import { getOrders } from "@/lib/dal/orders";
import type { OrderStatus } from "@/lib/supabase/types";
import OrderTable from "@/components/admin/orders/OrderTable";

const PAGE_SIZE = 20;

export default async function PedidosPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  const status = (typeof params.status === "string" ? params.status : "") as
    | OrderStatus
    | "";
  const search = typeof params.search === "string" ? params.search : "";
  const dateFrom = typeof params.dateFrom === "string" ? params.dateFrom : "";
  const dateTo = typeof params.dateTo === "string" ? params.dateTo : "";
  const page = typeof params.page === "string" ? parseInt(params.page, 10) : 1;
  const currentPage = page > 0 ? page : 1;

  const { orders, count } = await getOrders({
    status: status || undefined,
    search: search || undefined,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
    limit: PAGE_SIZE,
    offset: (currentPage - 1) * PAGE_SIZE,
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-white mb-1">
        Pedidos
      </h1>
      <p className="text-sm text-white/40 mb-6">
        Gestiona y revisa todos los pedidos.
      </p>

      <Suspense fallback={<div className="text-white/30">Cargando...</div>}>
        <OrderTable
          orders={orders}
          count={count}
          currentPage={currentPage}
          currentStatus={status}
          currentSearch={search}
          currentDateFrom={dateFrom}
          currentDateTo={dateTo}
        />
      </Suspense>
    </div>
  );
}
