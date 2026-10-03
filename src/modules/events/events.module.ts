import { Module } from '@nestjs/common';
import { EventsController } from './presentation/events.controller.js';
import { EventsService } from './application/events.service.js';

@Module({
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}
