'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, ExternalLink, KeyRound, Loader2, Lock, Mail, Sparkles, User } from 'lucide-react';
import { toast } from 'sonner';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { FillingGlassAvatar } from './filling-glass-avatar';
import { cn } from '@/lib/utils';

// Schema definitions
const emailSchema = z.object({
    email: z.string().email('Email inválido'),
});

const otpSchema = z.object({
    code: z.string().length(6, 'El código debe tener 6 dígitos'),
});

const detailsSchema = z.object({
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
    confirmPassword: z.string(),
    avatar: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
});

enum Step {
    EMAIL = 0,
    OTP = 1,
    DETAILS = 2,
}

function maskEmail(value: string) {
    const email = value.trim();
    const atIndex = email.indexOf('@');
    if (atIndex <= 1) return email;
    const name = email.slice(0, atIndex);
    const domain = email.slice(atIndex + 1);
    const maskedName = `${name[0]}***${name[name.length - 1]}`;
    return `${maskedName}@${domain}`;
}

// Email provider detection for quick access button
interface EmailProvider {
    name: string;
    url: string;
    color: string;
    bgColor: string;
}

function getEmailProvider(email: string): EmailProvider | null {
    const domain = email.split('@')[1]?.toLowerCase();
    if (!domain) return null;

    const providers: Record<string, EmailProvider> = {
        'gmail.com': {
            name: 'Gmail',
            url: 'https://mail.google.com',
            color: '#EA4335',
            bgColor: 'rgba(234, 67, 53, 0.1)',
        },
        'googlemail.com': {
            name: 'Gmail',
            url: 'https://mail.google.com',
            color: '#EA4335',
            bgColor: 'rgba(234, 67, 53, 0.1)',
        },
        'outlook.com': {
            name: 'Outlook',
            url: 'https://outlook.live.com',
            color: '#0078D4',
            bgColor: 'rgba(0, 120, 212, 0.1)',
        },
        'hotmail.com': {
            name: 'Outlook',
            url: 'https://outlook.live.com',
            color: '#0078D4',
            bgColor: 'rgba(0, 120, 212, 0.1)',
        },
        'live.com': {
            name: 'Outlook',
            url: 'https://outlook.live.com',
            color: '#0078D4',
            bgColor: 'rgba(0, 120, 212, 0.1)',
        },
        'msn.com': {
            name: 'Outlook',
            url: 'https://outlook.live.com',
            color: '#0078D4',
            bgColor: 'rgba(0, 120, 212, 0.1)',
        },
        'yahoo.com': {
            name: 'Yahoo Mail',
            url: 'https://mail.yahoo.com',
            color: '#6001D2',
            bgColor: 'rgba(96, 1, 210, 0.1)',
        },
        'yahoo.es': {
            name: 'Yahoo Mail',
            url: 'https://mail.yahoo.com',
            color: '#6001D2',
            bgColor: 'rgba(96, 1, 210, 0.1)',
        },
        'icloud.com': {
            name: 'iCloud Mail',
            url: 'https://www.icloud.com/mail',
            color: '#007AFF',
            bgColor: 'rgba(0, 122, 255, 0.1)',
        },
        'me.com': {
            name: 'iCloud Mail',
            url: 'https://www.icloud.com/mail',
            color: '#007AFF',
            bgColor: 'rgba(0, 122, 255, 0.1)',
        },
        'protonmail.com': {
            name: 'ProtonMail',
            url: 'https://mail.proton.me',
            color: '#6D4AFF',
            bgColor: 'rgba(109, 74, 255, 0.1)',
        },
        'proton.me': {
            name: 'ProtonMail',
            url: 'https://mail.proton.me',
            color: '#6D4AFF',
            bgColor: 'rgba(109, 74, 255, 0.1)',
        },
    };

    return providers[domain] || null;
}

const stepVariants = {
    enter: (direction: number) => ({
        x: direction > 0 ? 30 : -30,
        opacity: 0,
        scale: 0.96,
    }),
    center: {
        x: 0,
        opacity: 1,
        scale: 1,
    },
    exit: (direction: number) => ({
        x: direction < 0 ? 30 : -30,
        opacity: 0,
        scale: 0.96,
    }),
};

const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.1,
        },
    },
};

const staggerItem = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export function RegisterSteps({ onSuccess }: { onSuccess?: () => void }) {
    const [step, setStep] = useState<Step>(Step.EMAIL);
    const [direction, setDirection] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');

    const router = useRouter();
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:4000';

    // Forms
    const emailForm = useForm<z.infer<typeof emailSchema>>({
        resolver: zodResolver(emailSchema),
        mode: 'onChange',
        defaultValues: { email: '' },
    });
    const otpForm = useForm<z.infer<typeof otpSchema>>({
        resolver: zodResolver(otpSchema),
        mode: 'onChange',
        defaultValues: { code: '' },
    });
    const detailsForm = useForm<z.infer<typeof detailsSchema>>({
        resolver: zodResolver(detailsSchema),
        mode: 'onChange',
        defaultValues: { name: '', password: '', confirmPassword: '', avatar: '' },
    });

    const otpValue = otpForm.watch('code') ?? '';

    const steps = useMemo(
        () =>
            [
                { id: Step.EMAIL, title: 'Correo', Icon: Mail },
                { id: Step.OTP, title: 'Verificar', Icon: KeyRound },
                { id: Step.DETAILS, title: 'Perfil', Icon: User },
            ] as const,
        [],
    );

    const goToStep = (newStep: Step) => {
        setDirection(newStep > step ? 1 : -1);
        setStep(newStep);
    };

    // Handlers
    const onEmailSubmit = async (data: z.infer<typeof emailSchema>) => {
        setIsLoading(true);
        try {
            const res = await fetch(`${BACKEND_URL}/api/v1/auth/check-email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: data.email }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Error al verificar email');
            }

            setEmail(data.email);
            goToStep(Step.OTP);
            toast.success('Código enviado a tu email');
        } catch (error: unknown) {
            toast.error(error instanceof Error ? error.message : 'Error inesperado');
        } finally {
            setIsLoading(false);
        }
    };

    const onOtpSubmit = async (data: z.infer<typeof otpSchema>) => {
        setIsLoading(true);
        try {
            const res = await fetch(`${BACKEND_URL}/api/v1/auth/verify-code`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code: data.code }),
            });

            if (!res.ok) throw new Error('Código inválido o expirado');

            setOtp(data.code);
            goToStep(Step.DETAILS);
            toast.success('Email verificado');
        } catch (error: unknown) {
            toast.error(error instanceof Error ? error.message : 'Error inesperado');
        } finally {
            setIsLoading(false);
        }
    };

    const onDetailsSubmit = async (data: z.infer<typeof detailsSchema>) => {
        setIsLoading(true);
        try {
            const res = await fetch(`${BACKEND_URL}/api/v1/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    verificationCode: otp,
                    name: data.name,
                    password: data.password,
                    image: data.avatar,
                }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Error al registrar');
            }

            const loginRes = await signIn('credentials', {
                email,
                password: data.password,
                redirect: false,
            });

            if (loginRes?.error) {
                toast.error('Cuenta creada, pero error al iniciar sesión');
                router.push('/login');
            } else {
                toast.success('¡Bienvenido a KODE!');
                router.refresh();
                if (onSuccess) onSuccess();
            }
        } catch (error: unknown) {
            toast.error(error instanceof Error ? error.message : 'Error inesperado');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full relative overflow-hidden">
            {/* === PREMIUM FLUID STEPPER === */}
            <div className="mb-6">
                <div className="flex items-start justify-center gap-0">
                    {steps.map(({ id, title, Icon }, index) => {
                        const isActive = id === step;
                        const isDone = id < step;
                        const isLast = index === steps.length - 1;

                        return (
                            <div key={id} className="flex items-start">
                                {/* Step circle + title */}
                                <div className="flex flex-col items-center">
                                    <motion.div
                                        className={cn(
                                            'relative flex items-center justify-center w-11 h-11 rounded-full border-2 transition-colors duration-300',
                                            isActive
                                                ? 'border-orange-500 bg-orange-500/20'
                                                : isDone
                                                    ? 'border-orange-500 bg-orange-500'
                                                    : 'border-white/10 bg-black/40'
                                        )}
                                        animate={isActive ? { scale: [1, 1.05, 1] } : { scale: 1 }}
                                        transition={{ duration: 2, repeat: isActive ? Infinity : 0, ease: 'easeInOut' }}
                                    >
                                        {/* Glow effect for active */}
                                        {isActive && (
                                            <motion.div
                                                className="absolute inset-0 rounded-full bg-orange-500/30 blur-md -z-10"
                                                animate={{ opacity: [0.3, 0.6, 0.3] }}
                                                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                                            />
                                        )}

                                        {/* Icon or Check */}
                                        <AnimatePresence mode="wait">
                                            {isDone ? (
                                                <motion.div
                                                    key="check"
                                                    initial={{ scale: 0, rotate: -180 }}
                                                    animate={{ scale: 1, rotate: 0 }}
                                                    exit={{ scale: 0 }}
                                                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                                >
                                                    <Check className="w-5 h-5 text-black" strokeWidth={3} />
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    key="icon"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                >
                                                    <Icon
                                                        className={cn(
                                                            'w-5 h-5 transition-colors',
                                                            isActive ? 'text-orange-400' : 'text-white/40'
                                                        )}
                                                    />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>

                                    {/* Step title */}
                                    <span
                                        className={cn(
                                            'mt-2 text-[10px] font-semibold uppercase tracking-wider transition-colors whitespace-nowrap',
                                            isActive ? 'text-orange-400' : isDone ? 'text-white/70' : 'text-white/30'
                                        )}
                                    >
                                        {title}
                                    </span>
                                </div>

                                {/* Connector line (not for last item) */}
                                {!isLast && (
                                    <div className="flex items-center h-11 w-16 px-1">
                                        <div className="relative w-full h-0.5 bg-white/[0.08] rounded-full overflow-hidden">
                                            <motion.div
                                                className="absolute inset-y-0 left-0 bg-gradient-to-r from-orange-500 to-amber-400 rounded-full"
                                                initial={{ width: 0 }}
                                                animate={{ width: isDone ? '100%' : '0%' }}
                                                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* === STEP CONTENT === */}
            <AnimatePresence mode="wait" custom={direction} initial={false}>
                {step === Step.EMAIL && (
                    <motion.div
                        key="email"
                        custom={direction}
                        variants={stepVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    >
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            animate="show"
                            className="space-y-5"
                        >
                            <motion.div variants={staggerItem} className="text-center mb-6">
                                <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                                    Comencemos
                                </h2>
                                <p className="text-white/50 text-sm mt-1">Ingresa tu correo para continuar</p>
                            </motion.div>

                            <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-5">
                                <motion.div variants={staggerItem} className="space-y-2">
                                    <Label className="text-white/60 text-xs uppercase tracking-wider">Correo electrónico</Label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40 group-focus-within:text-orange-400 transition-colors" />
                                        <Input
                                            {...emailForm.register('email')}
                                            placeholder="tu@email.com"
                                            className="h-13 rounded-2xl border-white/[0.08] bg-white/[0.03] pl-11 text-white placeholder:text-white/25 focus-visible:ring-2 focus-visible:ring-orange-500/30 focus-visible:border-orange-500/50 transition-all"
                                            autoFocus
                                            inputMode="email"
                                            autoCapitalize="none"
                                            spellCheck={false}
                                        />
                                        {/* Focus glow */}
                                        <div className="absolute inset-0 rounded-2xl opacity-0 group-focus-within:opacity-100 pointer-events-none transition-opacity bg-gradient-to-r from-orange-500/5 to-amber-500/5 blur-xl -z-10" />
                                    </div>
                                    {emailForm.formState.errors.email && (
                                        <motion.p
                                            initial={{ opacity: 0, y: -5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-xs text-red-400 flex items-center gap-1"
                                        >
                                            <span className="inline-block w-1 h-1 rounded-full bg-red-400" />
                                            {emailForm.formState.errors.email.message}
                                        </motion.p>
                                    )}
                                </motion.div>

                                <motion.div variants={staggerItem}>
                                    <Button
                                        type="submit"
                                        className="relative w-full h-12 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 font-semibold text-black shadow-lg shadow-orange-500/25 overflow-hidden group"
                                        disabled={isLoading || !emailForm.formState.isValid}
                                    >
                                        {/* Shimmer effect */}
                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="absolute inset-0 animate-shimmer" />
                                        </div>
                                        <span className="relative flex items-center justify-center gap-2">
                                            {isLoading ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <>
                                                    Continuar
                                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                </>
                                            )}
                                        </span>
                                    </Button>
                                </motion.div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}

                {step === Step.OTP && (
                    <motion.div
                        key="otp"
                        custom={direction}
                        variants={stepVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    >
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            animate="show"
                            className="space-y-6"
                        >
                            <motion.div variants={staggerItem} className="text-center">
                                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500/20 to-amber-500/10 border border-orange-500/20 mb-4">
                                    <KeyRound className="w-7 h-7 text-orange-400" />
                                </div>
                                <h2 className="text-2xl font-bold text-white">Verifica tu email</h2>
                                <p className="text-white/50 text-sm mt-1">
                                    Ingresa el código enviado a{' '}
                                    <span className="text-orange-400 font-medium">{email ? maskEmail(email) : ''}</span>
                                </p>
                                <button
                                    onClick={() => goToStep(Step.EMAIL)}
                                    className="text-xs text-white/40 hover:text-orange-400 mt-2 transition-colors"
                                >
                                    ← Cambiar email
                                </button>
                            </motion.div>

                            {/* Quick access to email provider */}
                            {email && getEmailProvider(email) && (
                                <motion.div variants={staggerItem} className="flex justify-center">
                                    <a
                                        href={getEmailProvider(email)!.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group flex items-center gap-2.5 px-5 py-2.5 rounded-xl border transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                                        style={{
                                            borderColor: `${getEmailProvider(email)!.color}30`,
                                            backgroundColor: getEmailProvider(email)!.bgColor,
                                        }}
                                    >
                                        <Mail
                                            className="w-4 h-4 transition-colors"
                                            style={{ color: getEmailProvider(email)!.color }}
                                        />
                                        <span
                                            className="text-sm font-medium"
                                            style={{ color: getEmailProvider(email)!.color }}
                                        >
                                            Abrir {getEmailProvider(email)!.name}
                                        </span>
                                        <ExternalLink
                                            className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity"
                                            style={{ color: getEmailProvider(email)!.color }}
                                        />
                                    </a>
                                </motion.div>
                            )}

                            <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-6">
                                <motion.div variants={staggerItem} className="flex flex-col items-center">
                                    <input type="hidden" {...otpForm.register('code')} />
                                    <InputOTP
                                        maxLength={6}
                                        value={otpValue}
                                        onChange={(val) => otpForm.setValue('code', val, { shouldValidate: true })}
                                        containerClassName="justify-center gap-2"
                                    >
                                        <InputOTPGroup className="gap-2">
                                            {[0, 1, 2].map((index) => (
                                                <InputOTPSlot
                                                    key={index}
                                                    index={index}
                                                    className={cn(
                                                        'h-14 w-12 rounded-xl border-white/[0.08] bg-white/[0.03] text-white text-xl font-semibold',
                                                        'data-[active=true]:border-orange-500/50 data-[active=true]:ring-2 data-[active=true]:ring-orange-500/20',
                                                        'data-[active=true]:bg-orange-500/5 transition-all duration-200'
                                                    )}
                                                />
                                            ))}
                                        </InputOTPGroup>
                                        <div className="w-3 flex items-center justify-center">
                                            <div className="w-2 h-0.5 rounded-full bg-white/20" />
                                        </div>
                                        <InputOTPGroup className="gap-2">
                                            {[3, 4, 5].map((index) => (
                                                <InputOTPSlot
                                                    key={index}
                                                    index={index}
                                                    className={cn(
                                                        'h-14 w-12 rounded-xl border-white/[0.08] bg-white/[0.03] text-white text-xl font-semibold',
                                                        'data-[active=true]:border-orange-500/50 data-[active=true]:ring-2 data-[active=true]:ring-orange-500/20',
                                                        'data-[active=true]:bg-orange-500/5 transition-all duration-200'
                                                    )}
                                                />
                                            ))}
                                        </InputOTPGroup>
                                    </InputOTP>

                                    {/* OTP Complete indicator */}
                                    <AnimatePresence>
                                        {otpValue.length === 6 && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                exit={{ opacity: 0 }}
                                                className="mt-3 flex items-center gap-1.5 text-emerald-400 text-sm"
                                            >
                                                <Sparkles className="w-4 h-4" />
                                                <span>Código completo</span>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {otpForm.formState.errors.code && (
                                        <p className="mt-2 text-xs text-red-400">{otpForm.formState.errors.code.message}</p>
                                    )}
                                </motion.div>

                                <motion.div variants={staggerItem}>
                                    <Button
                                        type="submit"
                                        className="relative w-full h-12 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 font-semibold text-black shadow-lg shadow-orange-500/25 overflow-hidden group"
                                        disabled={isLoading || otpValue.length !== 6}
                                    >
                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="absolute inset-0 animate-shimmer" />
                                        </div>
                                        <span className="relative">
                                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verificar Código'}
                                        </span>
                                    </Button>
                                </motion.div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}

                {step === Step.DETAILS && (
                    <motion.div
                        key="details"
                        custom={direction}
                        variants={stepVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    >
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            animate="show"
                            className="space-y-5"
                        >
                            <motion.div variants={staggerItem} className="text-center mb-2">
                                <h2 className="text-2xl font-bold text-white">Crea tu perfil</h2>
                                <p className="text-white/50 text-sm mt-1">Solo falta un paso más</p>
                            </motion.div>

                            <form onSubmit={detailsForm.handleSubmit(onDetailsSubmit)} className="space-y-5">
                                {/* Avatar */}
                                <motion.div variants={staggerItem} className="flex justify-center">
                                    <FillingGlassAvatar
                                        value={detailsForm.watch('avatar')}
                                        onChange={(url) => detailsForm.setValue('avatar', url)}
                                    />
                                </motion.div>

                                {/* Name */}
                                <motion.div variants={staggerItem} className="space-y-2">
                                    <Label className="text-white/60 text-xs uppercase tracking-wider">Nombre</Label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40 group-focus-within:text-orange-400 transition-colors" />
                                        <Input
                                            {...detailsForm.register('name')}
                                            placeholder="Tu nombre"
                                            className="h-12 rounded-2xl border-white/[0.08] bg-white/[0.03] pl-11 text-white placeholder:text-white/25 focus-visible:ring-2 focus-visible:ring-orange-500/30 focus-visible:border-orange-500/50"
                                        />
                                    </div>
                                    {detailsForm.formState.errors.name && (
                                        <p className="text-xs text-red-400">{detailsForm.formState.errors.name.message}</p>
                                    )}
                                </motion.div>

                                {/* Passwords */}
                                <motion.div variants={staggerItem} className="grid grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                        <Label className="text-white/60 text-xs uppercase tracking-wider">Contraseña</Label>
                                        <div className="relative group">
                                            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40 group-focus-within:text-orange-400 transition-colors" />
                                            <Input
                                                type="password"
                                                {...detailsForm.register('password')}
                                                placeholder="••••••••"
                                                className="h-12 rounded-2xl border-white/[0.08] bg-white/[0.03] pl-10 text-white placeholder:text-white/25 focus-visible:ring-2 focus-visible:ring-orange-500/30 focus-visible:border-orange-500/50"
                                            />
                                        </div>
                                        {detailsForm.formState.errors.password && (
                                            <p className="text-xs text-red-400">{detailsForm.formState.errors.password.message}</p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-white/60 text-xs uppercase tracking-wider">Confirmar</Label>
                                        <div className="relative group">
                                            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40 group-focus-within:text-orange-400 transition-colors" />
                                            <Input
                                                type="password"
                                                {...detailsForm.register('confirmPassword')}
                                                placeholder="••••••••"
                                                className="h-12 rounded-2xl border-white/[0.08] bg-white/[0.03] pl-10 text-white placeholder:text-white/25 focus-visible:ring-2 focus-visible:ring-orange-500/30 focus-visible:border-orange-500/50"
                                            />
                                        </div>
                                        {detailsForm.formState.errors.confirmPassword && (
                                            <p className="text-xs text-red-400">{detailsForm.formState.errors.confirmPassword.message}</p>
                                        )}
                                    </div>
                                </motion.div>

                                <motion.div variants={staggerItem}>
                                    <Button
                                        type="submit"
                                        className="relative w-full h-12 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 font-semibold text-black shadow-lg shadow-orange-500/25 overflow-hidden group"
                                        disabled={isLoading || !detailsForm.formState.isValid}
                                    >
                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="absolute inset-0 animate-shimmer" />
                                        </div>
                                        <span className="relative flex items-center justify-center gap-2">
                                            {isLoading ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <>
                                                    <Sparkles className="w-4 h-4" />
                                                    Crear Cuenta
                                                </>
                                            )}
                                        </span>
                                    </Button>
                                </motion.div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
