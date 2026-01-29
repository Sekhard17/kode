'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Category } from '@/features/catalog/types';
import { Star, Eye } from 'lucide-react';

interface ProductBasicInfoProps {
    name: string;
    slug: string;
    description: string;
    categoryId: string | null;
    isFeatured: boolean;
    isActive: boolean;
    categories: Category[];
    errors: {
        name?: string;
        slug?: string;
    };
    onNameChange: (name: string) => void;
    onSlugChange: (slug: string) => void;
    onDescriptionChange: (description: string) => void;
    onCategoryChange: (categoryId: string | null) => void;
    onFeaturedChange: (isFeatured: boolean) => void;
    onActiveChange: (isActive: boolean) => void;
}

export function ProductBasicInfo({
    name,
    slug,
    description,
    categoryId,
    isFeatured,
    isActive,
    categories,
    errors,
    onNameChange,
    onSlugChange,
    onDescriptionChange,
    onCategoryChange,
    onFeaturedChange,
    onActiveChange,
}: ProductBasicInfoProps) {
    return (
        <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
                {/* Name */}
                <div className="space-y-2">
                    <Label htmlFor="name" className="text-white font-medium">
                        Nombre del producto *
                    </Label>
                    <Input
                        id="name"
                        value={name}
                        onChange={(e) => onNameChange(e.target.value)}
                        placeholder="Ej: Polera Negra Básica"
                        className="bg-zinc-900 border-zinc-800 focus-visible:ring-orange-500/30"
                    />
                    {errors.name && (
                        <p className="text-sm text-red-400">{errors.name}</p>
                    )}
                </div>

                {/* Slug */}
                <div className="space-y-2">
                    <Label htmlFor="slug" className="text-white font-medium">
                        Slug (URL) *
                    </Label>
                    <Input
                        id="slug"
                        value={slug}
                        onChange={(e) => onSlugChange(e.target.value.toLowerCase())}
                        placeholder="polera-negra-basica"
                        className="bg-zinc-900 border-zinc-800 focus-visible:ring-orange-500/30 font-mono text-sm"
                    />
                    <p className="text-xs text-zinc-500">
                        URL: /producto/{slug || 'slug-del-producto'}
                    </p>
                    {errors.slug && (
                        <p className="text-sm text-red-400">{errors.slug}</p>
                    )}
                </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
                <Label htmlFor="description" className="text-white font-medium">
                    Descripción
                </Label>
                <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => onDescriptionChange(e.target.value)}
                    placeholder="Describe el producto..."
                    rows={4}
                    className="bg-zinc-900 border-zinc-800 focus-visible:ring-orange-500/30 resize-none"
                />
            </div>

            {/* Category */}
            <div className="space-y-2">
                <Label className="text-white font-medium">Categoría</Label>
                <Select
                    value={categoryId || 'unassigned'}
                    onValueChange={(value) =>
                        onCategoryChange(value === 'unassigned' ? null : value)
                    }
                >
                    <SelectTrigger className="bg-zinc-900 border-zinc-800">
                        <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800">
                        <SelectItem value="unassigned">Sin categoría</SelectItem>
                        {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                                {cat.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Toggles */}
            <div className="pt-4 border-t border-zinc-800">
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex items-center justify-between gap-4 rounded-xl bg-zinc-900/40 border border-zinc-800 px-4 py-3">
                        <div className="flex items-center gap-3">
                            <Star className="h-4 w-4 text-orange-400" />
                            <Label htmlFor="featured" className="cursor-pointer">
                                <span className="text-zinc-200 font-medium">Producto destacado</span>
                                <p className="text-xs text-zinc-500 mt-0.5">Aparece en secciones destacadas.</p>
                            </Label>
                        </div>
                        <Switch
                            id="featured"
                            checked={isFeatured}
                            onCheckedChange={onFeaturedChange}
                            className="data-[state=checked]:bg-orange-500"
                        />
                    </div>

                    <div className="flex items-center justify-between gap-4 rounded-xl bg-zinc-900/40 border border-zinc-800 px-4 py-3">
                        <div className="flex items-center gap-3">
                            <Eye className="h-4 w-4 text-emerald-400" />
                            <Label htmlFor="active" className="cursor-pointer">
                                <span className="text-zinc-200 font-medium">Visible en tienda</span>
                                <p className="text-xs text-zinc-500 mt-0.5">Controla si se muestra al público.</p>
                            </Label>
                        </div>
                        <Switch
                            id="active"
                            checked={isActive}
                            onCheckedChange={onActiveChange}
                            className="data-[state=checked]:bg-emerald-500"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
