'use client';

import { useCart } from '../../hooks/useCart';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Cart } from '../../types';

interface CartViewProps {
    initialCart?: Cart | null;
}

export function CartView({ initialCart = null }: CartViewProps) {
    const { cart, isLoading, updateQuantity, removeItem, subtotal } = useCart(initialCart);

    if (isLoading) {
        return (
            <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-black italic tracking-tighter text-white mb-12 uppercase">Tu Carrito</h1>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-6">
                        {[1, 2].map((i) => (
                            <Skeleton key={i} className="h-32 w-full bg-zinc-900 rounded-2xl" />
                        ))}
                    </div>
                    <Skeleton className="h-64 w-full bg-zinc-900 rounded-2xl" />
                </div>
            </div>
        );
    }

    if (!cart || cart.items.length === 0) {
        return (
            <div className="mx-auto max-w-7xl px-4 py-40 sm:px-6 lg:px-8 text-center">
                <div className="flex justify-center mb-8">
                    <div className="h-24 w-24 rounded-full bg-zinc-900 flex items-center justify-center">
                        <ShoppingBag className="h-10 w-10 text-zinc-600" />
                    </div>
                </div>
                <h1 className="text-4xl font-black italic tracking-tighter text-white mb-4 uppercase">Tu carrito está vacío</h1>
                <p className="text-zinc-500 mb-10 max-w-md mx-auto">Parece que aún no has añadido nada a tu selección. Explora nuestras colecciones urbanas.</p>
                <Link href="/tienda">
                    <Button size="lg" className="bg-white hover:bg-zinc-200 text-black font-black uppercase tracking-widest px-10 h-14 rounded-2xl">
                        Ir a la tienda
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
            <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter text-white mb-16 uppercase">
                Tu Carrito <span className="text-orange-500 text-xl not-italic ml-4">({cart.items.length} ítems)</span>
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Cart Items List */}
                <div className="lg:col-span-2 space-y-6">
                    {cart.items.map((item) => (
                        <Card key={item.id} className="border-none bg-zinc-900/50 hover:bg-zinc-900 transition-all rounded-3xl overflow-hidden shadow-xl">
                            <CardContent className="p-6">
                                <div className="flex gap-6">
                                    {/* Image */}
                                    <div className="relative h-24 w-20 sm:h-32 sm:w-24 flex-shrink-0 overflow-hidden rounded-xl bg-zinc-800">
                                        <Image
                                            src={item.variant.product.images[0]?.path || ''}
                                            alt={item.variant.product.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    {/* Details */}
                                    <div className="flex flex-1 flex-col">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-lg font-bold text-white hover:text-orange-400 transition-colors uppercase italic tracking-tight">
                                                    <Link href={`/producto/${item.variant.product.slug}`}>
                                                        {item.variant.product.name}
                                                    </Link>
                                                </h3>
                                                <p className="text-xs font-black text-zinc-500 mt-1 uppercase tracking-widest">
                                                    Talla: <span className="text-white ml-1">{item.variant.size}</span>
                                                </p>
                                            </div>
                                            <p className="text-lg font-black text-white italic">
                                                ${(item.variant.priceClp * item.quantity).toLocaleString('es-CL')}
                                            </p>
                                        </div>

                                        <div className="mt-auto flex justify-between items-center">
                                            <div className="flex items-center bg-black rounded-lg border border-zinc-800 p-1">
                                                <button
                                                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                    className="p-1 text-zinc-500 hover:text-white transition-colors"
                                                >
                                                    <Minus className="h-4 w-4" />
                                                </button>
                                                <span className="w-10 text-center text-sm font-bold text-white">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="p-1 text-zinc-500 hover:text-white transition-colors"
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="text-zinc-500 hover:text-red-500 transition-colors p-2"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Summary Card */}
                <div className="lg:col-span-1">
                    <Card className="border-none bg-zinc-900 rounded-3xl p-8 sticky top-32 shadow-2xl overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 blur-3xl rounded-full -mr-16 -mt-16" />

                        <h2 className="text-2xl font-black italic tracking-tighter text-white uppercase mb-8">Resumen</h2>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-500 font-bold uppercase tracking-widest">Subtotal</span>
                                <span className="text-white font-bold">${subtotal.toLocaleString('es-CL')}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-500 font-bold uppercase tracking-widest">Envío</span>
                                <span className="text-white font-bold">Calculado en el checkout</span>
                            </div>
                            <Separator className="bg-zinc-800 my-4" />
                            <div className="flex justify-between">
                                <span className="text-lg font-black italic tracking-tighter text-white uppercase">Total</span>
                                <span className="text-2xl font-black italic text-orange-400">${subtotal.toLocaleString('es-CL')}</span>
                            </div>
                        </div>

                        <Link href="/checkout">
                            <Button className="w-full h-16 bg-white hover:bg-zinc-200 text-black font-black uppercase tracking-widest rounded-2xl group transition-all">
                                Finalizar Compra
                                <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-2" />
                            </Button>
                        </Link>

                        <div className="mt-8 pt-6 border-t border-zinc-800">
                            <div className="flex items-center space-x-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                                <span>Seguridad Garantizada con Flow</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
