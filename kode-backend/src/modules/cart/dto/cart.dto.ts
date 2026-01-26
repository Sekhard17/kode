import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsInt, Min, IsOptional, IsString } from 'class-validator';

export class AddToCartDto {
    @ApiProperty()
    @IsUUID()
    variantId: string;

    @ApiProperty({ default: 1 })
    @IsInt()
    @Min(1)
    quantity: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    guestKey?: string;
}

export class UpdateCartItemDto {
    @ApiProperty()
    @IsInt()
    @Min(1)
    quantity: number;
}

export class MergeCartDto {
    @ApiProperty()
    @IsString()
    guestKey: string;
}
