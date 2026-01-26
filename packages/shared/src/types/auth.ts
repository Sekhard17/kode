// User types
export type Role = 'ADMIN' | 'CUSTOMER';

export interface User {
    id: string;
    email: string;
    role: Role;
    firstName: string | null;
    lastName: string | null;
    phone: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserWithoutPassword extends Omit<User, 'password'> { }

// Auth types
export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken?: string;
}

export interface JwtPayload {
    sub: string;
    email: string;
    role: Role;
    iat?: number;
    exp?: number;
}
