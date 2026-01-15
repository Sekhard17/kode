/**
 * Categories Service - Categorías
 */

import api from './api';
import type {
    CategoryDto,
    CategoryListDto,
    CreateCategoryRequest
} from '../types';

// ============ ENDPOINTS ============

const CATEGORIES_ENDPOINTS = {
    BASE: '/categories',
    BY_ID: (id: string) => `/categories/${id}`,
    BY_SLUG: (slug: string) => `/categories/slug/${slug}`,
} as const;

// ============ SERVICIOS ============

/**
 * Obtener todas las categorías
 */
export async function getCategories(onlyActive = true): Promise<CategoryListDto[]> {
    const response = await api.get<CategoryListDto[]>(CATEGORIES_ENDPOINTS.BASE, {
        params: { onlyActive },
    });
    return response.data;
}

/**
 * Obtener categoría por ID
 */
export async function getCategoryById(id: string): Promise<CategoryDto> {
    const response = await api.get<CategoryDto>(CATEGORIES_ENDPOINTS.BY_ID(id));
    return response.data;
}

/**
 * Obtener categoría por slug (SEO-friendly)
 */
export async function getCategoryBySlug(slug: string): Promise<CategoryDto> {
    const response = await api.get<CategoryDto>(CATEGORIES_ENDPOINTS.BY_SLUG(slug));
    return response.data;
}

/**
 * Crear una nueva categoría (Solo Admin)
 */
export async function createCategory(data: CreateCategoryRequest): Promise<CategoryDto> {
    const response = await api.post<CategoryDto>(CATEGORIES_ENDPOINTS.BASE, data);
    return response.data;
}

// ============ EXPORT ============

export const categoriesService = {
    getCategories,
    getCategoryById,
    getCategoryBySlug,
    createCategory,
};
