import type { Metadata } from 'next';
import { Package, ShoppingCart, DollarSign, Users, TrendingUp } from 'lucide-react';
import { StatsCard } from '@/features/dashboard/components/StatsCard';
import { getProducts } from '@/features/catalog/services/catalog.service';
import { getCategories } from '@/features/catalog/services/catalog.service';

export const metadata: Metadata = {
    title: 'Dashboard | KODE Admin',
    description: 'Panel de administración KODE',
};

export default async function AdminDashboardPage() {
    // Fetch real data from the catalog
    const [productsData, categories] = await Promise.all([
        getProducts({ limit: 100, page: 1 }),
        getCategories(),
    ]);

    const totalProducts = productsData.items.length;
    const inStockProducts = productsData.items.filter(p => p.hasStock).length;
    const featuredProducts = productsData.items.filter(p => p.isFeatured).length;
    const totalCategories = categories.length;

    // Calculate average price
    const avgPrice = productsData.items.length > 0
        ? Math.round(productsData.items.reduce((sum, p) => sum + p.minPriceClp, 0) / productsData.items.length)
        : 0;

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-black text-white">
                        Panel de Control
                    </h2>
                    <p className="text-zinc-400 mt-1">
                        Resumen de tu tienda KODE
                    </p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:gap-6 grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Total Productos"
                    value={totalProducts}
                    icon={Package}
                />
                <StatsCard
                    title="En Stock"
                    value={inStockProducts}
                    change={totalProducts > 0 ? {
                        value: Math.round((inStockProducts / totalProducts) * 100),
                        type: 'increase',
                    } : undefined}
                    icon={TrendingUp}
                />
                <StatsCard
                    title="Destacados"
                    value={featuredProducts}
                    icon={Users}
                />
                <StatsCard
                    title="Categorías"
                    value={totalCategories}
                    icon={DollarSign}
                />
            </div>

            {/* Quick Actions */}
            <div className="rounded-2xl bg-zinc-900/50 border border-zinc-800/50 p-6">
                <h3 className="text-lg font-bold text-white mb-4">Acciones rápidas</h3>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {[
                        { name: 'Ver Productos', href: '/admin/productos', icon: Package, enabled: true },
                        { name: 'Ver Pedidos', href: '/admin/pedidos', icon: ShoppingCart, enabled: false },
                    ].map((action) => {
                        const Icon = action.icon;

                        if (!action.enabled) {
                            return (
                                <div
                                    key={action.name}
                                    className="flex items-center gap-3 p-4 rounded-xl bg-zinc-800/20 border border-zinc-800/50 opacity-50 cursor-not-allowed"
                                >
                                    <div className="p-2 rounded-lg bg-zinc-800/30">
                                        <Icon className="h-5 w-5 text-zinc-500" />
                                    </div>
                                    <div>
                                        <span className="text-sm font-medium text-zinc-500">
                                            {action.name}
                                        </span>
                                        <p className="text-xs text-zinc-600">Próximamente</p>
                                    </div>
                                </div>
                            );
                        }

                        return (
                            <a
                                key={action.name}
                                href={action.href}
                                className="flex items-center gap-3 p-4 rounded-xl bg-zinc-800/30 border border-zinc-800 hover:bg-zinc-800/50 hover:border-orange-500/30 transition-all duration-200 group"
                            >
                                <div className="p-2 rounded-lg bg-orange-500/10 group-hover:bg-orange-500/20 transition-colors">
                                    <Icon className="h-5 w-5 text-orange-500" />
                                </div>
                                <span className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors">
                                    {action.name}
                                </span>
                            </a>
                        );
                    })}
                </div>
            </div>

            {/* Recent Products Preview */}
            <div className="rounded-2xl bg-zinc-900/50 border border-zinc-800/50 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">Productos Recientes</h3>
                    <a href="/admin/productos" className="text-sm text-orange-400 hover:text-orange-300 transition-colors">
                        Ver todos →
                    </a>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {productsData.items.slice(0, 4).map((product) => (
                        <div key={product.id} className="p-3 rounded-xl bg-zinc-800/30 border border-zinc-800/50">
                            <p className="font-medium text-white text-sm truncate">{product.name}</p>
                            <p className="text-xs text-zinc-500">{product.categoryName || 'Sin categoría'}</p>
                            <p className="text-sm font-bold text-orange-400 mt-1">
                                ${product.minPriceClp.toLocaleString('es-CL')}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
