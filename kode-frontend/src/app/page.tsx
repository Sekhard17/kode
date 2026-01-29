import { getCategories, getProducts } from '@/features/catalog/services/catalog.service';
import { HomeView } from '@/features/home/components/HomeView';
import type { ProductListItem } from '@/features/catalog/types';

export default async function HomePage() {
  const categories = await getCategories();
  const [featuredPool, newestPool] = await Promise.all([
    getProducts({ isFeatured: true, limit: 10, page: 1 }),
    getProducts({ limit: 12, page: 1 }),
  ]);

  const seen = new Set<string>();
  const highlightProducts: ProductListItem[] = [];
  for (const p of [...featuredPool.items, ...newestPool.items]) {
    if (seen.has(p.id)) continue;
    seen.add(p.id);
    highlightProducts.push(p);
    if (highlightProducts.length >= 5) break;
  }

  const featuredProducts = featuredPool.items.slice(0, 8);
  const newestProducts = newestPool.items.slice(0, 8);

  return <HomeView newestProducts={newestProducts} highlightProducts={highlightProducts} categories={categories} />;
}
