'use client';

import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Dialog, DialogTitle } from '@/components/ui/dialog';
import { useAuthModal } from '../hooks/use-auth-modal';
import { RegisterSteps } from './register-steps';
import { LoginForm } from './login-form';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AuthModal() {
    const { isOpen, onClose, view, setView } = useAuthModal();

    return (
        <Dialog open={isOpen} onOpenChange={() => { }}>
            {/* Custom overlay that doesn't close on click */}
            <DialogPrimitive.Portal>
                <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
                <DialogPrimitive.Content
                    className={cn(
                        "fixed top-[50%] left-[50%] z-50 w-full max-w-[420px] -translate-x-1/2 -translate-y-1/2",
                        "rounded-3xl border border-white/[0.08] bg-black/95 px-6 py-8",
                        "shadow-[0_32px_100px_rgba(0,0,0,0.8)] backdrop-blur-2xl",
                        "data-[state=open]:animate-in data-[state=closed]:animate-out",
                        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
                        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
                        "outline-none"
                    )}
                    onPointerDownOutside={(e) => e.preventDefault()}
                    onInteractOutside={(e) => e.preventDefault()}
                >
                    <DialogTitle className="sr-only">
                        {view === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
                    </DialogTitle>

                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-20 p-1.5 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* === AMBIENT GLOW LAYERS === */}
                    <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 h-40 w-80 rounded-full bg-orange-500/25 blur-[80px]" />
                    <div className="pointer-events-none absolute -left-10 top-1/3 h-32 w-32 rounded-full bg-purple-500/10 blur-[60px]" />
                    <div className="pointer-events-none absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-amber-500/15 blur-[60px]" />

                    {/* Aurora gradient overlay */}
                    <div className="pointer-events-none absolute inset-0 rounded-3xl bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(249,115,22,0.12),transparent_50%)]" />
                    <div className="pointer-events-none absolute inset-0 rounded-3xl bg-[radial-gradient(ellipse_60%_40%_at_80%_100%,rgba(251,191,36,0.06),transparent_50%)]" />

                    {/* Glass edge highlight */}
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-3xl bg-gradient-to-r from-transparent via-white/15 to-transparent" />

                    {/* Floating particles */}
                    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
                        <div className="absolute top-1/4 left-1/4 w-1 h-1 rounded-full bg-orange-400/30 animate-float-slow" />
                        <div className="absolute top-1/3 right-1/3 w-0.5 h-0.5 rounded-full bg-amber-300/20 animate-float-medium" />
                        <div className="absolute bottom-1/3 left-1/2 w-1 h-1 rounded-full bg-orange-300/15 animate-float-fast" />
                    </div>

                    {/* === CONTENT === */}
                    <div className="relative z-10">
                        <AnimatePresence mode="wait" initial={false}>
                            {view === 'login' && (
                                <motion.div
                                    key="login"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.25 }}
                                >
                                    <LoginForm
                                        isModal
                                        onRegisterClick={() => setView('register')}
                                        onSuccess={onClose}
                                    />
                                </motion.div>
                            )}
                            {view === 'register' && (
                                <motion.div
                                    key="register"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.25 }}
                                >
                                    <RegisterSteps
                                        onSuccess={onClose}
                                    />
                                    <div className="mt-5 text-center pt-4 border-t border-white/[0.06]">
                                        <p className="text-zinc-500 text-sm">
                                            ¿Ya tienes cuenta?{' '}
                                            <button
                                                onClick={() => setView('login')}
                                                className="text-orange-400 hover:text-orange-300 font-semibold transition-colors duration-200 hover:underline underline-offset-2"
                                            >
                                                Inicia sesión
                                            </button>
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
        </Dialog>
    );
}
