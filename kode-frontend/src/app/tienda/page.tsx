import { getProducts, getCategories } from '@/features/catalog/services/catalog.service';
import { StoreView } from '@/features/catalog/components/views/StoreView';

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

    const { items: products, meta } = await getProducts({
        categorySlug,
        page: page ? parseInt(page) : 1,
        limit: 12
    });

    return (
        <StoreView
            categories={categories}
            products={products}
            currentCategory={currentCategory}
            categorySlug={categorySlug}
            meta={{
                page: meta.page,
                totalPages: meta.totalPages
            }}
        />
    );
}
