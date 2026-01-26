import type { ProductVariant } from './product';

// Order status
export type OrderStatus =
    | 'PENDING'
    | 'PAID'
    | 'PROCESSING'
    | 'SHIPPED'
    | 'DELIVERED'
    | 'CANCELLED';

// Payment status
export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';

// Discount type
export type DiscountType = 'PERCENTAGE' | 'FIXED';

// Shipping method
export interface ShippingMethod {
    id: string;
    name: string;
    description: string | null;
    priceCLP: number;
    isActive: boolean;
}

// Shipping address
export interface ShippingAddress {
    firstName: string;
    lastName: string;
    address: string;
    addressLine2?: string;
    city: string;
    region: string;
    postalCode: string;
    phone: string;
}

// Order item
export interface OrderItem {
    id: string;
    orderId: string;
    variantId: string;
    variant?: ProductVariant;
    quantity: number;
    priceCLP: number;
}

// Order
export interface Order {
    id: string;
    orderNumber: string;
    userId: string;
    status: OrderStatus;
    totalCLP: number;
    shippingMethodId: string | null;
    shippingMethod?: ShippingMethod | null;
    shippingAddress: ShippingAddress | null;
    items: OrderItem[];
    couponId: string | null;
    createdAt: Date;
    updatedAt: Date;
}

// Payment
export interface Payment {
    id: string;
    orderId: string;
    provider: string;
    status: PaymentStatus;
    providerOrderId: string | null;
    amountCLP: number;
    createdAt: Date;
    updatedAt: Date;
}

// Coupon
export interface Coupon {
    id: string;
    code: string;
    discountType: DiscountType;
    discountValue: number;
    minOrderCLP: number | null;
    maxUses: number | null;
    usedCount: number;
    expiresAt: Date | null;
    isActive: boolean;
}

// Order creation input
export interface CreateOrderInput {
    shippingMethodId: string;
    shippingAddress: ShippingAddress;
    couponCode?: string;
}

// Order summary (for lists)
export interface OrderSummary {
    id: string;
    orderNumber: string;
    status: OrderStatus;
    totalCLP: number;
    itemCount: number;
    createdAt: Date;
}
