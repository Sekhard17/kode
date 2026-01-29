'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { AdminProductListItem } from '@/features/catalog/types';
import {
    MoreHorizontal,
    Pencil,
    Eye,
    EyeOff,
    Search,
    Filter,
    Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Pagination } from './Pagination';
import { cn } from '@/lib/utils';
import { toggleProductActive } from '@/features/dashboard/services/admin-products.service';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface ProductsTableProps {
    products: AdminProductListItem[];
    total: number;
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onEdit: (id: string) => void;
    onSearch: (term: string) => void;
    initialSearch: string;
    limit?: number;
}

function formatPrice(price: number): string {
    return `$${price.toLocaleString('es-CL')}`;
}

export function ProductsTable({
    products,
    total,
    currentPage,
    totalPages,
    onPageChange,
    onEdit,
    onSearch,
    initialSearch,
    limit = 30
}: ProductsTableProps) {
    const router = useRouter();
    const [isToggling, setIsToggling] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState(initialSearch);

    // Update local state if prop changes (e.g. via URL navigation)
    useEffect(() => {
        setSearchTerm(initialSearch);
    }, [initialSearch]);

    // Better implementation of debounce inside component
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchTerm !== initialSearch) {
                onSearch(searchTerm);
            }
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [searchTerm, onSearch, initialSearch]);

    const handleToggleActive = async (id: string, currentStatus: boolean) => {
        try {
            setIsToggling(id);
            await toggleProductActive(id);
            toast.success(currentStatus ? 'Producto ocultado' : 'Producto visible en tienda');
            router.refresh(); // Refresh server data
        } catch (error) {
            toast.error('Error al cambiar estado');
        } finally {
            setIsToggling(null);
        }
    };

    return (
        <div className="space-y-4">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <Input
                        placeholder="Buscar productos..."
                        className="pl-9 bg-zinc-900 border-zinc-800 rounded-xl focus-visible:ring-orange-500/30"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button variant="outline" className="border-zinc-800 text-zinc-400 hover:text-white gap-2">
                    <Filter className="h-4 w-4" />
                    Filtros
                </Button>
            </div>

            {/* Table */}
            <div className="rounded-2xl border border-zinc-800/50 overflow-hidden bg-zinc-900/30">
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-zinc-800/50">
                                <th className="text-left text-xs font-bold uppercase tracking-wider text-zinc-500 px-4 py-3">
                                    Producto
                                </th>
                                <th className="text-left text-xs font-bold uppercase tracking-wider text-zinc-500 px-4 py-3">
                                    Categoría
                                </th>
                                <th className="text-left text-xs font-bold uppercase tracking-wider text-zinc-500 px-4 py-3">
                                    Precio
                                </th>
                                <th className="text-left text-xs font-bold uppercase tracking-wider text-zinc-500 px-4 py-3">
                                    Stock Total
                                </th>
                                <th className="text-left text-xs font-bold uppercase tracking-wider text-zinc-500 px-4 py-3">
                                    Estado
                                </th>
                                <th className="text-right text-xs font-bold uppercase tracking-wider text-zinc-500 px-4 py-3">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/30">
                            {products.map((product) => (
                                <tr
                                    key={product.id}
                                    className="hover:bg-zinc-800/20 transition-colors"
                                >
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-zinc-800 flex-shrink-0">
                                                {product.mainImage ? (
                                                    <Image
                                                        src={product.mainImage}
                                                        alt={product.name}
                                                        fill
                                                        className="object-cover"
                                                        sizes="48px"
                                                    />
                                                ) : (
                                                    <div className="h-full w-full flex items-center justify-center text-zinc-600 text-xs">
                                                        N/A
                                                    </div>
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-medium text-white truncate max-w-[200px]">
                                                    {product.name}
                                                </p>
                                                <div className="flex items-center gap-2 text-xs text-zinc-500">
                                                    <span className="truncate">{product.slug}</span>
                                                    <span>•</span>
                                                    <span>{product.variantsCount} var.</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="text-sm text-zinc-300">
                                            {product.categoryName || '—'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="font-medium text-white">
                                            {formatPrice(product.minPriceClp)}
                                            {product.minPriceClp !== product.maxPriceClp && ` - ${formatPrice(product.maxPriceClp)}`}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={cn(
                                            'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                                            product.totalStock > 0
                                                ? 'bg-emerald-500/10 text-emerald-400'
                                                : 'bg-red-500/10 text-red-400'
                                        )}>
                                            {product.totalStock} un.
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex flex-col gap-1">
                                            <span className={cn(
                                                'inline-flex items-center w-fit px-2 py-0.5 rounded-full text-xs font-medium',
                                                product.isActive
                                                    ? 'bg-emerald-500/10 text-emerald-400'
                                                    : 'bg-zinc-500/10 text-zinc-400'
                                            )}>
                                                {product.isActive ? 'Visible' : 'Oculto'}
                                            </span>
                                            {product.isFeatured && (
                                                <span className="inline-flex items-center w-fit px-2 py-0.5 rounded-full text-xs font-medium bg-orange-500/10 text-orange-400">
                                                    Destacado
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white">
                                                    {isToggling === product.id ? (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    ) : (
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    )}
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800">
                                                <DropdownMenuItem
                                                    className="text-zinc-300 hover:text-white gap-2 cursor-pointer"
                                                    onClick={() => onEdit(product.id)}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                    Editar
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-zinc-300 hover:text-white gap-2 cursor-pointer"
                                                    disabled={isToggling === product.id}
                                                    onClick={() => handleToggleActive(product.id, product.isActive)}
                                                >
                                                    {product.isActive ? (
                                                        <>
                                                            <EyeOff className="h-4 w-4" />
                                                            Ocultar
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Eye className="h-4 w-4" />
                                                            Mostrar
                                                        </>
                                                    )}
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden divide-y divide-zinc-800/30">
                    {products.map((product) => (
                        <div key={product.id} className="p-4">
                            <div className="flex items-start gap-3">
                                <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-zinc-800 flex-shrink-0">
                                    {product.mainImage ? (
                                        <Image
                                            src={product.mainImage}
                                            alt={product.name}
                                            fill
                                            className="object-cover"
                                            sizes="64px"
                                        />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center text-zinc-600 text-xs">
                                            N/A
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <p className="font-medium text-white truncate max-w-[150px]">
                                            {product.name}
                                        </p>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-6 w-6 -mr-2 text-zinc-400">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800">
                                                <DropdownMenuItem
                                                    className="text-zinc-300 gap-2"
                                                    onClick={() => onEdit(product.id)}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                    Editar
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-zinc-300 gap-2"
                                                    onClick={() => handleToggleActive(product.id, product.isActive)}
                                                >
                                                    {product.isActive ? (
                                                        <>
                                                            <EyeOff className="h-4 w-4" />
                                                            Ocultar
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Eye className="h-4 w-4" />
                                                            Mostrar
                                                        </>
                                                    )}
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>

                                    <p className="text-sm text-zinc-500">
                                        {product.categoryName || 'Sin categoría'}
                                    </p>

                                    <div className="flex items-center justify-between mt-2">
                                        <p className="font-bold text-white">
                                            {formatPrice(product.minPriceClp)}
                                        </p>
                                        <span className={cn(
                                            'text-xs font-medium px-2 py-0.5 rounded-full',
                                            product.isActive
                                                ? 'bg-emerald-500/10 text-emerald-400'
                                                : 'bg-zinc-500/10 text-zinc-400'
                                        )}>
                                            {product.isActive ? 'Visible' : 'Oculto'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {products.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-zinc-500">No se encontraron productos</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-zinc-800/50">
                <p className="text-sm text-zinc-500 text-center sm:text-left">
                    Mostrando {(currentPage - 1) * limit + 1} a {Math.min(currentPage * limit, total)} de {total} productos
                </p>
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={onPageChange}
                />
            </div>
        </div>
    );
}
