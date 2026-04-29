import {
  getMonthlyStats,
  getWeeklySales,
  getOrdersByCity,
  getTopProduct,
  getRecentOrders,
} from "@/lib/dal/analytics";
import DashboardContent from "@/components/admin/dashboard/DashboardContent";

export default async function AdminDashboardPage() {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const prevMonth = currentMonth - 1 || 12;
  const prevYear = currentMonth - 1 === 0 ? currentYear - 1 : currentYear;

  const [stats, prevStats, weeklySales, cityData, topProduct, recentOrders] =
    await Promise.all([
      getMonthlyStats(currentYear, currentMonth),
      getMonthlyStats(prevYear, prevMonth),
      getWeeklySales(12),
      getOrdersByCity(5),
      getTopProduct(currentYear, currentMonth),
      getRecentOrders(10),
    ]);

  // Calculate projected revenue
  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
  const daysPassed = now.getDate();
  const projectedRevenue =
    daysPassed > 0 ? (stats.totalSales / daysPassed) * daysInMonth : 0;

  return (
    <DashboardContent
      stats={stats}
      prevStats={prevStats}
      weeklySales={weeklySales}
      cityData={cityData}
      topProduct={topProduct}
      recentOrders={recentOrders}
      projectedRevenue={projectedRevenue}
    />
  );
}
