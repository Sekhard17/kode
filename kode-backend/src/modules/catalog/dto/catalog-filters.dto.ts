import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsBoolean, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CatalogFiltersDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    categoryId?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    categorySlug?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    minPrice?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    maxPrice?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @Type(() => Boolean)
    @IsBoolean()
    isFeatured?: boolean;

    @ApiProperty({ required: false, default: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    page?: number = 1;

    @ApiProperty({ required: false, default: 12 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    limit?: number = 12;
}
