export interface CartItem {
    id: string;
    variantId: string;
    quantity: number;
    variant: {
        id: string;
        sku: string;
        size: string;
        priceClp: number;
        stock: number;
        product: {
            name: string;
            slug: string;
            images: Array<{
                path: string;
            }>;
        };
    };
}

export interface Cart {
    id: string;
    userId: string | null;
    guestKey: string | null;
    items: CartItem[];
}
