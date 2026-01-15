/**
 * Tipos del Carrito de Compras
 */

import type { Size } from './enums';

// ============ RESPONSE TYPES ============

export interface CartDto {
    items: CartItemDto[];
    subtotal: number;
    totalItems: number;
}

export interface CartItemDto {
    id: string;
    productId: string;
    productName: string;
    productSlug: string;
    productImageUrl: string | null;
    unitPrice: number;
    size: Size;
    quantity: number;
    totalPrice: number;
    isAvailable: boolean;
    availableStock: number;
}

// ============ REQUEST TYPES ============

export interface AddToCartRequest {
    productId: string;
    size: Size;
    quantity?: number;
}

export interface UpdateCartItemRequest {
    quantity: number;
}
