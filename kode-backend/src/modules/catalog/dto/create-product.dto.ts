import {
    IsString,
    IsOptional,
    IsBoolean,
    IsArray,
    ValidateNested,
    IsInt,
    Min,
    IsNotEmpty,
    ArrayMinSize,
    Matches,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateVariantDto {
    @ApiProperty({ example: 'POL-BLK-M', description: 'SKU único de la variante' })
    @IsString()
    @IsNotEmpty()
    sku: string;

    @ApiProperty({ example: 'M', description: 'Talla del producto' })
    @IsString()
    @IsNotEmpty()
    size: string;

    @ApiPropertyOptional({ example: 'Negro', description: 'Color del producto' })
    @IsString()
    @IsOptional()
    color?: string;

    @ApiProperty({ example: 29990, description: 'Precio en CLP (entero)' })
    @IsInt()
    @Min(0)
    priceClp: number;

    @ApiProperty({ example: 10, description: 'Stock disponible' })
    @IsInt()
    @Min(0)
    stock: number;
}

export class CreateProductImageDto {
    @ApiProperty({ example: 'https://storage.example.com/image.webp', description: 'URL de la imagen' })
    @IsString()
    @IsNotEmpty()
    path: string;

    @ApiPropertyOptional({ example: 'Polera negra vista frontal', description: 'Texto alternativo' })
    @IsString()
    @IsOptional()
    altText?: string;

    @ApiProperty({ example: 0, description: 'Orden de la imagen' })
    @IsInt()
    @Min(0)
    sortOrder: number;

    @ApiProperty({ example: true, description: 'Es la imagen principal' })
    @IsBoolean()
    isPrimary: boolean;
}

export class CreateProductDto {
    @ApiProperty({ example: 'Polera Negra Básica', description: 'Nombre del producto' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'polera-negra-basica', description: 'Slug URL-friendly único' })
    @IsString()
    @IsNotEmpty()
    @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
        message: 'El slug debe contener solo letras minúsculas, números y guiones',
    })
    slug: string;

    @ApiPropertyOptional({ example: 'Polera 100% algodón premium', description: 'Descripción del producto' })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiPropertyOptional({ description: 'ID de la categoría' })
    @IsString()
    @IsOptional()
    categoryId?: string;

    @ApiProperty({ example: false, description: 'Producto destacado' })
    @IsBoolean()
    isFeatured: boolean;

    @ApiProperty({ example: true, description: 'Producto activo (visible en tienda)' })
    @IsBoolean()
    isActive: boolean;

    @ApiProperty({ type: [CreateVariantDto], description: 'Variantes del producto' })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateVariantDto)
    @ArrayMinSize(1, { message: 'El producto debe tener al menos una variante' })
    variants: CreateVariantDto[];

    @ApiProperty({ type: [CreateProductImageDto], description: 'Imágenes del producto' })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateProductImageDto)
    images: CreateProductImageDto[];
}
