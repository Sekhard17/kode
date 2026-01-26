import { z } from 'zod';

// Login schema
export const loginSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export type LoginInput = z.infer<typeof loginSchema>;

// Register schema
export const registerSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z
        .string()
        .min(8, 'La contraseña debe tener al menos 8 caracteres')
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            'La contraseña debe contener al menos una mayúscula, una minúscula y un número'
        ),
    confirmPassword: z.string(),
    firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').optional(),
    lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres').optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
});

export type RegisterInput = z.infer<typeof registerSchema>;

// Update profile schema
export const updateProfileSchema = z.object({
    firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').optional(),
    lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres').optional(),
    phone: z.string().regex(/^\+?[0-9]{9,15}$/, 'Número de teléfono inválido').optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

// Change password schema
export const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, 'La contraseña actual es requerida'),
    newPassword: z
        .string()
        .min(8, 'La contraseña debe tener al menos 8 caracteres')
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            'La contraseña debe contener al menos una mayúscula, una minúscula y un número'
        ),
    confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
});

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
