/**
 * Tipos de Productos
 */

import type { Size } from './enums';

// ============ RESPONSE TYPES ============

export interface ProductListDto {
    id: string;
    name: string;
    slug: string;
    price: number;
    compareAtPrice: number | null;
    hasDiscount: boolean;
    discountPercentage: number | null;
    primaryImageUrl: string | null;
    categoryName: string;
    isAvailable: boolean;
}

export interface ProductDto {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    price: number;
    compareAtPrice: number | null;
    hasDiscount: boolean;
    discountPercentage: number | null;
    isActive: boolean;
    isFeatured: boolean;
    categoryId: string;
    categoryName: string;
    images: ProductImageDto[];
    variants: ProductVariantDto[];
}

export interface ProductImageDto {
    id: string;
    url: string;
    altText: string | null;
    displayOrder: number;
    isPrimary: boolean;
}

export interface ProductVariantDto {
    id: string;
    size: Size;
    stock: number;
    sku: string | null;
    isAvailable: boolean;
}

// ============ REQUEST TYPES ============

export interface GetProductsParams {
    page?: number;
    pageSize?: number;
    search?: string;
    categoryId?: string;
    isFeatured?: boolean;
    onlyActive?: boolean;
}

export interface CreateProductRequest {
    name: string;
    description?: string;
    price: number;
    compareAtPrice?: number;
    categoryId: string;
    isFeatured: boolean;
    variants: CreateProductVariantDto[];
}

export interface CreateProductVariantDto {
    size: Size;
    stock: number;
    sku?: string;
}
