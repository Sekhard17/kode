import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { getCookie, setCookie, deleteCookie } from 'cookies-next';

interface CartState {
    guestKey: string;
    cartCount: number;
    setCartCount: (count: number) => void;
    getGuestKey: () => string;
    clearGuestKey: () => void;
}

const GUEST_KEY_COOKIE = 'kode_guest_key';

export const useCartStore = create<CartState>()((set, get) => ({
    guestKey: (getCookie(GUEST_KEY_COOKIE) as string) || '',
    cartCount: 0,
    setCartCount: (count) => set({ cartCount: count }),
    getGuestKey: () => {
        let key = get().guestKey;

        if (!key) {
            key = uuidv4();
            set({ guestKey: key });
            setCookie(GUEST_KEY_COOKIE, key, {
                maxAge: 60 * 60 * 24 * 30, // 30 días
                path: '/',
                sameSite: 'lax',
            });
        }

        return key;
    },
    clearGuestKey: () => {
        deleteCookie(GUEST_KEY_COOKIE);
        set({ guestKey: '' });
    }
}));
