// Re-export all types
export * from './types';

// Re-export schemas - using explicit names to avoid conflicts with types
export {
    // Auth schemas
    loginSchema,
    registerSchema,
    updateProfileSchema,
    changePasswordSchema,
    type LoginInput,
    type RegisterInput,
    type UpdateProfileInput,
    type ChangePasswordInput,
    // Product schemas
    categorySchema,
    productImageSchema,
    productVariantSchema,
    createProductSchema,
    updateProductSchema,
    productFiltersSchema,
    type CategoryInput,
    type ProductImageInput,
    type ProductVariantInput,
    type CreateProductInput,
    type UpdateProductInput,
    type ProductFiltersInput,
    // Cart schemas
    addToCartSchema,
    updateCartItemSchema,
    removeFromCartSchema,
    type AddToCartInput as AddToCartSchemaInput,
    type UpdateCartItemInput as UpdateCartItemSchemaInput,
    type RemoveFromCartInput,
    // Order schemas
    chileanRegions,
    type ChileanRegion,
    addressSchema,
    shippingAddressSchema,
    createOrderSchema,
    orderStatusSchema,
    updateOrderStatusSchema,
    couponTypeSchema,
    createCouponSchema,
    validateCouponSchema,
    type AddressInput,
    type ShippingAddressInput,
    type CreateOrderSchemaInput,
    type OrderStatusInput,
    type UpdateOrderStatusInput,
    type CreateCouponInput,
    type ValidateCouponInput,
} from './schemas';
