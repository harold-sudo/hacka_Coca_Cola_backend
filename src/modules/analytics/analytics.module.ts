import { Module } from '@nestjs/common';
import { AnalyticsService } from './application/analytics.service.js';
import { AnalyticsController } from './presentation/analytics.controller.js';

@Module({
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
