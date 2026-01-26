import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class RegisterDto {
    @ApiProperty({ example: 'usuario@ejemplo.com' })
    @IsEmail({}, { message: 'Email inválido' })
    email: string;

    @ApiProperty({ example: 'MiPassword123' })
    @IsString()
    @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
    password: string;

    @ApiProperty({ example: 'Juan Pérez', required: false })
    @IsString()
    @IsOptional()
    name?: string;
}

export class LoginDto {
    @ApiProperty({ example: 'usuario@ejemplo.com' })
    @IsEmail({}, { message: 'Email inválido' })
    email: string;

    @ApiProperty({ example: 'MiPassword123' })
    @IsString()
    @MinLength(1, { message: 'La contraseña es requerida' })
    password: string;
}

export class AuthResponseDto {
    @ApiProperty()
    accessToken: string;

    @ApiProperty()
    user: UserResponseDto;
}

export class UserResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    email: string;

    @ApiProperty({ nullable: true })
    name: string | null;

    @ApiProperty({ nullable: true })
    image: string | null;

    @ApiProperty({ enum: ['CUSTOMER', 'ADMIN'] })
    role: 'CUSTOMER' | 'ADMIN';
}
