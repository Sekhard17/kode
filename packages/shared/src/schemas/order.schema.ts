import { z } from 'zod';

// Chilean regions
export const chileanRegions = [
    'Arica y Parinacota',
    'Tarapacá',
    'Antofagasta',
    'Atacama',
    'Coquimbo',
    'Valparaíso',
    'Metropolitana',
    "O'Higgins",
    'Maule',
    'Ñuble',
    'Biobío',
    'La Araucanía',
    'Los Ríos',
    'Los Lagos',
    'Aysén',
    'Magallanes',
] as const;

// Shipping address schema
export const shippingAddressSchema = z.object({
    firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
    address: z.string().min(5, 'La dirección debe tener al menos 5 caracteres'),
    addressLine2: z.string().optional(),
    city: z.string().min(2, 'La ciudad es requerida'),
    region: z.enum(chileanRegions, { message: 'Selecciona una región válida' }),
    postalCode: z.string().regex(/^[0-9]{7}$/, 'Código postal inválido (7 dígitos)'),
    phone: z.string().regex(/^\+?56[0-9]{9}$/, 'Número de teléfono inválido'),
});

export type ShippingAddressInput = z.infer<typeof shippingAddressSchema>;

// Create order schema
export const createOrderSchema = z.object({
    shippingMethodId: z.string().uuid('Método de envío inválido'),
    shippingAddress: shippingAddressSchema,
    couponCode: z.string().optional(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;

// Order status enum for updates (admin)
export const orderStatusSchema = z.enum([
    'PENDING',
    'PAID',
    'PROCESSING',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED',
]);

export type OrderStatusInput = z.infer<typeof orderStatusSchema>;

// Update order status schema (admin)
export const updateOrderStatusSchema = z.object({
    orderId: z.string().uuid('ID de orden inválido'),
    status: orderStatusSchema,
    trackingNumber: z.string().optional(),
    notes: z.string().optional(),
});

export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;

// Coupon schema (admin)
export const createCouponSchema = z.object({
    code: z.string().min(3, 'El código debe tener al menos 3 caracteres').max(20).toUpperCase(),
    discountType: z.enum(['PERCENTAGE', 'FIXED']),
    discountValue: z.number().positive('El valor del descuento debe ser positivo'),
    minOrderCLP: z.number().int().min(0).optional().nullable(),
    maxUses: z.number().int().positive().optional().nullable(),
    expiresAt: z.string().datetime().optional().nullable(),
    isActive: z.boolean().default(true),
}).refine((data) => {
    if (data.discountType === 'PERCENTAGE' && data.discountValue > 100) {
        return false;
    }
    return true;
}, {
    message: 'El porcentaje no puede ser mayor a 100',
    path: ['discountValue'],
});

export type CreateCouponInput = z.infer<typeof createCouponSchema>;
