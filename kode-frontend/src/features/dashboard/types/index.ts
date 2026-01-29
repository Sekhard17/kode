import { Session } from 'next-auth';

export interface DashboardLayoutProps {
    children: React.ReactNode;
    session: Session;
}

export interface NavItem {
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
}

export interface StatCard {
    title: string;
    value: string | number;
    change?: {
        value: number;
        type: 'increase' | 'decrease';
    };
    icon: React.ComponentType<{ className?: string }>;
}
