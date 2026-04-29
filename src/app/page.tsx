import { getPublicProducts } from "@/lib/dal/products";
import HomeContent from "@/components/home/HomeContent";

export default async function Home() {
  const products = await getPublicProducts();

  return <HomeContent products={products} />;
}
