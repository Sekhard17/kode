/**
 * Traducciones del carrito de compras
 * @module lib/translations/cart
 */

export interface CartTranslations {
    title: string;
    emptyTitle: string;
    emptySubtitle: string;
    continueShopping: string;
    product: string;
    price: string;
    quantity: string;
    total: string;
    remove: string;
    subtotal: string;
    shipping: string;
    shippingFree: string;
    shippingCalculated: string;
    orderTotal: string;
    checkout: string;
    secureCheckout: string;
    freeShippingNote: string;
    size: string;
    orderSummary: string;
}

export const cartTranslations: Record<"es" | "en", CartTranslations> = {
    es: {
        title: "Carrito de Compras",
        emptyTitle: "Tu carrito está vacío",
        emptySubtitle: "Parece que aún no has agregado nada. ¡Descubre nuestra colección!",
        continueShopping: "Explorar Tienda",
        product: "Producto",
        price: "Precio",
        quantity: "Cantidad",
        total: "Total",
        remove: "Eliminar",
        subtotal: "Subtotal",
        shipping: "Envío",
        shippingFree: "Gratis",
        shippingCalculated: "Calculado al pagar",
        orderTotal: "Total del Pedido",
        checkout: "Proceder al Pago",
        secureCheckout: "Pago 100% seguro",
        freeShippingNote: "¡Envío gratis en compras sobre $50.000!",
        size: "Talla",
        orderSummary: "Resumen del Pedido",
    },
    en: {
        title: "Shopping Cart",
        emptyTitle: "Your cart is empty",
        emptySubtitle: "Looks like you haven't added anything yet. Discover our collection!",
        continueShopping: "Explore Shop",
        product: "Product",
        price: "Price",
        quantity: "Quantity",
        total: "Total",
        remove: "Remove",
        subtotal: "Subtotal",
        shipping: "Shipping",
        shippingFree: "Free",
        shippingCalculated: "Calculated at checkout",
        orderTotal: "Order Total",
        checkout: "Proceed to Checkout",
        secureCheckout: "100% Secure Checkout",
        freeShippingNote: "Free shipping on orders over $50!",
        size: "Size",
        orderSummary: "Order Summary",
    },
};

export function getCartTranslations(locale: "es" | "en"): CartTranslations {
    return cartTranslations[locale];
}
