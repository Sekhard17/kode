import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddToCartDto, UpdateCartItemDto, MergeCartDto } from './dto/cart.dto';
import { OptionalJwtGuard } from '../auth/guards/optional-jwt.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Cart')
@Controller({ path: 'cart', version: '1' })
export class CartController {
    constructor(private readonly cartService: CartService) { }

    @Get()
    @UseGuards(OptionalJwtGuard)
    @ApiOperation({ summary: 'Obtener el carrito actual' })
    async getCart(@Req() req: any, @Query('guestKey') guestKey?: string) {
        return this.cartService.getCart(req.user?.id, guestKey);
    }

    @Post('items')
    @UseGuards(OptionalJwtGuard)
    @ApiOperation({ summary: 'Añadir item al carrito' })
    async addItem(@Req() req: any, @Body() dto: AddToCartDto) {
        return this.cartService.addItem(req.user?.id, dto);
    }

    @Put('items/:id')
    @ApiOperation({ summary: 'Actualizar cantidad de un item' })
    async updateItem(@Param('id') id: string, @Body() dto: UpdateCartItemDto) {
        return this.cartService.updateItem(id, dto);
    }

    @Delete('items/:id')
    @ApiOperation({ summary: 'Eliminar un item del carrito' })
    async removeItem(@Param('id') id: string) {
        return this.cartService.removeItem(id);
    }

    @Post('merge')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Fusionar carrito de invitado con el del usuario' })
    async mergeCart(@Req() req: any, @Body() dto: MergeCartDto) {
        return this.cartService.mergeCart(req.user.id, dto.guestKey);
    }
}
