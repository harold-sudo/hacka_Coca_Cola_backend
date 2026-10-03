import { ProductsService } from '../application/products.service.js';
import { CreateProductDto } from './dto/products.dto.js';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    listProducts(): Promise<{
        success: boolean;
        code: string;
        message: string;
        data: any[];
    }>;
    createProduct(dto: CreateProductDto): Promise<{
        success: boolean;
        code: string;
        message: string;
        data: {
            id: `${string}-${string}-${string}-${string}-${string}`;
            sku: string;
            name: string;
            brandLine: string;
            isActive: boolean;
        };
    }>;
    toggleProduct(id: string): Promise<{
        success: boolean;
        code: string;
        message: string;
        data: {
            id: string;
            isActive: boolean;
        };
    }>;
}
