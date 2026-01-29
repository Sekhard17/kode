'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { BottomNavBar } from './BottomNavBar';

interface ConditionalLayoutProps {
    children: React.ReactNode;
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
    const pathname = usePathname();
    const isAdminRoute = pathname?.startsWith('/admin');

    if (isAdminRoute) {
        // Admin routes get their own layout, just render children
        return <>{children}</>;
    }

    // Public routes get Navbar, Footer, and BottomNavBar
    return (
        <>
            <Navbar />
            <main className="flex-grow pt-20 pb-16 md:pb-0">
                {children}
            </main>
            <Footer />
            <BottomNavBar />
        </>
    );
}
