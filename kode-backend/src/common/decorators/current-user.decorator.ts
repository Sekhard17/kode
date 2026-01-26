import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { UserResponseDto } from '../../modules/auth/dto';

export const CurrentUser = createParamDecorator(
    (data: keyof UserResponseDto | undefined, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest<{ user: UserResponseDto }>();
        const user = request.user;

        if (!user) {
            return null;
        }

        return data ? user[data] : user;
    },
);
