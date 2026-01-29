import { Suspense } from 'react';
import { ProductGrid } from '@/features/catalog/components/ProductGrid';
import { ProductGridSkeleton } from '@/features/catalog/components/ProductGridSkeleton';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Category, ProductListItem } from '../../types';
import { StoreMosaic } from '@/features/catalog/components/StoreMosaic';

interface StoreViewProps {
    categories: Category[];
    products: ProductListItem[];
    highlightProducts?: ProductListItem[];
    currentCategory?: Category;
    categorySlug?: string;
    meta: {
        page: number;
        totalPages: number;
    };
}

export function StoreView({
    categories,
    products,
    highlightProducts = [],
    currentCategory,
    categorySlug,
    meta
}: StoreViewProps) {
    return (
        <div className="min-h-screen bg-black pt-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24">
                {/* Header Section */}
                <div className="mb-12 border-b border-zinc-900 pb-12">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
                        <div className="lg:col-span-5 max-w-2xl">
                            <h2 className="text-sm font-black uppercase tracking-[0.4em] text-orange-500 mb-4">Catálogo</h2>
                            <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter text-white leading-none uppercase">
                                {currentCategory ? currentCategory.name : 'La Tienda'}
                            </h1>
                            <p className="mt-6 text-zinc-500 text-lg max-w-lg leading-relaxed font-medium uppercase tracking-tight">
                                {currentCategory?.description || 'Explora nuestra selección completa de Essential Streetwear con calce premium.'}
                            </p>
                        </div>

                        <div className="lg:col-span-7 hidden lg:block">
                            <StoreMosaic products={highlightProducts} />
                        </div>

                        <div className="flex items-center space-x-2 lg:col-span-12">
                            <span className="text-xs font-bold uppercase tracking-widest text-zinc-600 mr-2">Filtros</span>
                            <Button variant="outline" size="sm" className="border-zinc-800 text-white rounded-full h-12 w-12 flex items-center justify-center p-0">
                                <SlidersHorizontal className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Categories Bar */}
                <div className="flex flex-wrap gap-3 mb-12">
                    <Link href="/tienda">
                        <Badge
                            variant={!categorySlug ? 'default' : 'outline'}
                            className={`px-6 py-2 rounded-full font-bold uppercase tracking-widest text-[10px] transition-all cursor-pointer ${!categorySlug ? 'bg-white text-black border-none' : 'border-zinc-800 text-zinc-400 hover:border-zinc-600'
                                }`}
                        >
                            Todos
                        </Badge>
                    </Link>
                    {categories.map((cat) => (
                        <Link key={cat.id} href={`/tienda?categorySlug=${cat.slug}`}>
                            <Badge
                                variant={categorySlug === cat.slug ? 'default' : 'outline'}
                                className={`px-6 py-2 rounded-full font-bold uppercase tracking-widest text-[10px] transition-all cursor-pointer ${categorySlug === cat.slug ? 'bg-orange-500 text-black border-none' : 'border-zinc-800 text-zinc-400 hover:border-zinc-600'
                                    }`}
                            >
                                {cat.name}
                            </Badge>
                        </Link>
                    ))}
                </div>

                {/* Content */}
                <Suspense fallback={<ProductGridSkeleton />}>
                    <ProductGrid products={products} />

                    {/* Pagination Placeholder */}
                    {meta.totalPages > 1 && (
                        <div className="mt-20 flex justify-center items-center space-x-4">
                            <Button variant="outline" disabled={meta.page <= 1} className="border-zinc-800 text-white min-w-[120px] rounded-xl font-bold uppercase tracking-widest h-12">
                                Anterior
                            </Button>
                            <span className="text-sm font-black text-white px-4">
                                {meta.page} / {meta.totalPages}
                            </span>
                            <Button variant="outline" disabled={meta.page >= meta.totalPages} className="border-zinc-800 text-white min-w-[120px] rounded-xl font-bold uppercase tracking-widest h-12">
                                Siguiente
                            </Button>
                        </div>
                    )}
                </Suspense>
            </div>
        </div>
    );
}
