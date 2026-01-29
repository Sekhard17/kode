'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Tags,
    Ticket,
    Settings,
    LogOut,
    ChevronRight,
    Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
    name: string;
    description: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    enabled: boolean;
    badge?: string;
}

const mainNavItems: NavItem[] = [
    {
        name: 'Dashboard',
        description: 'Resumen y estadísticas',
        href: '/admin',
        icon: LayoutDashboard,
        enabled: true,
    },
    {
        name: 'Productos',
        description: 'Gestiona tu catálogo',
        href: '/admin/productos',
        icon: Package,
        enabled: true,
    },
    {
        name: 'Pedidos',
        description: 'Órdenes y envíos',
        href: '/admin/pedidos',
        icon: ShoppingCart,
        enabled: false,
        badge: 'Pronto',
    },
    {
        name: 'Categorías',
        description: 'Organiza productos',
        href: '/admin/categorias',
        icon: Tags,
        enabled: false,
        badge: 'Pronto',
    },
    {
        name: 'Cupones',
        description: 'Descuentos y promociones',
        href: '/admin/cupones',
        icon: Ticket,
        enabled: false,
        badge: 'Pronto',
    },
];

interface DashboardSidebarProps {
    userName?: string | null;
    userEmail?: string | null;
}

export function DashboardSidebar({ userName, userEmail }: DashboardSidebarProps) {
    const pathname = usePathname();

    const isActive = (href: string) => {
        if (href === '/admin') {
            return pathname === '/admin';
        }
        return pathname.startsWith(href);
    };

    return (
        <aside className="hidden md:flex md:flex-col w-72 fixed left-0 top-0 bottom-0 z-50 bg-zinc-950 border-r border-zinc-800/50">
            {/* Logo */}
            <div className="flex items-center h-16 px-6 border-b border-zinc-800/50">
                <Link href="/admin" className="flex items-center gap-3">
                    <div className="relative h-8 w-24">
                        <Image
                            src="/LogoModoOscuro.png"
                            alt="KODE"
                            fill
                            className="object-contain object-left"
                            priority
                        />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-orange-500 bg-orange-500/10 px-2.5 py-1 rounded-md border border-orange-500/20">
                        Admin
                    </span>
                </Link>
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
                <p className="px-3 mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">
                    Navegación
                </p>
                {mainNavItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    const disabled = !item.enabled;

                    if (disabled) {
                        return (
                            <div
                                key={item.name}
                                className="flex items-center gap-3 px-3 py-3 rounded-xl text-zinc-600 cursor-not-allowed opacity-60"
                            >
                                <div className="p-2 rounded-lg bg-zinc-900/50">
                                    <Icon className="h-5 w-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium">{item.name}</span>
                                        <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 bg-zinc-800/50 px-1.5 py-0.5 rounded">
                                            {item.badge}
                                        </span>
                                    </div>
                                    <p className="text-xs text-zinc-700 truncate">{item.description}</p>
                                </div>
                            </div>
                        );
                    }

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                'flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group',
                                active
                                    ? 'bg-gradient-to-r from-orange-500/10 to-orange-500/5 border border-orange-500/20'
                                    : 'hover:bg-zinc-900/50'
                            )}
                        >
                            <div className={cn(
                                'p-2 rounded-lg transition-colors',
                                active
                                    ? 'bg-orange-500/20'
                                    : 'bg-zinc-900/50 group-hover:bg-zinc-800/50'
                            )}>
                                <Icon className={cn(
                                    'h-5 w-5 transition-colors',
                                    active ? 'text-orange-500' : 'text-zinc-400 group-hover:text-white'
                                )} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <span className={cn(
                                    'text-sm font-medium block transition-colors',
                                    active ? 'text-white' : 'text-zinc-300 group-hover:text-white'
                                )}>
                                    {item.name}
                                </span>
                                <p className={cn(
                                    'text-xs truncate transition-colors',
                                    active ? 'text-zinc-400' : 'text-zinc-600 group-hover:text-zinc-500'
                                )}>
                                    {item.description}
                                </p>
                            </div>
                            {active && (
                                <ChevronRight className="h-4 w-4 text-orange-500/50" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Settings */}
            <div className="px-3 py-4 border-t border-zinc-800/50">
                <div
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-zinc-600 cursor-not-allowed opacity-60"
                >
                    <div className="p-2 rounded-lg bg-zinc-900/50">
                        <Settings className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Configuración</span>
                            <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 bg-zinc-800/50 px-1.5 py-0.5 rounded">
                                Pronto
                            </span>
                        </div>
                        <p className="text-xs text-zinc-700">Ajustes de la tienda</p>
                    </div>
                </div>

                <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-zinc-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 mt-1 group"
                >
                    <div className="p-2 rounded-lg bg-zinc-900/50 group-hover:bg-red-500/10 transition-colors">
                        <LogOut className="h-5 w-5" />
                    </div>
                    <div className="flex-1 text-left">
                        <span className="text-sm font-medium block">Cerrar sesión</span>
                        <p className="text-xs text-zinc-600 group-hover:text-red-400/60">Volver al inicio</p>
                    </div>
                </button>
            </div>

            {/* User Info */}
            <div className="px-4 py-4 border-t border-zinc-800/50 bg-zinc-900/30">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-black font-black text-sm shadow-lg shadow-orange-500/20">
                        {userName?.charAt(0)?.toUpperCase() || userEmail?.charAt(0)?.toUpperCase() || 'A'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                            {userName || 'Administrador'}
                        </p>
                        <p className="text-xs text-zinc-500 truncate">
                            {userEmail}
                        </p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
