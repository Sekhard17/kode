import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { render } from '@react-email/render';
import * as React from 'react';
import {
    OrderConfirmationEmail,
    OrderShippedEmail,
    PaymentApprovedEmail,
    VerificationEmail,
} from './templates';

interface OrderItem {
    productName: string;
    size: string;
    quantity: number;
    unitPriceClp: number;
    lineTotalClp: number;
}

interface SendOrderConfirmationParams {
    to: string;
    customerName: string;
    orderNumber: string;
    items: OrderItem[];
    subtotalClp: number;
    shippingPriceClp: number;
    discountClp: number;
    totalClp: number;
    shipAddress: string;
    shipCity: string;
    shipRegion: string;
}

interface SendPaymentApprovedParams {
    to: string;
    customerName: string;
    orderNumber: string;
    totalClp: number;
    paymentMethod?: string;
}

interface SendOrderShippedParams {
    to: string;
    customerName: string;
    orderNumber: string;
    trackingCode?: string;
    trackingUrl?: string;
    carrierName?: string;
}

@Injectable()
export class NotificationsService {
    private readonly logger = new Logger(NotificationsService.name);
    private readonly apiKey: string;
    private readonly fromEmail: string;
    private readonly fromName: string;
    private readonly logoUrl: string;

    constructor(private readonly configService: ConfigService) {
        this.apiKey = this.configService.get<string>('MAILEROO_API_KEY') || '';
        this.fromEmail = this.configService.get<string>('MAILEROO_FROM_EMAIL') || 'noreply@kode.cl';
        this.fromName = this.configService.get<string>('MAILEROO_FROM_NAME') || 'KODE';
        this.logoUrl = this.configService.get<string>('APP_URL') + '/LogoModoClaro.png';
    }

    /**
     * Send email via Maileroo API v2
     */
    async sendEmail(to: string, subject: string, html: string): Promise<{ success: boolean; error?: string; details?: any }> {
        if (!this.apiKey) {
            return { success: false, error: 'MAILEROO_API_KEY not configured' };
        }

        try {
            const payload = {
                from: {
                    address: this.fromEmail,
                    name: this.fromName,
                },
                to: [
                    {
                        address: to,
                    },
                ],
                subject,
                html,
            };

            const response = await fetch('https://smtp.maileroo.com/api/v2/emails', {
                method: 'POST',
                headers: {
                    'X-API-Key': this.apiKey,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const responseText = await response.text();
            let responseJson: any = null;
            try {
                responseJson = JSON.parse(responseText);
            } catch { }

            if (!response.ok) {
                return {
                    success: false,
                    error: `Maileroo error (${response.status})`,
                    details: {
                        status: response.status,
                        response: responseJson || responseText,
                        payload: { ...payload, html: '[HTML content]' },
                    },
                };
            }

            return { success: true, details: responseJson };
        } catch (error) {
            return {
                success: false,
                error: 'Failed to send email',
                details: error instanceof Error ? error.message : String(error),
            };
        }
    }

    /**
     * Send order confirmation email
     */
    async sendOrderConfirmation(params: SendOrderConfirmationParams) {
        const html = await render(
            React.createElement(OrderConfirmationEmail, {
                customerName: params.customerName,
                orderNumber: params.orderNumber,
                items: params.items,
                subtotalClp: params.subtotalClp,
                shippingPriceClp: params.shippingPriceClp,
                discountClp: params.discountClp,
                totalClp: params.totalClp,
                shipAddress: params.shipAddress,
                shipCity: params.shipCity,
                shipRegion: params.shipRegion,
                logoUrl: this.logoUrl,
            })
        );

        return this.sendEmail(
            params.to,
            `Confirmación de pedido #${params.orderNumber} - KODE`,
            html
        );
    }

    /**
     * Send payment approved email
     */
    async sendPaymentApproved(params: SendPaymentApprovedParams) {
        const html = await render(
            React.createElement(PaymentApprovedEmail, {
                customerName: params.customerName,
                orderNumber: params.orderNumber,
                totalClp: params.totalClp,
                paymentMethod: params.paymentMethod,
                logoUrl: this.logoUrl,
            })
        );

        return this.sendEmail(
            params.to,
            `Pago confirmado - Pedido #${params.orderNumber} - KODE`,
            html
        );
    }

    /**
     * Send order shipped email
     */
    async sendOrderShipped(params: SendOrderShippedParams) {
        const html = await render(
            React.createElement(OrderShippedEmail, {
                customerName: params.customerName,
                orderNumber: params.orderNumber,
                trackingCode: params.trackingCode,
                trackingUrl: params.trackingUrl,
                carrierName: params.carrierName,
                logoUrl: this.logoUrl,
            })
        );

        return this.sendEmail(
            params.to,
            `¡Tu pedido #${params.orderNumber} está en camino! - KODE`,
            html
        );
    }

    /**
     * Send verification code email
     */
    async sendVerificationCode(params: {
        to: string;
        customerName?: string;
        code: string;
        expiresInMinutes?: number;
    }) {
        const html = await render(
            React.createElement(VerificationEmail, {
                customerName: params.customerName,
                code: params.code,
                expiresInMinutes: params.expiresInMinutes || 10,
            })
        );

        return this.sendEmail(
            params.to,
            `Tu código de verificación: ${params.code} - KODE`,
            html
        );
    }
}
