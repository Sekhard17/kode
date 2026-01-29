'use client';

import Image from 'next/image';
import { ProductFormData, Category } from '@/features/catalog/types';
import { Star, EyeOff, Package } from 'lucide-react';

interface ProductPreviewProps {
    formData: ProductFormData;
    categories: Category[];
}

function formatPrice(price: number): string {
    return `$${price.toLocaleString('es-CL')}`;
}

export function ProductPreview({ formData, categories }: ProductPreviewProps) {
    const category = categories.find((c) => c.id === formData.categoryId);
    const primaryImage = formData.images.find((img) => img.isPrimary) || formData.images[0];
    const minPrice = formData.variants.length > 0
        ? Math.min(...formData.variants.map((v) => v.priceClp))
        : 0;
    const maxPrice = formData.variants.length > 0
        ? Math.max(...formData.variants.map((v) => v.priceClp))
        : 0;
    const totalStock = formData.variants.reduce((acc, v) => acc + v.stock, 0);
    const sizes = [...new Set(formData.variants.map((v) => v.size))];

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-white font-medium">Vista previa</h3>
                <p className="text-sm text-zinc-500">
                    Así se verá el producto en la tienda
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,420px),1fr] lg:items-start">
                {/* Product Card Preview */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden">
                    {/* Image */}
                    <div className="relative aspect-square bg-zinc-800">
                        {primaryImage?.preview || primaryImage?.path ? (
                            <Image
                                src={primaryImage.preview || primaryImage.path || ''}
                                alt={formData.name || 'Producto'}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Package className="h-16 w-16 text-zinc-700" />
                            </div>
                        )}

                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-2">
                            {formData.isFeatured && (
                                <span className="bg-orange-500 text-black text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded flex items-center gap-1">
                                    <Star className="h-3 w-3" fill="currentColor" />
                                    Destacado
                                </span>
                            )}
                            {!formData.isActive && (
                                <span className="bg-zinc-700 text-zinc-300 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded flex items-center gap-1">
                                    <EyeOff className="h-3 w-3" />
                                    Oculto
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Info */}
                    <div className="p-4 space-y-3">
                        <div>
                            <p className="text-xs text-zinc-500 uppercase tracking-wider">
                                {category?.name || 'Sin categoría'}
                            </p>
                            <h4 className="text-lg font-bold text-white mt-1">
                                {formData.name || 'Nombre del producto'}
                            </h4>
                        </div>

                        {/* Price */}
                        <div>
                            {minPrice === maxPrice ? (
                                <p className="text-xl font-black text-orange-500">
                                    {formatPrice(minPrice)}
                                </p>
                            ) : (
                                <p className="text-xl font-black text-orange-500">
                                    {formatPrice(minPrice)} - {formatPrice(maxPrice)}
                                </p>
                            )}
                        </div>

                        {/* Sizes */}
                        {sizes.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {sizes.map((size) => (
                                    <span
                                        key={size}
                                        className="text-xs font-medium text-zinc-400 bg-zinc-800 px-2 py-1 rounded"
                                    >
                                        {size}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Stock */}
                        <div className="flex items-center gap-2 text-sm">
                            {totalStock > 0 ? (
                                <>
                                    <span className="h-2 w-2 bg-emerald-500 rounded-full" />
                                    <span className="text-emerald-400">{totalStock} en stock</span>
                                </>
                            ) : (
                                <>
                                    <span className="h-2 w-2 bg-red-500 rounded-full" />
                                    <span className="text-red-400">Sin stock</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Summary */}
                <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-4 space-y-3">
                    <h4 className="font-medium text-white">Resumen</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-zinc-500">Slug</p>
                            <p className="text-white font-mono">{formData.slug || '-'}</p>
                        </div>
                        <div>
                            <p className="text-zinc-500">Categoría</p>
                            <p className="text-white">{category?.name || 'Sin categoría'}</p>
                        </div>
                        <div>
                            <p className="text-zinc-500">Variantes</p>
                            <p className="text-white">{formData.variants.length}</p>
                        </div>
                        <div>
                            <p className="text-zinc-500">Imágenes</p>
                            <p className="text-white">{formData.images.length}</p>
                        </div>
                        <div>
                            <p className="text-zinc-500">Estado</p>
                            <p className={formData.isActive ? 'text-emerald-400' : 'text-zinc-400'}>
                                {formData.isActive ? 'Visible' : 'Oculto'}
                            </p>
                        </div>
                        <div>
                            <p className="text-zinc-500">Destacado</p>
                            <p className={formData.isFeatured ? 'text-orange-400' : 'text-zinc-400'}>
                                {formData.isFeatured ? 'Sí' : 'No'}
                            </p>
                        </div>
                    </div>

                    {formData.description && (
                        <div className="pt-3 border-t border-zinc-800">
                            <p className="text-zinc-500 text-sm">Descripción</p>
                            <p className="text-zinc-300 text-sm mt-1">{formData.description}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
