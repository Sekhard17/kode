import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CatalogFiltersDto } from './dto/catalog-filters.dto';

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

        const where: any = {
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

        // Transform to ListItem format (simplifying for catalog view)
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
}
