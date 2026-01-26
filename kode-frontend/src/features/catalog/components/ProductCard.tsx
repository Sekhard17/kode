import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProductListItem } from '../types';

interface ProductCardProps {
    product: ProductListItem;
}

export function ProductCard({ product }: ProductCardProps) {
    const priceRange = product.minPriceClp === product.maxPriceClp
        ? `$${product.minPriceClp.toLocaleString('es-CL')}`
        : `$${product.minPriceClp.toLocaleString('es-CL')} - $${product.maxPriceClp.toLocaleString('es-CL')}`;

    return (
        <Link href={`/producto/${product.slug}`} className="group">
            <Card className="overflow-hidden border-none bg-zinc-900 transition-all duration-300 hover:ring-2 hover:ring-orange-500/50 shadow-lg">
                <div className="relative aspect-[3/4] overflow-hidden">
                    {product.mainImage ? (
                        <Image
                            src={product.mainImage}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    ) : (
                        <div className="h-full w-full bg-zinc-800 flex items-center justify-center">
                            <span className="text-zinc-500">No image</span>
                        </div>
                    )}

                    {product.isFeatured && (
                        <Badge className="absolute top-3 left-3 bg-orange-500 hover:bg-orange-600 border-none px-3 py-1 text-xs font-bold uppercase tracking-wider text-black">
                            Featured
                        </Badge>
                    )}

                    {!product.hasStock && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[2px]">
                            <Badge variant="outline" className="border-zinc-400 text-zinc-400 font-bold uppercase px-4 py-2">
                                Agotado
                            </Badge>
                        </div>
                    )}
                </div>

                <CardContent className="p-4 bg-gradient-to-b from-zinc-900 to-black">
                    <div className="mb-1 text-xs font-semibold uppercase tracking-tighter text-zinc-500">
                        {product.categoryName || 'General'}
                    </div>
                    <h3 className="line-clamp-1 text-base font-bold text-white transition-colors group-hover:text-orange-400">
                        {product.name}
                    </h3>
                </CardContent>

                <CardFooter className="px-4 pb-4 pt-0 bg-black flex justify-between items-center">
                    <span className="text-lg font-black text-white italic tracking-tighter">
                        {priceRange}
                    </span>
                    <div className="h-1 w-8 bg-zinc-800 group-hover:bg-orange-500 transition-colors rounded-full" />
                </CardFooter>
            </Card>
        </Link>
    );
}
