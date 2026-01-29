'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useCartStore } from './store/useCartStore';
import { mergeGuestCart } from './services/cart.service';
import { useCart } from './hooks/useCart';

export function CartSync() {
    const { data: session } = useSession();
    const { guestKey, clearGuestKey } = useCartStore();
    const { refreshCart } = useCart();

    const accessToken = session?.accessToken;

    useEffect(() => {
        const sync = async () => {
            if (accessToken && guestKey) {
                try {
                    await mergeGuestCart(guestKey, accessToken);
                    // Limpiamos la cookie pero NO refrescamos si ya estamos en una página 
                    // que se encargará o que ya hizo el fetch (como el carrito SSR)
                    clearGuestKey();

                    // Solo refrescamos el contador global si NO estamos en la página de carrito
                    // (porque la página de carrito ya tiene sus propios datos frescos)
                    if (window.location.pathname !== '/carrito') {
                        refreshCart();
                    }
                } catch (error) {
                    console.error('Merge error:', error);
                }
            }
        };

        sync();
    }, [accessToken, guestKey]);

    return null;
}
