import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class QuoteRequestDto {
    @ApiPropertyOptional({ description: 'ID del método de envío' })
    @IsOptional()
    @IsString()
    shippingMethodId?: string;

    @ApiPropertyOptional({ description: 'Región para calcular envío' })
    @IsOptional()
    @IsString()
    region?: string;

    @ApiPropertyOptional({ description: 'Código de cupón' })
    @IsOptional()
    @IsString()
    couponCode?: string;

    @ApiPropertyOptional({ description: 'Guest key para checkout como invitado' })
    @IsOptional()
    @IsString()
    guestKey?: string;
}

export interface QuoteResponseDto {
    items: Array<{
        id: string;
        productName: string;
        variantSku: string;
        size: string;
        color: string | null;
        unitPriceClp: number;
        quantity: number;
        lineTotalClp: number;
        imageUrl: string | null;
    }>;
    subtotalClp: number;
    shippingPriceClp: number;
    discountClp: number;
    totalClp: number;
    couponApplied: {
        code: string;
        type: string;
        value: number;
    } | null;
    itemsCount: number;
}
