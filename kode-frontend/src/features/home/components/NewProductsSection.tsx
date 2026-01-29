

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';
import { ProductListItem } from '@/features/catalog/types';

interface NewProductsSectionProps {
    products: ProductListItem[];
}

function formatPrice(price: number): string {
    return `$${price.toLocaleString('es-CL')}`;
}

function NewProductCard({ product, index }: { product: ProductListItem; index: number }) {
    const priceDisplay = product.minPriceClp === product.maxPriceClp
        ? formatPrice(product.minPriceClp)
        : `${formatPrice(product.minPriceClp)} - ${formatPrice(product.maxPriceClp)}`;

    return (
        <Link
            href={`/producto/${product.slug}`}
            className="group block"
            style={{ width: '320px', flexShrink: 0 }}
        >
            {/* Card Container */}
            <div className="relative overflow-hidden rounded-2xl bg-zinc-900/60 backdrop-blur-sm border border-zinc-800/50 transition-all duration-500 group-hover:border-orange-500/30 group-hover:shadow-[0_0_40px_rgba(249,115,22,0.15)]">
                {/* Image Container */}
                <div className="relative w-full" style={{ height: '420px' }}>
                    {product.mainImage ? (
                        <Image
                            src={product.mainImage}
                            alt={product.name}
                            fill
                            className="object-cover transition-all duration-700 group-hover:scale-105"
                            sizes="320px"
                        />
                    ) : (
                        <div className="h-full w-full bg-zinc-800 flex items-center justify-center">
                            <span className="text-zinc-600 text-sm">Sin imagen</span>
                        </div>
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                    {/* NEW Badge */}
                    <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-orange-500 text-black px-3 py-1.5 rounded-full">
                        <Sparkles className="h-3 w-3" />
                        <span className="text-[10px] font-black uppercase tracking-wider">Nuevo</span>
                    </div>

                    {/* Out of Stock Overlay */}
                    {!product.hasStock && (
                        <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px] flex items-center justify-center">
                            <span className="text-zinc-400 text-xs font-bold uppercase tracking-widest border border-zinc-600 px-4 py-2 rounded-full">
                                Agotado
                            </span>
                        </div>
                    )}

                    {/* Content Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                        {/* Category */}
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-400/80 mb-2 block">
                            {product.categoryName || 'General'}
                        </span>

                        {/* Product Name */}
                        <h3 className="text-lg font-bold text-white leading-tight mb-3 line-clamp-2 group-hover:text-orange-50 transition-colors">
                            {product.name}
                        </h3>

                        {/* Price & CTA */}
                        <div className="flex items-center justify-between">
                            <span className="text-xl font-black text-white italic tracking-tight">
                                {priceDisplay}
                            </span>
                            <div className="flex items-center gap-1 text-zinc-400 group-hover:text-orange-400 transition-colors">
                                <span className="text-[10px] font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    Ver
                                </span>
                                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export function NewProductsSection({ products }: NewProductsSectionProps) {
    if (!products || products.length === 0) return null;

    return (
        <section className="py-20 hidden md:block overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="h-px w-8 bg-orange-500" />
                            <span className="text-[11px] font-black uppercase tracking-[0.3em] text-orange-500">
                                Recién Llegados
                            </span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter text-white">
                            NEW ARRIVALS
                        </h2>
                    </div>

                    <Link
                        href="/tienda"
                        className="hidden sm:flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-orange-400 transition-colors group"
                    >
                        <span>Ver todo</span>
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                {/* Horizontal Scrollable Product List */}
                <div className="relative">

                    {/* Scrollable Container */}
                    <div
                        className="flex gap-6 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory"
                        style={{
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none',
                        }}
                    >
                        {products.map((product, index) => (
                            <div key={product.id} className="snap-start">
                                <NewProductCard product={product} index={index} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

