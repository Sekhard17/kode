import { getProductBySlug } from '@/features/catalog/services/catalog.service';
import { ProductDetailView } from '@/features/catalog/components/views/ProductDetailView';
import { notFound } from 'next/navigation';

interface ProductPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { slug } = await params;

    try {
        const product = await getProductBySlug(slug);
        return <ProductDetailView product={product} />;
    } catch (error) {
        console.error('Error loading product:', error);
        notFound();
    }
}
