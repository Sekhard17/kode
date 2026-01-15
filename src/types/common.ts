/**
 * Tipos Comunes/Compartidos
 */

// ============ PAGINATION ============

export interface PaginatedResponse<T> {
    items: T[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

// ============ ERRORS ============

export interface ErrorResponse {
    errors: string[];
}

// ============ API MESSAGES ============

export interface MessageResponse {
    message: string;
}

// ============ UTILITY TYPES ============

export type Nullable<T> = T | null;

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
