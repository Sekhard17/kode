'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Camera, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface FillingGlassAvatarProps {
    value?: string;
    onChange: (url: string) => void;
    className?: string;
}

export function FillingGlassAvatar({ value, onChange, className }: FillingGlassAvatarProps) {
    const [progress, setProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [uploadComplete, setUploadComplete] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Solo se permiten imágenes');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.error('La imagen no debe superar los 5MB');
            return;
        }

        setIsUploading(true);
        setProgress(0);
        setUploadComplete(false);

        const progressInterval = setInterval(() => {
            setProgress(p => {
                if (p >= 90) return 90;
                const diff = 90 - p;
                return p + Math.max(1, diff * 0.12);
            });
        }, 120);

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('bucket', 'avatares-registro');

            const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:4000';
            const res = await fetch(`${BACKEND_URL}/api/v1/storage/upload-avatar`, {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) throw new Error('Error al subir');

            const data = await res.json();
            const url = data.url;

            clearInterval(progressInterval);
            setProgress(100);
            setUploadComplete(true);

            setTimeout(() => {
                onChange(url);
                setIsUploading(false);
                setProgress(0);
                setUploadComplete(false);
                toast.success('Avatar subido');
            }, 800);

        } catch (error) {
            clearInterval(progressInterval);
            setIsUploading(false);
            setProgress(0);
            toast.error('Error al subir la imagen');
            console.error(error);
        }
    };

    const clearImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange('');
        if (inputRef.current) inputRef.current.value = '';
    };

    return (
        <div
            className={cn("relative cursor-pointer group", className)}
            onClick={() => !isUploading && inputRef.current?.click()}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                disabled={isUploading}
            />

            {/* Outer glow ring */}
            <motion.div
                className="absolute -inset-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                    background: 'linear-gradient(135deg, rgba(249,115,22,0.3) 0%, rgba(251,191,36,0.2) 50%, rgba(249,115,22,0.3) 100%)',
                    filter: 'blur(8px)',
                }}
            />

            {/* Main container - 3D Glass effect */}
            <div className="relative w-28 h-28">
                {/* Background glass layer */}
                <div className={cn(
                    "absolute inset-0 rounded-full transition-all duration-500",
                    value
                        ? "bg-gradient-to-br from-orange-500/20 to-amber-500/10"
                        : "bg-gradient-to-br from-white/[0.04] to-white/[0.01]"
                )} />

                {/* Border */}
                <div className={cn(
                    "absolute inset-0 rounded-full border-2 transition-all duration-300",
                    value
                        ? "border-orange-500/50"
                        : isHovered
                            ? "border-orange-500/30"
                            : "border-white/[0.08] border-dashed"
                )} />

                {/* Inner shadow for depth */}
                <div className="absolute inset-1 rounded-full shadow-inner shadow-black/20" />

                {/* Content container */}
                <div className="absolute inset-0 rounded-full overflow-hidden flex items-center justify-center">
                    {/* Empty state */}
                    {!value && !isUploading && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center gap-1 text-white/30 group-hover:text-orange-400 transition-colors duration-300"
                        >
                            <Camera className="w-7 h-7" />
                            <span className="text-[9px] font-semibold uppercase tracking-widest">Foto</span>
                        </motion.div>
                    )}

                    {/* Uploaded image */}
                    {value && !isUploading && (
                        <motion.img
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                            src={value}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                        />
                    )}

                    {/* Upload progress - Liquid fill */}
                    <AnimatePresence>
                        {isUploading && (
                            <>
                                {/* Liquid fill */}
                                <motion.div
                                    initial={{ height: '0%' }}
                                    animate={{ height: `${progress}%` }}
                                    transition={{ type: 'spring', stiffness: 40, damping: 15 }}
                                    className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-orange-500 via-orange-400 to-amber-400"
                                >
                                    {/* Wave effect at top */}
                                    <svg
                                        className="absolute -top-2 left-0 w-full h-4"
                                        viewBox="0 0 120 10"
                                        preserveAspectRatio="none"
                                    >
                                        <motion.path
                                            d="M0,5 Q15,0 30,5 T60,5 T90,5 T120,5 V10 H0 Z"
                                            fill="currentColor"
                                            className="text-orange-400"
                                            animate={{
                                                d: [
                                                    "M0,5 Q15,0 30,5 T60,5 T90,5 T120,5 V10 H0 Z",
                                                    "M0,5 Q15,10 30,5 T60,5 T90,5 T120,5 V10 H0 Z",
                                                    "M0,5 Q15,0 30,5 T60,5 T90,5 T120,5 V10 H0 Z",
                                                ]
                                            }}
                                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                                        />
                                    </svg>

                                    {/* Bubbles */}
                                    <div className="absolute inset-0 overflow-hidden">
                                        <motion.div
                                            className="absolute w-2 h-2 rounded-full bg-white/30"
                                            initial={{ bottom: 0, left: '20%' }}
                                            animate={{ bottom: '100%', opacity: [0.3, 0.6, 0] }}
                                            transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                                        />
                                        <motion.div
                                            className="absolute w-1.5 h-1.5 rounded-full bg-white/20"
                                            initial={{ bottom: 0, left: '50%' }}
                                            animate={{ bottom: '100%', opacity: [0.2, 0.5, 0] }}
                                            transition={{ duration: 1.8, repeat: Infinity, delay: 0.3 }}
                                        />
                                        <motion.div
                                            className="absolute w-1 h-1 rounded-full bg-white/40"
                                            initial={{ bottom: 0, left: '75%' }}
                                            animate={{ bottom: '100%', opacity: [0.4, 0.7, 0] }}
                                            transition={{ duration: 1.2, repeat: Infinity, delay: 0.6 }}
                                        />
                                    </div>
                                </motion.div>

                                {/* Progress text or check */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="absolute z-20 flex items-center justify-center"
                                >
                                    {uploadComplete ? (
                                        <motion.div
                                            initial={{ scale: 0, rotate: -180 }}
                                            animate={{ scale: 1, rotate: 0 }}
                                            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                                            className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/50"
                                        >
                                            <Check className="w-6 h-6 text-white" strokeWidth={3} />
                                        </motion.div>
                                    ) : (
                                        <span className="text-lg font-bold text-white drop-shadow-lg">
                                            {Math.round(progress)}%
                                        </span>
                                    )}
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>

                    {/* Hover overlay for existing image */}
                    {value && !isUploading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: isHovered ? 1 : 0 }}
                            className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center"
                        >
                            <div className="flex flex-col items-center text-white">
                                <Upload className="w-6 h-6 mb-1" />
                                <span className="text-[10px] font-medium">Cambiar</span>
                            </div>
                            <button
                                onClick={clearImage}
                                className="absolute top-2 right-2 bg-red-500/90 hover:bg-red-500 text-white p-1.5 rounded-full shadow-lg transition-all hover:scale-110"
                                title="Eliminar"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </motion.div>
                    )}
                </div>

                {/* Specular highlight - top left */}
                <div className="pointer-events-none absolute top-3 left-4 w-10 h-5 bg-gradient-to-br from-white/25 to-transparent rounded-full blur-sm rotate-[-30deg]" />

                {/* Secondary highlight - smaller */}
                <div className="pointer-events-none absolute top-6 left-7 w-3 h-2 bg-white/30 rounded-full blur-[2px] rotate-[-30deg]" />

                {/* Glass rim highlight */}
                <div className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ring-white/[0.08]" />
            </div>

            {/* Label below */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center mt-2 text-[10px] text-white/30 font-medium uppercase tracking-widest"
            >
                {value ? 'Tu avatar' : 'Opcional'}
            </motion.p>
        </div>
    );
}
