import {
    Controller,
    Post,
    UseInterceptors,
    UploadedFile,
    ParseFilePipe,
    MaxFileSizeValidator,
    FileTypeValidator,
    UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { StorageService } from './storage.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Storage')
@Controller({ path: 'storage', version: '1' })
export class StorageController {
    constructor(private readonly storageService: StorageService) { }

    @Post('upload-avatar')
    @ApiOperation({ summary: 'Subir avatar de usuario' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @ApiResponse({ status: 201, description: 'Avatar subido exitosamente', schema: { type: 'object', properties: { url: { type: 'string' } } } })
    @UseInterceptors(FileInterceptor('file'))
    async uploadAvatar(
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
                    new FileTypeValidator({ fileType: /(jpg|jpeg|png|webp)$/ }),
                ],
            }),
        )
        file: Express.Multer.File,
    ) {
        const url = await this.storageService.uploadFile(
            file.buffer,
            'avatars',
            file.originalname,
            'avatares-registro'
        );

        return { url };
    }

    @Post('upload-product-image')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Subir imagen de producto (solo admin)' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @ApiResponse({
        status: 201,
        description: 'Imagen subida exitosamente',
        schema: {
            type: 'object',
            properties: {
                url: { type: 'string' },
                path: { type: 'string' },
            }
        }
    })
    @UseInterceptors(FileInterceptor('file'))
    async uploadProductImage(
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // 10MB
                    new FileTypeValidator({ fileType: /(jpg|jpeg|png|webp)$/ }),
                ],
            }),
        )
        file: Express.Multer.File,
    ) {
        const url = await this.storageService.uploadFile(
            file.buffer,
            'products',
            file.originalname,
        );

        return { url, path: url };
    }
}
