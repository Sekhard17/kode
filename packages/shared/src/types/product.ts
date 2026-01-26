// Category types
export interface Category {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    parentId: string | null;
    sortOrder: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface CategoryWithChildren extends Category {
    parent?: Category | null;
    children?: Category[];
}

// Product types
export interface Product {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    detailsHtml: string | null;
    categoryId: string | null;
    isActive: boolean;
    isFeatured: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface ProductImage {
    id: string;
    productId: string;
    path: string;
    altText: string | null;
    sortOrder: number;
    isPrimary: boolean;
    createdAt: Date;
}

export interface ProductVariant {
    id: string;
    productId: string;
    sku: string;
    size: string;
    color: string | null;
    priceClp: number;
    stock: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// Full product with relations
export interface ProductWithDetails extends Product {
    category?: Category | null;
    images: ProductImage[];
    variants: ProductVariant[];
}

// Product listing (catalog view) - optimized for lists
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

// Available sizes/colors for product
export interface ProductVariantOptions {
    sizes: string[];
    colors: string[];
}
