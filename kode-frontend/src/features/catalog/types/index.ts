// ========== PUBLIC TYPES (Catalog) ==========

export interface Category {
    id: string;
    name: string;
    slug: string;
    description: string | null;
}

export interface ProductListItem {
    id: string;
    name: string;
    slug: string;
    categoryId: string | null;
    categoryName: string | null;
    categorySlug: string | null;
    mainImage: string | null;
    minPriceClp: number;
    maxPriceClp: number;
    hasStock: boolean;
    isFeatured: boolean;
}

export interface ProductVariant {
    id: string;
    sku: string;
    size: string;
    color: string | null;
    priceClp: number;
    stock: number;
}

export interface ProductImage {
    id: string;
    path: string;
    altText: string | null;
    sortOrder: number;
    isPrimary: boolean;
}

export interface ProductDetail extends ProductListItem {
    description: string | null;
    images: ProductImage[];
    variants: ProductVariant[];
    category: Category | null;
}

export interface PaginatedResponse<T> {
    items: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface CatalogFilters {
    categoryId?: string;
    categorySlug?: string;
    minPrice?: number;
    maxPrice?: number;
    isFeatured?: boolean;
    page?: number;
    limit?: number;
}

// ========== ADMIN TYPES ==========

export interface AdminProductListItem extends ProductListItem {
    isActive: boolean;
    totalStock: number;
    variantsCount: number;
    createdAt: string;
}

export interface VariantFormData {
    id?: string;
    sku: string;
    size: string;
    color: string;
    priceClp: number;
    stock: number;
}

export interface ImageFormData {
    id?: string;
    file?: File;
    path?: string;
    altText: string;
    sortOrder: number;
    isPrimary: boolean;
    preview?: string; // For local preview URL
}

export interface ProductFormData {
    name: string;
    slug: string;
    description: string;
    categoryId: string | null;
    isFeatured: boolean;
    isActive: boolean;
    variants: VariantFormData[];
    images: ImageFormData[];
}

export interface CreateProductPayload {
    name: string;
    slug: string;
    description?: string;
    categoryId?: string;
    isFeatured: boolean;
    isActive: boolean;
    variants: {
        sku: string;
        size: string;
        color?: string;
        priceClp: number;
        stock: number;
    }[];
    images: {
        path: string;
        altText?: string;
        sortOrder: number;
        isPrimary: boolean;
    }[];
}

export interface UpdateProductPayload extends Partial<Omit<CreateProductPayload, 'variants' | 'images'>> {
    variants?: {
        id?: string;
        sku?: string;
        size?: string;
        color?: string;
        priceClp?: number;
        stock?: number;
    }[];
    images?: {
        id?: string;
        path?: string;
        altText?: string;
        sortOrder?: number;
        isPrimary?: boolean;
    }[];
}

export interface ProductFullDetail {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    categoryId: string | null;
    isFeatured: boolean;
    isActive: boolean;
    category: Category | null;
    variants: ProductVariant[];
    images: ProductImage[];
    createdAt: string;
    updatedAt: string;
}
