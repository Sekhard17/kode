import { z } from 'zod';

// Category schema
export const categorySchema = z.object({
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    slug: z.string().min(2, 'El slug debe tener al menos 2 caracteres').regex(/^[a-z0-9-]+$/, 'Slug inválido'),
    description: z.string().optional(),
    parentId: z.string().uuid().optional().nullable(),
});

export type CategoryInput = z.infer<typeof categorySchema>;

// Product image schema
export const productImageSchema = z.object({
    url: z.string().url('URL inválida'),
    alt: z.string().optional(),
    sortOrder: z.number().int().min(0).default(0),
});

// Product variant schema
export const productVariantSchema = z.object({
    sku: z.string().min(1, 'El SKU es requerido'),
    size: z.string().min(1, 'La talla es requerida'),
    color: z.string().min(1, 'El color es requerido'),
    priceCLP: z.number().int().positive('El precio debe ser un número positivo'),
    stock: z.number().int().min(0, 'El stock no puede ser negativo').default(0),
});

export type ProductVariantInput = z.infer<typeof productVariantSchema>;

// Create product schema
export const createProductSchema = z.object({
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    slug: z.string().min(2, 'El slug debe tener al menos 2 caracteres').regex(/^[a-z0-9-]+$/, 'Slug inválido'),
    description: z.string().optional(),
    categoryId: z.string().uuid('ID de categoría inválido'),
    isActive: z.boolean().default(true),
    images: z.array(productImageSchema).optional(),
    variants: z.array(productVariantSchema).min(1, 'Debe tener al menos una variante'),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;

// Update product schema
export const updateProductSchema = createProductSchema.partial().extend({
    id: z.string().uuid(),
});

export type UpdateProductInput = z.infer<typeof updateProductSchema>;

// Product filters schema
export const productFiltersSchema = z.object({
    categoryId: z.string().uuid().optional(),
    minPrice: z.number().int().min(0).optional(),
    maxPrice: z.number().int().positive().optional(),
    sizes: z.array(z.string()).optional(),
    colors: z.array(z.string()).optional(),
    inStock: z.boolean().optional(),
    search: z.string().optional(),
    page: z.number().int().positive().default(1),
    limit: z.number().int().min(1).max(100).default(20),
    sortBy: z.enum(['name', 'price', 'createdAt']).default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type ProductFiltersInput = z.infer<typeof productFiltersSchema>;
