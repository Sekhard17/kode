/**
 * Products Service - Productos
 */

import api from './api';
import type {
    ProductDto,
    ProductListDto,
    GetProductsParams,
    CreateProductRequest,
    PaginatedResponse
} from '../types';

// ============ ENDPOINTS ============

const PRODUCTS_ENDPOINTS = {
    BASE: '/products',
    BY_ID: (id: string) => `/products/${id}`,
    BY_SLUG: (slug: string) => `/products/slug/${slug}`,
} as const;

// ============ SERVICIOS ============

/**
 * Obtener lista de productos con filtros y paginación
 */
export async function getProducts(params?: GetProductsParams): Promise<PaginatedResponse<ProductListDto>> {
    const response = await api.get<PaginatedResponse<ProductListDto>>(PRODUCTS_ENDPOINTS.BASE, {
        params,
    });
    return response.data;
}

/**
 * Obtener producto por ID
 */
export async function getProductById(id: string): Promise<ProductDto> {
    const response = await api.get<ProductDto>(PRODUCTS_ENDPOINTS.BY_ID(id));
    return response.data;
}

/**
 * Obtener producto por slug (SEO-friendly)
 */
export async function getProductBySlug(slug: string): Promise<ProductDto> {
    const response = await api.get<ProductDto>(PRODUCTS_ENDPOINTS.BY_SLUG(slug));
    return response.data;
}

/**
 * Crear un nuevo producto (Solo Admin)
 */
export async function createProduct(data: CreateProductRequest): Promise<ProductDto> {
    const response = await api.post<ProductDto>(PRODUCTS_ENDPOINTS.BASE, data);
    return response.data;
}

/**
 * Obtener productos destacados
 */
export async function getFeaturedProducts(limit = 8): Promise<PaginatedResponse<ProductListDto>> {
    return getProducts({ isFeatured: true, pageSize: limit });
}

/**
 * Buscar productos por nombre
 */
export async function searchProducts(query: string, page = 1): Promise<PaginatedResponse<ProductListDto>> {
    return getProducts({ search: query, page });
}

/**
 * Obtener productos por categoría
 */
export async function getProductsByCategory(categoryId: string, page = 1): Promise<PaginatedResponse<ProductListDto>> {
    return getProducts({ categoryId, page });
}

// ============ EXPORT ============

export const productsService = {
    getProducts,
    getProductById,
    getProductBySlug,
    createProduct,
    getFeaturedProducts,
    searchProducts,
    getProductsByCategory,
};
