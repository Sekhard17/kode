import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { IsEmail, IsString, IsOptional } from 'class-validator';

class TestEmailDto {
    @IsEmail()
    to: string;

    @IsString()
    @IsOptional()
    customerName?: string;
}

@ApiTags('Notifications (Test)')
@Controller({ path: 'notifications', version: '1' })
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) { }

    @Post('test/order-confirmation')
    @ApiOperation({ summary: '[TEST] Enviar email de confirmación de orden' })
    async testOrderConfirmation(@Body() dto: TestEmailDto) {
        const result = await this.notificationsService.sendOrderConfirmation({
            to: dto.to,
            customerName: dto.customerName || 'Cliente de Prueba',
            orderNumber: 'KODE-TEST-1234',
            items: [
                {
                    productName: 'Polera Oversize Negra',
                    size: 'M',
                    quantity: 2,
                    unitPriceClp: 29990,
                    lineTotalClp: 59980,
                },
                {
                    productName: 'Jeans Slim Fit Azul',
                    size: '32',
                    quantity: 1,
                    unitPriceClp: 49990,
                    lineTotalClp: 49990,
                },
            ],
            subtotalClp: 109970,
            shippingPriceClp: 3990,
            discountClp: 10997,
            totalClp: 102963,
            shipAddress: 'Av. Providencia 1234, Depto 501',
            shipCity: 'Santiago',
            shipRegion: 'Metropolitana',
        });

        return result;
    }

    @Post('test/payment-approved')
    @ApiOperation({ summary: '[TEST] Enviar email de pago aprobado' })
    async testPaymentApproved(@Body() dto: TestEmailDto) {
        const result = await this.notificationsService.sendPaymentApproved({
            to: dto.to,
            customerName: dto.customerName || 'Cliente de Prueba',
            orderNumber: 'KODE-TEST-1234',
            totalClp: 102963,
            paymentMethod: 'Flow (Webpay)',
        });

        return result;
    }

    @Post('test/order-shipped')
    @ApiOperation({ summary: '[TEST] Enviar email de pedido enviado' })
    async testOrderShipped(@Body() dto: TestEmailDto) {
        const result = await this.notificationsService.sendOrderShipped({
            to: dto.to,
            customerName: dto.customerName || 'Cliente de Prueba',
            orderNumber: 'KODE-TEST-1234',
            trackingCode: 'STARKEN-123456789',
            trackingUrl: 'https://www.starken.cl/seguimiento',
            carrierName: 'Starken',
        });

        return result;
    }

    @Post('test/verification-code')
    @ApiOperation({ summary: '[TEST] Enviar email de verificación con código OTP' })
    async testVerificationCode(@Body() dto: TestEmailDto) {
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        const result = await this.notificationsService.sendVerificationCode({
            to: dto.to,
            customerName: dto.customerName || 'Usuario',
            code,
            expiresInMinutes: 10,
        });

        return { ...result, testCode: code };
    }
}
