'use client';

import { useCallback } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ImageFormData } from '@/features/catalog/types';
import { Upload, X, Star, GripVertical } from 'lucide-react';

interface ProductImagesProps {
    images: ImageFormData[];
    onAddImage: (file: File) => void;
    onRemoveImage: (index: number) => void;
    onSetPrimary: (index: number) => void;
    onUpdateAltText: (index: number, altText: string) => void;
}

export function ProductImages({
    images,
    onAddImage,
    onRemoveImage,
    onSetPrimary,
    onUpdateAltText,
}: ProductImagesProps) {
    const handleDrop = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            const files = Array.from(e.dataTransfer.files);
            files.forEach((file) => {
                if (file.type.startsWith('image/')) {
                    onAddImage(file);
                }
            });
        },
        [onAddImage]
    );

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    }, []);

    const handleFileSelect = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const files = Array.from(e.target.files || []);
            files.forEach((file) => {
                if (file.type.startsWith('image/')) {
                    onAddImage(file);
                }
            });
            e.target.value = '';
        },
        [onAddImage]
    );

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-white font-medium">Imágenes del producto</h3>
                <p className="text-sm text-zinc-500">
                    Arrastra y suelta imágenes o haz click para seleccionar
                </p>
            </div>

            {/* Drop Zone */}
            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="border-2 border-dashed border-zinc-800 hover:border-orange-500/50 rounded-xl p-8 text-center transition-colors cursor-pointer"
            >
                <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                    <Upload className="h-10 w-10 mx-auto text-zinc-600 mb-3" />
                    <p className="text-zinc-400 font-medium">
                        Arrastra imágenes aquí
                    </p>
                    <p className="text-sm text-zinc-600 mt-1">
                        o haz click para seleccionar
                    </p>
                    <p className="text-xs text-zinc-700 mt-2">
                        JPG, PNG, WebP • Máx 10MB
                    </p>
                </label>
            </div>

            {/* Images Grid */}
            {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map((image, index) => (
                        <div
                            key={index}
                            className="relative group bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden"
                        >
                            {/* Image */}
                            <div className="relative aspect-square">
                                <Image
                                    src={image.preview || image.path || ''}
                                    alt={image.altText || `Imagen ${index + 1}`}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 640px) 50vw, 25vw"
                                />

                                {/* Primary Badge */}
                                {image.isPrimary && (
                                    <div className="absolute top-2 left-2 bg-orange-500 text-black text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                                        Principal
                                    </div>
                                )}

                                {/* Overlay Actions */}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => onSetPrimary(index)}
                                        className={`h-8 w-8 ${image.isPrimary
                                                ? 'text-orange-500'
                                                : 'text-white hover:text-orange-400'
                                            }`}
                                        title="Marcar como principal"
                                    >
                                        <Star className="h-4 w-4" fill={image.isPrimary ? 'currentColor' : 'none'} />
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => onRemoveImage(index)}
                                        className="h-8 w-8 text-white hover:text-red-400"
                                        title="Eliminar"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>

                                {/* Drag Handle */}
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <GripVertical className="h-4 w-4 text-white/50" />
                                </div>
                            </div>

                            {/* Alt Text Input */}
                            <div className="p-2">
                                <Input
                                    value={image.altText}
                                    onChange={(e) => onUpdateAltText(index, e.target.value)}
                                    placeholder="Texto alternativo"
                                    className="h-8 text-xs bg-zinc-800 border-zinc-700"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {images.length === 0 && (
                <p className="text-center text-zinc-600 text-sm py-4">
                    Las imágenes son opcionales pero recomendadas
                </p>
            )}
        </div>
    );
}
