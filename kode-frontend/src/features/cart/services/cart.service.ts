import { Cart } from '../types';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

export async function fetchCart(token?: string, guestKey?: string): Promise<Cart> {
    const query = guestKey ? `?guestKey=${guestKey}` : '';
    const headers: HeadersInit = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${BACKEND_URL}/api/v1/cart${query}`, {
        headers,
        cache: 'no-store',
    });
    if (!res.ok) throw new Error('Failed to fetch cart');
    return res.json();
}

export async function addItemToCart(
    variantId: string,
    quantity: number,
    token?: string,
    guestKey?: string
) {
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${BACKEND_URL}/api/v1/cart/items`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ variantId, quantity, guestKey }),
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to add item');
    }
    return res.json();
}

export async function updateCartItem(itemId: string, quantity: number, token?: string) {
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${BACKEND_URL}/api/v1/cart/items/${itemId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ quantity }),
    });
    if (!res.ok) throw new Error('Failed to update item');
    return res.json();
}

export async function removeCartItem(itemId: string, token?: string) {
    const headers: HeadersInit = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${BACKEND_URL}/api/v1/cart/items/${itemId}`, {
        method: 'DELETE',
        headers,
    });
    if (!res.ok) throw new Error('Failed to remove item');
    return res.json();
}

export async function mergeGuestCart(guestKey: string, token: string) {
    const res = await fetch(`${BACKEND_URL}/api/v1/cart/merge`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ guestKey }),
    });
    if (!res.ok) throw new Error('Failed to merge cart');
    return res.json();
}
