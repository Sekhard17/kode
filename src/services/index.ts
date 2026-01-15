/**
 * KØDE Services - Barrel Export
 * 
 * Importa todos los servicios desde aquí:
 * import { authService, productsService } from '@/services';
 */

// API Client y helpers
export {
    default as api,
    getErrorMessage,
    isAuthError
} from './api';

// Services
export { authService, register, login, logout, getCurrentUser, refreshSession, isAuthenticated } from './auth.service';
export { productsService, getProducts, getProductById, getProductBySlug, getFeaturedProducts, searchProducts, getProductsByCategory } from './products.service';
export { categoriesService, getCategories, getCategoryById, getCategoryBySlug } from './categories.service';
export { cartService, getCart, addToCart, updateCartItem, removeFromCart, clearCart, getCartCount } from './cart.service';
export { ordersService, getMyOrders, getOrderById, createOrder, getLatestOrder } from './orders.service';
export { wishlistService, getWishlist, addToWishlist, removeFromWishlist, isInWishlist, toggleWishlist, getWishlistCount } from './wishlist.service';
