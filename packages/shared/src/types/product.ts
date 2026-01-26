// Category types
export interface Category {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    parentId: string | null;
    parent?: Category | null;
    children?: Category[];
}

// Product types
export interface Product {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    categoryId: string;
    category?: Category;
    isActive: boolean;
    images?: ProductImage[];
    variants?: ProductVariant[];
    createdAt: Date;
    updatedAt: Date;
}

export interface ProductImage {
    id: string;
    productId: string;
    url: string;
    alt: string | null;
    sortOrder: number;
}

export interface ProductVariant {
    id: string;
    productId: string;
    sku: string;
    size: string;
    color: string;
    priceCLP: number;
    stock: number;
}

// Product listing (catalog view)
export interface ProductListItem {
    id: string;
    name: string;
    slug: string;
    categoryId: string;
    categoryName: string;
    mainImage: string | null;
    minPriceCLP: number;
    maxPriceCLP: number;
    hasStock: boolean;
}
