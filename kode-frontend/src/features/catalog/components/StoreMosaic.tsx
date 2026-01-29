import Link from 'next/link';
import Image from 'next/image';

import type { ProductListItem } from '../types';
import { cn } from '@/lib/utils';

function formatPriceRange(product: ProductListItem) {
  if (product.minPriceClp === product.maxPriceClp) {
    return `$${product.minPriceClp.toLocaleString('es-CL')}`;
  }
  return `$${product.minPriceClp.toLocaleString('es-CL')} – $${product.maxPriceClp.toLocaleString('es-CL')}`;
}

function Tile({
  product,
  className,
  priority,
}: {
  product: ProductListItem;
  className: string;
  priority?: boolean;
}) {
  return (
    <Link
      href={`/producto/${product.slug}`}
      className={cn(
        'group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] shadow-[0_16px_60px_rgba(0,0,0,0.35)]',
        className,
      )}
    >
      <div className="absolute inset-0">
        {product.mainImage ? (
          <Image
            src={product.mainImage}
            alt={product.name}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 520px, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-zinc-900 to-black" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(60%_80%_at_50%_0%,rgba(249,115,22,0.12),transparent_55%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>

      <div className="relative flex h-full flex-col justify-end p-6">
        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/55">
              {product.categoryName || 'KODE'}
            </p>
            <p className="mt-2 line-clamp-2 text-lg font-black italic tracking-tighter text-white">
              {product.name}
            </p>
            <p className="mt-2 text-sm font-extrabold text-orange-200">
              {formatPriceRange(product)}
            </p>
          </div>

          <div className="hidden lg:grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.06] text-white/80 transition-colors group-hover:bg-orange-500 group-hover:text-black">
            <span className="text-base font-black">↗</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function StoreMosaic({ products }: { products: ProductListItem[] }) {
  const items = products.slice(0, 4);
  if (items.length < 3) return null;

  const [a, b, c, d] = items;

  return (
    <div className="grid grid-cols-4 grid-rows-2 gap-4">
      <Tile product={a} className="col-span-2 row-span-2 min-h-[480px]" priority />
      {b ? <Tile product={b} className="col-span-2 row-span-1 min-h-[230px]" /> : null}
      {c ? <Tile product={c} className="col-span-1 row-span-1 min-h-[230px]" /> : null}
      {d ? <Tile product={d} className="col-span-1 row-span-1 min-h-[230px]" /> : null}
    </div>
  );
}
