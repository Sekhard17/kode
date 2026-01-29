'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ProductsTable } from '@/features/dashboard/components/ProductsTable';
import { ProductFormModal } from '@/features/dashboard/components/products/ProductFormModal';
import { Plus } from 'lucide-react';
import {
    AdminProductListItem,
    PaginatedResponse,
    Category,
    ProductFullDetail
} from '@/features/catalog/types';
import { getProductById } from '@/features/dashboard/services/admin-products.service';
import { toast } from 'sonner';

interface ProductsPageContentProps {
    initialProducts: PaginatedResponse<AdminProductListItem>;
    categories: Category[];
}

export default function ProductsPageContent({ initialProducts, categories }: ProductsPageContentProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // URL State
    const page = parseInt(searchParams.get('page') || '1', 10);
    const search = searchParams.get('search') || '';

    // Optimization: Check if we have all products loaded (Small Catalog Mode)
    // Only enabled if we are on page 1, no search initially (or cleared), 
    // and total count is less than or equal to limit (30).
    const isSmallCatalog = initialProducts.meta.total <= 30 && page === 1 && !search;

    // Local state for client-side search optimization
    const [clientProducts, setClientProducts] = useState<AdminProductListItem[]>(initialProducts.items);
    const [isClientSearchMode, setIsClientSearchMode] = useState(isSmallCatalog);

    // Sync state when initialProducts changes (e.g. server search result or pagination)
    useEffect(() => {
        setClientProducts(initialProducts.items);
        // Re-evaluate mode only if we are "reset" (page 1, no search)
        if (!search && page === 1 && initialProducts.meta.total <= 30) {
            setIsClientSearchMode(true);
        } else if (search || page > 1) {
            // If URL has search or page > 1, we are in server mode
            // Unless we were already in client mode and searching locally? 
            // Simpler to fallback to server mode if URL logic takes over.
            setIsClientSearchMode(false);
        }
    }, [initialProducts, search, page]);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<ProductFullDetail | undefined>(undefined);
    const [isLoadingProduct, setIsLoadingProduct] = useState(false);

    // Refresh data when modal closes successfully
    const handleSuccess = () => {
        router.refresh();
        toast.success(selectedProduct ? 'Producto actualizado' : 'Producto creado exitosamente');
    };

    const handleSearch = useCallback((term: string) => {
        // CLIENT-SIDE OPTIMIZATION
        if (isClientSearchMode) {
            if (!term) {
                setClientProducts(initialProducts.items); // Reset
                // Update URL just to clean it, but no fetch needed if shallow? 
                // Actually router.push without query params triggers fetch.
                // We keep URL clean or sync? 
                // Let's just filter locally effectively.
                const params = new URLSearchParams(searchParams.toString());
                params.delete('search');
                window.history.replaceState(null, '', `?${params.toString()}`);
                return;
            }

            const lowerTerm = term.toLowerCase();
            const filtered = initialProducts.items.filter(p =>
                p.name.toLowerCase().includes(lowerTerm) ||
                p.slug.toLowerCase().includes(lowerTerm)
            );
            setClientProducts(filtered);

            // Optional: Update URL without triggering navigation/fetch
            const params = new URLSearchParams(searchParams.toString());
            params.set('search', term);
            window.history.replaceState(null, '', `?${params.toString()}`);
            return;
        }

        // SERVER-SIDE FALLBACK (Large Catalog)
        const params = new URLSearchParams(searchParams.toString());
        if (term) {
            params.set('search', term);
        } else {
            params.delete('search');
        }
        params.set('page', '1'); // Reset to page 1 on search
        router.push(`?${params.toString()}`);
    }, [searchParams, router, isClientSearchMode, initialProducts.items]);

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', newPage.toString());
        router.push(`?${params.toString()}`);
    };

    const handleCreate = () => {
        setSelectedProduct(undefined);
        setIsModalOpen(true);
    };

    const handleEdit = async (id: string) => {
        setIsLoadingProduct(true);
        try {
            const product = await getProductById(id);
            setSelectedProduct(product);
            setIsModalOpen(true);
        } catch (error) {
            toast.error('Error al cargar detalles del producto');
        } finally {
            setIsLoadingProduct(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-white">Productos</h2>
                    <p className="text-zinc-400 text-sm mt-1">
                        Gestiona tu catálogo de productos
                    </p>
                </div>
                <Button
                    onClick={handleCreate}
                    className="bg-orange-500 hover:bg-orange-400 text-black font-bold gap-2"
                >
                    <Plus className="h-4 w-4" />
                    Nuevo Producto
                </Button>
            </div>

            {/* Products Table */}
            <ProductsTable
                products={clientProducts}
                total={isClientSearchMode ? clientProducts.length : initialProducts.meta.total}
                currentPage={initialProducts.meta.page}
                totalPages={isClientSearchMode ? 1 : initialProducts.meta.totalPages}
                onPageChange={handlePageChange}
                onEdit={handleEdit}
                onSearch={handleSearch}
                initialSearch={search}
                limit={30}
            />

            {/* Product Modal */}
            <ProductFormModal
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                categories={categories}
                product={selectedProduct}
                onSuccess={handleSuccess}
            />

            {/* Loading Overlay */}
            {isLoadingProduct && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
                </div>
            )}
        </div>
    );
}
