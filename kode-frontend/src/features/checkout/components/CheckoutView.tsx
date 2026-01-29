'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/features/cart/store/useCartStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
    getQuote,
    getShippingMethods,
    validateCoupon,
    createOrder,
} from '../services/checkout.service';
import { Quote, ShippingMethod, CheckoutFormData } from '../types';
import { Loader2, Tag, Truck, Package, CheckCircle } from 'lucide-react';

const REGIONES_CHILE = [
    'Arica y Parinacota',
    'Tarapacá',
    'Antofagasta',
    'Atacama',
    'Coquimbo',
    'Valparaíso',
    'Metropolitana',
    'O\'Higgins',
    'Maule',
    'Ñuble',
    'Biobío',
    'La Araucanía',
    'Los Ríos',
    'Los Lagos',
    'Aysén',
    'Magallanes',
];

export function CheckoutView() {
    const { data: session } = useSession();
    const router = useRouter();
    const { guestKey, setCartCount } = useCartStore();

    const [quote, setQuote] = useState<Quote | null>(null);
    const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [couponLoading, setCouponLoading] = useState(false);

    const [form, setForm] = useState<CheckoutFormData>({
        customerName: session?.user?.name || '',
        customerEmail: session?.user?.email || '',
        customerPhone: '',
        shipRegion: '',
        shipCity: '',
        shipCommune: '',
        shipAddress1: '',
        shipAddress2: '',
        shipReference: '',
        shippingMethodId: '',
        couponCode: '',
    });

    // Load initial data
    useEffect(() => {
        const loadData = async () => {
            try {
                const [quoteData, methodsData] = await Promise.all([
                    getQuote(session?.accessToken, guestKey || undefined),
                    getShippingMethods(),
                ]);
                setQuote(quoteData);
                setShippingMethods(methodsData);

                // Set default shipping method if available
                if (methodsData.length > 0 && !form.shippingMethodId) {
                    setForm((prev) => ({
                        ...prev,
                        shippingMethodId: methodsData[0].id,
                    }));
                }
            } catch (error) {
                console.error('Error loading checkout data:', error);
                toast.error('Error al cargar información del checkout');
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [session?.accessToken, guestKey]);

    // Update quote when shipping/coupon changes
    useEffect(() => {
        if (!form.shippingMethodId || !form.shipRegion) return;

        const updateQuote = async () => {
            try {
                const quoteData = await getQuote(
                    session?.accessToken,
                    guestKey || undefined,
                    form.shippingMethodId,
                    form.shipRegion,
                    form.couponCode || undefined
                );
                setQuote(quoteData);
            } catch (error) {
                console.error('Error updating quote:', error);
            }
        };
        updateQuote();
    }, [form.shippingMethodId, form.shipRegion, form.couponCode]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleApplyCoupon = async () => {
        if (!form.couponCode.trim()) return;

        setCouponLoading(true);
        try {
            await validateCoupon(form.couponCode, quote?.subtotalClp || 0);
            toast.success('Cupón aplicado correctamente');
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Cupón inválido';
            toast.error(message);
            setForm((prev) => ({ ...prev, couponCode: '' }));
        } finally {
            setCouponLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!quote || quote.items.length === 0) {
            toast.error('El carrito está vacío');
            return;
        }

        setIsSubmitting(true);
        try {
            const order = await createOrder(
                form,
                session?.accessToken,
                guestKey || undefined
            );
            setCartCount(0);
            toast.success(`¡Orden ${order.orderNumber} creada exitosamente!`);
            router.push(`/orden/${order.orderNumber}?email=${encodeURIComponent(form.customerEmail)}`);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error al crear orden';
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
        }).format(price);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!quote || quote.items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h1 className="text-2xl font-bold mb-2">Tu carrito está vacío</h1>
                <p className="text-muted-foreground mb-6">
                    Añade productos a tu carrito para continuar con el checkout
                </p>
                <Button onClick={() => router.push('/tienda')}>Ver Tienda</Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Checkout</h1>

            <form onSubmit={handleSubmit}>
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left column - Form */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Customer Info */}
                        <section className="bg-card rounded-xl p-6 border">
                            <h2 className="text-xl font-semibold mb-4">
                                Información de Contacto
                            </h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="customerName">Nombre completo *</Label>
                                    <Input
                                        id="customerName"
                                        name="customerName"
                                        value={form.customerName}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Tu nombre"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="customerEmail">Email *</Label>
                                    <Input
                                        id="customerEmail"
                                        name="customerEmail"
                                        type="email"
                                        value={form.customerEmail}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="tu@email.com"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <Label htmlFor="customerPhone">Teléfono</Label>
                                    <Input
                                        id="customerPhone"
                                        name="customerPhone"
                                        type="tel"
                                        value={form.customerPhone}
                                        onChange={handleInputChange}
                                        placeholder="+56 9 1234 5678"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Shipping Address */}
                        <section className="bg-card rounded-xl p-6 border">
                            <h2 className="text-xl font-semibold mb-4">
                                Dirección de Envío
                            </h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="shipRegion">Región *</Label>
                                    <select
                                        id="shipRegion"
                                        name="shipRegion"
                                        value={form.shipRegion}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs"
                                    >
                                        <option value="">Selecciona una región</option>
                                        {REGIONES_CHILE.map((region) => (
                                            <option key={region} value={region}>
                                                {region}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <Label htmlFor="shipCity">Ciudad *</Label>
                                    <Input
                                        id="shipCity"
                                        name="shipCity"
                                        value={form.shipCity}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Santiago"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="shipCommune">Comuna *</Label>
                                    <Input
                                        id="shipCommune"
                                        name="shipCommune"
                                        value={form.shipCommune}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Providencia"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="shipAddress1">Dirección *</Label>
                                    <Input
                                        id="shipAddress1"
                                        name="shipAddress1"
                                        value={form.shipAddress1}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Calle y número"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="shipAddress2">Depto/Oficina</Label>
                                    <Input
                                        id="shipAddress2"
                                        name="shipAddress2"
                                        value={form.shipAddress2}
                                        onChange={handleInputChange}
                                        placeholder="Depto 123"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="shipReference">Referencia</Label>
                                    <Input
                                        id="shipReference"
                                        name="shipReference"
                                        value={form.shipReference}
                                        onChange={handleInputChange}
                                        placeholder="Cerca de..."
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Shipping Method */}
                        <section className="bg-card rounded-xl p-6 border">
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <Truck className="w-5 h-5" />
                                Método de Envío
                            </h2>
                            <div className="space-y-3">
                                {shippingMethods.map((method) => {
                                    let price = 0;
                                    if (method.pricingType === 'FLAT') {
                                        price = method.flatPriceClp || 0;
                                    } else if (method.pricingType === 'BY_REGION' && form.shipRegion) {
                                        const rate = method.ratesByRegion.find(
                                            (r) => r.region === form.shipRegion
                                        );
                                        price = rate?.priceClp || 0;
                                    }

                                    return (
                                        <label
                                            key={method.id}
                                            className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all ${form.shippingMethodId === method.id
                                                    ? 'border-primary bg-primary/5'
                                                    : 'hover:border-primary/50'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="radio"
                                                    name="shippingMethodId"
                                                    value={method.id}
                                                    checked={form.shippingMethodId === method.id}
                                                    onChange={handleInputChange}
                                                    className="w-4 h-4 text-primary"
                                                />
                                                <div>
                                                    <span className="font-medium">{method.name}</span>
                                                    {method.description && (
                                                        <p className="text-sm text-muted-foreground">
                                                            {method.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <span className="font-semibold">
                                                {method.pricingType === 'FREE'
                                                    ? 'Gratis'
                                                    : formatPrice(price)}
                                            </span>
                                        </label>
                                    );
                                })}
                            </div>
                        </section>
                    </div>

                    {/* Right column - Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-card rounded-xl p-6 border sticky top-4">
                            <h2 className="text-xl font-semibold mb-4">Resumen del Pedido</h2>

                            {/* Items */}
                            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                                {quote.items.map((item) => (
                                    <div key={item.id} className="flex gap-3 text-sm">
                                        <div className="w-12 h-12 bg-muted rounded-md flex-shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium truncate">{item.productName}</p>
                                            <p className="text-muted-foreground">
                                                Talla {item.size} × {item.quantity}
                                            </p>
                                        </div>
                                        <span className="font-medium">
                                            {formatPrice(item.lineTotalClp)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Coupon */}
                            <div className="border-t pt-4 mb-4">
                                <Label htmlFor="couponCode" className="flex items-center gap-2 mb-2">
                                    <Tag className="w-4 h-4" />
                                    Cupón de descuento
                                </Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="couponCode"
                                        name="couponCode"
                                        value={form.couponCode}
                                        onChange={handleInputChange}
                                        placeholder="CODIGO"
                                        className="uppercase"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleApplyCoupon}
                                        disabled={couponLoading}
                                    >
                                        {couponLoading ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            'Aplicar'
                                        )}
                                    </Button>
                                </div>
                                {quote.couponApplied && (
                                    <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                                        <CheckCircle className="w-4 h-4" />
                                        Cupón {quote.couponApplied.code} aplicado
                                    </p>
                                )}
                            </div>

                            {/* Totals */}
                            <div className="border-t pt-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Subtotal ({quote.itemsCount} items)</span>
                                    <span>{formatPrice(quote.subtotalClp)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Envío</span>
                                    <span>
                                        {quote.shippingPriceClp === 0
                                            ? 'Gratis'
                                            : formatPrice(quote.shippingPriceClp)}
                                    </span>
                                </div>
                                {quote.discountClp > 0 && (
                                    <div className="flex justify-between text-sm text-green-600">
                                        <span>Descuento</span>
                                        <span>-{formatPrice(quote.discountClp)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                                    <span>Total</span>
                                    <span>{formatPrice(quote.totalClp)}</span>
                                </div>
                            </div>

                            {/* Submit */}
                            <Button
                                type="submit"
                                size="lg"
                                className="w-full mt-6"
                                disabled={isSubmitting || !form.shippingMethodId}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                        Procesando...
                                    </>
                                ) : (
                                    `Confirmar Pedido • ${formatPrice(quote.totalClp)}`
                                )}
                            </Button>

                            <p className="text-xs text-muted-foreground text-center mt-4">
                                Al confirmar aceptas nuestros términos y condiciones
                            </p>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
