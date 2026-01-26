import type {
    OrderStatus,
    PaymentStatus,
    PaymentProvider,
    CouponType,
    ShippingPricingType,
} from './auth';

// Re-export enums for convenience
export type { OrderStatus, PaymentStatus, PaymentProvider, CouponType, ShippingPricingType };

// Address types
export interface Address {
    id: string;
    userId: string;
    label: string | null;
    fullName: string;
    phone: string;
    email: string | null;
    country: string;
    region: string;
    city: string;
    commune: string;
    addressLine: string;
    addressLine2: string | null;
    reference: string | null;
    isDefault: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// Shipping method types
export interface ShippingMethod {
    id: string;
    name: string;
    pricingType: ShippingPricingType;
    isActive: boolean;
    flatPriceClp: number | null;
    description: string | null;
    sortOrder: number;
}

export interface ShippingRateByRegion {
    id: string;
    shippingMethodId: string;
    region: string;
    priceClp: number;
}

export interface ShippingMethodWithRates extends ShippingMethod {
    ratesByRegion: ShippingRateByRegion[];
}

// Coupon types
export interface Coupon {
    id: string;
    code: string;
    type: CouponType;
    value: number;
    minSubtotalClp: number | null;
    maxRedemptions: number | null;
    maxPerUser: number | null;
    startsAt: Date | null;
    endsAt: Date | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface CouponValidation {
    isValid: boolean;
    coupon: Coupon | null;
    discountClp: number;
    errorMessage: string | null;
}

// Order item types
export interface OrderItem {
    id: string;
    orderId: string;
    productId: string | null;
    variantId: string | null;
    productName: string;
    variantSku: string;
    size: string;
    color: string | null;
    unitPriceClp: number;
    quantity: number;
    lineTotalClp: number;
}

// Order types
export interface Order {
    id: string;
    orderNumber: string;
    status: OrderStatus;
    userId: string | null;
    customerName: string;
    customerEmail: string;
    customerPhone: string | null;
    shipCountry: string;
    shipRegion: string;
    shipCity: string;
    shipCommune: string;
    shipAddress1: string;
    shipAddress2: string | null;
    shipReference: string | null;
    shippingMethodId: string | null;
    shippingPriceClp: number;
    subtotalClp: number;
    discountClp: number;
    totalClp: number;
    couponId: string | null;
    trackingCode: string | null;
    trackingUrl: string | null;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface OrderWithDetails extends Order {
    items: OrderItem[];
    shippingMethod: ShippingMethod | null;
    coupon: Coupon | null;
}

// Payment types
export interface Payment {
    id: string;
    orderId: string;
    provider: PaymentProvider;
    status: PaymentStatus;
    amountClp: number;
    providerPaymentId: string | null;
    providerOrderId: string | null;
    createdAt: Date;
    updatedAt: Date;
}

// Order creation input
export interface CreateOrderInput {
    // Customer info (required for guest, optional for logged in)
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    // Shipping address
    shipRegion: string;
    shipCity: string;
    shipCommune: string;
    shipAddress1: string;
    shipAddress2?: string;
    shipReference?: string;
    // Shipping method
    shippingMethodId: string;
    // Coupon
    couponCode?: string;
    // Notes
    notes?: string;
}

// Order summary (for lists)
export interface OrderSummary {
    id: string;
    orderNumber: string;
    status: OrderStatus;
    totalClp: number;
    itemCount: number;
    createdAt: Date;
}

// Order status update (admin)
export interface UpdateOrderStatusInput {
    orderId: string;
    status: OrderStatus;
    trackingCode?: string;
    trackingUrl?: string;
    notes?: string;
}
