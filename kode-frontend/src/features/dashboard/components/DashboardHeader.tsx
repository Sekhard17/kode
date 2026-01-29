'use client';

import { Bell, Search, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface DashboardHeaderProps {
    title: string;
    subtitle?: string;
    onMenuClick?: () => void;
}

export function DashboardHeader({ title, subtitle, onMenuClick }: DashboardHeaderProps) {
    return (
        <header className="sticky top-0 z-40 h-16 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/50">
            <div className="flex items-center justify-between h-full px-4 md:px-6">
                {/* Left side - Menu button (mobile) + Title */}
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden text-zinc-400 hover:text-white"
                        onClick={onMenuClick}
                    >
                        <Menu className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-lg font-bold text-white">{title}</h1>
                        {subtitle && (
                            <p className="text-xs text-zinc-500">{subtitle}</p>
                        )}
                    </div>
                </div>

                {/* Right side - Search + Actions */}
                <div className="flex items-center gap-3">
                    {/* Search - hidden on mobile */}
                    <div className="hidden md:flex relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                        <Input
                            placeholder="Buscar..."
                            className="w-64 h-9 pl-9 bg-zinc-900 border-zinc-800 text-sm rounded-xl focus-visible:ring-orange-500/30"
                        />
                    </div>

                    {/* Notifications */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="relative text-zinc-400 hover:text-white"
                    >
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-orange-500 rounded-full" />
                    </Button>
                </div>
            </div>
        </header>
    );
}
