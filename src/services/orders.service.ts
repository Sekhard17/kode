/**
 * Orders Service - Pedidos
 */

import api from './api';
import type {
    OrderDto,
    OrderListDto,
    CreateOrderRequest,
    GetOrdersParams,
    PaginatedResponse
} from '../types';

// ============ ENDPOINTS ============

const ORDERS_ENDPOINTS = {
    BASE: '/orders',
    BY_ID: (orderId: string) => `/orders/${orderId}`,
} as const;

// ============ SERVICIOS ============

/**
 * Obtener mis pedidos con paginación
 */
export async function getMyOrders(params?: GetOrdersParams): Promise<PaginatedResponse<OrderListDto>> {
    const response = await api.get<PaginatedResponse<OrderListDto>>(ORDERS_ENDPOINTS.BASE, {
        params,
    });
    return response.data;
}

/**
 * Obtener detalle de un pedido por ID
 */
export async function getOrderById(orderId: string): Promise<OrderDto> {
    const response = await api.get<OrderDto>(ORDERS_ENDPOINTS.BY_ID(orderId));
    return response.data;
}

/**
 * Crear un nuevo pedido desde el carrito
 */
export async function createOrder(data: CreateOrderRequest): Promise<OrderDto> {
    const response = await api.post<OrderDto>(ORDERS_ENDPOINTS.BASE, data);
    return response.data;
}

/**
 * Obtener el último pedido
 */
export async function getLatestOrder(): Promise<OrderListDto | null> {
    const orders = await getMyOrders({ page: 1, pageSize: 1 });
    return orders.items[0] || null;
}

// ============ EXPORT ============

export const ordersService = {
    getMyOrders,
    getOrderById,
    createOrder,
    getLatestOrder,
};
