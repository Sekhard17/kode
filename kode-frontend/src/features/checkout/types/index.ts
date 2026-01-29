export interface ShippingMethod {
    id: string;
    name: string;
    pricingType: 'FLAT' | 'BY_REGION' | 'FREE' | 'PICKUP';
    flatPriceClp: number | null;
    description: string | null;
    ratesByRegion: Array<{
        region: string;
        priceClp: number;
    }>;
}

export interface QuoteItem {
    id: string;
    productName: string;
    variantSku: string;
    size: string;
    color: string | null;
    unitPriceClp: number;
    quantity: number;
    lineTotalClp: number;
    imageUrl: string | null;
}

export interface Quote {
    items: QuoteItem[];
    subtotalClp: number;
    shippingPriceClp: number;
    discountClp: number;
    totalClp: number;
    couponApplied: {
        code: string;
        type: string;
        value: number;
    } | null;
    itemsCount: number;
}

export interface CheckoutFormData {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shipRegion: string;
    shipCity: string;
    shipCommune: string;
    shipAddress1: string;
    shipAddress2: string;
    shipReference: string;
    shippingMethodId: string;
    couponCode: string;
}

export interface OrderResult {
    id: string;
    orderNumber: string;
    status: string;
    totalClp: number;
    createdAt: string;
}
