import {
    Controller,
    Post,
    Get,
    Body,
    UseGuards,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, AuthResponseDto, UserResponseDto, CheckEmailDto, VerifyCodeDto } from './dto';
import { JwtAuthGuard } from '../../common/guards';
import { CurrentUser } from '../../common/decorators';

@ApiTags('Auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('check-email')
    @ApiOperation({ summary: 'Verificar disponibilidad de email y enviar OTP' })
    @ApiResponse({ status: 200, description: 'Código enviado' })
    @ApiResponse({ status: 409, description: 'Email ya registrado' })
    async checkEmail(@Body() dto: CheckEmailDto) {
        return this.authService.checkEmail(dto);
    }

    @Post('verify-code')
    @ApiOperation({ summary: 'Verificar código OTP' })
    @ApiResponse({ status: 200, description: 'Código válido' })
    @ApiResponse({ status: 400, description: 'Código inválido o expirado' })
    async verifyCode(@Body() dto: VerifyCodeDto) {
        const isValid = await this.authService.verifyCode(dto);
        return { valid: isValid };
    }

    @Post('resend-code')
    @ApiOperation({ summary: 'Reenviar código OTP' })
    async resendCode(@Body() dto: CheckEmailDto) {
        return this.authService.checkEmail(dto);
    }

    @Post('register')
    @ApiOperation({ summary: 'Registrar nuevo usuario' })
    @ApiResponse({
        status: 201,
        description: 'Usuario registrado exitosamente',
        type: AuthResponseDto,
    })
    @ApiResponse({ status: 409, description: 'Email ya registrado' })
    async register(@Body() dto: RegisterDto): Promise<AuthResponseDto> {
        return this.authService.register(dto);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Iniciar sesión' })
    @ApiResponse({
        status: 200,
        description: 'Login exitoso',
        type: AuthResponseDto,
    })
    @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
    async login(@Body() dto: LoginDto): Promise<AuthResponseDto> {
        return this.authService.login(dto);
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Obtener perfil del usuario actual' })
    @ApiResponse({
        status: 200,
        description: 'Perfil del usuario',
        type: UserResponseDto,
    })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    async getProfile(@CurrentUser() user: UserResponseDto): Promise<UserResponseDto> {
        return user;
    }
}
