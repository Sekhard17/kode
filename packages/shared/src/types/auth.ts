// Enums matching Prisma schema
export type Role = 'CUSTOMER' | 'ADMIN';

export type OrderStatus =
    | 'CREATED'
    | 'PAYMENT_PENDING'
    | 'PAID'
    | 'PREPARING'
    | 'SHIPPED'
    | 'DELIVERED'
    | 'CANCELLED'
    | 'REFUNDED';

export type PaymentProvider = 'FLOW';

export type PaymentStatus =
    | 'INITIATED'
    | 'PENDING'
    | 'APPROVED'
    | 'REJECTED'
    | 'CANCELLED'
    | 'FAILED'
    | 'REFUNDED';

export type CouponType = 'PERCENT' | 'FIXED';

export type ShippingPricingType = 'FLAT' | 'BY_REGION' | 'FREE' | 'PICKUP';

export type LegalPageType = 'TERMS' | 'PRIVACY' | 'SHIPPING' | 'RETURNS' | 'CONTACT';

// User types
export interface User {
    id: string;
    name: string | null;
    email: string;
    emailVerified: Date | null;
    image: string | null;
    role: Role;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserPublic {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    role: Role;
}

// Auth types
export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    email: string;
    password: string;
    name?: string;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken?: string;
}

export interface JwtPayload {
    sub: string;
    email: string;
    role: Role;
    iat?: number;
    exp?: number;
}

// Session type for Auth.js
export interface SessionUser {
    id: string;
    email: string;
    name: string | null;
    image: string | null;
    role: Role;
}
