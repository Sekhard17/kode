import { ProductListItem } from '../types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
    products: ProductListItem[];
}

export function ProductGrid({ products }: ProductGridProps) {
    if (products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center">
                <h3 className="text-2xl font-bold text-white mb-2">No se encontraron productos</h3>
                <p className="text-zinc-400 max-w-md">Prueba ajustando los filtros o revisa otras categorías.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-6">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
}
