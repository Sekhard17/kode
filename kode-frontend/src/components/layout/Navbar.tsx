'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, User, Search, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const NAV_LINKS = [
    { name: 'Inicio', href: '/' },
    { name: 'Tienda', href: '/tienda' },
    { name: 'Polerones', href: '/tienda?categorySlug=polerones' },
    { name: 'Poleras', href: '/tienda?categorySlug=poleras' },
];

export function Navbar() {
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 z-50 w-full transition-all duration-300 ${isScrolled ? 'bg-black/80 backdrop-blur-md border-b border-zinc-800' : 'bg-transparent'
                }`}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-20 items-center justify-between">
                    <div className="flex items-center">
                        <Link href="/" className="flex flex-shrink-0 items-center">
                            <span className="text-3xl font-black italic tracking-tighter text-white">KODE<span className="text-orange-500">.</span></span>
                        </Link>
                    </div>

                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-8">
                            {NAV_LINKS.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={`text-xs font-bold uppercase tracking-[0.2em] transition-colors hover:text-orange-500 ${pathname === link.href ? 'text-orange-500' : 'text-zinc-400'
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="icon" className="text-white hover:bg-zinc-900 rounded-full transition-all hover:scale-110">
                            <Search className="h-5 w-5" />
                        </Button>
                        <Link href="/cuenta">
                            <Button variant="ghost" size="icon" className="text-white hover:bg-zinc-900 rounded-full transition-all hover:scale-110">
                                <User className="h-5 w-5" />
                            </Button>
                        </Link>
                        <Button variant="ghost" size="icon" className="relative text-white hover:bg-zinc-900 rounded-full transition-all hover:scale-110">
                            <ShoppingBag className="h-5 w-5" />
                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-bold text-black ring-2 ring-black">
                                0
                            </span>
                        </Button>

                        <div className="md:hidden ml-2">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon" className="text-white hover:bg-zinc-900">
                                        <Menu className="h-6 w-6" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="right" className="bg-black border-zinc-800 p-8 w-[300px]">
                                    <div className="flex flex-col space-y-8 mt-12">
                                        {NAV_LINKS.map((link) => (
                                            <Link
                                                key={link.name}
                                                href={link.href}
                                                className="text-2xl font-black uppercase italic tracking-tighter text-white hover:text-orange-500 transition-colors"
                                            >
                                                {link.name}
                                            </Link>
                                        ))}
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
