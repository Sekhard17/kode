'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useCartStore } from '../store/useCartStore';
import { fetchCart, updateCartItem, removeCartItem } from '../services/cart.service';
import { Cart } from '../types';
import { toast } from 'sonner';

export function useCart() {
    const { data: session } = useSession();
    const { getGuestKey, setCartCount } = useCartStore();
    const [cart, setCart] = useState<Cart | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const loadCart = async () => {
        try {
            setIsLoading(true);
            const guestKey = getGuestKey();
            const accessToken = (session?.user as any)?.accessToken;
            const data = await fetchCart(accessToken, guestKey);
            setCart(data);
            const totalItems = data.items.reduce((acc, item) => acc + item.quantity, 0);
            setCartCount(totalItems);
        } catch (error) {
            console.error('Error loading cart:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadCart();
    }, [session]);

    const updateQuantity = async (itemId: string, quantity: number) => {
        try {
            const accessToken = (session?.user as any)?.accessToken;
            await updateCartItem(itemId, quantity, accessToken);
            toast.success('Cantidad actualizada');
            loadCart();
        } catch (error: any) {
            toast.error(error.message || 'Error al actualizar');
        }
    };

    const removeItem = async (itemId: string) => {
        try {
            const accessToken = (session?.user as any)?.accessToken;
            await removeCartItem(itemId, accessToken);
            toast.success('Producto eliminado');
            loadCart();
        } catch (error: any) {
            toast.error(error.message || 'Error al eliminar');
        }
    };

    const subtotal = cart?.items.reduce(
        (acc, item) => acc + item.variant.priceClp * item.quantity,
        0
    ) || 0;

    return {
        cart,
        isLoading,
        updateQuantity,
        removeItem,
        subtotal,
        refreshCart: loadCart,
        getGuestKey,
    };
}
