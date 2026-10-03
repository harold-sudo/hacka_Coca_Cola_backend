import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    try {
      await this.$connect();
      console.log('✅ Conexión con PostgreSQL/Supabase exitosa');
    } catch (err: any) {
      console.warn('⚠️ No se pudo conectar a la base de datos PostgreSQL:', err.message);
      console.warn('👉 Asegúrate de proveer la DATABASE_URL correcta en .env');
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
    } catch {}
  }
}
