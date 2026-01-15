/**
 * Cart Service - Carrito de Compras
 */

import api from './api';
import type {
    CartDto,
    AddToCartRequest,
    UpdateCartItemRequest,
    MessageResponse
} from '../types';

// ============ ENDPOINTS ============

const CART_ENDPOINTS = {
    BASE: '/cart',
    ITEM: (cartItemId: string) => `/cart/${cartItemId}`,
} as const;

// ============ SERVICIOS ============

/**
 * Obtener carrito del usuario actual
 */
export async function getCart(): Promise<CartDto> {
    const response = await api.get<CartDto>(CART_ENDPOINTS.BASE);
    return response.data;
}

/**
 * Agregar producto al carrito
 */
export async function addToCart(data: AddToCartRequest): Promise<MessageResponse> {
    const response = await api.post<MessageResponse>(CART_ENDPOINTS.BASE, data);
    return response.data;
}

/**
 * Actualizar cantidad de un item del carrito
 */
export async function updateCartItem(cartItemId: string, data: UpdateCartItemRequest): Promise<MessageResponse> {
    const response = await api.put<MessageResponse>(CART_ENDPOINTS.ITEM(cartItemId), data);
    return response.data;
}

/**
 * Eliminar item del carrito
 */
export async function removeFromCart(cartItemId: string): Promise<MessageResponse> {
    const response = await api.delete<MessageResponse>(CART_ENDPOINTS.ITEM(cartItemId));
    return response.data;
}

/**
 * Limpiar todo el carrito (eliminar todos los items)
 */
export async function clearCart(): Promise<void> {
    const cart = await getCart();
    await Promise.all(cart.items.map(item => removeFromCart(item.id)));
}

/**
 * Obtener cantidad total de items en el carrito
 */
export async function getCartCount(): Promise<number> {
    const cart = await getCart();
    return cart.totalItems;
}

// ============ EXPORT ============

export const cartService = {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartCount,
};
