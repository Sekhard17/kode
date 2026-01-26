import { ApiProperty } from '@nestjs/swagger';

export class CatalogFiltersDto {
    @ApiProperty({ required: false })
    categoryId?: string;

    @ApiProperty({ required: false })
    categorySlug?: string;

    @ApiProperty({ required: false })
    minPrice?: number;

    @ApiProperty({ required: false })
    maxPrice?: number;

    @ApiProperty({ required: false })
    isFeatured?: boolean;

    @ApiProperty({ required: false, default: 1 })
    page?: number = 1;

    @ApiProperty({ required: false, default: 12 })
    limit?: number = 12;
}
