import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    const productImagePath = (fileName: string) => `/productos/${fileName}`;

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
        { name: 'Chaquetas', slug: 'chaquetas', description: 'Outerwear y capas' },
        { name: 'Pantalones', slug: 'pantalones', description: 'Comfortable cargo & joggers' },
        { name: 'Accesorios', slug: 'accesorios', description: 'Essential style items' },
    ];

    for (const [index, cat] of categories.entries()) {
        await prisma.category.upsert({
            where: { slug: cat.slug },
            update: {},
            create: {
                name: cat.name,
                slug: cat.slug,
                description: cat.description,
                isActive: true,
                sortOrder: index,
            },
        });
    }
    console.log('✅ Categories created');

    const poleronesCat = await prisma.category.findUnique({ where: { slug: 'polerones' } });
    const polerasCat = await prisma.category.findUnique({ where: { slug: 'poleras' } });
    const chaquetasCat = await prisma.category.findUnique({ where: { slug: 'chaquetas' } });

    // 3. Create Products
    const products = [
        {
            name: 'Polerón Morado (Sin Gorro)',
            slug: 'poleron-singorro-morado',
            description: 'Polerón premium con calce limpio y vibe urbano.',
            categoryId: poleronesCat?.id,
            isFeatured: true,
            variants: [
                { sku: 'KODE-POL-MOR-S', size: 'S', priceClp: 44990, stock: 12 },
                { sku: 'KODE-POL-MOR-M', size: 'M', priceClp: 44990, stock: 18 },
                { sku: 'KODE-POL-MOR-L', size: 'L', priceClp: 44990, stock: 9 },
            ],
            images: [
                { path: productImagePath('poleron_singorro_morado.png'), altText: 'Polerón morado', isPrimary: true },
            ],
        },
        {
            name: 'Polera Algodón Verde',
            slug: 'polera-algodon-verde',
            description: 'Algodón suave, fit cómodo y diseño minimal.',
            categoryId: polerasCat?.id,
            isFeatured: true,
            variants: [
                { sku: 'KODE-TEE-VER-S', size: 'S', priceClp: 22990, stock: 20 },
                { sku: 'KODE-TEE-VER-M', size: 'M', priceClp: 22990, stock: 16 },
                { sku: 'KODE-TEE-VER-L', size: 'L', priceClp: 22990, stock: 11 },
            ],
            images: [
                { path: productImagePath('polera_algodon_verde.png'), altText: 'Polera verde', isPrimary: true },
            ],
        },
        {
            name: 'Cortavientos Blanco/Negro',
            slug: 'cortavientos-blanco-negro',
            description: 'Capa liviana y técnica para el día a día.',
            categoryId: chaquetasCat?.id,
            isFeatured: false,
            variants: [
                { sku: 'KODE-CORT-BN-S', size: 'S', priceClp: 54990, stock: 8 },
                { sku: 'KODE-CORT-BN-M', size: 'M', priceClp: 54990, stock: 6 },
                { sku: 'KODE-CORT-BN-L', size: 'L', priceClp: 54990, stock: 4 },
            ],
            images: [
                { path: productImagePath('cortavientos_blancoynegro.png'), altText: 'Cortavientos blanco y negro', isPrimary: true },
            ],
        },
        {
            name: 'Parka Azul Marino',
            slug: 'parka-azul-marino',
            description: 'Outerwear premium para frío, con look limpio y urbano.',
            categoryId: chaquetasCat?.id,
            isFeatured: false,
            variants: [
                { sku: 'KODE-PARKA-AZ-S', size: 'S', priceClp: 79990, stock: 5 },
                { sku: 'KODE-PARKA-AZ-M', size: 'M', priceClp: 79990, stock: 4 },
                { sku: 'KODE-PARKA-AZ-L', size: 'L', priceClp: 79990, stock: 3 },
            ],
            images: [
                { path: productImagePath('parka_azulmarino.png'), altText: 'Parka azul marino', isPrimary: true },
            ],
        },
    ];

    for (const prod of products) {
        await prisma.product.upsert({
            where: { slug: prod.slug },
            update: {
                name: prod.name,
                description: prod.description,
                categoryId: prod.categoryId ?? null,
                isActive: true,
                isFeatured: prod.isFeatured,
                images: {
                    deleteMany: {},
                    create: prod.images,
                },
                variants: {
                    deleteMany: {},
                    create: prod.variants,
                },
            },
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
