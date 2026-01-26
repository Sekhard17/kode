import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ProductGrid } from '@/features/catalog/components/ProductGrid';
import { ProductListItem } from '@/features/catalog/types';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

interface HomeViewProps {
    featuredProducts: ProductListItem[];
}

export function HomeView({ featuredProducts }: HomeViewProps) {
    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="relative h-[90vh] min-h-[600px] w-full overflow-hidden">
                <Image
                    src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2000"
                    alt="Hero Fashion"
                    fill
                    priority
                    className="object-cover brightness-[0.4]"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                    <div className="mb-6 inline-block bg-orange-500/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-orange-500/20">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500">New Era Collection</span>
                    </div>
                    <h1 className="max-w-4xl text-5xl md:text-8xl font-black italic tracking-tighter text-white mb-8 leading-[0.9]">
                        MODA CON <br />
                        <span className="text-orange-500">ACTITUD</span> KODE<span className="text-white">.</span>
                    </h1>
                    <p className="max-w-xl text-zinc-400 text-lg md:text-xl font-medium mb-10 leading-relaxed">
                        Explora nuestra nueva colección minimalista diseñada para destacar en la ciudad.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link href="/tienda">
                            <Button size="lg" className="h-14 px-10 bg-white hover:bg-zinc-200 text-black font-black uppercase tracking-widest rounded-2xl transition-all active:scale-95">
                                Comprar Ahora
                            </Button>
                        </Link>
                        <Link href="/tienda?categorySlug=polerones">
                            <Button size="lg" variant="outline" className="h-14 px-10 border-zinc-700 hover:bg-zinc-900 text-white font-black uppercase tracking-widest rounded-2xl transition-all">
                                Colecciones
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-2 animate-bounce">
                    <div className="h-10 w-[2px] bg-gradient-to-b from-transparent to-orange-500" />
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-sm font-black uppercase tracking-[0.4em] text-orange-500 mb-4">Highlights</h2>
                        <h3 className="text-4xl md:text-5xl font-black italic tracking-tighter text-white">LOS MÁS BUSCADOS</h3>
                    </div>
                    <Link href="/tienda" className="hidden sm:flex items-center text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors group">
                        Ver catálogo completo
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                <ProductGrid products={featuredProducts} />

                <div className="mt-12 sm:hidden text-center">
                    <Link href="/tienda">
                        <Button variant="outline" className="w-full h-14 border-zinc-800 rounded-2xl uppercase font-black tracking-widest">
                            Ver Todo
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Brand Ethos */}
            <section className="bg-zinc-900/40 border-y border-zinc-900 py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 lg:items-center gap-16">
                        <div className="relative aspect-square rounded-3xl overflow-hidden">
                            <Image
                                src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=800"
                                alt="Style"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                            <div className="absolute bottom-8 left-8 right-8 text-white">
                                <p className="text-4xl font-black italic tracking-tighter uppercase mb-2 leading-none">Diseño <br /> Atemporal</p>
                                <p className="text-zinc-300 text-sm max-w-xs leading-relaxed uppercase font-bold tracking-[0.1em]">Calidad que trasciende las tendencias rápidas.</p>
                            </div>
                        </div>
                        <div>
                            <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter text-white mb-8 leading-[1]">
                                NUESTRA <span className="text-orange-500">FILOSOFÍA</span>
                            </h2>
                            <div className="space-y-8">
                                {[
                                    { title: "Premium Sourcing", desc: "Utilizamos los mejores textiles para asegurar durabilidad y confort superior." },
                                    { title: "Minimalist Aesthetic", desc: "Menos es más. Diseños limpios que reflejan confianza y sobriedad urbana." },
                                    { title: "Limited Editions", desc: "No producimos en masa. Cada pieza es parte de una serie limitada y exclusiva." }
                                ].map((item, i) => (
                                    <div key={i} className="flex space-x-4">
                                        <span className="text-orange-500 text-lg font-black italic leading-none">0{i + 1}</span>
                                        <div>
                                            <h4 className="text-white font-black uppercase tracking-widest mb-2">{item.title}</h4>
                                            <p className="text-zinc-500 leading-relaxed text-sm">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
