import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
    title: string;
    value: string | number;
    change?: {
        value: number;
        type: 'increase' | 'decrease';
    };
    icon: React.ComponentType<{ className?: string }>;
    className?: string;
}

export function StatsCard({ title, value, change, icon: Icon, className }: StatsCardProps) {
    return (
        <div className={cn(
            'relative overflow-hidden rounded-2xl bg-zinc-900/50 border border-zinc-800/50 p-6 transition-all duration-300 hover:border-zinc-700/50 hover:bg-zinc-900/70',
            className
        )}>
            {/* Background Glow */}
            <div className="absolute -top-10 -right-10 h-24 w-24 rounded-full bg-orange-500/5 blur-2xl" />

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-zinc-400">{title}</span>
                <div className="p-2 rounded-xl bg-zinc-800/50">
                    <Icon className="h-4 w-4 text-orange-500" />
                </div>
            </div>

            {/* Value */}
            <p className="text-3xl font-black text-white tracking-tight mb-2">
                {value}
            </p>

            {/* Change indicator */}
            {change && (
                <div className={cn(
                    'flex items-center gap-1 text-sm font-medium',
                    change.type === 'increase' ? 'text-emerald-400' : 'text-red-400'
                )}>
                    {change.type === 'increase' ? (
                        <TrendingUp className="h-4 w-4" />
                    ) : (
                        <TrendingDown className="h-4 w-4" />
                    )}
                    <span>{change.type === 'increase' ? '+' : '-'}{Math.abs(change.value)}%</span>
                    <span className="text-zinc-500 font-normal ml-1">vs mes anterior</span>
                </div>
            )}
        </div>
    );
}
