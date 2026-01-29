'use client';

import { useState, useCallback, useMemo } from 'react';
import {
    ProductFormData,
    VariantFormData,
    ImageFormData,
    ProductFullDetail,
} from '@/features/catalog/types';

// Utility to generate slug from name
function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}

// Utility to generate SKU
function generateSku(productName: string, size: string, color: string): string {
    const prefix = productName.substring(0, 3).toUpperCase();
    const sizeCode = size.toUpperCase();
    const colorCode = color ? color.substring(0, 3).toUpperCase() : 'STD';
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `${prefix}-${sizeCode}-${colorCode}-${random}`;
}

const INITIAL_FORM_DATA: ProductFormData = {
    name: '',
    slug: '',
    description: '',
    categoryId: null,
    isFeatured: false,
    isActive: true,
    variants: [],
    images: [],
};

const INITIAL_VARIANT: VariantFormData = {
    sku: '',
    size: '',
    color: '',
    priceClp: 0,
    stock: 0,
};

export type ProductFormStep = 'basic' | 'variants' | 'images' | 'preview';

interface ValidationErrors {
    name?: string;
    slug?: string;
    variants?: string;
    images?: string;
}

interface UseProductFormReturn {
    formData: ProductFormData;
    currentStep: ProductFormStep;
    steps: ProductFormStep[];
    currentStepIndex: number;
    errors: ValidationErrors;
    isValid: boolean;
    isStepValid: (step: ProductFormStep) => boolean;

    // Navigation
    goToStep: (step: ProductFormStep) => void;
    nextStep: () => void;
    prevStep: () => void;
    canGoNext: boolean;
    canGoPrev: boolean;

    // Basic info
    setName: (name: string) => void;
    setSlug: (slug: string) => void;
    setDescription: (description: string) => void;
    setCategoryId: (categoryId: string | null) => void;
    setIsFeatured: (isFeatured: boolean) => void;
    setIsActive: (isActive: boolean) => void;

    // Variants
    addVariant: () => void;
    removeVariant: (index: number) => void;
    updateVariant: (index: number, field: keyof VariantFormData, value: string | number) => void;

    // Images
    addImage: (file: File) => void;
    removeImage: (index: number) => void;
    setImageAsPrimary: (index: number) => void;
    reorderImages: (fromIndex: number, toIndex: number) => void;
    updateImageAltText: (index: number, altText: string) => void;

    // Form actions
    reset: () => void;
    loadProduct: (product: ProductFullDetail) => void;
    getPayload: () => ProductFormData;
}

export function useProductForm(initialProduct?: ProductFullDetail): UseProductFormReturn {
    const steps: ProductFormStep[] = ['basic', 'variants', 'images', 'preview'];

    const [formData, setFormData] = useState<ProductFormData>(() => {
        if (initialProduct) {
            return {
                name: initialProduct.name,
                slug: initialProduct.slug,
                description: initialProduct.description || '',
                categoryId: initialProduct.categoryId,
                isFeatured: initialProduct.isFeatured,
                isActive: initialProduct.isActive,
                variants: initialProduct.variants.map((v) => ({
                    id: v.id,
                    sku: v.sku,
                    size: v.size,
                    color: v.color || '',
                    priceClp: v.priceClp,
                    stock: v.stock,
                })),
                images: initialProduct.images.map((img) => ({
                    id: img.id,
                    path: img.path,
                    altText: img.altText || '',
                    sortOrder: img.sortOrder,
                    isPrimary: img.isPrimary,
                })),
            };
        }
        return INITIAL_FORM_DATA;
    });

    const [currentStep, setCurrentStep] = useState<ProductFormStep>('basic');

    // Validation
    const errors = useMemo<ValidationErrors>(() => {
        const errs: ValidationErrors = {};

        if (!formData.name.trim()) {
            errs.name = 'El nombre es requerido';
        }

        if (!formData.slug.trim()) {
            errs.slug = 'El slug es requerido';
        } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(formData.slug)) {
            errs.slug = 'Slug inválido (solo letras minúsculas, números y guiones)';
        }

        if (formData.variants.length === 0) {
            errs.variants = 'Debe agregar al menos una variante';
        } else {
            const invalidVariants = formData.variants.some(
                (v) => !v.sku || !v.size || v.priceClp <= 0
            );
            if (invalidVariants) {
                errs.variants = 'Todas las variantes deben tener SKU, talla y precio válido';
            }
        }

        return errs;
    }, [formData]);

    const isStepValid = useCallback((step: ProductFormStep): boolean => {
        switch (step) {
            case 'basic':
                return !errors.name && !errors.slug && formData.name.trim() !== '' && formData.slug.trim() !== '';
            case 'variants':
                return !errors.variants && formData.variants.length > 0;
            case 'images':
                return true; // Images are optional
            case 'preview':
                return true;
            default:
                return false;
        }
    }, [errors, formData]);

    const isValid = useMemo(() => {
        return Object.keys(errors).length === 0 && formData.variants.length > 0;
    }, [errors, formData.variants.length]);

    const currentStepIndex = steps.indexOf(currentStep);
    const canGoNext = currentStepIndex < steps.length - 1 && isStepValid(currentStep);
    const canGoPrev = currentStepIndex > 0;

    // Navigation
    const goToStep = useCallback((step: ProductFormStep) => {
        setCurrentStep(step);
    }, []);

    const nextStep = useCallback(() => {
        if (canGoNext) {
            setCurrentStep(steps[currentStepIndex + 1]);
        }
    }, [canGoNext, currentStepIndex, steps]);

    const prevStep = useCallback(() => {
        if (canGoPrev) {
            setCurrentStep(steps[currentStepIndex - 1]);
        }
    }, [canGoPrev, currentStepIndex, steps]);

    // Basic info setters
    const setName = useCallback((name: string) => {
        setFormData((prev) => ({
            ...prev,
            name,
            slug: prev.slug || generateSlug(name),
        }));
    }, []);

    const setSlug = useCallback((slug: string) => {
        setFormData((prev) => ({ ...prev, slug }));
    }, []);

    const setDescription = useCallback((description: string) => {
        setFormData((prev) => ({ ...prev, description }));
    }, []);

    const setCategoryId = useCallback((categoryId: string | null) => {
        setFormData((prev) => ({ ...prev, categoryId }));
    }, []);

    const setIsFeatured = useCallback((isFeatured: boolean) => {
        setFormData((prev) => ({ ...prev, isFeatured }));
    }, []);

    const setIsActive = useCallback((isActive: boolean) => {
        setFormData((prev) => ({ ...prev, isActive }));
    }, []);

    // Variants
    const addVariant = useCallback(() => {
        setFormData((prev) => ({
            ...prev,
            variants: [
                ...prev.variants,
                {
                    ...INITIAL_VARIANT,
                    sku: generateSku(prev.name || 'PRD', 'M', ''),
                },
            ],
        }));
    }, []);

    const removeVariant = useCallback((index: number) => {
        setFormData((prev) => ({
            ...prev,
            variants: prev.variants.filter((_, i) => i !== index),
        }));
    }, []);

    const updateVariant = useCallback(
        (index: number, field: keyof VariantFormData, value: string | number) => {
            setFormData((prev) => ({
                ...prev,
                variants: prev.variants.map((v, i) =>
                    i === index ? { ...v, [field]: value } : v
                ),
            }));
        },
        []
    );

    // Images
    const addImage = useCallback((file: File) => {
        const preview = URL.createObjectURL(file);
        const newImage: ImageFormData = {
            file,
            altText: '',
            sortOrder: formData.images.length,
            isPrimary: formData.images.length === 0,
            preview,
        };
        setFormData((prev) => ({
            ...prev,
            images: [...prev.images, newImage],
        }));
    }, [formData.images.length]);

    const removeImage = useCallback((index: number) => {
        setFormData((prev) => {
            const newImages = prev.images.filter((_, i) => i !== index);
            // If removed primary, make first one primary
            if (prev.images[index]?.isPrimary && newImages.length > 0) {
                newImages[0].isPrimary = true;
            }
            // Update sortOrder
            return {
                ...prev,
                images: newImages.map((img, i) => ({ ...img, sortOrder: i })),
            };
        });
    }, []);

    const setImageAsPrimary = useCallback((index: number) => {
        setFormData((prev) => ({
            ...prev,
            images: prev.images.map((img, i) => ({
                ...img,
                isPrimary: i === index,
            })),
        }));
    }, []);

    const reorderImages = useCallback((fromIndex: number, toIndex: number) => {
        setFormData((prev) => {
            const newImages = [...prev.images];
            const [movedItem] = newImages.splice(fromIndex, 1);
            newImages.splice(toIndex, 0, movedItem);
            return {
                ...prev,
                images: newImages.map((img, i) => ({ ...img, sortOrder: i })),
            };
        });
    }, []);

    const updateImageAltText = useCallback((index: number, altText: string) => {
        setFormData((prev) => ({
            ...prev,
            images: prev.images.map((img, i) =>
                i === index ? { ...img, altText } : img
            ),
        }));
    }, []);

    // Form actions
    const reset = useCallback(() => {
        setFormData(INITIAL_FORM_DATA);
        setCurrentStep('basic');
    }, []);

    const loadProduct = useCallback((product: ProductFullDetail) => {
        setFormData({
            name: product.name,
            slug: product.slug,
            description: product.description || '',
            categoryId: product.categoryId,
            isFeatured: product.isFeatured,
            isActive: product.isActive,
            variants: product.variants.map((v) => ({
                id: v.id,
                sku: v.sku,
                size: v.size,
                color: v.color || '',
                priceClp: v.priceClp,
                stock: v.stock,
            })),
            images: product.images.map((img) => ({
                id: img.id,
                path: img.path,
                altText: img.altText || '',
                sortOrder: img.sortOrder,
                isPrimary: img.isPrimary,
            })),
        });
        setCurrentStep('basic');
    }, []);

    const getPayload = useCallback(() => formData, [formData]);

    return {
        formData,
        currentStep,
        steps,
        currentStepIndex,
        errors,
        isValid,
        isStepValid,
        goToStep,
        nextStep,
        prevStep,
        canGoNext,
        canGoPrev,
        setName,
        setSlug,
        setDescription,
        setCategoryId,
        setIsFeatured,
        setIsActive,
        addVariant,
        removeVariant,
        updateVariant,
        addImage,
        removeImage,
        setImageAsPrimary,
        reorderImages,
        updateImageAltText,
        reset,
        loadProduct,
        getPayload,
    };
}
