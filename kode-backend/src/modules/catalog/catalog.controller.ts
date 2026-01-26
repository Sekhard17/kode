import { Controller, Get, Query, Param, VersioningType } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CatalogService } from './catalog.service';
import { CatalogFiltersDto } from './dto/catalog-filters.dto';

@ApiTags('Catalog')
@Controller({ path: 'catalog', version: '1' })
export class CatalogController {
    constructor(private readonly catalogService: CatalogService) { }

    @Get('categories')
    @ApiOperation({ summary: 'Obtener todas las categorías activas' })
    @ApiResponse({ status: 200, description: 'Lista de categorías' })
    async getCategories() {
        return this.catalogService.getCategories();
    }

    @Get('products')
    @ApiOperation({ summary: 'Obtener productos filtrados' })
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
}
