/**
 * Tipos de Lista de Deseos (Wishlist)
 */

// ============ RESPONSE TYPES ============

export interface WishlistDto {
    items: WishlistItemDto[];
    totalItems: number;
}

export interface WishlistItemDto {
    id: string;
    productId: string;
    productName: string;
    productSlug: string;
    productImageUrl: string | null;
    price: number;
    compareAtPrice: number | null;
    hasDiscount: boolean;
    isAvailable: boolean;
    addedAt: string;
}
