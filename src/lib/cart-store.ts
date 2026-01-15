/**
 * =================================================================
 * CART STORE - KØDE Streetwear
 * =================================================================
 * 
 * Manejo del estado del carrito de compras.
 * 
 * ARQUITECTURA CLEAN:
 * - Los tipos vienen de /types
 * - Este archivo maneja la lógica del carrito (store)
 * - No contiene lógica de UI, solo estado y operaciones
 */

import type { CartDto, CartItemDto } from '../types';
import { Size } from '../types';

// ============ CONFIGURACIÓN ============

/** Umbral para envío gratis (en pesos chilenos) */
const FREE_SHIPPING_THRESHOLD = 50000;

// ============ TIPOS ============

/** Resultado de una operación del carrito */
export interface CartOperationResult {
    success: boolean;
    message: string;
    cart?: CartDto;
}

// ============ FUNCIONES DE ENVÍO ============

/**
 * Verifica si el subtotal califica para envío gratis
 */
export function hasFreeShipping(subtotal: number): boolean {
    return subtotal >= FREE_SHIPPING_THRESHOLD;
}

/**
 * Obtiene el umbral de envío gratis
 */
export function getFreeShippingThreshold(): number {
    return FREE_SHIPPING_THRESHOLD;
}

/**
 * Calcula el progreso hacia envío gratis (0-100)
 */
export function getFreeShippingProgress(subtotal: number): number {
    const progress = (subtotal / FREE_SHIPPING_THRESHOLD) * 100;
    return Math.min(100, Math.round(progress));
}

// ============ DATOS DE DEMOSTRACIÓN ============

/**
 * Crea un carrito de demostración con productos de ejemplo
 * En producción, esto vendría del backend/API
 */
export function createDemoCart(): CartDto {
    const items: CartItemDto[] = [
        {
            id: 'cart-item-1',
            productId: 'prod-001',
            productName: 'KØDE Urban Hoodie Black',
            productSlug: 'kode-urban-hoodie-black',
            productImageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop',
            unitPrice: 45990,
            size: Size.M,
            quantity: 1,
            totalPrice: 45990,
            isAvailable: true,
            availableStock: 15
        },
        {
            id: 'cart-item-2',
            productId: 'prod-002',
            productName: 'KØDE Street Cargo Pants',
            productSlug: 'kode-street-cargo-pants',
            productImageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&h=400&fit=crop',
            unitPrice: 38990,
            size: Size.L,
            quantity: 2,
            totalPrice: 77980,
            isAvailable: true,
            availableStock: 8
        },
        {
            id: 'cart-item-3',
            productId: 'prod-003',
            productName: 'KØDE Oversized Tee White',
            productSlug: 'kode-oversized-tee-white',
            productImageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
            unitPrice: 19990,
            size: Size.S,
            quantity: 1,
            totalPrice: 19990,
            isAvailable: true,
            availableStock: 25
        }
    ];

    const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);

    return {
        items,
        subtotal,
        totalItems: items.reduce((sum, item) => sum + item.quantity, 0)
    };
}

// ============ OPERACIONES DEL CARRITO ============

/**
 * Actualiza la cantidad de un item en el carrito
 * En producción, esto llamaría al backend
 */
export function updateItemQuantity(itemId: string, newQuantity: number): CartOperationResult {
    // Validación básica
    if (newQuantity < 1 || newQuantity > 10) {
        return {
            success: false,
            message: 'La cantidad debe estar entre 1 y 10'
        };
    }

    // En producción: llamar al servicio del carrito
    // await cartService.updateQuantity(itemId, newQuantity);

    return {
        success: true,
        message: `Cantidad actualizada a ${newQuantity}`
    };
}

/**
 * Elimina un item del carrito
 * En producción, esto llamaría al backend
 */
export function removeItem(itemId: string): CartOperationResult {
    if (!itemId) {
        return {
            success: false,
            message: 'ID de item inválido'
        };
    }

    // En producción: llamar al servicio del carrito
    // await cartService.removeItem(itemId);

    return {
        success: true,
        message: 'Producto eliminado del carrito'
    };
}

/**
 * Agrega un item al carrito
 * En producción, esto llamaría al backend
 */
export function addItem(productId: string, size: Size, quantity: number = 1): CartOperationResult {
    if (!productId) {
        return {
            success: false,
            message: 'ID de producto inválido'
        };
    }

    if (quantity < 1) {
        return {
            success: false,
            message: 'La cantidad debe ser al menos 1'
        };
    }

    // En producción: llamar al servicio del carrito
    // await cartService.addToCart({ productId, size, quantity });

    return {
        success: true,
        message: 'Producto agregado al carrito'
    };
}

/**
 * Vacía el carrito completo
 */
export function clearCart(): CartOperationResult {
    // En producción: llamar al servicio del carrito
    // await cartService.clearCart();

    return {
        success: true,
        message: 'Carrito vaciado'
    };
}
