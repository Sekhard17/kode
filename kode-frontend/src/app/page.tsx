import { getProducts } from '@/features/catalog/services/catalog.service';
import { HomeView } from '@/features/home/components/HomeView';

export default async function HomePage() {
  const { items: featuredProducts } = await getProducts({ isFeatured: true, limit: 4 });

  return <HomeView featuredProducts={featuredProducts} />;
}
