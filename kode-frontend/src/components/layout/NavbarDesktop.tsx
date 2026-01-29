'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Search, ShoppingBag, User, LayoutDashboard, Settings, LogOut, UserCircle } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useAuthModal } from '@/features/auth/hooks/use-auth-modal';
import { useCartStore } from '@/features/cart/store/useCartStore';

export type NavLink = { name: string; href: string; description?: string };

function isLinkActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  if (href.startsWith('/tienda')) return pathname.startsWith('/tienda');
  return pathname === href;
}

export function NavbarDesktop({
  isScrolled,
  links,
}: {
  isScrolled: boolean;
  links: NavLink[];
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const { onOpen } = useAuthModal();
  const { cartCount } = useCartStore();

  return (
    <div className="hidden md:flex h-20 items-center justify-between">
      <div className="flex items-center gap-6">
        <Link
          href="/"
          className="group flex items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
          aria-label="KODE"
        >
          <span className="relative inline-block h-8 w-[140px] lg:w-[150px]">
            <Image
              src="/LogoModoOscuro.png"
              alt="KODE"
              fill
              priority
              sizes="(min-width: 1024px) 150px, 140px"
              className="object-contain object-left opacity-95 transition-opacity group-hover:opacity-100"
            />
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-8">
        {links.map((link) => {
          const active = isLinkActive(pathname, link.href);
          return (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                'group relative text-[11px] font-semibold uppercase tracking-[0.22em] transition-colors',
                active ? 'text-white' : 'text-white/55 hover:text-white/90',
              )}
            >
              <span className="relative z-10">{link.name}</span>
              <span
                className={cn(
                  'pointer-events-none absolute left-0 top-full mt-2 h-px w-0 bg-gradient-to-r from-orange-500/0 via-orange-500/70 to-orange-500/0 transition-all duration-300',
                  active ? 'w-10' : 'group-hover:w-8',
                )}
              />
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-2">
        <div
          className={cn(
            'flex items-center gap-1 rounded-full border p-1 backdrop-blur-md transition-all duration-300',
            isScrolled ? 'bg-black/55 border-white/10' : 'bg-black/20 border-white/5',
          )}
        >
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full text-white/75 hover:text-white hover:bg-white/5"
            aria-label="Buscar"
          >
            <Search className="h-5 w-5" />
          </Button>

          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full text-white/75 hover:text-white hover:bg-white/5"
                  aria-label="Mi cuenta"
                >
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 bg-zinc-950/95 backdrop-blur-xl border-zinc-800 rounded-xl p-1"
              >
                {/* User Info */}
                <div className="px-3 py-2 mb-1">
                  <p className="text-sm font-medium text-white truncate">
                    {session.user?.name || 'Usuario'}
                  </p>
                  <p className="text-xs text-zinc-500 truncate">
                    {session.user?.email}
                  </p>
                </div>
                <DropdownMenuSeparator className="bg-zinc-800" />

                {/* Admin Link - Only for admins */}
                {session.user?.role === 'ADMIN' && (
                  <>
                    <DropdownMenuItem asChild className="cursor-pointer text-zinc-300 hover:text-white focus:text-white focus:bg-orange-500/10 rounded-lg">
                      <Link href="/admin" className="flex items-center gap-2">
                        <LayoutDashboard className="h-4 w-4 text-orange-500" />
                        Panel Admin
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-zinc-800" />
                  </>
                )}

                <DropdownMenuItem asChild className="cursor-pointer text-zinc-300 hover:text-white focus:text-white focus:bg-white/5 rounded-lg">
                  <Link href="/cuenta" className="flex items-center gap-2">
                    <UserCircle className="h-4 w-4" />
                    Mi Cuenta
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer text-zinc-300 hover:text-white focus:text-white focus:bg-white/5 rounded-lg">
                  <Link href="/cuenta/pedidos" className="flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4" />
                    Mis Pedidos
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer text-zinc-300 hover:text-white focus:text-white focus:bg-white/5 rounded-lg">
                  <Link href="/cuenta/configuracion" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Configuración
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-zinc-800" />

                <DropdownMenuItem
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="cursor-pointer text-zinc-400 hover:text-red-400 focus:text-red-400 focus:bg-red-500/10 rounded-lg"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full text-white/75 hover:text-white hover:bg-white/5"
              aria-label="Iniciar sesión"
              onClick={() => onOpen('login')}
            >
              <User className="h-5 w-5" />
            </Button>
          )}

          <Link href="/carrito" aria-label="Carrito">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="relative h-10 w-10 rounded-full text-white/75 hover:text-white hover:bg-white/5"
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 ? (
                <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-black text-black ring-2 ring-black">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              ) : null}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
