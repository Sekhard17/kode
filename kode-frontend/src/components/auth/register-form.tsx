'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:4000';

export function RegisterForm() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const confirmPassword = formData.get('confirmPassword') as string;

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            setIsLoading(false);
            return;
        }

        if (password.length < 8) {
            setError('La contraseña debe tener al menos 8 caracteres');
            setIsLoading(false);
            return;
        }

        try {
            // Register user
            const registerResponse = await fetch(`${BACKEND_URL}/api/v1/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });

            if (!registerResponse.ok) {
                const data = await registerResponse.json() as { message?: string };
                setError(data.message ?? 'Error al registrar');
                setIsLoading(false);
                return;
            }

            // Auto login after registration
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError('Cuenta creada. Por favor, inicia sesión.');
                router.push('/login');
            } else {
                router.push('/');
                router.refresh();
            }
        } catch {
            setError('Error al registrar');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="bg-white dark:bg-zinc-900 shadow-xl rounded-2xl p-8 border border-zinc-200 dark:border-zinc-800">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
                        Crear Cuenta
                    </h1>
                    <p className="text-zinc-600 dark:text-zinc-400 mt-2">
                        Únete a KODE
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
                        >
                            Nombre (opcional)
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            autoComplete="name"
                            className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                            placeholder="Juan Pérez"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
                        >
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                            placeholder="tu@email.com"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
                        >
                            Contraseña
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="new-password"
                            required
                            minLength={8}
                            className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                            placeholder="Mínimo 8 caracteres"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="confirmPassword"
                            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
                        >
                            Confirmar Contraseña
                        </label>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            autoComplete="new-password"
                            required
                            minLength={8}
                            className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
                    </button>
                </form>

                <p className="text-center text-zinc-600 dark:text-zinc-400 mt-6">
                    ¿Ya tienes cuenta?{' '}
                    <Link
                        href="/login"
                        className="text-orange-500 hover:text-orange-600 font-medium"
                    >
                        Inicia sesión
                    </Link>
                </p>
            </div>
        </div>
    );
}
