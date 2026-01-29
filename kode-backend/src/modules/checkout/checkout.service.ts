import {
    Injectable,
    BadRequestException,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { QuoteRequestDto, QuoteResponseDto } from './dto/checkout.dto';
import { CreateOrderDto } from '../orders/dto/orders.dto';
import { OrdersService } from '../orders/orders.service';

@Injectable()
export class CheckoutService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly ordersService: OrdersService
    ) { }

    /**
     * Calculate quote for current cart without creating order
     */
    async getQuote(
        userId: string | undefined,
        dto: QuoteRequestDto
    ): Promise<QuoteResponseDto> {
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
            return {
                items: [],
                subtotalClp: 0,
                shippingPriceClp: 0,
                discountClp: 0,
                totalClp: 0,
                couponApplied: null,
                itemsCount: 0,
            };
        }

        // 2. Calculate subtotal
        const subtotalClp = cart.items.reduce(
            (acc, item) => acc + item.variant.priceClp * item.quantity,
            0
        );

        // 3. Calculate shipping
        let shippingPriceClp = 0;
        if (dto.shippingMethodId) {
            const shippingMethod = await this.prisma.shippingMethod.findUnique({
                where: { id: dto.shippingMethodId },
            });

            if (shippingMethod && shippingMethod.isActive) {
                if (shippingMethod.pricingType === 'FLAT') {
                    shippingPriceClp = shippingMethod.flatPriceClp ?? 0;
                } else if (
                    shippingMethod.pricingType === 'BY_REGION' &&
                    dto.region
                ) {
                    const regionRate =
                        await this.prisma.shippingRateByRegion.findFirst({
                            where: {
                                shippingMethodId: shippingMethod.id,
                                region: dto.region,
                            },
                        });
                    shippingPriceClp = regionRate?.priceClp ?? 0;
                }
            }
        }

        // 4. Apply coupon if provided
        let discountClp = 0;
        let couponApplied: QuoteResponseDto['couponApplied'] = null;

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
                    discountClp = Math.round(
                        (subtotalClp * coupon.value) / 100
                    );
                } else {
                    discountClp = coupon.value;
                }
                couponApplied = {
                    code: coupon.code,
                    type: coupon.type,
                    value: coupon.value,
                };
            }
        }

        const totalClp = subtotalClp + shippingPriceClp - discountClp;

        // 5. Build response
        const items = cart.items.map((item) => ({
            id: item.id,
            productName: item.variant.product.name,
            variantSku: item.variant.sku,
            size: item.variant.size,
            color: item.variant.color,
            unitPriceClp: item.variant.priceClp,
            quantity: item.quantity,
            lineTotalClp: item.variant.priceClp * item.quantity,
            imageUrl: item.variant.product.images[0]?.path ?? null,
        }));

        return {
            items,
            subtotalClp,
            shippingPriceClp,
            discountClp,
            totalClp,
            couponApplied,
            itemsCount: cart.items.reduce((acc, item) => acc + item.quantity, 0),
        };
    }

    /**
     * Get available shipping methods
     */
    async getShippingMethods() {
        return this.prisma.shippingMethod.findMany({
            where: { isActive: true },
            orderBy: { sortOrder: 'asc' },
            include: {
                ratesByRegion: true,
            },
        });
    }

    /**
     * Validate coupon code
     */
    async validateCoupon(code: string, subtotalClp: number) {
        const coupon = await this.prisma.coupon.findUnique({
            where: { code },
        });

        if (!coupon) {
            throw new NotFoundException('Cupón no encontrado');
        }

        if (!coupon.isActive) {
            throw new BadRequestException('Este cupón ya no está activo');
        }

        if (coupon.startsAt && coupon.startsAt > new Date()) {
            throw new BadRequestException('Este cupón aún no está disponible');
        }

        if (coupon.endsAt && coupon.endsAt < new Date()) {
            throw new BadRequestException('Este cupón ha expirado');
        }

        if (coupon.minSubtotalClp && subtotalClp < coupon.minSubtotalClp) {
            throw new BadRequestException(
                `El subtotal mínimo para usar este cupón es $${coupon.minSubtotalClp.toLocaleString('es-CL')}`
            );
        }

        let discountClp = 0;
        if (coupon.type === 'PERCENT') {
            discountClp = Math.round((subtotalClp * coupon.value) / 100);
        } else {
            discountClp = coupon.value;
        }

        return {
            valid: true,
            code: coupon.code,
            type: coupon.type,
            value: coupon.value,
            discountClp,
        };
    }

    /**
     * Create order (delegates to OrdersService)
     */
    async createOrder(userId: string | undefined, dto: CreateOrderDto) {
        return this.ordersService.createOrder(userId, dto);
    }
}
