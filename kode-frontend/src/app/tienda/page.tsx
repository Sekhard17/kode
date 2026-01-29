import { getProducts, getCategories } from '@/features/catalog/services/catalog.service';
import { StoreView } from '@/features/catalog/components/views/StoreView';
import type { ProductListItem } from '@/features/catalog/types';

interface StorePageProps {
    searchParams: Promise<{
        categorySlug?: string;
        page?: string;
    }>;
}

export default async function StorePage({ searchParams }: StorePageProps) {
    const { categorySlug, page } = await searchParams;
    const categories = await getCategories();

    const currentCategory = categories.find(c => c.slug === categorySlug);

    const currentPage = page ? parseInt(page, 10) : 1;

    const [featuredPool, firstPagePool] = await Promise.all([
        getProducts({
            categorySlug,
            isFeatured: true,
            page: 1,
            limit: 8,
        }),
        getProducts({
            categorySlug,
            page: 1,
            limit: 12,
        }),
    ]);

    const listing =
        currentPage === 1
            ? firstPagePool
            : await getProducts({
                categorySlug,
                page: currentPage,
                limit: 12,
            });

    const seen = new Set<string>();
    const curated: ProductListItem[] = [];
    for (const p of [...featuredPool.items, ...firstPagePool.items]) {
        if (seen.has(p.id)) continue;
        seen.add(p.id);
        curated.push(p);
        if (curated.length >= 5) break;
    }

    const highlightProducts = curated.length > 0 ? curated : listing.items.slice(0, 5);

    return (
        <StoreView
            categories={categories}
            products={listing.items}
            highlightProducts={highlightProducts}
            currentCategory={currentCategory}
            categorySlug={categorySlug}
            meta={{
                page: listing.meta.page,
                totalPages: listing.meta.totalPages
            }}
        />
    );
}
