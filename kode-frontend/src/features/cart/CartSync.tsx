'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useCartStore } from './store/useCartStore';
import { mergeGuestCart } from './services/cart.service';
import { useCart } from './hooks/useCart';

export function CartSync() {
    const { data: session } = useSession();
    const { guestKey } = useCartStore();
    const { refreshCart } = useCart();

    useEffect(() => {
        const sync = async () => {
            const accessToken = (session?.user as any)?.accessToken;
            if (accessToken && guestKey) {
                try {
                    await mergeGuestCart(guestKey, accessToken);
                    // Opcional: limpiar guestKey después de merge si se desea, 
                    // pero aquí el servidor ya borró el carrito de invitado.
                    refreshCart();
                } catch (error) {
                    console.error('Merge error:', error);
                }
            }
        };

        sync();
    }, [session, guestKey]);

    return null;
}
