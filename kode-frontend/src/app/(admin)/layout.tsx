import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { DashboardLayout } from '@/features/dashboard/components/DashboardLayout';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session) {
        redirect('/login');
    }

    if (session.user.role !== 'ADMIN') {
        redirect('/');
    }

    return (
        <DashboardLayout session={session} title="Dashboard">
            {children}
        </DashboardLayout>
    );
}
