import { auth, signOut } from '@/lib/auth';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Mi Cuenta | KODE',
    description: 'Gestiona tu cuenta KODE',
};

export default async function AccountPage() {
    const session = await auth();

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-zinc-200 dark:border-zinc-800 p-8">
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-6">
                        Mi Cuenta
                    </h1>

                    <div className="space-y-6">
                        <div className="border-b border-zinc-200 dark:border-zinc-800 pb-6">
                            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
                                Información Personal
                            </h2>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400">Nombre</p>
                                    <p className="text-zinc-900 dark:text-white font-medium">
                                        {session?.user?.name ?? 'No especificado'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400">Email</p>
                                    <p className="text-zinc-900 dark:text-white font-medium">
                                        {session?.user?.email}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400">Rol</p>
                                    <p className="text-zinc-900 dark:text-white font-medium capitalize">
                                        {session?.user?.role?.toLowerCase()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <form
                            action={async () => {
                                'use server';
                                await signOut({ redirectTo: '/' });
                            }}
                        >
                            <button
                                type="submit"
                                className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors"
                            >
                                Cerrar Sesión
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
