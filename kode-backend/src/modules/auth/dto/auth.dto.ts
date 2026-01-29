import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsOptional, Length } from 'class-validator';

export class CheckEmailDto {
    @ApiProperty({ example: 'usuario@ejemplo.com' })
    @IsEmail({}, { message: 'Email inválido' })
    email: string;
}

export class VerifyCodeDto {
    @ApiProperty({ example: 'usuario@ejemplo.com' })
    @IsEmail({}, { message: 'Email inválido' })
    email: string;

    @ApiProperty({ example: '123456' })
    @IsString()
    @Length(6, 6, { message: 'El código debe tener 6 dígitos' })
    code: string;
}

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

    @ApiProperty({ example: '123456', description: 'Código de verificación OTP' })
    @IsString()
    @Length(6, 6, { message: 'El código debe tener 6 dígitos' })
    verificationCode: string;

    @ApiProperty({ example: 'https://...', required: false })
    @IsString()
    @IsOptional()
    image?: string;
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

export class AuthResponseDto {
    @ApiProperty()
    accessToken: string;

    @ApiProperty({ type: UserResponseDto })
    user: UserResponseDto;
}
