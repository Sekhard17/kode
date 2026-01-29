'use client';

import Link from 'next/link';
import Image from 'next/image';
import { CreditCard, LogIn, LogOut, MapPin, Menu, Settings, Shield, ShoppingBag, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useAuthModal } from '@/features/auth/hooks/use-auth-modal';
import { useCartStore } from '@/features/cart/store/useCartStore';
import type { NavLink } from './NavbarDesktop';

export function NavbarMobile({
  isScrolled,
  links: _links,
}: {
  isScrolled: boolean;
  links: NavLink[];
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const { onOpen } = useAuthModal();
  const { cartCount } = useCartStore();

  return (
    <div className="flex md:hidden h-20 items-center justify-between">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={cn(
          'h-11 w-11 rounded-full text-white/80 hover:text-white hover:bg-white/5',
          isScrolled ? 'bg-black/20' : '',
        )}
        aria-label={session ? 'Mi cuenta' : 'Iniciar sesión'}
        onClick={() => (session ? router.push('/cuenta') : onOpen('login'))}
      >
        <User className="h-6 w-6" />
      </Button>

      <Link href="/" className="flex items-center" aria-label="KODE">
        <span className="relative inline-block h-8 w-[140px]">
          <Image
            src="/LogoModoOscuro.png"
            alt="KODE"
            fill
            priority
            sizes="140px"
            className="object-contain object-center opacity-95"
          />
        </span>
      </Link>

      <div className="flex items-center gap-2">
        <Link href="/carrito" aria-label="Carrito">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn(
              'relative h-11 w-11 rounded-full text-white/80 hover:text-white hover:bg-white/5',
              isScrolled ? 'bg-black/20' : '',
            )}
          >
            <ShoppingBag className="h-6 w-6" />
            {cartCount > 0 ? (
              <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-black text-black ring-2 ring-black">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            ) : null}
          </Button>
        </Link>

        <Sheet>
          <SheetTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={cn(
                'h-11 w-11 rounded-full text-white hover:bg-white/5',
                isScrolled ? 'bg-black/20' : '',
              )}
              aria-label="Abrir menú"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-black border-white/10 p-8 w-[300px]">
            <div className="mt-6">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white/90">
                    <User className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">
                      {session?.user?.name || session?.user?.email || 'Invitado'}
                    </p>
                    <p className="truncate text-xs text-white/60">
                      {session ? 'Cuenta, pedidos y direcciones' : 'Inicia sesión para comprar más rápido'}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  {session ? (
                    <>
                      <Button
                        type="button"
                        className="flex-1 rounded-full bg-white/10 text-white hover:bg-white/15"
                        onClick={() => router.push('/cuenta')}
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        Mi panel
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        className="rounded-full text-white/80 hover:text-white hover:bg-white/5"
                        onClick={() => signOut({ callbackUrl: '/' })}
                        aria-label="Cerrar sesión"
                      >
                        <LogOut className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <Button
                      type="button"
                      className="w-full rounded-full bg-orange-500 text-black hover:bg-orange-400"
                      onClick={() => onOpen('login')}
                    >
                      <LogIn className="mr-2 h-4 w-4" />
                      Iniciar sesión
                    </Button>
                  )}
                </div>

                {session ? (
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2 text-xs font-semibold text-white/80 hover:bg-white/[0.05]"
                      onClick={() => router.push('/cuenta?tab=pedidos')}
                    >
                      <CreditCard className="h-4 w-4" />
                      Mis pedidos
                    </button>
                    <button
                      type="button"
                      className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2 text-xs font-semibold text-white/80 hover:bg-white/[0.05]"
                      onClick={() => router.push('/cuenta?tab=direcciones')}
                    >
                      <MapPin className="h-4 w-4" />
                      Direcciones
                    </button>
                  </div>
                ) : null}

                {session?.user?.role === 'ADMIN' ? (
                  <button
                    type="button"
                    className="mt-3 flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2 text-left text-xs text-white/80 hover:bg-white/[0.05]"
                    onClick={() => router.push('/admin')}
                  >
                    <span className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-orange-500" />
                      Panel admin
                    </span>
                    <span className="text-white/40">→</span>
                  </button>
                ) : null}
              </div>

              <div className="mt-8">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/50">
                  Acciones rápidas
                </p>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className="rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3 text-left hover:bg-white/[0.05]"
                    onClick={() => router.push('/tienda')}
                  >
                    <span className="block text-sm font-semibold text-white">Explorar</span>
                    <span className="block text-xs text-white/60">Ver colección</span>
                  </button>
                  <button
                    type="button"
                    className="rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3 text-left hover:bg-white/[0.05]"
                    onClick={() => router.push('/carrito')}
                  >
                    <span className="block text-sm font-semibold text-white">Carrito</span>
                    <span className="block text-xs text-white/60">Revisar items</span>
                  </button>
                  {session ? (
                    <>
                      <button
                        type="button"
                        className="rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3 text-left hover:bg-white/[0.05]"
                        onClick={() => router.push('/cuenta?tab=pedidos')}
                      >
                        <span className="block text-sm font-semibold text-white">Pedidos</span>
                        <span className="block text-xs text-white/60">Estado y tracking</span>
                      </button>
                      <button
                        type="button"
                        className="rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3 text-left hover:bg-white/[0.05]"
                        onClick={() => router.push('/cuenta?tab=direcciones')}
                      >
                        <span className="block text-sm font-semibold text-white">Direcciones</span>
                        <span className="block text-xs text-white/60">Para checkout</span>
                      </button>
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
