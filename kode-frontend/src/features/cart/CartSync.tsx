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

    useEffect(() => {
        const sync = async () => {
            const accessToken = (session?.user as any)?.accessToken;
            if (accessToken && guestKey) {
                try {
                    await mergeGuestCart(guestKey, accessToken);
                    clearGuestKey();
                    refreshCart();
                } catch (error) {
                    console.error('Merge error:', error);
                }
            }
        };

        sync();
    }, [session, guestKey, clearGuestKey]);

    return null;
}
