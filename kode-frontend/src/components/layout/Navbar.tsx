'use client';

import { useEffect, useState } from 'react';
import { NavbarDesktop } from './NavbarDesktop';
import { NavbarMobile } from './NavbarMobile';

const NAV_LINKS = [
    { name: 'Inicio', href: '/', description: 'Home y destacados' },
    { name: 'Tienda', href: '/tienda', description: 'Ver todos los productos' },
    { name: 'Polerones', href: '/tienda?categorySlug=polerones', description: 'Abrigo premium street' },
    { name: 'Poleras', href: '/tienda?categorySlug=poleras', description: 'Básicos y gráficos' },
];

export function Navbar() {
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
            className={`fixed top-0 z-50 w-full transition-all duration-300 ${isScrolled
                ? 'bg-black/70 backdrop-blur-md border-b border-white/10'
                : 'bg-transparent'
                }`}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <NavbarDesktop isScrolled={isScrolled} links={NAV_LINKS} />
                <NavbarMobile isScrolled={isScrolled} links={NAV_LINKS} />
            </div>
        </nav>
    );
}
