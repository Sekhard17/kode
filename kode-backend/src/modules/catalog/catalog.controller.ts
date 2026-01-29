import {
    Controller,
    Get,
    Post,
    Patch,
    Query,
    Param,
    Body,
    UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CatalogService } from './catalog.service';
import { CatalogFiltersDto } from './dto/catalog-filters.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Catalog')
@Controller({ path: 'catalog', version: '1' })
export class CatalogController {
    constructor(private readonly catalogService: CatalogService) { }

    // ========== PUBLIC ENDPOINTS ==========

    @Get('categories')
    @ApiOperation({ summary: 'Obtener todas las categorías activas' })
    @ApiResponse({ status: 200, description: 'Lista de categorías' })
    async getCategories() {
        return this.catalogService.getCategories();
    }

    @Get('products')
    @ApiOperation({ summary: 'Obtener productos filtrados (solo activos)' })
    @ApiResponse({ status: 200, description: 'Lista paginada de productos' })
    async getProducts(@Query() filters: CatalogFiltersDto) {
        return this.catalogService.getProducts(filters);
    }

    @Get('products/:slug')
    @ApiOperation({ summary: 'Obtener detalles de un producto por slug' })
    @ApiResponse({ status: 200, description: 'Detalle del producto' })
    @ApiResponse({ status: 404, description: 'Producto no encontrado' })
    async getProduct(@Param('slug') slug: string) {
        return this.catalogService.getProductBySlug(slug);
    }

    // ========== ADMIN ENDPOINTS ==========

    @Get('admin/products')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Obtener productos para admin (incluye inactivos)' })
    @ApiResponse({ status: 200, description: 'Lista paginada de productos para admin' })
    async getProductsAdmin(
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('search') search?: string,
    ) {
        const pageNum = page ? parseInt(page, 10) : 1;
        const limitNum = limit ? parseInt(limit, 10) : 7;
        return this.catalogService.getProductsAdmin(pageNum, limitNum, search);
    }

    @Get('admin/products/:id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Obtener un producto por ID para edición' })
    @ApiResponse({ status: 200, description: 'Detalle completo del producto' })
    @ApiResponse({ status: 404, description: 'Producto no encontrado' })
    async getProductById(@Param('id') id: string) {
        return this.catalogService.getProductById(id);
    }

    @Post('admin/products')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Crear un nuevo producto' })
    @ApiResponse({ status: 201, description: 'Producto creado exitosamente' })
    @ApiResponse({ status: 400, description: 'Datos inválidos' })
    @ApiResponse({ status: 409, description: 'Slug o SKU ya existe' })
    async createProduct(@Body() data: CreateProductDto) {
        return this.catalogService.createProduct(data);
    }

    @Patch('admin/products/:id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Actualizar un producto existente' })
    @ApiResponse({ status: 200, description: 'Producto actualizado' })
    @ApiResponse({ status: 404, description: 'Producto no encontrado' })
    @ApiResponse({ status: 409, description: 'Slug ya existe' })
    async updateProduct(
        @Param('id') id: string,
        @Body() data: UpdateProductDto,
    ) {
        return this.catalogService.updateProduct(id, data);
    }

    @Patch('admin/products/:id/toggle-active')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Habilitar/deshabilitar un producto' })
    @ApiResponse({ status: 200, description: 'Estado del producto actualizado' })
    @ApiResponse({ status: 404, description: 'Producto no encontrado' })
    async toggleProductActive(@Param('id') id: string) {
        return this.catalogService.toggleProductActive(id);
    }
}
