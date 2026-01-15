/**
 * KØDE Types - Barrel Export
 * 
 * Importa todos los tipos desde aquí:
 * import { ProductDto, Size, AuthResponse } from '@/types';
 */

// Enums y utilidades
export {
    Size,
    SizeLabels,
    SizeOptions,
    OrderStatus,
    OrderStatusLabels,
    OrderStatusColors,
    Role,
    RoleLabels
} from './enums';

// Auth
export type {
    UserDto,
    AuthResponse,
    RegisterRequest,
    LoginRequest
} from './auth';

// Products
export type {
    ProductListDto,
    ProductDto,
    ProductImageDto,
    ProductVariantDto,
    GetProductsParams,
    CreateProductRequest,
    CreateProductVariantDto
} from './products';

// Categories
export type {
    CategoryListDto,
    CategoryDto,
    CreateCategoryRequest
} from './categories';

// Cart
export type {
    CartDto,
    CartItemDto,
    AddToCartRequest,
    UpdateCartItemRequest
} from './cart';

// Orders
export type {
    OrderListDto,
    OrderDto,
    OrderItemDto,
    ShippingInfoDto,
    CreateOrderRequest,
    CreateOrderShippingDto,
    GetOrdersParams
} from './orders';

// Wishlist
export type {
    WishlistDto,
    WishlistItemDto
} from './wishlist';

// Common
export type {
    PaginatedResponse,
    ErrorResponse,
    MessageResponse,
    Nullable,
    Optional
} from './common';
