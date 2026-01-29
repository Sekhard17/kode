'use server';

import { auth } from '@/lib/auth';
import {
    AdminProductListItem,
    PaginatedResponse,
    ProductFullDetail,
    CreateProductPayload,
    UpdateProductPayload,
} from '@/features/catalog/types';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

async function getAuthHeader(): Promise<HeadersInit> {
    const session = await auth();
    if (!session?.accessToken) {
        throw new Error('No autorizado');
    }
    return {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
    };
}

export async function getProductsAdmin(
    page = 1,
    limit = 30,
    search?: string
): Promise<PaginatedResponse<AdminProductListItem>> {
    const headers = await getAuthHeader();

    let url = `${BACKEND_URL}/api/v1/catalog/admin/products?page=${page}&limit=${limit}`;
    if (search) {
        url += `&search=${encodeURIComponent(search)}`;
    }

    const res = await fetch(url, {
        headers,
        cache: 'no-store',
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || 'Error al obtener productos');
    }

    return res.json();
}

export async function getProductById(id: string): Promise<ProductFullDetail> {
    const headers = await getAuthHeader();

    const res = await fetch(`${BACKEND_URL}/api/v1/catalog/admin/products/${id}`, {
        headers,
        cache: 'no-store',
    });

    if (!res.ok) {
        throw new Error('Producto no encontrado');
    }

    return res.json();
}

export async function createProduct(data: CreateProductPayload): Promise<ProductFullDetail> {
    const headers = await getAuthHeader();

    const res = await fetch(`${BACKEND_URL}/api/v1/catalog/admin/products`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || 'Error al crear producto');
    }

    return res.json();
}

export async function updateProduct(
    id: string,
    data: UpdateProductPayload
): Promise<ProductFullDetail> {
    const headers = await getAuthHeader();

    const res = await fetch(`${BACKEND_URL}/api/v1/catalog/admin/products/${id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || 'Error al actualizar producto');
    }

    return res.json();
}

export async function toggleProductActive(id: string): Promise<{ id: string; isActive: boolean }> {
    const headers = await getAuthHeader();

    const res = await fetch(
        `${BACKEND_URL}/api/v1/catalog/admin/products/${id}/toggle-active`,
        {
            method: 'PATCH',
            headers,
        }
    );

    if (!res.ok) {
        throw new Error('Error al cambiar estado del producto');
    }

    return res.json();
}

export async function uploadProductImage(formData: FormData): Promise<{ url: string; path: string }> {
    const session = await auth();
    if (!session?.accessToken) {
        throw new Error('No autorizado');
    }

    const res = await fetch(`${BACKEND_URL}/api/v1/storage/upload-product-image`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${session.accessToken}`,
        },
        body: formData,
    });

    if (!res.ok) {
        throw new Error('Error al subir imagen');
    }

    return res.json();
}
