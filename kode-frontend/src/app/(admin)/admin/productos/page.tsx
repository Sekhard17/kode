import { Suspense } from 'react';
import ProductsPageContent from './ProductsPageContent';
import { getProductsAdmin } from '@/features/dashboard/services/admin-products.service';
import { getCategories } from '@/features/catalog/services/catalog.service';

// Revalidate every minute to keep data relatively fresh without overloading
export const revalidate = 60;

export default async function ProductsPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; search?: string }>;
}) {
    const { page: pageStr, search: searchStr } = await searchParams;
    const page = pageStr ? parseInt(pageStr, 10) : 1;
    const search = searchStr || undefined;
    const limit = 30;

    try {
        const [productsData, categories] = await Promise.all([
            getProductsAdmin(page, limit, search),
            getCategories(),
        ]);

        return (
            <ProductsPageContent
                initialProducts={productsData}
                categories={categories}
            />
        );
    } catch (error) {
        return (
            <div className="flex items-center justify-center p-12 text-zinc-500">
                Error al cargar productos. Por favor recarga la página.
            </div>
        );
    }
}
