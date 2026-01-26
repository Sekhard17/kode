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

export type ChileanRegion = typeof chileanRegions[number];

// Address schema
export const addressSchema = z.object({
    label: z.string().max(50).optional(),
    fullName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    phone: z.string().regex(/^\+?56[0-9]{9}$/, 'Número de teléfono inválido (ej: +56912345678)'),
    email: z.string().email('Email inválido').optional(),
    region: z.enum(chileanRegions, { message: 'Selecciona una región válida' }),
    city: z.string().min(2, 'La ciudad es requerida'),
    commune: z.string().min(2, 'La comuna es requerida'),
    addressLine: z.string().min(5, 'La dirección debe tener al menos 5 caracteres'),
    addressLine2: z.string().optional(),
    reference: z.string().max(200).optional(),
    isDefault: z.boolean().default(false),
});

export type AddressInput = z.infer<typeof addressSchema>;

// Shipping address for checkout (subset without label/isDefault)
export const shippingAddressSchema = z.object({
    fullName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    phone: z.string().regex(/^\+?56[0-9]{9}$/, 'Número de teléfono inválido'),
    email: z.string().email('Email inválido').optional(),
    region: z.enum(chileanRegions, { message: 'Selecciona una región válida' }),
    city: z.string().min(2, 'La ciudad es requerida'),
    commune: z.string().min(2, 'La comuna es requerida'),
    addressLine: z.string().min(5, 'La dirección debe tener al menos 5 caracteres'),
    addressLine2: z.string().optional(),
    reference: z.string().max(200).optional(),
});

export type ShippingAddressInput = z.infer<typeof shippingAddressSchema>;

// Order status enum
export const orderStatusSchema = z.enum([
    'CREATED',
    'PAYMENT_PENDING',
    'PAID',
    'PREPARING',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED',
    'REFUNDED',
]);

export type OrderStatusInput = z.infer<typeof orderStatusSchema>;

// Create order schema
export const createOrderSchema = z.object({
    // Customer info
    customerName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    customerEmail: z.string().email('Email inválido'),
    customerPhone: z.string().regex(/^\+?56[0-9]{9}$/, 'Número de teléfono inválido').optional(),
    // Shipping address
    shipRegion: z.enum(chileanRegions, { message: 'Selecciona una región válida' }),
    shipCity: z.string().min(2, 'La ciudad es requerida'),
    shipCommune: z.string().min(2, 'La comuna es requerida'),
    shipAddress1: z.string().min(5, 'La dirección debe tener al menos 5 caracteres'),
    shipAddress2: z.string().optional(),
    shipReference: z.string().max(200).optional(),
    // Shipping method
    shippingMethodId: z.string().cuid('Método de envío inválido'),
    // Coupon
    couponCode: z.string().max(20).optional(),
    // Notes
    notes: z.string().max(500).optional(),
});

export type CreateOrderSchemaInput = z.infer<typeof createOrderSchema>;

// Update order status schema (admin)
export const updateOrderStatusSchema = z.object({
    orderId: z.string().cuid('ID de orden inválido'),
    status: orderStatusSchema,
    trackingCode: z.string().max(100).optional(),
    trackingUrl: z.string().url('URL de tracking inválida').optional(),
    notes: z.string().max(500).optional(),
});

export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;

// Coupon type enum
export const couponTypeSchema = z.enum(['PERCENT', 'FIXED']);

// Create coupon schema (admin)
export const createCouponSchema = z.object({
    code: z.string().min(3, 'El código debe tener al menos 3 caracteres').max(20).toUpperCase(),
    type: couponTypeSchema,
    value: z.number().positive('El valor del descuento debe ser positivo'),
    minSubtotalClp: z.number().int().min(0).optional().nullable(),
    maxRedemptions: z.number().int().positive().optional().nullable(),
    maxPerUser: z.number().int().positive().optional().nullable(),
    startsAt: z.string().datetime().optional().nullable(),
    endsAt: z.string().datetime().optional().nullable(),
    isActive: z.boolean().default(true),
}).refine((data) => {
    if (data.type === 'PERCENT' && data.value > 100) {
        return false;
    }
    return true;
}, {
    message: 'El porcentaje no puede ser mayor a 100',
    path: ['value'],
});

export type CreateCouponInput = z.infer<typeof createCouponSchema>;

// Validate coupon schema
export const validateCouponSchema = z.object({
    code: z.string().min(1, 'El código es requerido'),
    subtotalClp: z.number().int().positive(),
});

export type ValidateCouponInput = z.infer<typeof validateCouponSchema>;
