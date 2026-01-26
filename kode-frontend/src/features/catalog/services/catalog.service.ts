import { Category, ProductListItem, ProductDetail, PaginatedResponse, CatalogFilters } from '../types';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

export async function getCategories(): Promise<Category[]> {
    const res = await fetch(`${BACKEND_URL}/api/v1/catalog/categories`, {
        next: { revalidate: 3600 }, // Cache categories for 1 hour
    });
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
}

export async function getProducts(filters: CatalogFilters = {}): Promise<PaginatedResponse<ProductListItem>> {
    const query = new URLSearchParams();
    if (filters.categoryId) query.append('categoryId', filters.categoryId);
    if (filters.categorySlug) query.append('categorySlug', filters.categorySlug);
    if (filters.minPrice) query.append('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) query.append('maxPrice', filters.maxPrice.toString());
    if (filters.isFeatured !== undefined) query.append('isFeatured', filters.isFeatured.toString());
    if (filters.page) query.append('page', filters.page.toString());
    if (filters.limit) query.append('limit', filters.limit.toString());

    const res = await fetch(`${BACKEND_URL}/api/v1/catalog/products?${query.toString()}`, {
        next: { revalidate: 60 }, // Cache list for 1 minute
    });
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
}

export async function getProductBySlug(slug: string): Promise<ProductDetail> {
    const res = await fetch(`${BACKEND_URL}/api/v1/catalog/products/${slug}`, {
        next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error('Failed to fetch product');
    return res.json();
}
