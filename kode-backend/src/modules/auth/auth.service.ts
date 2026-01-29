import {
    Injectable,
    UnauthorizedException,
    ConflictException,
    BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto, LoginDto, AuthResponseDto, UserResponseDto, CheckEmailDto, VerifyCodeDto } from './dto';
import type { Role, JwtPayload } from '@kode/shared';
import { NotificationsService } from '../../modules/notifications/notifications.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
        private readonly notificationsService: NotificationsService,
    ) { }

    /**
     * Paso 1: Verificar email y enviar OTP
     */
    async checkEmail(dto: CheckEmailDto): Promise<{ message: string; expiresInMinutes: number }> {
        const email = dto.email.toLowerCase();

        // Check if user exists
        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            throw new ConflictException('El email ya está registrado');
        }

        // Generate OTP
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresInMinutes = 10;
        const expires = new Date(Date.now() + expiresInMinutes * 60 * 1000);

        // Delete previous tokens
        await this.prisma.verificationToken.deleteMany({
            where: { identifier: email },
        });

        // Save new token
        await this.prisma.verificationToken.create({
            data: {
                identifier: email,
                token: code,
                expires,
            },
        });

        // Send email
        await this.notificationsService.sendVerificationCode({
            to: email,
            code,
            expiresInMinutes,
        });

        return { message: 'Código de verificación enviado', expiresInMinutes };
    }

    /**
     * Paso 2 (Opcional): Verificar código antes de registro
     */
    async verifyCode(dto: VerifyCodeDto): Promise<boolean> {
        const email = dto.email.toLowerCase();

        const token = await this.prisma.verificationToken.findFirst({
            where: {
                identifier: email,
                token: dto.code,
            },
        });

        if (!token) {
            throw new BadRequestException('Código inválido');
        }

        if (token.expires < new Date()) {
            throw new BadRequestException('El código ha expirado');
        }

        return true;
    }

    async register(dto: RegisterDto): Promise<AuthResponseDto> {
        const email = dto.email.toLowerCase();

        // Verify OTP
        const validCode = await this.verifyCode({ email, code: dto.verificationCode });
        if (!validCode) {
            throw new BadRequestException('Código de verificación inválido');
        }

        // Check user again (concurrency)
        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            throw new ConflictException('El email ya está registrado');
        }

        // Hash password
        const passwordHash = await argon2.hash(dto.password);

        // Create user (verified)
        const user = await this.prisma.user.create({
            data: {
                email,
                passwordHash,
                name: dto.name,
                image: dto.image,
                role: 'CUSTOMER',
                emailVerified: new Date(),
            },
        });

        // Delete used token
        await this.prisma.verificationToken.deleteMany({
            where: { identifier: email },
        });

        // Generate tokens
        const accessToken = await this.generateToken(user.id, user.email, user.role);

        return {
            accessToken,
            user: this.toUserResponse(user),
        };
    }

    async login(dto: LoginDto): Promise<AuthResponseDto> {
        // Find user
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email.toLowerCase() },
        });

        if (!user || !user.passwordHash) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        // Verify password
        const isValid = await argon2.verify(user.passwordHash, dto.password);
        if (!isValid) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        // Generate tokens
        const accessToken = await this.generateToken(user.id, user.email, user.role);

        return {
            accessToken,
            user: this.toUserResponse(user),
        };
    }

    async validateUser(userId: string): Promise<UserResponseDto | null> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return null;
        }

        return this.toUserResponse(user);
    }

    async getProfile(userId: string): Promise<UserResponseDto> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new UnauthorizedException('Usuario no encontrado');
        }

        return this.toUserResponse(user);
    }

    private async generateToken(
        userId: string,
        email: string,
        role: Role,
    ): Promise<string> {
        const payload: JwtPayload = {
            sub: userId,
            email,
            role,
        };

        return this.jwtService.signAsync(payload);
    }

    private toUserResponse(user: {
        id: string;
        email: string;
        name: string | null;
        image: string | null;
        role: Role;
    }): UserResponseDto {
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role,
        };
    }
}
