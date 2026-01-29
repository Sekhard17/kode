import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Query,
    UseGuards,
    Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/orders.dto';
import { OptionalJwtGuard } from '../auth/guards/optional-jwt.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
    user: { id: string; email: string; role: string };
}

@ApiTags('Orders')
@Controller({ path: 'orders', version: '1' })
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Post()
    @UseGuards(OptionalJwtGuard)
    @ApiOperation({ summary: 'Crear una nueva orden desde el carrito' })
    async createOrder(
        @Req() req: AuthenticatedRequest,
        @Body() dto: CreateOrderDto
    ) {
        return this.ordersService.createOrder(req.user?.id, dto);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Obtener órdenes del usuario autenticado' })
    async getUserOrders(@Req() req: AuthenticatedRequest) {
        return this.ordersService.getUserOrders(req.user.id);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Obtener detalle de una orden' })
    async getOrderById(
        @Param('id') id: string,
        @Req() req: AuthenticatedRequest
    ) {
        return this.ordersService.getOrderById(id, req.user.id);
    }

    @Get('lookup/:orderNumber')
    @ApiOperation({ summary: 'Buscar orden por número (para confirmación)' })
    async getOrderByNumber(
        @Param('orderNumber') orderNumber: string,
        @Query('email') email: string
    ) {
        return this.ordersService.getOrderByNumber(orderNumber, email);
    }
}
