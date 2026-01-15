/**
 * Tipos de Autenticación
 */

export interface UserDto {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
}

export interface AuthResponse {
    token: string;
    user: UserDto;
}

// ============ REQUEST TYPES ============

export interface RegisterRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}
