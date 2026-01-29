import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateProductDto, CreateVariantDto, CreateProductImageDto } from './create-product.dto';
import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateVariantDto extends PartialType(CreateVariantDto) {
    @ApiPropertyOptional({ description: 'ID de la variante existente (para actualizar)' })
    @IsString()
    @IsOptional()
    id?: string;
}

export class UpdateProductImageDto extends PartialType(CreateProductImageDto) {
    @ApiPropertyOptional({ description: 'ID de la imagen existente (para actualizar)' })
    @IsString()
    @IsOptional()
    id?: string;
}

export class UpdateProductDto extends PartialType(
    OmitType(CreateProductDto, ['variants', 'images'] as const),
) {
    @ApiPropertyOptional({ type: [UpdateVariantDto], description: 'Variantes a actualizar/agregar' })
    @IsOptional()
    variants?: UpdateVariantDto[];

    @ApiPropertyOptional({ type: [UpdateProductImageDto], description: 'Imágenes a actualizar/agregar' })
    @IsOptional()
    images?: UpdateProductImageDto[];
}
