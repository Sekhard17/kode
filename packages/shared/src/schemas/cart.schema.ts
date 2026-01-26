import { z } from 'zod';

// Add to cart schema
export const addToCartSchema = z.object({
    variantId: z.string().uuid('ID de variante inválido'),
    quantity: z.number().int().positive('La cantidad debe ser mayor a 0'),
});

export type AddToCartInput = z.infer<typeof addToCartSchema>;

// Update cart item schema
export const updateCartItemSchema = z.object({
    itemId: z.string().uuid('ID de item inválido'),
    quantity: z.number().int().min(0, 'La cantidad no puede ser negativa'),
});

export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;

// Remove from cart schema
export const removeFromCartSchema = z.object({
    itemId: z.string().uuid('ID de item inválido'),
});

export type RemoveFromCartInput = z.infer<typeof removeFromCartSchema>;
