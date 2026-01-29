'use client';

import { useState } from 'react';
import { Session } from 'next-auth';
import { DashboardSidebar } from './DashboardSidebar';
import { DashboardHeader } from './DashboardHeader';
import { DashboardBottomNav } from './DashboardBottomNav';

interface DashboardLayoutProps {
    children: React.ReactNode;
    session: Session;
    title: string;
    subtitle?: string;
}

export function DashboardLayout({ children, session, title, subtitle }: DashboardLayoutProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-zinc-950">
            {/* Sidebar - Desktop only */}
            <DashboardSidebar
                userName={session.user?.name}
                userEmail={session.user?.email}
            />

            {/* Main Content Area - adjusted for wider sidebar */}
            <div className="md:pl-72">
                {/* Header */}
                <DashboardHeader
                    title={title}
                    subtitle={subtitle}
                    onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                />

                {/* Page Content */}
                <main className="p-4 lg:p-6 pb-24 lg:pb-6">
                    {children}
                </main>
            </div>

            {/* Bottom Navigation - Mobile only */}
            <DashboardBottomNav />
        </div>
    );
}
