'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Lock, Mail, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface LoginFormProps {
    isModal?: boolean;
    onRegisterClick?: () => void;
    onSuccess?: () => void;
}

const REMEMBER_EMAIL_KEY = 'kode_remember_email';

export function LoginForm({ isModal = false, onRegisterClick, onSuccess }: LoginFormProps) {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(true);
    const [emailLocked, setEmailLocked] = useState(true);
    const [passwordLocked, setPasswordLocked] = useState(true);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const remembered = window.localStorage.getItem(REMEMBER_EMAIL_KEY);
        if (remembered) {
            setEmail(remembered);
            setRememberMe(true);
        }
    }, []);

    const canSubmit = useMemo(() => {
        return email.trim().length > 0 && password.length > 0 && !isLoading;
    }, [email, password, isLoading]);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!canSubmit) return;
        setIsLoading(true);
        setError(null);

        try {
            if (typeof window !== 'undefined') {
                if (rememberMe) {
                    window.localStorage.setItem(REMEMBER_EMAIL_KEY, email.trim());
                } else {
                    window.localStorage.removeItem(REMEMBER_EMAIL_KEY);
                }
            }

            const result = await signIn('credentials', {
                email: email.trim(),
                password,
                redirect: false,
            });

            if (result?.error) {
                setError('Credenciales inválidas');
                setIsLoading(false);
            } else {
                toast.success('¡Bienvenido de vuelta!', {
                    description: 'Has iniciado sesión correctamente',
                });

                // Call onSuccess to close modal before navigation
                if (onSuccess) {
                    onSuccess();
                }

                router.push('/');
                router.refresh();
                // Keep isLoading true during navigation to prevent double-clicks
            }
        } catch {
            setError('Error al iniciar sesión');
            setIsLoading(false);
        }
    }

    const content = (
        <div className="w-full">
            <div className="flex flex-col items-center text-center">
                <div className={cn('relative', isModal ? 'h-9 w-[150px]' : 'h-10 w-[170px]')}>
                    <Image
                        src="/LogoModoOscuro.png"
                        alt="KODE"
                        fill
                        priority
                        sizes="170px"
                        className="object-contain"
                    />
                </div>
                <p className={cn('mt-3 text-sm italic', isModal ? 'text-white/60' : 'text-white/55')}>
                    <span className="font-medium text-white/80">Decode</span>{' '}
                    <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text font-medium text-transparent">
                        your
                    </span>{' '}
                    <span className="font-medium text-white/80">Style</span>
                </p>
            </div>

            {/* Form heading */}
            <h2 className="mt-6 text-center text-lg font-semibold text-white/90">
                Ingresa a tu cuenta
            </h2>

            <div className="mt-5 space-y-5">
                {error ? (
                    <div className="rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                        {error}
                    </div>
                ) : null}

                <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
                    <div className="space-y-2">
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/55" />
                            <Input
                                id="email"
                                name="kode-email"
                                type="text"
                                inputMode="email"
                                autoCapitalize="none"
                                spellCheck={false}
                                autoComplete="off"
                                placeholder="tu@email.com"
                                value={email}
                                readOnly={emailLocked}
                                onFocus={() => setEmailLocked(false)}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                className="h-12 rounded-2xl border-white/10 bg-black/30 pl-11 text-white placeholder:text-white/35 focus-visible:ring-orange-500/30"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/55" />
                            <Input
                                id="password"
                                name="kode-password"
                                type="password"
                                autoComplete="new-password"
                                placeholder="••••••••"
                                value={password}
                                readOnly={passwordLocked}
                                onFocus={() => setPasswordLocked(false)}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                                className="h-12 rounded-2xl border-white/10 bg-black/30 pl-11 text-white placeholder:text-white/35 focus-visible:ring-orange-500/30"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 pt-1">
                        <label className="inline-flex items-center gap-2 text-xs font-semibold text-white/70 select-none">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRememberMe(e.target.checked)}
                                className="h-4 w-4 rounded border-white/20 bg-black/40 text-orange-500 focus:ring-orange-500/30"
                            />
                            Recordarme
                        </label>

                        <span className="text-[11px] text-white/45">
                            {rememberMe ? 'Guardamos tu email en este dispositivo' : 'No guardamos tu email'}
                        </span>
                    </div>

                    <Button
                        type="submit"
                        disabled={!canSubmit}
                        className="h-12 w-full rounded-2xl bg-orange-500 text-black font-black uppercase tracking-widest hover:bg-orange-400 disabled:opacity-50 disabled:cursor-not-allowed"
                        data-testid="login-submit-button"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Iniciando sesión...
                            </>
                        ) : (
                            <>
                                Iniciar sesión
                                <ArrowRight className="ml-1 h-4 w-4" />
                            </>
                        )}
                    </Button>
                </form>
            </div>

            <p className="mt-6 text-center text-sm text-white/60">
                ¿No tienes cuenta?{' '}
                {onRegisterClick ? (
                    <button
                        type="button"
                        onClick={onRegisterClick}
                        className="font-semibold text-orange-300 hover:text-orange-200"
                    >
                        Regístrate
                    </button>
                ) : (
                    <Link href="/registro" className="font-semibold text-orange-300 hover:text-orange-200">
                        Regístrate
                    </Link>
                )}
            </p>
        </div>
    );

    return (
        isModal ? (
            content
        ) : (
            <div className="w-full max-w-md mx-auto">
                <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-8 shadow-[0_24px_90px_rgba(0,0,0,0.55)] backdrop-blur-xl">
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_0%,rgba(249,115,22,0.18),transparent_60%)]" />
                    <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-orange-500/10 blur-3xl" />
                    <div className="relative">{content}</div>
                </div>
            </div>
        )
    );
}
