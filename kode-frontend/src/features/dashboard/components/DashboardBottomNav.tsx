'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Tags,
    Settings,
    Lock,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    enabled: boolean;
}

const navItems: NavItem[] = [
    { name: 'Inicio', href: '/admin', icon: LayoutDashboard, enabled: true },
    { name: 'Productos', href: '/admin/productos', icon: Package, enabled: true },
    { name: 'Pedidos', href: '/admin/pedidos', icon: ShoppingCart, enabled: false },
    { name: 'Categorías', href: '/admin/categorias', icon: Tags, enabled: false },
    { name: 'Ajustes', href: '/admin/configuracion', icon: Settings, enabled: false },
];

export function DashboardBottomNav() {
    const pathname = usePathname();

    const isActive = (href: string) => {
        if (href === '/admin') {
            return pathname === '/admin';
        }
        return pathname.startsWith(href);
    };

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-zinc-950/95 backdrop-blur-xl border-t border-zinc-800/50">
            {/* Safe area padding for notched devices */}
            <div className="flex items-center justify-around h-16 px-1 pb-safe">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    const disabled = !item.enabled;

                    if (disabled) {
                        return (
                            <div
                                key={item.name}
                                className="flex flex-col items-center justify-center gap-0.5 px-2 py-2 min-w-[56px] opacity-40"
                            >
                                <div className="relative p-1.5 rounded-lg bg-zinc-900/50">
                                    <Icon className="h-5 w-5 text-zinc-600" />
                                    <Lock className="absolute -top-1 -right-1 h-3 w-3 text-zinc-500" />
                                </div>
                                <span className="text-[10px] font-medium text-zinc-600">
                                    {item.name}
                                </span>
                            </div>
                        );
                    }

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                'flex flex-col items-center justify-center gap-0.5 px-2 py-2 rounded-xl transition-all duration-200 min-w-[56px]',
                                active
                                    ? 'text-orange-400'
                                    : 'text-zinc-500 active:scale-95'
                            )}
                        >
                            <div className={cn(
                                'p-1.5 rounded-lg transition-all duration-200',
                                active
                                    ? 'bg-orange-500/15 shadow-lg shadow-orange-500/10'
                                    : 'bg-transparent'
                            )}>
                                <Icon className={cn(
                                    'h-5 w-5 transition-colors',
                                    active ? 'text-orange-500' : 'text-zinc-400'
                                )} />
                            </div>
                            <span className={cn(
                                'text-[10px] font-semibold transition-colors',
                                active ? 'text-orange-400' : 'text-zinc-500'
                            )}>
                                {item.name}
                            </span>
                            {/* Active indicator dot */}
                            {active && (
                                <div className="absolute bottom-1 h-1 w-1 rounded-full bg-orange-500" />
                            )}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
