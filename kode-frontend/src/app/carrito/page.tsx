import { CartView } from '@/features/cart/components/views/CartView';
import { auth } from '@/lib/auth';
import { cookies } from 'next/headers';
import { fetchCart } from '@/features/cart/services/cart.service';

export default async function CarritoPage() {
    const session = await auth();
    const cookieStore = await cookies();
    const guestKey = cookieStore.get('kode_guest_key')?.value;

    let initialCart = null;
    try {
        if (session?.accessToken || guestKey) {
            initialCart = await fetchCart(session?.accessToken, guestKey);
        }
    } catch (error) {
        console.error('Error fetching initial cart for SSR:', error);
    }

    return <CartView initialCart={initialCart} />;
}
