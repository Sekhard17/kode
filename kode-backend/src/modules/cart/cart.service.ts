import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AddToCartDto, UpdateCartItemDto } from './dto/cart.dto';

@Injectable()
export class CartService {
    constructor(private readonly prisma: PrismaService) { }

    async getCart(userId?: string, guestKey?: string) {
        if (!userId && !guestKey) {
            throw new BadRequestException('Se requiere userId o guestKey');
        }

        // Si tenemos ambos, intentamos fusionar automáticamente (útil para SSR)
        if (userId && guestKey) {
            await this.mergeCart(userId, guestKey);
        }

        const cart = await this.prisma.cart.findFirst({
            where: userId ? { userId } : { guestKey },
            include: {
                items: {
                    include: {
                        variant: {
                            include: {
                                product: {
                                    include: {
                                        images: { take: 1, orderBy: { sortOrder: 'asc' } },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        if (!cart) {
            return { items: [], total: 0 };
        }

        return cart;
    }

    async addItem(userId: string | undefined, dto: AddToCartDto) {
        const { variantId, quantity, guestKey } = dto;

        // 1. Validar stock
        const variant = await this.prisma.productVariant.findUnique({
            where: { id: variantId },
        });

        if (!variant) throw new NotFoundException('Variante no encontrada');
        if (variant.stock < quantity) throw new BadRequestException('Stock insuficiente');

        // 2. Buscar o crear carrito
        let cart = await this.prisma.cart.findFirst({
            where: userId ? { userId } : { guestKey },
        });

        if (!cart) {
            cart = await this.prisma.cart.create({
                data: userId ? { userId } : { guestKey: guestKey! },
            });
        }

        // 3. Buscar si el item ya existe
        const existingItem = await this.prisma.cartItem.findFirst({
            where: { cartId: cart.id, variantId },
        });

        if (existingItem) {
            if (variant.stock < existingItem.quantity + quantity) {
                throw new BadRequestException('Stock insuficiente al sumar al carrito');
            }
            return this.prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: existingItem.quantity + quantity },
            });
        }

        return this.prisma.cartItem.create({
            data: {
                cartId: cart.id,
                variantId,
                quantity,
            },
        });
    }

    async updateItem(itemId: string, dto: UpdateCartItemDto) {
        const item = await this.prisma.cartItem.findUnique({
            where: { id: itemId },
            include: { variant: true },
        });

        if (!item) throw new NotFoundException('Item no encontrado');
        if (item.variant.stock < dto.quantity) throw new BadRequestException('Stock insuficiente');

        return this.prisma.cartItem.update({
            where: { id: itemId },
            data: { quantity: dto.quantity },
        });
    }

    async removeItem(itemId: string) {
        return this.prisma.cartItem.delete({
            where: { id: itemId },
        });
    }

    async mergeCart(userId: string, guestKey: string) {
        const guestCart = await this.prisma.cart.findFirst({
            where: { guestKey },
            include: { items: true },
        });

        if (!guestCart || guestCart.items.length === 0) {
            return { success: true, message: 'Nada que fusionar' };
        }

        let userCart = await this.prisma.cart.findFirst({
            where: { userId },
        });

        if (!userCart) {
            userCart = await this.prisma.cart.create({
                data: { userId },
            });
        }

        for (const item of guestCart.items) {
            const existingInUser = await this.prisma.cartItem.findFirst({
                where: { cartId: userCart.id, variantId: item.variantId },
            });

            if (existingInUser) {
                await this.prisma.cartItem.update({
                    where: { id: existingInUser.id },
                    data: { quantity: existingInUser.quantity + item.quantity },
                });
            } else {
                await this.prisma.cartItem.create({
                    data: {
                        cartId: userCart.id,
                        variantId: item.variantId,
                        quantity: item.quantity,
                    },
                });
            }
        }

        // Limpiar carrito de invitado
        await this.prisma.cart.delete({ where: { id: guestCart.id } });

        return { success: true, message: 'Carrito fusionado correctamente' };
    }
}
