import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

interface CartState {
    guestKey: string;
    cartCount: number;
    setCartCount: (count: number) => void;
    getGuestKey: () => string;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            guestKey: '',
            cartCount: 0,
            setCartCount: (count) => set({ cartCount: count }),
            getGuestKey: () => {
                let key = get().guestKey;
                if (!key) {
                    key = uuidv4();
                    set({ guestKey: key });
                }
                return key;
            },
        }),
        {
            name: 'kode-cart-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
