'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ProductDetail, ProductVariant } from '../types';
import { ShoppingBag, ChevronRight, Info } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useCart } from '../../cart/hooks/useCart';
import { addItemToCart } from '../../cart/services/cart.service';
import { toast } from 'sonner';

interface ProductDetailsProps {
    product: ProductDetail;
}

export function ProductDetails({ product }: ProductDetailsProps) {
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
        product.variants.find(v => v.stock > 0) || product.variants[0] || null
    );
    const [mainImage, setMainImage] = useState(
        product.images.find(img => img.isPrimary)?.path || product.images[0]?.path
    );

    const { data: session } = useSession();
    const { getGuestKey, refreshCart } = useCart();
    const [isAdding, setIsAdding] = useState(false);

    const handleAddToCart = async () => {
        if (!selectedVariant) return;

        try {
            setIsAdding(true);
            const guestKey = getGuestKey();
            const accessToken = (session?.user as any)?.accessToken;

            await addItemToCart(selectedVariant.id, 1, accessToken, guestKey);
            toast.success('Producto añadido al carrito');
            refreshCart();
        } catch (error: any) {
            toast.error(error.message || 'Error al añadir al carrito');
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Media Gallery */}
            <div className="space-y-4">
                <div className="relative aspect-[3/4] overflow-hidden rounded-3xl bg-zinc-900 shadow-2xl">
                    {mainImage ? (
                        <Image
                            src={mainImage}
                            alt={product.name}
                            fill
                            className="object-cover"
                            priority
                        />
                    ) : (
                        <div className="h-full w-full flex items-center justify-center text-zinc-500">No image</div>
                    )}
                </div>

                {product.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-4">
                        {product.images.map((img) => (
                            <button
                                key={img.id}
                                onClick={() => setMainImage(img.path)}
                                className={`relative aspect-square overflow-hidden rounded-xl border-2 transition-all ${mainImage === img.path ? 'border-orange-500 ring-2 ring-orange-500/20' : 'border-transparent hover:border-zinc-700'
                                    }`}
                            >
                                <Image src={img.path} alt={product.name} fill className="object-cover" />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
                <div className="mb-4 flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-zinc-500">
                    <span className="hover:text-white transition-colors cursor-pointer">{product.categoryName}</span>
                    <ChevronRight className="h-3 w-3" />
                    <span className="text-zinc-400">Detalle</span>
                </div>

                <h1 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter mb-4">
                    {product.name}
                </h1>

                <div className="flex items-center space-x-4 mb-8">
                    <div className="text-3xl font-black text-orange-400 italic">
                        ${selectedVariant?.priceClp.toLocaleString('es-CL')}
                    </div>
                    {product.isFeatured && (
                        <Badge className="bg-orange-500 text-black border-none font-bold uppercase px-3 py-1">
                            Top Selection
                        </Badge>
                    )}
                </div>

                <p className="text-zinc-400 text-lg leading-relaxed mb-8">
                    {product.description || 'Sin descripción disponible.'}
                </p>

                <Separator className="bg-zinc-800 mb-8" />

                {/* Variants Selector */}
                <div className="space-y-6 mb-10">
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <label className="text-sm font-bold uppercase tracking-widest text-zinc-300">Selecciona Talla</label>
                            {selectedVariant && (
                                <span className={`text-xs font-bold uppercase ${selectedVariant.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    {selectedVariant.stock > 5 ? 'En Stock' : selectedVariant.stock > 0 ? `Últimas ${selectedVariant.stock} unidades` : 'Agotado'}
                                </span>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {product.variants.map((v) => (
                                <button
                                    key={v.id}
                                    disabled={v.stock === 0}
                                    onClick={() => setSelectedVariant(v)}
                                    className={`min-w-[50px] h-[50px] flex items-center justify-center rounded-xl border-2 font-bold transition-all ${selectedVariant?.id === v.id
                                        ? 'border-orange-500 bg-orange-500/10 text-white shadow-[0_0_15px_rgba(249,115,22,0.3)]'
                                        : v.stock === 0
                                            ? 'border-zinc-800 text-zinc-700 cursor-not-allowed'
                                            : 'border-zinc-800 text-zinc-400 hover:border-zinc-600'
                                        }`}
                                >
                                    {v.size}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* CTA Actions */}
                <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                    <Button
                        size="lg"
                        disabled={!selectedVariant || selectedVariant.stock === 0 || isAdding}
                        onClick={handleAddToCart}
                        className="flex-1 bg-white hover:bg-zinc-200 text-black h-16 rounded-2xl text-lg font-black uppercase transition-all active:scale-95"
                    >
                        <ShoppingBag className="mr-3 h-6 w-6" />
                        {isAdding ? 'Añadiendo...' : 'Añadir al Carrito'}
                    </Button>
                </div>

                {/* Benefits Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12 bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800">
                    <div className="flex items-start space-x-3 text-sm">
                        <div className="h-6 w-6 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                            <Info className="h-3 w-3 text-orange-500" />
                        </div>
                        <div>
                            <p className="font-bold text-white uppercase tracking-tighter text-xs">Despacho en 24h</p>
                            <p className="text-zinc-500 text-xs mt-1">Región Metropolitana de Lunes a Viernes.</p>
                        </div>
                    </div>
                    <div className="flex items-start space-x-3 text-sm">
                        <div className="h-6 w-6 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                            <Info className="h-3 w-3 text-orange-500" />
                        </div>
                        <div>
                            <p className="font-bold text-white uppercase tracking-tighter text-xs">Garantía KODE</p>
                            <p className="text-zinc-500 text-xs mt-1">30 días para cambios y devoluciones sin costo.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
