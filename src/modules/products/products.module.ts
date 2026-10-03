import { Module } from '@nestjs/common';
import { ProductsController } from './presentation/products.controller.js';
import { ProductsService } from './application/products.service.js';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
