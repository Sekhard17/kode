/**
 * Wishlist Service - Lista de Deseos
 */

import api from './api';
import type {
    WishlistDto,
    MessageResponse
} from '../types';

// ============ ENDPOINTS ============

const WISHLIST_ENDPOINTS = {
    BASE: '/wishlist',
    ITEM: (productId: string) => `/wishlist/${productId}`,
} as const;

// ============ SERVICIOS ============

/**
 * Obtener mi lista de deseos
 */
export async function getWishlist(): Promise<WishlistDto> {
    const response = await api.get<WishlistDto>(WISHLIST_ENDPOINTS.BASE);
    return response.data;
}

/**
 * Agregar producto a la lista de deseos
 */
export async function addToWishlist(productId: string): Promise<MessageResponse> {
    const response = await api.post<MessageResponse>(WISHLIST_ENDPOINTS.ITEM(productId));
    return response.data;
}

/**
 * Eliminar producto de la lista de deseos
 */
export async function removeFromWishlist(productId: string): Promise<MessageResponse> {
    const response = await api.delete<MessageResponse>(WISHLIST_ENDPOINTS.ITEM(productId));
    return response.data;
}

/**
 * Verificar si un producto está en la wishlist
 */
export async function isInWishlist(productId: string): Promise<boolean> {
    const wishlist = await getWishlist();
    return wishlist.items.some(item => item.productId === productId);
}

/**
 * Toggle producto en wishlist (agregar si no está, eliminar si está)
 */
export async function toggleWishlist(productId: string): Promise<{ added: boolean }> {
    const isIn = await isInWishlist(productId);

    if (isIn) {
        await removeFromWishlist(productId);
        return { added: false };
    } else {
        await addToWishlist(productId);
        return { added: true };
    }
}

/**
 * Obtener cantidad de items en wishlist
 */
export async function getWishlistCount(): Promise<number> {
    const wishlist = await getWishlist();
    return wishlist.totalItems;
}

// ============ EXPORT ============

export const wishlistService = {
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist,
    getWishlistCount,
};
