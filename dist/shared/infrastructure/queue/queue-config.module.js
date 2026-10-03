var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { QUEUES } from './queue.constants.js';
let QueueConfigModule = class QueueConfigModule {
};
QueueConfigModule = __decorate([
    Module({
        imports: [
            BullModule.forRootAsync({
                imports: [ConfigModule],
                useFactory: (configService) => ({
                    connection: {
                        host: configService.get('REDIS_HOST', 'localhost'),
                        port: configService.get('REDIS_PORT', 6379),
                        password: configService.get('REDIS_PASSWORD') || undefined,
                        maxRetriesPerRequest: null,
                        enableOfflineQueue: false,
                        lazyConnect: true,
                        retryStrategy: (times) => {
                            if (times > 2)
                                return null;
                            return 1000;
                        },
                    },
                }),
                inject: [ConfigService],
            }),
            BullModule.registerQueue({ name: QUEUES.WHATSAPP_INBOUND }, { name: QUEUES.WHATSAPP_OUTBOUND }, { name: QUEUES.FEEDBACK_PIPELINE }),
        ],
        exports: [BullModule],
    })
], QueueConfigModule);
export { QueueConfigModule };
//# sourceMappingURL=queue-config.module.js.map