import {
    Injectable,
    UnauthorizedException,
    ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto, LoginDto, AuthResponseDto, UserResponseDto } from './dto';
import type { Role, JwtPayload } from '@kode/shared';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
    ) { }

    async register(dto: RegisterDto): Promise<AuthResponseDto> {
        // Check if user exists
        const existingUser = await this.prisma.user.findUnique({
            where: { email: dto.email.toLowerCase() },
        });

        if (existingUser) {
            throw new ConflictException('El email ya está registrado');
        }

        // Hash password
        const passwordHash = await argon2.hash(dto.password);

        // Create user
        const user = await this.prisma.user.create({
            data: {
                email: dto.email.toLowerCase(),
                passwordHash,
                name: dto.name,
                role: 'CUSTOMER',
            },
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
