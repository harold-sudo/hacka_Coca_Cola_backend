import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProductsService } from '../application/products.service.js';
import { CreateProductDto } from './dto/products.dto.js';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async listProducts() {
    const data = await this.productsService.listProducts();
    return {
      success: true,
      code: 'OK',
      message: 'Productos obtenidos con éxito',
      data,
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createProduct(@Body() dto: CreateProductDto) {
    const data = await this.productsService.createProduct(dto);
    return {
      success: true,
      code: 'OK',
      message: 'Producto creado con éxito',
      data,
    };
  }

  @Patch(':id')
  async toggleProduct(@Param('id') id: string) {
    const data = await this.productsService.toggleProduct(id);
    return {
      success: true,
      code: 'OK',
      message: 'Estado del producto actualizado',
      data,
    };
  }
}
