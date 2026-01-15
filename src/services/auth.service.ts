/**
 * Auth Service - Autenticación por Cookies HTTP-only
 * 
 * La autenticación se maneja completamente por cookies del lado del servidor.
 * No se almacena nada en localStorage.
 */

import api from './api';
import type {
    RegisterRequest,
    LoginRequest,
    UserDto
} from '../types';

// ============ ENDPOINTS ============

const AUTH_ENDPOINTS = {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    REFRESH: '/auth/refresh',
} as const;

// ============ RESPONSE TYPES ============

interface AuthUserResponse {
    user: UserDto;
}

interface MessageResponse {
    message: string;
}

// ============ SERVICIOS ============

/**
 * Registrar un nuevo usuario
 * La cookie se setea automáticamente por el backend
 */
export async function register(data: RegisterRequest): Promise<UserDto> {
    const response = await api.post<AuthUserResponse>(AUTH_ENDPOINTS.REGISTER, data);
    return response.data.user;
}

/**
 * Iniciar sesión
 * La cookie se setea automáticamente por el backend
 */
export async function login(data: LoginRequest): Promise<UserDto> {
    const response = await api.post<AuthUserResponse>(AUTH_ENDPOINTS.LOGIN, data);
    return response.data.user;
}

/**
 * Cerrar sesión
 * Elimina la cookie del servidor
 */
export async function logout(): Promise<void> {
    await api.post<MessageResponse>(AUTH_ENDPOINTS.LOGOUT);
}

/**
 * Obtener usuario actual (validar sesión)
 * Retorna null si no hay sesión válida
 */
export async function getCurrentUser(): Promise<UserDto | null> {
    try {
        const response = await api.get<UserDto>(AUTH_ENDPOINTS.ME);
        return response.data;
    } catch {
        return null;
    }
}

/**
 * Refrescar/extender la sesión
 */
export async function refreshSession(): Promise<boolean> {
    try {
        await api.post<MessageResponse>(AUTH_ENDPOINTS.REFRESH);
        return true;
    } catch {
        return false;
    }
}

/**
 * Verificar si hay sesión activa
 */
export async function isAuthenticated(): Promise<boolean> {
    const user = await getCurrentUser();
    return user !== null;
}

// ============ EXPORT ============

export const authService = {
    register,
    login,
    logout,
    getCurrentUser,
    refreshSession,
    isAuthenticated,
};
