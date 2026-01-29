'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useCartStore } from '../store/useCartStore';
import { fetchCart, updateCartItem, removeCartItem } from '../services/cart.service';
import { Cart } from '../types';
import { toast } from 'sonner';

export function useCart(initialCart: Cart | null = null) {
    const { data: session, status } = useSession();
    const { guestKey, getGuestKey, setCartCount } = useCartStore();
    const [cart, setCart] = useState<Cart | null>(initialCart);
    const [isLoading, setIsLoading] = useState(!initialCart);

    // Sincronizar contador si tenemos initialCart
    useEffect(() => {
        if (initialCart) {
            const totalItems = initialCart.items.reduce((acc, item) => acc + item.quantity, 0);
            setCartCount(totalItems);
        }
    }, [initialCart]);

    const loadCart = async (showLoading = true) => {
        try {
            if (showLoading) setIsLoading(true);
            const accessToken = session?.accessToken;

            // Si no hay usuario logueado ni guestKey, no hay carrito que buscar
            // Retornamos un carrito vacío para invitados nuevos
            if (!accessToken && !guestKey) {
                setCart({ id: '', userId: null, guestKey: null, items: [] });
                setCartCount(0);
                return;
            }

            const data = await fetchCart(accessToken, guestKey || undefined);
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
        // Reducimos a un solo fetch: si ya tenemos initialCart (SSR), no pedimos nada en el cliente
        // al montar. Solo cargamos si no se pasaron datos iniciales.
        if (!initialCart) {
            loadCart(true);
        }
    }, []); // Solo al montar

    const updateQuantity = async (itemId: string, quantity: number) => {
        try {
            const accessToken = session?.accessToken;
            await updateCartItem(itemId, quantity, accessToken);
            toast.success('Cantidad actualizada');
            loadCart();
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error al actualizar';
            toast.error(message);
        }
    };

    const removeItem = async (itemId: string) => {
        try {
            const accessToken = session?.accessToken;
            await removeCartItem(itemId, accessToken);
            toast.success('Producto eliminado');
            loadCart();
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error al eliminar';
            toast.error(message);
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
        guestKey,
    };
}
