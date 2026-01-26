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
