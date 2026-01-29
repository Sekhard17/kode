'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, LayoutGrid, ShoppingBag, User } from 'lucide-react';
import { useSession } from 'next-auth/react';

import { cn } from '@/lib/utils';
import { useCartStore } from '@/features/cart/store/useCartStore';
import { useAuthModal } from '@/features/auth/hooks/use-auth-modal';

type Item = {
  key: 'home' | 'shop' | 'cart' | 'profile';
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

const ITEMS: Item[] = [
  { key: 'home', href: '/', label: 'Inicio', icon: Home },
  { key: 'shop', href: '/tienda', label: 'Tienda', icon: LayoutGrid },
  { key: 'cart', href: '/carrito', label: 'Carrito', icon: ShoppingBag },
  { key: 'profile', href: '/cuenta', label: 'Perfil', icon: User },
];

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname.startsWith(href);
}

export function BottomNavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const { onOpen } = useAuthModal();
  const { cartCount } = useCartStore();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      aria-label="Navegación inferior"
    >
      <div className="border-t border-white/10 bg-black/85 backdrop-blur-2xl shadow-[0_-10px_40px_rgba(0,0,0,0.55)]">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-4 py-2">
            {ITEMS.map((item) => {
              const active = item.key === 'profile'
                ? pathname.startsWith('/cuenta')
                : isActive(pathname, item.href);
              const Icon = item.icon;

              const baseClasses =
                'relative flex flex-col items-center justify-center gap-1 py-1.5';
              const activeClasses = 'text-orange-400';
              const inactiveClasses = 'text-white/55 hover:text-white/85';

              const iconEl = (
                <span className="relative">
                  <Icon className="h-[22px] w-[22px]" />
                  {item.key === 'cart' && cartCount > 0 ? (
                    <span className="absolute -top-2 -right-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-black text-black ring-2 ring-black">
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  ) : null}
                </span>
              );

              const labelEl = (
                <span className={cn('text-[10px] font-semibold', active ? 'text-orange-400' : 'text-white/55')}>
                  {item.label}
                </span>
              );

              if (item.key === 'profile') {
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => (session ? router.push('/cuenta') : onOpen('login'))}
                    className={cn(baseClasses, active ? activeClasses : inactiveClasses)}
                    aria-label={session ? 'Perfil' : 'Iniciar sesión'}
                  >
                    {iconEl}
                    {labelEl}
                  </button>
                );
              }

              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={cn(baseClasses, active ? activeClasses : inactiveClasses)}
                  aria-label={item.label}
                >
                  {iconEl}
                  {labelEl}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
