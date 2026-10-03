import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './shared/infrastructure/prisma/prisma.module.js';
import { QueueConfigModule } from './shared/infrastructure/queue/queue-config.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { ScanningModule } from './modules/scanning/scanning.module.js';
import { FeedbackModule } from './modules/feedback/feedback.module.js';
import { ConversationsModule } from './modules/conversations/conversations.module.js';
import { AnalyticsModule } from './modules/analytics/analytics.module.js';
import { EventsModule } from './modules/events/events.module.js';
import { ProductsModule } from './modules/products/products.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    QueueConfigModule,
    AuthModule,
    ScanningModule,
    FeedbackModule,
    ConversationsModule,
    AnalyticsModule,
    EventsModule,
    ProductsModule,
  ],
})
export class AppModule {}
