import { HomeDashboard } from "@/components/HomeDashboard";
import { getInStockCount, getRecentMovements } from "@/lib/inventory";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [inStock, recent] = await Promise.all([getInStockCount(), getRecentMovements(15)]);
  return <HomeDashboard inStock={inStock} recent={recent} />;
}