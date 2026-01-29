import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsString,
    IsOptional,
    IsEmail,
    IsNotEmpty,
    MaxLength,
    MinLength,
} from 'class-validator';

export class CreateOrderDto {
    // Customer info
    @ApiProperty({ description: 'Nombre completo del cliente' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    customerName: string;

    @ApiProperty({ description: 'Email del cliente' })
    @IsEmail()
    @IsNotEmpty()
    customerEmail: string;

    @ApiPropertyOptional({ description: 'Teléfono del cliente' })
    @IsOptional()
    @IsString()
    @MaxLength(20)
    customerPhone?: string;

    // Shipping address
    @ApiProperty({ description: 'Región de envío' })
    @IsString()
    @IsNotEmpty()
    shipRegion: string;

    @ApiProperty({ description: 'Ciudad de envío' })
    @IsString()
    @IsNotEmpty()
    shipCity: string;

    @ApiProperty({ description: 'Comuna de envío' })
    @IsString()
    @IsNotEmpty()
    shipCommune: string;

    @ApiProperty({ description: 'Dirección línea 1 (calle y número)' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(200)
    shipAddress1: string;

    @ApiPropertyOptional({ description: 'Dirección línea 2 (depto, oficina, etc.)' })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    shipAddress2?: string;

    @ApiPropertyOptional({ description: 'Referencia para el envío' })
    @IsOptional()
    @IsString()
    @MaxLength(200)
    shipReference?: string;

    // Shipping method
    @ApiProperty({ description: 'ID del método de envío' })
    @IsString()
    @IsNotEmpty()
    shippingMethodId: string;

    // Optional coupon
    @ApiPropertyOptional({ description: 'Código del cupón de descuento' })
    @IsOptional()
    @IsString()
    couponCode?: string;

    // Guest key (for guest checkout)
    @ApiPropertyOptional({ description: 'Guest key para checkout como invitado' })
    @IsOptional()
    @IsString()
    guestKey?: string;
}

export class OrderResponseDto {
    id: string;
    orderNumber: string;
    status: string;
    customerName: string;
    customerEmail: string;
    subtotalClp: number;
    shippingPriceClp: number;
    discountClp: number;
    totalClp: number;
    createdAt: Date;
}
