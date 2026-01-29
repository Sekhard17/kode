import { Quote, ShippingMethod, CheckoutFormData, OrderResult } from '../types';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

export async function getQuote(
    token?: string,
    guestKey?: string,
    shippingMethodId?: string,
    region?: string,
    couponCode?: string
): Promise<Quote> {
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${BACKEND_URL}/api/v1/checkout/quote`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ guestKey, shippingMethodId, region, couponCode }),
        cache: 'no-store',
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Error al obtener cotización');
    }
    return res.json();
}

export async function getShippingMethods(): Promise<ShippingMethod[]> {
    const res = await fetch(`${BACKEND_URL}/api/v1/checkout/shipping-methods`, {
        cache: 'no-store',
    });

    if (!res.ok) throw new Error('Error al obtener métodos de envío');
    return res.json();
}

export async function validateCoupon(
    code: string,
    subtotal: number
): Promise<{ valid: boolean; discountClp: number; code: string; type: string; value: number }> {
    const res = await fetch(
        `${BACKEND_URL}/api/v1/checkout/validate-coupon?code=${encodeURIComponent(code)}&subtotal=${subtotal}`,
        { cache: 'no-store' }
    );

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Cupón inválido');
    }
    return res.json();
}

export async function createOrder(
    data: CheckoutFormData,
    token?: string,
    guestKey?: string
): Promise<OrderResult> {
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${BACKEND_URL}/api/v1/checkout/create-order`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ ...data, guestKey }),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Error al crear orden');
    }
    return res.json();
}
