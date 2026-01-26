import { z } from 'zod';

// Category schema
export const categorySchema = z.object({
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    slug: z.string().min(2, 'El slug debe tener al menos 2 caracteres').regex(/^[a-z0-9-]+$/, 'Slug inválido (solo minúsculas, números y guiones)'),
    description: z.string().max(500).optional().nullable(),
    parentId: z.string().cuid().optional().nullable(),
    sortOrder: z.number().int().min(0).default(0),
    isActive: z.boolean().default(true),
});

export type CategoryInput = z.infer<typeof categorySchema>;

// Product image schema
export const productImageSchema = z.object({
    path: z.string().min(1, 'El path de la imagen es requerido'),
    altText: z.string().max(200).optional().nullable(),
    sortOrder: z.number().int().min(0).default(0),
    isPrimary: z.boolean().default(false),
});

export type ProductImageInput = z.infer<typeof productImageSchema>;

// Product variant schema
export const productVariantSchema = z.object({
    sku: z.string().min(1, 'El SKU es requerido').max(50),
    size: z.string().min(1, 'La talla es requerida'),
    color: z.string().optional().nullable(),
    priceClp: z.number().int().positive('El precio debe ser un número positivo'),
    stock: z.number().int().min(0, 'El stock no puede ser negativo').default(0),
    isActive: z.boolean().default(true),
});

export type ProductVariantInput = z.infer<typeof productVariantSchema>;

// Create product schema
export const createProductSchema = z.object({
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    slug: z.string().min(2, 'El slug debe tener al menos 2 caracteres').regex(/^[a-z0-9-]+$/, 'Slug inválido'),
    description: z.string().max(2000).optional().nullable(),
    detailsHtml: z.string().max(10000).optional().nullable(),
    categoryId: z.string().cuid('ID de categoría inválido').optional().nullable(),
    isActive: z.boolean().default(true),
    isFeatured: z.boolean().default(false),
    images: z.array(productImageSchema).optional(),
    variants: z.array(productVariantSchema).min(1, 'Debe tener al menos una variante'),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;

// Update product schema
export const updateProductSchema = createProductSchema.partial().extend({
    id: z.string().cuid(),
});

export type UpdateProductInput = z.infer<typeof updateProductSchema>;

// Product filters schema
export const productFiltersSchema = z.object({
    categoryId: z.string().cuid().optional(),
    categorySlug: z.string().optional(),
    minPrice: z.number().int().min(0).optional(),
    maxPrice: z.number().int().positive().optional(),
    sizes: z.array(z.string()).optional(),
    colors: z.array(z.string()).optional(),
    inStock: z.boolean().optional(),
    isFeatured: z.boolean().optional(),
    isActive: z.boolean().optional(),
    search: z.string().optional(),
    page: z.number().int().positive().default(1),
    limit: z.number().int().min(1).max(100).default(20),
    sortBy: z.enum(['name', 'priceClp', 'createdAt']).default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type ProductFiltersInput = z.infer<typeof productFiltersSchema>;
