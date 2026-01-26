import type { ProductVariant } from './product';

// Cart types
export interface Cart {
    id: string;
    userId: string;
    items: CartItem[];
    updatedAt: Date;
}

export interface CartItem {
    id: string;
    cartId: string;
    variantId: string;
    variant?: ProductVariant;
    quantity: number;
}

export interface CartItemWithDetails extends CartItem {
    productName: string;
    productSlug: string;
    productImage: string | null;
    size: string;
    color: string;
    priceCLP: number;
    subtotalCLP: number;
}

export interface CartSummary {
    items: CartItemWithDetails[];
    itemCount: number;
    totalCLP: number;
}

// Cart operations
export interface AddToCartInput {
    variantId: string;
    quantity: number;
}

export interface UpdateCartItemInput {
    itemId: string;
    quantity: number;
}
