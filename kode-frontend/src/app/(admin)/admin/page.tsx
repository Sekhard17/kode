import { auth } from '@/lib/auth';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Admin Dashboard | KODE',
    description: 'Panel de administración KODE',
};

export default async function AdminPage() {
    const session = await auth();

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-zinc-200 dark:border-zinc-800 p-8">
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">
                        Panel de Administración
                    </h1>
                    <p className="text-zinc-600 dark:text-zinc-400 mb-8">
                        Bienvenido, {session?.user?.name ?? session?.user?.email}
                    </p>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {[
                            { name: 'Productos', href: '/admin/productos', count: '—' },
                            { name: 'Pedidos', href: '/admin/pedidos', count: '—' },
                            { name: 'Categorías', href: '/admin/categorias', count: '—' },
                            { name: 'Cupones', href: '/admin/cupones', count: '—' },
                        ].map((item) => (
                            <div
                                key={item.name}
                                className="p-6 bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700"
                            >
                                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                    {item.name}
                                </p>
                                <p className="text-3xl font-bold text-zinc-900 dark:text-white mt-2">
                                    {item.count}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
