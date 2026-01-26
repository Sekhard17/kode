import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // 1. Create Admin User
    const adminPassword = await argon2.hash('Admin123!');
    await prisma.user.upsert({
        where: { email: 'admin@kode.com' },
        update: {},
        create: {
            email: 'admin@kode.com',
            passwordHash: adminPassword,
            name: 'KODE Admin',
            role: 'ADMIN',
        },
    });
    console.log('✅ Admin user created');

    // 2. Create Categories
    const categories = [
        { name: 'Polerones', slug: 'polerones', description: 'Streetwear hoodies' },
        { name: 'Poleras', slug: 'poleras', description: 'Premium cotton tees' },
        { name: 'Pantalones', slug: 'pantalones', description: 'Comfortable cargo & joggers' },
        { name: 'Accesorios', slug: 'accesorios', description: 'Essential style items' },
    ];

    for (const cat of categories) {
        await prisma.category.upsert({
            where: { slug: cat.slug },
            update: {},
            create: {
                name: cat.name,
                slug: cat.slug,
                description: cat.description,
                isActive: true,
                sortOrder: categories.indexOf(cat),
            },
        });
    }
    console.log('✅ Categories created');

    const poleronesCat = await prisma.category.findUnique({ where: { slug: 'polerones' } });
    const polerasCat = await prisma.category.findUnique({ where: { slug: 'poleras' } });

    // 3. Create Products
    const products = [
        {
            name: 'Oversized Hoodie Black',
            slug: 'oversized-hoodie-black',
            description: 'Polerón oversized de alto gramaje con bordado minimalista.',
            categoryId: poleronesCat?.id,
            isFeatured: true,
            variants: [
                { sku: 'HOD-BLK-S', size: 'S', priceClp: 45000, stock: 10 },
                { sku: 'HOD-BLK-M', size: 'M', priceClp: 45000, stock: 15 },
                { sku: 'HOD-BLK-L', size: 'L', priceClp: 45000, stock: 8 },
            ],
            images: [
                { path: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800', altText: 'Hoodie Black Front', isPrimary: true },
            ],
        },
        {
            name: 'Essential Tee White',
            slug: 'essential-tee-white',
            description: 'Polera de algodón Pima con calce perfecto.',
            categoryId: polerasCat?.id,
            isFeatured: true,
            variants: [
                { sku: 'TEE-WHT-M', size: 'M', priceClp: 22000, stock: 20 },
                { sku: 'TEE-WHT-L', size: 'L', priceClp: 22000, stock: 12 },
            ],
            images: [
                { path: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800', altText: 'Tee White', isPrimary: true },
            ],
        },
        {
            name: 'Cyberpunk Jacket',
            slug: 'cyberpunk-jacket',
            description: 'Chaqueta técnica con detalles reflectantes y múltiples bolsillos.',
            categoryId: poleronesCat?.id,
            isFeatured: false,
            variants: [
                { sku: 'JKT-CYB-L', size: 'L', priceClp: 85000, stock: 5 },
            ],
            images: [
                { path: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800', altText: 'Tech Jacket', isPrimary: true },
            ],
        },
    ];

    for (const prod of products) {
        await prisma.product.upsert({
            where: { slug: prod.slug },
            update: {},
            create: {
                name: prod.name,
                slug: prod.slug,
                description: prod.description,
                categoryId: prod.categoryId,
                isActive: true,
                isFeatured: prod.isFeatured,
                variants: {
                    create: prod.variants,
                },
                images: {
                    create: prod.images,
                },
            },
        });
    }
    console.log('✅ Products created');

    console.log('🚀 Seeding finished successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
