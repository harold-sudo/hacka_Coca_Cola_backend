var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './shared/infrastructure/prisma/prisma.module.js';
import { QueueConfigModule } from './shared/infrastructure/queue/queue-config.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { ScanningModule } from './modules/scanning/scanning.module.js';
import { FeedbackModule } from './modules/feedback/feedback.module.js';
import { ConversationsModule } from './modules/conversations/conversations.module.js';
import { AnalyticsModule } from './modules/analytics/analytics.module.js';
let AppModule = class AppModule {
};
AppModule = __decorate([
    Module({
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
        ],
    })
], AppModule);
export { AppModule };
//# sourceMappingURL=app.module.js.map