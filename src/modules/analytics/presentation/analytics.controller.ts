import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { AnalyticsService } from '../application/analytics.service.js';

@Controller('events')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get(':id/metrics')
  async getMetrics(@Param('id', ParseUUIDPipe) id: string) {
    const data = await this.analyticsService.getEventMetrics(id);
    return {
      success: true,
      code: 'OK',
      message: 'Métricas de evento obtenidas con éxito',
      data,
    };
  }
}
