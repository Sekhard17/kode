'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { StoreMosaic } from '@/features/catalog/components/StoreMosaic';
import type { ProductListItem } from '@/features/catalog/types';


export function HomeMosaicHero({ products }: { products: ProductListItem[] }) {
  return (
    <section className="hidden md:block bg-black relative overflow-hidden">
      {/* Subtle ambient glow */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-orange-500/[0.07] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[300px] bg-amber-500/[0.05] blur-[100px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left content */}
          <div className="lg:col-span-5 space-y-8 pt-4">
            <div>
              {/* Animated title with blur effect */}
              <h1 className="text-5xl lg:text-7xl font-black italic tracking-tighter leading-[0.9]">
                <motion.span
                  className="block text-white"
                  initial={{ filter: "blur(8px)", opacity: 0, y: 20 }}
                  animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                  transition={{ delay: 0, duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
                >
                  Decode
                </motion.span>
                <span className="mt-1 flex items-baseline gap-3">
                  <motion.span
                    className="bg-gradient-to-r from-orange-400 via-orange-500 to-amber-300 bg-clip-text text-transparent"
                    initial={{ filter: "blur(8px)", opacity: 0, y: 20 }}
                    animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
                  >
                    your
                  </motion.span>
                  <motion.span
                    className="text-white"
                    initial={{ filter: "blur(8px)", opacity: 0, y: 20 }}
                    animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
                  >
                    Style
                  </motion.span>
                </span>
              </h1>

              {/* Animated decorative line */}
              <motion.div
                className="mt-4 h-[2px] w-24 origin-left rounded-full bg-gradient-to-r from-orange-500 via-orange-400 to-transparent"
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5, ease: "easeOut" }}
              />

              <motion.p
                className="mt-8 max-w-md text-zinc-400 text-base lg:text-lg leading-relaxed"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                Descubre nuestra selección exclusiva de prendas con actitud.
                Diseño premium, calce perfecto.
              </motion.p>
            </div>

            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85, duration: 0.5 }}
            >
              <Link href="/tienda">
                <Button
                  size="lg"
                  className="h-14 px-8 bg-white hover:bg-zinc-100 text-black font-bold uppercase tracking-wider rounded-2xl transition-all hover:shadow-[0_8px_30px_rgba(255,255,255,0.15)] active:scale-[0.98]"
                >
                  Explorar tienda
                </Button>
              </Link>
              <Link href="/tienda?categorySlug=polerones">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 px-8 border-zinc-700 hover:border-zinc-600 hover:bg-white/[0.03] text-white font-bold uppercase tracking-wider rounded-2xl transition-all"
                >
                  Ver polerones
                </Button>
              </Link>
            </motion.div>

            <motion.div
              className="flex items-center gap-10 pt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              <div className="flex items-center gap-2.5">
                <span className="h-2 w-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]" />
                <span className="text-xs font-semibold uppercase tracking-widest text-white/50">
                  Envío express
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="h-2 w-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]" />
                <span className="text-xs font-semibold uppercase tracking-widest text-white/50">
                  Edición limitada
                </span>
              </div>
            </motion.div>
          </div>

          {/* Right mosaic */}
          <div className="lg:col-span-7">
            <StoreMosaic products={products} />
          </div>
        </div>
      </div>
    </section>
  );
}
