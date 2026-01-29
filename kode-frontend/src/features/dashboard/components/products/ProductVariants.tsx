'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { VariantFormData } from '@/features/catalog/types';
import { Plus, Trash2 } from 'lucide-react';

interface ProductVariantsProps {
    variants: VariantFormData[];
    error?: string;
    onAddVariant: () => void;
    onRemoveVariant: (index: number) => void;
    onUpdateVariant: (index: number, field: keyof VariantFormData, value: string | number) => void;
}

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export function ProductVariants({
    variants,
    error,
    onAddVariant,
    onRemoveVariant,
    onUpdateVariant,
}: ProductVariantsProps) {
    const formatPrice = (value: number) => {
        return value.toLocaleString('es-CL');
    };

    const parsePrice = (value: string) => {
        return parseInt(value.replace(/\D/g, ''), 10) || 0;
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-white font-medium">Variantes del producto</h3>
                    <p className="text-sm text-zinc-500">
                        Agrega tallas, colores y precios
                    </p>
                </div>
                <Button
                    type="button"
                    onClick={onAddVariant}
                    className="bg-orange-500 hover:bg-orange-400 text-black font-bold gap-2"
                >
                    <Plus className="h-4 w-4" />
                    Agregar variante
                </Button>
            </div>

            {error && (
                <p className="text-sm text-red-400 bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20">
                    {error}
                </p>
            )}

            {variants.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-zinc-800 rounded-xl">
                    <p className="text-zinc-500">No hay variantes agregadas</p>
                    <p className="text-sm text-zinc-600 mt-1">
                        Haz click en &quot;Agregar variante&quot; para comenzar
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {/* Header */}
                    <div className="hidden sm:grid grid-cols-12 gap-4 px-4 text-xs font-bold uppercase tracking-wider text-zinc-500">
                        <div className="col-span-3">SKU</div>
                        <div className="col-span-2">Talla</div>
                        <div className="col-span-2">Color</div>
                        <div className="col-span-2">Precio (CLP)</div>
                        <div className="col-span-2">Stock</div>
                        <div className="col-span-1"></div>
                    </div>

                    {/* Variants */}
                    {variants.map((variant, index) => (
                        <div
                            key={index}
                            className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4"
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                                {/* SKU */}
                                <div className="sm:col-span-3">
                                    <label className="text-xs text-zinc-500 sm:hidden mb-1 block">
                                        SKU
                                    </label>
                                    <Input
                                        value={variant.sku}
                                        onChange={(e) =>
                                            onUpdateVariant(index, 'sku', e.target.value.toUpperCase())
                                        }
                                        placeholder="SKU-001"
                                        className="bg-zinc-800 border-zinc-700 font-mono text-sm"
                                    />
                                </div>

                                {/* Size */}
                                <div className="sm:col-span-2">
                                    <label className="text-xs text-zinc-500 sm:hidden mb-1 block">
                                        Talla
                                    </label>
                                    <select
                                        value={variant.size}
                                        onChange={(e) =>
                                            onUpdateVariant(index, 'size', e.target.value)
                                        }
                                        className="w-full h-9 px-3 rounded-md bg-zinc-800 border border-zinc-700 text-white text-sm"
                                    >
                                        <option value="">Seleccionar</option>
                                        {SIZES.map((size) => (
                                            <option key={size} value={size}>
                                                {size}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Color */}
                                <div className="sm:col-span-2">
                                    <label className="text-xs text-zinc-500 sm:hidden mb-1 block">
                                        Color
                                    </label>
                                    <Input
                                        value={variant.color}
                                        onChange={(e) =>
                                            onUpdateVariant(index, 'color', e.target.value)
                                        }
                                        placeholder="Negro"
                                        className="bg-zinc-800 border-zinc-700 text-sm"
                                    />
                                </div>

                                {/* Price */}
                                <div className="sm:col-span-2">
                                    <label className="text-xs text-zinc-500 sm:hidden mb-1 block">
                                        Precio (CLP)
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">
                                            $
                                        </span>
                                        <Input
                                            value={formatPrice(variant.priceClp)}
                                            onChange={(e) =>
                                                onUpdateVariant(index, 'priceClp', parsePrice(e.target.value))
                                            }
                                            className="bg-zinc-800 border-zinc-700 text-sm pl-7"
                                        />
                                    </div>
                                </div>

                                {/* Stock */}
                                <div className="sm:col-span-2">
                                    <label className="text-xs text-zinc-500 sm:hidden mb-1 block">
                                        Stock
                                    </label>
                                    <Input
                                        type="number"
                                        min={0}
                                        value={variant.stock}
                                        onChange={(e) =>
                                            onUpdateVariant(index, 'stock', parseInt(e.target.value, 10) || 0)
                                        }
                                        className="bg-zinc-800 border-zinc-700 text-sm"
                                    />
                                </div>

                                {/* Delete */}
                                <div className="sm:col-span-1 flex justify-end">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => onRemoveVariant(index)}
                                        className="text-zinc-500 hover:text-red-400 hover:bg-red-500/10"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
