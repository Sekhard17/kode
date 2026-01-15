/**
 * Tipos de Categorías
 */

// ============ RESPONSE TYPES ============

export interface CategoryListDto {
    id: string;
    name: string;
    slug: string;
    imageUrl: string | null;
    productCount: number;
}

export interface CategoryDto {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    imageUrl: string | null;
    isActive: boolean;
    displayOrder: number;
    productCount: number;
}

// ============ REQUEST TYPES ============

export interface CreateCategoryRequest {
    name: string;
    description?: string;
    imageUrl?: string;
    displayOrder?: number;
}
