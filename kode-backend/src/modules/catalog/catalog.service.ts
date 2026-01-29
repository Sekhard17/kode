import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CatalogFiltersDto } from './dto/catalog-filters.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CatalogService {
    constructor(private readonly prisma: PrismaService) { }

    async getCategories() {
        return this.prisma.category.findMany({
            where: { isActive: true },
            orderBy: { sortOrder: 'asc' },
        });
    }

    async getProducts(filters: CatalogFiltersDto) {
        const { categoryId, categorySlug, minPrice, maxPrice, isFeatured, page = 1, limit = 12 } = filters;
        const skip = (page - 1) * limit;

        const where: Prisma.ProductWhereInput = {
            isActive: true,
        };

        if (isFeatured !== undefined) {
            where.isFeatured = isFeatured;
        }

        if (categoryId) {
            where.categoryId = categoryId;
        } else if (categorySlug) {
            where.category = { slug: categorySlug };
        }

        if (minPrice !== undefined || maxPrice !== undefined) {
            where.variants = {
                some: {
                    priceClp: {
                        gte: minPrice,
                        lte: maxPrice,
                    },
                    isActive: true,
                },
            };
        }

        const [items, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                include: {
                    category: true,
                    images: {
                        orderBy: { sortOrder: 'asc' },
                        take: 1,
                    },
                    variants: {
                        where: { isActive: true },
                        orderBy: { priceClp: 'asc' },
                    },
                },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.product.count({ where }),
        ]);

        const formattedItems = items.map((p) => {
            const mainImage = p.images[0]?.path || null;
            const prices = p.variants.map((v) => v.priceClp);
            const minPriceClp = prices.length > 0 ? Math.min(...prices) : 0;
            const maxPriceClp = prices.length > 0 ? Math.max(...prices) : 0;
            const hasStock = p.variants.some((v) => v.stock > 0);

            return {
                id: p.id,
                name: p.name,
                slug: p.slug,
                categoryId: p.categoryId,
                categoryName: p.category?.name || null,
                categorySlug: p.category?.slug || null,
                mainImage,
                minPriceClp,
                maxPriceClp,
                hasStock,
                isFeatured: p.isFeatured,
            };
        });

        return {
            items: formattedItems,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async getProductBySlug(slug: string) {
        const product = await this.prisma.product.findUnique({
            where: { slug, isActive: true },
            include: {
                category: true,
                images: {
                    orderBy: { sortOrder: 'asc' },
                },
                variants: {
                    where: { isActive: true },
                    orderBy: { size: 'asc' },
                },
            },
        });

        if (!product) {
            throw new NotFoundException('Producto no encontrado');
        }

        return product;
    }

    // ========== ADMIN METHODS ==========

    async getProductsAdmin(page = 1, limit = 7, search?: string) {
        const skip = (page - 1) * limit;

        const where: Prisma.ProductWhereInput = {};
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { slug: { contains: search, mode: 'insensitive' } },
            ];
        }

        const [items, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                include: {
                    category: true,
                    images: {
                        orderBy: { sortOrder: 'asc' },
                        take: 1,
                    },
                    variants: {
                        orderBy: { priceClp: 'asc' },
                    },
                },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.product.count({ where }),
        ]);

        const formattedItems = items.map((p) => {
            const mainImage = p.images[0]?.path || null;
            const prices = p.variants.map((v) => v.priceClp);
            const minPriceClp = prices.length > 0 ? Math.min(...prices) : 0;
            const maxPriceClp = prices.length > 0 ? Math.max(...prices) : 0;
            const hasStock = p.variants.some((v) => v.stock > 0);
            const totalStock = p.variants.reduce((acc, v) => acc + v.stock, 0);

            return {
                id: p.id,
                name: p.name,
                slug: p.slug,
                categoryId: p.categoryId,
                categoryName: p.category?.name || null,
                categorySlug: p.category?.slug || null,
                mainImage,
                minPriceClp,
                maxPriceClp,
                hasStock,
                totalStock,
                isFeatured: p.isFeatured,
                isActive: p.isActive,
                variantsCount: p.variants.length,
                createdAt: p.createdAt,
            };
        });

        return {
            items: formattedItems,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async getProductById(id: string) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: {
                category: true,
                images: {
                    orderBy: { sortOrder: 'asc' },
                },
                variants: {
                    orderBy: { size: 'asc' },
                },
            },
        });

        if (!product) {
            throw new NotFoundException('Producto no encontrado');
        }

        return product;
    }

    async createProduct(data: CreateProductDto) {
        const existing = await this.prisma.product.findUnique({
            where: { slug: data.slug },
        });

        if (existing) {
            throw new ConflictException('Ya existe un producto con este slug');
        }

        const skus = data.variants.map((v) => v.sku);
        const existingSkus = await this.prisma.productVariant.findMany({
            where: { sku: { in: skus } },
            select: { sku: true },
        });

        if (existingSkus.length > 0) {
            throw new ConflictException(
                `Los siguientes SKUs ya existen: ${existingSkus.map((s) => s.sku).join(', ')}`,
            );
        }

        return this.prisma.$transaction(async (tx) => {
            const product = await tx.product.create({
                data: {
                    name: data.name,
                    slug: data.slug,
                    description: data.description,
                    categoryId: data.categoryId || null,
                    isFeatured: data.isFeatured,
                    isActive: data.isActive,
                    variants: {
                        create: data.variants.map((v) => ({
                            sku: v.sku,
                            size: v.size,
                            color: v.color || null,
                            priceClp: v.priceClp,
                            stock: v.stock,
                        })),
                    },
                    images: {
                        create: data.images.map((img) => ({
                            path: img.path,
                            altText: img.altText || null,
                            sortOrder: img.sortOrder,
                            isPrimary: img.isPrimary,
                        })),
                    },
                },
                include: {
                    category: true,
                    variants: true,
                    images: true,
                },
            });

            return product;
        });
    }

    async updateProduct(id: string, data: UpdateProductDto) {
        const existing = await this.prisma.product.findUnique({
            where: { id },
            include: { variants: true, images: true },
        });

        if (!existing) {
            throw new NotFoundException('Producto no encontrado');
        }

        if (data.slug && data.slug !== existing.slug) {
            const slugExists = await this.prisma.product.findUnique({
                where: { slug: data.slug },
            });
            if (slugExists) {
                throw new ConflictException('Ya existe un producto con este slug');
            }
        }

        return this.prisma.$transaction(async (tx) => {
            const productUpdate: Prisma.ProductUpdateInput = {};
            if (data.name !== undefined) productUpdate.name = data.name;
            if (data.slug !== undefined) productUpdate.slug = data.slug;
            if (data.description !== undefined) productUpdate.description = data.description;
            if (data.categoryId !== undefined) {
                productUpdate.category = data.categoryId
                    ? { connect: { id: data.categoryId } }
                    : { disconnect: true };
            }
            if (data.isFeatured !== undefined) productUpdate.isFeatured = data.isFeatured;
            if (data.isActive !== undefined) productUpdate.isActive = data.isActive;

            await tx.product.update({
                where: { id },
                data: productUpdate,
            });

            if (data.variants) {
                const existingVariantIds = existing.variants.map((v) => v.id);
                const incomingVariantIds = data.variants
                    .filter((v) => v.id)
                    .map((v) => v.id as string);

                const toDelete = existingVariantIds.filter(
                    (vid) => !incomingVariantIds.includes(vid),
                );
                if (toDelete.length > 0) {
                    await tx.productVariant.deleteMany({
                        where: { id: { in: toDelete } },
                    });
                }

                for (const variant of data.variants) {
                    if (variant.id && existingVariantIds.includes(variant.id)) {
                        await tx.productVariant.update({
                            where: { id: variant.id },
                            data: {
                                sku: variant.sku,
                                size: variant.size,
                                color: variant.color,
                                priceClp: variant.priceClp,
                                stock: variant.stock,
                            },
                        });
                    } else {
                        await tx.productVariant.create({
                            data: {
                                productId: id,
                                sku: variant.sku!,
                                size: variant.size!,
                                color: variant.color || null,
                                priceClp: variant.priceClp!,
                                stock: variant.stock ?? 0,
                            },
                        });
                    }
                }
            }

            if (data.images) {
                const existingImageIds = existing.images.map((i) => i.id);
                const incomingImageIds = data.images
                    .filter((i) => i.id)
                    .map((i) => i.id as string);

                const imagesToDelete = existingImageIds.filter(
                    (imgId) => !incomingImageIds.includes(imgId),
                );
                if (imagesToDelete.length > 0) {
                    await tx.productImage.deleteMany({
                        where: { id: { in: imagesToDelete } },
                    });
                }

                for (const image of data.images) {
                    if (image.id && existingImageIds.includes(image.id)) {
                        await tx.productImage.update({
                            where: { id: image.id },
                            data: {
                                path: image.path,
                                altText: image.altText,
                                sortOrder: image.sortOrder,
                                isPrimary: image.isPrimary,
                            },
                        });
                    } else if (image.path) {
                        await tx.productImage.create({
                            data: {
                                productId: id,
                                path: image.path,
                                altText: image.altText || null,
                                sortOrder: image.sortOrder ?? 0,
                                isPrimary: image.isPrimary ?? false,
                            },
                        });
                    }
                }
            }

            return tx.product.findUnique({
                where: { id },
                include: {
                    category: true,
                    variants: true,
                    images: { orderBy: { sortOrder: 'asc' } },
                },
            });
        });
    }

    async toggleProductActive(id: string) {
        const product = await this.prisma.product.findUnique({
            where: { id },
        });

        if (!product) {
            throw new NotFoundException('Producto no encontrado');
        }

        return this.prisma.product.update({
            where: { id },
            data: { isActive: !product.isActive },
            select: { id: true, isActive: true },
        });
    }
}
