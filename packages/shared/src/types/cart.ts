import type { ProductVariant } from './product';

// Cart types
export interface Cart {
    id: string;
    userId: string | null;
    guestKey: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface CartItem {
    id: string;
    cartId: string;
    variantId: string;
    quantity: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface CartItemWithDetails extends CartItem {
    variant: ProductVariant & {
        product: {
            id: string;
            name: string;
            slug: string;
        };
    };
    productName: string;
    productSlug: string;
    productImage: string | null;
    size: string;
    color: string | null;
    priceClp: number;
    subtotalClp: number;
}

export interface CartSummary {
    id: string;
    items: CartItemWithDetails[];
    itemCount: number;
    subtotalClp: number;
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

export interface MergeGuestCartInput {
    guestKey: string;
}
