var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
let PrismaService = class PrismaService extends PrismaClient {
    async onModuleInit() {
        try {
            await this.$connect();
            console.log('✅ Conexión con PostgreSQL/Supabase exitosa');
        }
        catch (err) {
            console.warn('⚠️ No se pudo conectar a la base de datos PostgreSQL:', err.message);
            console.warn('👉 Asegúrate de proveer la DATABASE_URL correcta en .env');
        }
    }
    async onModuleDestroy() {
        try {
            await this.$disconnect();
        }
        catch { }
    }
};
PrismaService = __decorate([
    Injectable()
], PrismaService);
export { PrismaService };
//# sourceMappingURL=prisma.service.js.map