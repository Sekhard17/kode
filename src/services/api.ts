/**
 * API Client Base - Axios Configuration
 * 
 * Cliente axios configurado para autenticación por cookies HTTP-only
 */

import axios, { type AxiosError, type AxiosInstance } from 'axios';
import type { ErrorResponse } from '../types';

// ============ CONFIGURACIÓN ============

const API_BASE_URL = 'http://localhost:5133/api';

// ============ CLIENTE AXIOS ============

const api: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
    // ⚠️ IMPORTANTE: Enviar cookies en todas las requests
    withCredentials: true,
});

// ============ INTERCEPTOR RESPONSE ============

api.interceptors.response.use(
    (response) => response,
    (error: AxiosError<ErrorResponse>) => {
        // Manejar errores de autenticación
        if (error.response?.status === 401) {
            // La cookie expiró o es inválida
            // El manejo se hace en el frontend según el contexto
        }
        return Promise.reject(error);
    }
);

// ============ HELPERS ============

/**
 * Extrae mensaje de error de la respuesta
 */
export function getErrorMessage(error: unknown): string {
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;
        if (axiosError.response?.data?.errors) {
            return axiosError.response.data.errors.join(', ');
        }
        return axiosError.message;
    }
    return 'Error desconocido';
}

/**
 * Verifica si un error es de autenticación
 */
export function isAuthError(error: unknown): boolean {
    if (axios.isAxiosError(error)) {
        return error.response?.status === 401;
    }
    return false;
}

export default api;
