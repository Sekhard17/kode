/**
 * Tipos de Pedidos/Órdenes
 */

import type { Size, OrderStatus } from './enums';

// ============ RESPONSE TYPES ============

export interface OrderListDto {
    id: string;
    orderNumber: string;
    status: OrderStatus;
    createdAt: string;
    total: number;
    itemCount: number;
    firstItemImage: string | null;
}

export interface OrderDto {
    id: string;
    orderNumber: string;
    status: OrderStatus;
    createdAt: string;
    subtotal: number;
    shippingCost: number;
    total: number;
    shippingInfo: ShippingInfoDto;
    trackingNumber: string | null;
    shippedAt: string | null;
    deliveredAt: string | null;
    items: OrderItemDto[];
}

export interface OrderItemDto {
    id: string;
    productName: string;
    productImageUrl: string | null;
    size: Size;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}

export interface ShippingInfoDto {
    name: string;
    address: string;
    city: string;
    region: string;
    postalCode: string;
    phone: string;
    notes: string | null;
}

// ============ REQUEST TYPES ============

export interface CreateOrderRequest {
    shipping: CreateOrderShippingDto;
}

export interface CreateOrderShippingDto {
    name: string;
    address: string;
    city: string;
    region: string;
    postalCode: string;
    phone: string;
    notes?: string;
}

export interface GetOrdersParams {
    page?: number;
    pageSize?: number;
}
