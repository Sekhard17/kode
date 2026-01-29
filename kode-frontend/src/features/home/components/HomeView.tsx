import Image from 'next/image';
import { Category, ProductListItem } from '@/features/catalog/types';
import { MobileHomeView } from './MobileHomeView';
import { HomeMosaicHero } from './HomeMosaicHero';
import { NewProductsSection } from './NewProductsSection';

interface HomeViewProps {
    newestProducts: ProductListItem[];
    highlightProducts: ProductListItem[];
    categories: Category[];
}

export function HomeView({ newestProducts, highlightProducts, categories }: HomeViewProps) {
    return (
        <div className="flex flex-col">
            <MobileHomeView categories={categories} featuredProducts={newestProducts} />

            <HomeMosaicHero products={highlightProducts} />

            {/* New Products Section - Desktop Only */}
            <NewProductsSection products={newestProducts} />

            {/* Brand Ethos */}
            <section className="bg-zinc-900/40 border-y border-zinc-900 py-24 hidden md:block">
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

