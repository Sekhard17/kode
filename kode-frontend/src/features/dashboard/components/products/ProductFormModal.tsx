'use client';

import { useEffect, useState, useTransition } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useProductForm, ProductFormStep } from '@/features/dashboard/hooks/use-product-form';
import { ProductBasicInfo } from './ProductBasicInfo';
import { ProductVariants } from './ProductVariants';
import { ProductImages } from './ProductImages';
import { ProductPreview } from './ProductPreview';
import { Category, ProductFullDetail, CreateProductPayload } from '@/features/catalog/types';
import { createProduct, updateProduct, uploadProductImage } from '@/features/dashboard/services/admin-products.service';
import { ChevronLeft, ChevronRight, Loader2, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductFormModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    categories: Category[];
    product?: ProductFullDetail;
    onSuccess?: () => void;
}

const STEP_LABELS: Record<ProductFormStep, string> = {
    basic: 'Información',
    variants: 'Variantes',
    images: 'Imágenes',
    preview: 'Vista previa',
};

export function ProductFormModal({
    open,
    onOpenChange,
    categories,
    product,
    onSuccess,
}: ProductFormModalProps) {
    const isEditing = !!product;
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    const form = useProductForm(product);

    const handleSubmit = async () => {
        setError(null);

        startTransition(async () => {
            try {
                // First, upload any new images
                const uploadedImages = await Promise.all(
                    form.formData.images.map(async (img, index) => {
                        if (img.file) {
                            const formData = new FormData();
                            formData.append('file', img.file);
                            const result = await uploadProductImage(formData);
                            return {
                                path: result.path,
                                altText: img.altText || undefined,
                                sortOrder: index,
                                isPrimary: img.isPrimary,
                            };
                        }
                        return {
                            id: img.id,
                            path: img.path,
                            altText: img.altText || undefined,
                            sortOrder: index,
                            isPrimary: img.isPrimary,
                        };
                    })
                );

                const payload: CreateProductPayload = {
                    name: form.formData.name,
                    slug: form.formData.slug,
                    description: form.formData.description || undefined,
                    categoryId: form.formData.categoryId || undefined,
                    isFeatured: form.formData.isFeatured,
                    isActive: form.formData.isActive,
                    variants: form.formData.variants.map((v) => ({
                        sku: v.sku,
                        size: v.size,
                        color: v.color || undefined,
                        priceClp: v.priceClp,
                        stock: v.stock,
                    })),
                    images: uploadedImages.filter((img) => img.path) as CreateProductPayload['images'],
                };

                if (isEditing && product) {
                    await updateProduct(product.id, {
                        ...payload,
                        variants: form.formData.variants.map((v) => ({
                            id: v.id,
                            sku: v.sku,
                            size: v.size,
                            color: v.color || undefined,
                            priceClp: v.priceClp,
                            stock: v.stock,
                        })),
                        images: uploadedImages,
                    });
                } else {
                    await createProduct(payload);
                }

                form.reset();
                onOpenChange(false);
                onSuccess?.();
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Error al guardar producto');
            }
        });
    };

    const handleClose = () => {
        if (!isPending) {
            form.reset();
            onOpenChange(false);
        }
    };

    const canJumpToStep = (index: number) => index <= form.currentStepIndex;
    const progressPct =
        form.steps.length <= 1 ? 0 : Math.round((form.currentStepIndex / (form.steps.length - 1)) * 100);

    useEffect(() => {
        if (!open) return;

        setError(null);

        if (product) {
            form.loadProduct(product);
            return;
        }

        // New product flow
        form.reset();
    }, [open, product?.id]);

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent
                className={cn(
                    'max-w-[calc(100vw-2rem)] sm:max-w-4xl lg:max-w-5xl xl:max-w-6xl',
                    'max-h-[90vh] overflow-hidden flex flex-col',
                    'p-0 rounded-2xl bg-zinc-950 border border-zinc-800/80 shadow-2xl',
                )}
                onInteractOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => isPending && e.preventDefault()}
            >
                {/* Top Bar */}
                <div className="flex-shrink-0 border-b border-zinc-800/80 px-6 py-5">
                    <DialogHeader className="gap-0">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <DialogTitle className="text-xl font-bold text-white">
                                    {isEditing ? 'Editar producto' : 'Nuevo producto'}
                                </DialogTitle>
                                <p className="text-sm text-zinc-500 mt-1">
                                    Completa los pasos para {isEditing ? 'actualizar' : 'crear'} el producto.
                                </p>
                            </div>

                            <div className="hidden sm:flex flex-col items-end gap-2 pt-4">
                                <span className="text-xs font-bold uppercase tracking-[0.25em] text-zinc-500">
                                    Paso {form.currentStepIndex + 1}/{form.steps.length}
                                </span>
                                <div className="h-1.5 w-40 rounded-full bg-zinc-900 overflow-hidden">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-300"
                                        style={{ width: `${progressPct}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Stepper */}
                        <nav className="mt-5">
                            <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                                {form.steps.map((step, index) => {
                                    const disabled = isPending || !canJumpToStep(index);
                                    const isActive = form.currentStep === step;
                                    const isDone = form.currentStepIndex > index;

                                    return (
                                        <button
                                            key={step}
                                            type="button"
                                            onClick={() => {
                                                if (!disabled) form.goToStep(step);
                                            }}
                                            disabled={disabled}
                                            aria-current={isActive ? 'step' : undefined}
                                            className={cn(
                                                'group flex items-center gap-2 rounded-full border px-3 py-2 transition-colors',
                                                'min-w-[160px] justify-start',
                                                disabled
                                                    ? 'opacity-60 cursor-not-allowed border-zinc-900 bg-zinc-950'
                                                    : 'border-zinc-800 bg-zinc-950 hover:bg-zinc-900/40 hover:border-orange-500/20',
                                                isActive && 'border-orange-500/30 bg-zinc-900/50'
                                            )}
                                        >
                                            <span
                                                className={cn(
                                                    'inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-black transition-colors',
                                                    isDone
                                                        ? 'bg-orange-500 text-black'
                                                        : isActive
                                                            ? 'bg-orange-500/15 text-orange-400 ring-1 ring-orange-500/30'
                                                            : 'bg-zinc-900 text-zinc-500 ring-1 ring-zinc-800'
                                                )}
                                            >
                                                {isDone ? <Check className="h-4 w-4" /> : index + 1}
                                            </span>
                                            <span className={cn('text-sm font-semibold', isActive ? 'text-white' : 'text-zinc-300')}>
                                                {STEP_LABELS[step]}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </nav>
                    </DialogHeader>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-6 py-6">
                    <div className="mx-auto w-full max-w-5xl">
                        {form.currentStep === 'basic' && (
                            <ProductBasicInfo
                                name={form.formData.name}
                                slug={form.formData.slug}
                                description={form.formData.description}
                                categoryId={form.formData.categoryId}
                                isFeatured={form.formData.isFeatured}
                                isActive={form.formData.isActive}
                                categories={categories}
                                errors={form.errors}
                                onNameChange={form.setName}
                                onSlugChange={form.setSlug}
                                onDescriptionChange={form.setDescription}
                                onCategoryChange={form.setCategoryId}
                                onFeaturedChange={form.setIsFeatured}
                                onActiveChange={form.setIsActive}
                            />
                        )}

                        {form.currentStep === 'variants' && (
                            <ProductVariants
                                variants={form.formData.variants}
                                error={form.errors.variants}
                                onAddVariant={form.addVariant}
                                onRemoveVariant={form.removeVariant}
                                onUpdateVariant={form.updateVariant}
                            />
                        )}

                        {form.currentStep === 'images' && (
                            <ProductImages
                                images={form.formData.images}
                                onAddImage={form.addImage}
                                onRemoveImage={form.removeImage}
                                onSetPrimary={form.setImageAsPrimary}
                                onUpdateAltText={form.updateImageAltText}
                            />
                        )}

                        {form.currentStep === 'preview' && (
                            <ProductPreview
                                formData={form.formData}
                                categories={categories}
                            />
                        )}
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="flex-shrink-0 mx-6 mb-4 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                        {error}
                    </div>
                )}

                {/* Footer Actions */}
                <div className="flex-shrink-0 flex items-center justify-between border-t border-zinc-800/80 px-6 py-4">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={form.prevStep}
                        disabled={!form.canGoPrev || isPending}
                        className="gap-2"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Anterior
                    </Button>

                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={isPending}
                            className="border-zinc-800"
                        >
                            Cancelar
                        </Button>

                        {form.currentStep === 'preview' ? (
                            <Button
                                type="button"
                                onClick={handleSubmit}
                                disabled={!form.isValid || isPending}
                                className="bg-orange-500 hover:bg-orange-400 text-black font-bold gap-2 min-w-[120px]"
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Guardando...
                                    </>
                                ) : (
                                    <>
                                        <Check className="h-4 w-4" />
                                        {isEditing ? 'Actualizar' : 'Crear producto'}
                                    </>
                                )}
                            </Button>
                        ) : (
                            <Button
                                type="button"
                                onClick={form.nextStep}
                                disabled={!form.canGoNext || isPending}
                                className="bg-orange-500 hover:bg-orange-400 text-black font-bold gap-2"
                            >
                                Siguiente
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
