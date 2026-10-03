var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service.js';
let ProductsService = class ProductsService {
    prisma;
    memoryProducts = [
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
    constructor(prisma) {
        this.prisma = prisma;
    }
    async listProducts() {
        try {
            const dbProducts = await this.prisma.product.findMany({
                orderBy: { name: 'asc' },
            });
            if (dbProducts.length > 0) {
                return dbProducts;
            }
        }
        catch {
        }
        return this.memoryProducts;
    }
    async createProduct(dto) {
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
        }
        catch {
        }
        this.memoryProducts.push(newProd);
        return newProd;
    }
    async toggleProduct(id) {
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
        }
        catch {
        }
        const p = this.memoryProducts.find((x) => x.id === id);
        if (p) {
            p.isActive = !p.isActive;
            nextStatus = p.isActive;
        }
        return { id, isActive: nextStatus };
    }
};
ProductsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], ProductsService);
export { ProductsService };
//# sourceMappingURL=products.service.js.map