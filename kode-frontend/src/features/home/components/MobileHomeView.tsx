'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Heart, Search, SlidersHorizontal, User } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import type { Category, ProductListItem } from '@/features/catalog/types';
import { cn } from '@/lib/utils';

function initials(nameOrEmail: string) {
  const clean = nameOrEmail.trim();
  if (!clean) return 'K';
  const parts = clean.split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase()).join('') || 'K';
}

export function MobileHomeView({
  categories,
  featuredProducts,
}: {
  categories: Category[];
  featuredProducts: ProductListItem[];
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');

  const displayName = session?.user?.name || session?.user?.email || 'KODE';
  const subtitle = session ? 'Bienvenido de vuelta' : 'Explora la colección';
  const avatarText = useMemo(() => initials(displayName), [displayName]);

  const promoImage = featuredProducts[0]?.mainImage || null;

  return (
    <section className="md:hidden">
      <AnimatePresence>
        {searchOpen ? (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="fixed inset-x-0 top-20 z-50 px-4"
          >
            <div className="mx-auto max-w-7xl rounded-2xl border border-white/10 bg-black/70 p-3 backdrop-blur-xl shadow-[0_16px_60px_rgba(0,0,0,0.45)]">
              <form
                className="flex items-center gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSearchOpen(false);
                  const q = query.trim();
                  router.push(q ? `/tienda?search=${encodeURIComponent(q)}` : '/tienda');
                }}
              >
                <div className="flex flex-1 items-center gap-2 rounded-xl bg-white/5 px-3 py-2 ring-1 ring-white/10">
                  <Search className="h-4 w-4 text-white/70" />
                  <input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Buscar productos…"
                    className="w-full bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  className="h-10 rounded-xl px-3 text-sm font-semibold text-white/70 hover:bg-white/5"
                  onClick={() => setSearchOpen(false)}
                >
                  Cerrar
                </button>
                <button
                  type="submit"
                  className="h-10 rounded-xl bg-orange-500 px-4 text-sm font-black text-black hover:bg-orange-400"
                >
                  Buscar
                </button>
              </form>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="mx-auto max-w-7xl px-4 pt-6">
        <div className="rounded-[28px] border border-white/10 bg-black/40 backdrop-blur-xl shadow-[0_16px_80px_rgba(0,0,0,0.45)] overflow-hidden">
          <div className="px-5 pt-6 pb-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  type="button"
                  onClick={() => (session ? router.push('/cuenta') : router.push('/login'))}
                  className="relative h-11 w-11 overflow-hidden rounded-full bg-white/5 ring-1 ring-white/10 flex items-center justify-center text-white/90"
                  aria-label="Cuenta"
                >
                  {session?.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="44px"
                    />
                  ) : (
                    <span className="text-sm font-black">{avatarText}</span>
                  )}
                </button>
                <div className="min-w-0">
                  <p className="truncate text-base font-semibold leading-tight text-white">
                    {displayName}
                  </p>
                  <p className="truncate text-xs text-white/60">
                    {subtitle}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10 text-white/80 hover:bg-white/10"
                  aria-label="Buscar"
                  onClick={() => {
                    setSearchOpen(true);
                    setTimeout(() => inputRef.current?.focus(), 60);
                  }}
                >
                  <Search className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10 text-orange-200 hover:bg-white/10"
                  aria-label="Filtros"
                  onClick={() => router.push('/tienda')}
                >
                  <SlidersHorizontal className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="px-5 pb-6">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
                Categorías
              </p>
              <Link href="/tienda" className="text-xs font-semibold text-orange-600">
                Ver todo
              </Link>
            </div>

            <div className="mt-4 -mx-1 flex gap-3 overflow-x-auto px-1 pb-2">
              {categories.slice(0, 12).map((c) => (
                <Link
                  key={c.id}
                  href={`/tienda?categorySlug=${encodeURIComponent(c.slug)}`}
                  className="flex shrink-0 flex-col items-center gap-2"
                >
                  <div className="relative grid h-[68px] w-[68px] place-items-center rounded-full bg-white/5 ring-1 ring-white/10">
                    <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_20%,rgba(249,115,22,0.25),transparent_55%)]" />
                    <span className="relative text-lg font-black text-white">
                      {(c.name || 'K')[0]?.toUpperCase()}
                    </span>
                  </div>
                  <span className="max-w-[74px] truncate text-[12px] font-semibold text-white/75">
                    {c.name}
                  </span>
                </Link>
              ))}
            </div>

            <div className="mt-4 overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-[0_18px_60px_rgba(249,115,22,0.35)]">
              <div className="relative px-5 py-6">
                <p className="text-[28px] font-black leading-[1.05] tracking-tight">
                  <span className="block text-white/95">Decode</span>
                  <span className="mt-1 block">
                    <span className="text-white/90">your </span>
                    <span className="relative inline-block">
                      <span className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-800 bg-clip-text text-transparent">
                        Style
                      </span>
                      <span className="pointer-events-none absolute -bottom-2 left-0 h-[3px] w-14 rounded-full bg-white/70 shadow-[0_0_16px_rgba(255,255,255,0.22)]" />
                    </span>
                  </span>
                </p>
                <p className="mt-2 max-w-[220px] text-sm text-white/85">
                  Drops limitados, fit perfecto y calidad premium.
                </p>

                <div className="mt-4">
                  <Link
                    href="/tienda"
                    className="inline-flex h-11 items-center rounded-full bg-white px-5 text-sm font-black text-zinc-950 shadow-sm"
                  >
                    Ver detalles
                  </Link>
                </div>

                {promoImage ? (
                  <div className="pointer-events-none absolute -right-8 -bottom-6 h-[140px] w-[200px] opacity-95">
                    <Image
                      src={promoImage}
                      alt=""
                      fill
                      className="object-contain drop-shadow-[0_22px_40px_rgba(0,0,0,0.35)]"
                      sizes="200px"
                    />
                  </div>
                ) : null}
              </div>
            </div>

            <div className="mt-7 flex items-center justify-between">
              <h3 className="text-lg font-black text-white">Destacados</h3>
              <Link href="/tienda" className="text-sm font-semibold text-orange-400">
                Ver todo
              </Link>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              {featuredProducts.slice(0, 4).map((p) => (
                <Link
                  key={p.id}
                  href={`/producto/${p.slug}`}
                  className="group rounded-3xl bg-white/[0.04] ring-1 ring-white/10 shadow-sm overflow-hidden"
                >
                  <div className="relative aspect-[4/3] bg-black/30">
                    {p.mainImage ? (
                      <Image
                        src={p.mainImage}
                        alt={p.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    ) : null}
                    <button
                      type="button"
                      aria-label="Favorito"
                      onClick={(e) => e.preventDefault()}
                      className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-black/40 text-white/80 ring-1 ring-white/10 backdrop-blur hover:bg-black/55"
                    >
                      <Heart className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="p-4">
                    <p className="line-clamp-1 text-sm font-semibold text-white">
                      {p.name}
                    </p>
                    <p className="mt-1 text-sm font-black text-white">
                      ${p.minPriceClp.toLocaleString('es-CL')}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-white/60">
                        {p.categoryName || 'KODE'}
                      </span>
                      <span className="grid h-8 w-8 place-items-center rounded-full bg-orange-500 text-black font-black">
                        →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
