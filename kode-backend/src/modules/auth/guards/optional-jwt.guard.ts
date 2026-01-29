import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtGuard extends AuthGuard('jwt') {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    handleRequest<TUser = unknown>(err: unknown, user: TUser, info: unknown): TUser {
        // Retorna el usuario si existe, pero no lanza error si no hay token
        return user;
    }
}
