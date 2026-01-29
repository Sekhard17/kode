import {
    Controller,
    Get,
    Post,
    Body,
    Query,
    UseGuards,
    Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CheckoutService } from './checkout.service';
import { QuoteRequestDto } from './dto/checkout.dto';
import { CreateOrderDto } from '../orders/dto/orders.dto';
import { OptionalJwtGuard } from '../auth/guards/optional-jwt.guard';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
    user: { id: string; email: string; role: string };
}

@ApiTags('Checkout')
@Controller({ path: 'checkout', version: '1' })
export class CheckoutController {
    constructor(private readonly checkoutService: CheckoutService) { }

    @Post('quote')
    @UseGuards(OptionalJwtGuard)
    @ApiOperation({
        summary: 'Obtener cotización del carrito (sin crear orden)',
    })
    async getQuote(
        @Req() req: AuthenticatedRequest,
        @Body() dto: QuoteRequestDto
    ) {
        return this.checkoutService.getQuote(req.user?.id, dto);
    }

    @Post('create-order')
    @UseGuards(OptionalJwtGuard)
    @ApiOperation({ summary: 'Crear orden desde el carrito' })
    async createOrder(
        @Req() req: AuthenticatedRequest,
        @Body() dto: CreateOrderDto
    ) {
        return this.checkoutService.createOrder(req.user?.id, dto);
    }

    @Get('shipping-methods')
    @ApiOperation({ summary: 'Obtener métodos de envío disponibles' })
    async getShippingMethods() {
        return this.checkoutService.getShippingMethods();
    }

    @Get('validate-coupon')
    @ApiOperation({ summary: 'Validar un código de cupón' })
    async validateCoupon(
        @Query('code') code: string,
        @Query('subtotal') subtotal: string
    ) {
        return this.checkoutService.validateCoupon(
            code,
            parseInt(subtotal, 10) || 0
        );
    }
}
