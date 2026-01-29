import { Module } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { CheckoutController } from './checkout.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { OrdersModule } from '../orders/orders.module';

@Module({
    imports: [PrismaModule, OrdersModule],
    providers: [CheckoutService],
    controllers: [CheckoutController],
    exports: [CheckoutService],
})
export class CheckoutModule { }
