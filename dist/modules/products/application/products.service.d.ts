import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service.js';
import { CreateProductDto } from '../presentation/dto/products.dto.js';
export declare class ProductsService {
    private readonly prisma;
    private memoryProducts;
    constructor(prisma: PrismaService);
    listProducts(): Promise<any[]>;
    createProduct(dto: CreateProductDto): Promise<{
        id: `${string}-${string}-${string}-${string}-${string}`;
        sku: string;
        name: string;
        brandLine: string;
        isActive: boolean;
    }>;
    toggleProduct(id: string): Promise<{
        id: string;
        isActive: boolean;
    }>;
}
