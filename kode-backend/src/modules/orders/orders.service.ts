import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateOrderDto } from './dto/orders.dto';
import { OrderStatus } from '@prisma/client';

interface StockValidationResult {
    variantId: string;
    productName: string;
    size: string;
    requestedQty: number;
    availableStock: number;
}

@Injectable()
export class OrdersService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly notificationsService: NotificationsService,
    ) { }

    /**
     * Generates a unique order number in format: KODE-YYYYMMDD-XXXX
     */
    private generateOrderNumber(): string {
        const date = new Date();
        const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
        const random = Math.random().toString(36).substring(2, 6).toUpperCase();
        return `KODE-${dateStr}-${random}`;
    }

    /**
     * Validates stock availability for all cart items
     * Throws BadRequestException if any item has insufficient stock
     */
    private async validateStock(
        items: Array<{ variantId: string; quantity: number }>
    ): Promise<void> {
        const insufficientStock: StockValidationResult[] = [];

        for (const item of items) {
            const variant = await this.prisma.productVariant.findUnique({
                where: { id: item.variantId },
                include: { product: { select: { name: true } } },
            });

            if (!variant) {
                throw new NotFoundException(
                    `Variante ${item.variantId} no encontrada`
                );
            }

            if (variant.stock < item.quantity) {
                insufficientStock.push({
                    variantId: item.variantId,
                    productName: variant.product.name,
                    size: variant.size,
                    requestedQty: item.quantity,
                    availableStock: variant.stock,
                });
            }
        }

        if (insufficientStock.length > 0) {
            const messages = insufficientStock.map(
                (item) =>
                    `"${item.productName}" talla ${item.size}: solicitado ${item.requestedQty}, disponible ${item.availableStock}`
            );
            throw new BadRequestException({
                message: 'Stock insuficiente para algunos productos',
                details: messages,
                code: 'INSUFFICIENT_STOCK',
            });
        }
    }

    /**
     * Decrements stock for all items after successful order
     */
    private async decrementStock(
        items: Array<{ variantId: string; quantity: number }>
    ): Promise<void> {
        for (const item of items) {
            await this.prisma.productVariant.update({
                where: { id: item.variantId },
                data: { stock: { decrement: item.quantity } },
            });
        }
    }

    /**
     * Creates a new order from the user's cart
     */
    async createOrder(userId: string | undefined, dto: CreateOrderDto) {
        // 1. Get cart
        const cart = await this.prisma.cart.findFirst({
            where: userId ? { userId } : { guestKey: dto.guestKey },
            include: {
                items: {
                    include: {
                        variant: {
                            include: {
                                product: {
                                    include: {
                                        images: {
                                            take: 1,
                                            orderBy: { sortOrder: 'asc' },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        if (!cart || cart.items.length === 0) {
            throw new BadRequestException('El carrito está vacío');
        }

        // 2. VALIDATE STOCK in real-time
        const itemsForValidation = cart.items.map((item) => ({
            variantId: item.variantId,
            quantity: item.quantity,
        }));
        await this.validateStock(itemsForValidation);

        // 3. Get shipping method
        const shippingMethod = await this.prisma.shippingMethod.findUnique({
            where: { id: dto.shippingMethodId },
        });

        if (!shippingMethod || !shippingMethod.isActive) {
            throw new BadRequestException('Método de envío no válido');
        }

        // Calculate shipping price based on pricing type
        let shippingPriceClp = 0;
        if (shippingMethod.pricingType === 'FLAT') {
            shippingPriceClp = shippingMethod.flatPriceClp ?? 0;
        } else if (shippingMethod.pricingType === 'BY_REGION') {
            const regionRate = await this.prisma.shippingRateByRegion.findFirst(
                {
                    where: {
                        shippingMethodId: shippingMethod.id,
                        region: dto.shipRegion,
                    },
                }
            );
            shippingPriceClp = regionRate?.priceClp ?? 0;
        }
        // FREE and PICKUP have 0 shipping

        // 4. Calculate subtotal
        const subtotalClp = cart.items.reduce(
            (acc, item) => acc + item.variant.priceClp * item.quantity,
            0
        );

        // 5. Apply coupon if provided
        let discountClp = 0;
        let couponId: string | null = null;

        if (dto.couponCode) {
            const coupon = await this.prisma.coupon.findUnique({
                where: { code: dto.couponCode },
            });

            if (
                coupon &&
                coupon.isActive &&
                (!coupon.startsAt || coupon.startsAt <= new Date()) &&
                (!coupon.endsAt || coupon.endsAt >= new Date()) &&
                (!coupon.minSubtotalClp || subtotalClp >= coupon.minSubtotalClp)
            ) {
                if (coupon.type === 'PERCENT') {
                    discountClp = Math.round((subtotalClp * coupon.value) / 100);
                } else {
                    discountClp = coupon.value;
                }
                couponId = coupon.id;
            }
        }

        const totalClp = subtotalClp + shippingPriceClp - discountClp;

        // 6. Create order with transaction
        const order = await this.prisma.$transaction(async (tx) => {
            // Create order
            const newOrder = await tx.order.create({
                data: {
                    orderNumber: this.generateOrderNumber(),
                    status: OrderStatus.CREATED,
                    userId: userId ?? null,
                    customerName: dto.customerName,
                    customerEmail: dto.customerEmail,
                    customerPhone: dto.customerPhone ?? null,
                    shipRegion: dto.shipRegion,
                    shipCity: dto.shipCity,
                    shipCommune: dto.shipCommune,
                    shipAddress1: dto.shipAddress1,
                    shipAddress2: dto.shipAddress2 ?? null,
                    shipReference: dto.shipReference ?? null,
                    shippingMethodId: dto.shippingMethodId,
                    shippingPriceClp,
                    subtotalClp,
                    discountClp,
                    totalClp,
                    couponId,
                    items: {
                        create: cart.items.map((item) => ({
                            productId: item.variant.product.id,
                            variantId: item.variantId,
                            productName: item.variant.product.name,
                            variantSku: item.variant.sku,
                            size: item.variant.size,
                            color: item.variant.color,
                            unitPriceClp: item.variant.priceClp,
                            quantity: item.quantity,
                            lineTotalClp: item.variant.priceClp * item.quantity,
                        })),
                    },
                },
                include: {
                    items: true,
                },
            });

            // Decrement stock
            for (const item of cart.items) {
                await tx.productVariant.update({
                    where: { id: item.variantId },
                    data: { stock: { decrement: item.quantity } },
                });
            }

            // Clear cart
            await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

            // Create coupon redemption if used
            if (couponId) {
                await tx.couponRedemption.create({
                    data: {
                        couponId,
                        userId: userId ?? null,
                        orderId: newOrder.id,
                    },
                });
            }

            return newOrder;
        });

        const result = {
            id: order.id,
            orderNumber: order.orderNumber,
            status: order.status,
            customerName: order.customerName,
            customerEmail: order.customerEmail,
            subtotalClp: order.subtotalClp,
            shippingPriceClp: order.shippingPriceClp,
            discountClp: order.discountClp,
            totalClp: order.totalClp,
            itemsCount: order.items.length,
            createdAt: order.createdAt,
        };

        // Send order confirmation email (async, don't block response)
        this.notificationsService.sendOrderConfirmation({
            to: dto.customerEmail,
            customerName: dto.customerName,
            orderNumber: order.orderNumber,
            items: cart.items.map((item) => ({
                productName: item.variant.product.name,
                size: item.variant.size,
                quantity: item.quantity,
                unitPriceClp: item.variant.priceClp,
                lineTotalClp: item.variant.priceClp * item.quantity,
            })),
            subtotalClp,
            shippingPriceClp,
            discountClp,
            totalClp,
            shipAddress: dto.shipAddress1,
            shipCity: dto.shipCity,
            shipRegion: dto.shipRegion,
        }).catch((err) => console.error('Failed to send order confirmation email:', err));

        return result;
    }

    /**
     * Get orders for a user
     */
    async getUserOrders(userId: string) {
        const orders = await this.prisma.order.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            include: {
                items: {
                    include: {
                        variant: {
                            include: {
                                product: {
                                    include: {
                                        images: {
                                            take: 1,
                                            orderBy: { sortOrder: 'asc' },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        return orders;
    }

    /**
     * Get order by ID (validates ownership)
     */
    async getOrderById(orderId: string, userId?: string) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: {
                items: {
                    include: {
                        variant: {
                            include: {
                                product: {
                                    include: {
                                        images: {
                                            take: 1,
                                            orderBy: { sortOrder: 'asc' },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                shippingMethod: true,
                coupon: true,
            },
        });

        if (!order) {
            throw new NotFoundException('Orden no encontrada');
        }

        // If userId provided, validate ownership (unless admin check is added later)
        if (userId && order.userId !== userId) {
            throw new NotFoundException('Orden no encontrada');
        }

        return order;
    }

    /**
     * Get order by order number (for confirmation pages)
     */
    async getOrderByNumber(orderNumber: string, email: string) {
        const order = await this.prisma.order.findFirst({
            where: {
                orderNumber,
                customerEmail: email,
            },
            include: {
                items: true,
                shippingMethod: true,
            },
        });

        if (!order) {
            throw new NotFoundException('Orden no encontrada');
        }

        return order;
    }
}
