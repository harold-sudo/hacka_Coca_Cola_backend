import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service.js';
import { CreateProductDto, UpdateProductDto } from '../presentation/dto/products.dto.js';

@Injectable()
export class ProductsService {
  private memoryProducts: any[] = [
    {
      id: 'zero',
      sku: 'CCZ-350',
      name: 'Coca-Cola Zero Azúcar 350 ml',
      brandLine: 'Coca-Cola Zero',
      isActive: true,
    },
    {
      id: 'original',
      sku: 'CCO-350',
      name: 'Coca-Cola Original 350 ml',
      brandLine: 'Coca-Cola',
      isActive: true,
    },
    {
      id: 'sprite',
      sku: 'SPR-350',
      name: 'Sprite 350 ml',
      brandLine: 'Sprite',
      isActive: true,
    },
    {
      id: 'vanilla',
      sku: 'CCV-350',
      name: 'Coca-Cola Zero Vainilla 350 ml',
      brandLine: 'Coca-Cola Creations',
      isActive: true,
    },
  ];

  constructor(private readonly prisma: PrismaService) {}

  async listProducts() {
    try {
      const dbProducts = await this.prisma.product.findMany({
        orderBy: { name: 'asc' },
      });
      if (dbProducts.length > 0) {
        return dbProducts;
      }
    } catch {
      // Memory fallback
    }
    return this.memoryProducts;
  }

  async createProduct(dto: CreateProductDto) {
    if (this.memoryProducts.some((p) => p.sku === dto.sku)) {
      throw new ConflictException('El SKU ya existe');
    }

    const newProd = {
      id: crypto.randomUUID(),
      sku: dto.sku,
      name: dto.name,
      brandLine: dto.brandLine,
      isActive: true,
    };

    try {
      await this.prisma.product.create({
        data: {
          id: newProd.id,
          sku: dto.sku,
          name: dto.name,
          brandLine: dto.brandLine,
          isActive: true,
        },
      });
    } catch {
      // Memory fallback
    }

    this.memoryProducts.push(newProd);
    return newProd;
  }

  async toggleProduct(id: string) {
    let nextStatus = false;
    try {
      const prod = await this.prisma.product.findUnique({ where: { id } });
      if (prod) {
        nextStatus = !prod.isActive;
        await this.prisma.product.update({
          where: { id },
          data: { isActive: nextStatus },
        });
        return { id, isActive: nextStatus };
      }
    } catch {
      // Memory fallback
    }

    const p = this.memoryProducts.find((x) => x.id === id);
    if (p) {
      p.isActive = !p.isActive;
      nextStatus = p.isActive;
    }

    return { id, isActive: nextStatus };
  }
}
