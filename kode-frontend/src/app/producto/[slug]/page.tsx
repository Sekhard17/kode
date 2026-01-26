import { getProductBySlug } from '@/features/catalog/services/catalog.service';
import { ProductDetails } from '@/features/catalog/components/ProductDetails';
import { notFound } from 'next/navigation';
import { Separator } from '@/components/ui/separator';

interface ProductPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { slug } = await params;

    try {
        const product = await getProductBySlug(slug);

        return (
            <div className="min-h-screen bg-black pt-12 pb-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <ProductDetails product={product} />

                    <div className="mt-24">
                        <h3 className="text-2xl font-black italic tracking-tighter text-white mb-8 border-l-4 border-orange-500 pl-4 uppercase">
                            Especificaciones Técnicas
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-zinc-900/50 p-8 rounded-3xl border border-zinc-800">
                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-zinc-500 text-xs font-black uppercase tracking-widest mb-2">Construcción</h4>
                                    <p className="text-white text-sm leading-relaxed">Costuras reforzadas en puntos críticos para máxima durabilidad en uso diario.</p>
                                </div>
                                <div>
                                    <h4 className="text-zinc-500 text-xs font-black uppercase tracking-widest mb-2">Materiales</h4>
                                    <p className="text-white text-sm leading-relaxed">Tejido desarrollado exclusivamente para KODE con tecnología Ready-To-Wear.</p>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-zinc-500 text-xs font-black uppercase tracking-widest mb-2">Cuidados</h4>
                                    <p className="text-white text-sm leading-relaxed">Lavar en frío, no usar secadora (para preservar el fit y gramaje original).</p>
                                </div>
                                <div>
                                    <h4 className="text-zinc-500 text-xs font-black uppercase tracking-widest mb-2">Fit</h4>
                                    <p className="text-white text-sm leading-relaxed">Corte diseñado para favorecer la silueta manteniendo la libertad de movimiento.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        notFound();
    }
}
