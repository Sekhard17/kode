// API Response wrapper
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: ApiError;
    meta?: PaginationMeta;
}

export interface ApiError {
    code: string;
    message: string;
    details?: Record<string, string[]>;
}

export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}

// Pagination input
export interface PaginationInput {
    page?: number;
    limit?: number;
}

// Sort input
export interface SortInput {
    field: string;
    order: 'asc' | 'desc';
}

// Common filter inputs
export interface ProductFilters {
    categoryId?: string;
    minPrice?: number;
    maxPrice?: number;
    sizes?: string[];
    colors?: string[];
    inStock?: boolean;
    search?: string;
}

export interface OrderFilters {
    status?: string;
    startDate?: Date;
    endDate?: Date;
    search?: string;
}
