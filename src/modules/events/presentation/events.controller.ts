import {
  Controller,
  Get,
  Post,
  Patch,
  Put,
  Param,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { EventsService } from '../application/events.service.js';
import {
  CreateEventDto,
  TransitionEventDto,
  AddActivityDto,
  AddStaffAccessDto,
  SetCampaignDto,
} from './dto/events.dto.js';

@Controller()
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get('events')
  async listEvents() {
    const data = await this.eventsService.listEvents();
    return {
      success: true,
      code: 'OK',
      message: 'Eventos obtenidos con éxito',
      data,
    };
  }

  @Post('events')
  @HttpCode(HttpStatus.CREATED)
  async createEvent(@Body() dto: CreateEventDto) {
    const data = await this.eventsService.createEvent(dto);
    return {
      success: true,
      code: 'OK',
      message: 'Evento creado con éxito',
      data,
    };
  }

  @Get('events/:id')
  async getEvent(@Param('id') id: string) {
    const data = await this.eventsService.getEvent(id);
    return {
      success: true,
      code: 'OK',
      message: 'Evento obtenido con éxito',
      data,
    };
  }

  @Post('events/:id/transition')
  @HttpCode(HttpStatus.OK)
  async transitionEvent(
    @Param('id') id: string,
    @Body() dto: TransitionEventDto,
  ) {
    const data = await this.eventsService.transitionEvent(id, dto.target);
    return {
      success: true,
      code: 'OK',
      message: `Estado actualizado a ${dto.target}`,
      data,
    };
  }

  @Post('events/:id/publish')
  @HttpCode(HttpStatus.OK)
  async publishEvent(@Param('id') id: string) {
    const data = await this.eventsService.transitionEvent(id, 'PUBLISHED');
    return {
      success: true,
      code: 'OK',
      message: 'Evento publicado con éxito',
      data,
    };
  }

  @Post('events/:id/start')
  @HttpCode(HttpStatus.OK)
  async startEvent(@Param('id') id: string) {
    const data = await this.eventsService.transitionEvent(id, 'ACTIVE');
    return {
      success: true,
      code: 'OK',
      message: 'Evento iniciado con éxito',
      data,
    };
  }

  @Post('events/:id/complete')
  @HttpCode(HttpStatus.OK)
  async completeEvent(@Param('id') id: string) {
    const data = await this.eventsService.transitionEvent(id, 'COMPLETED');
    return {
      success: true,
      code: 'OK',
      message: 'Evento completado',
      data,
    };
  }

  @Post('events/:id/cancel')
  @HttpCode(HttpStatus.OK)
  async cancelEvent(@Param('id') id: string) {
    const data = await this.eventsService.transitionEvent(id, 'CANCELLED');
    return {
      success: true,
      code: 'OK',
      message: 'Evento cancelado',
      data,
    };
  }

  @Post('events/:id/activities')
  @HttpCode(HttpStatus.CREATED)
  async addActivity(
    @Param('id') id: string,
    @Body() dto: AddActivityDto,
  ) {
    const data = await this.eventsService.addActivity(id, dto);
    return {
      success: true,
      code: 'OK',
      message: 'Actividad agregada con éxito',
      data,
    };
  }

  @Patch('activities/:id')
  async toggleActivity(@Param('id') id: string) {
    const data = await this.eventsService.toggleActivity(id);
    return {
      success: true,
      code: 'OK',
      message: 'Estado de la actividad actualizado',
      data,
    };
  }

  @Post('events/:id/staff-accesses')
  @HttpCode(HttpStatus.CREATED)
  async addStaffAccess(
    @Param('id') id: string,
    @Body() dto: AddStaffAccessDto,
  ) {
    const data = await this.eventsService.addStaffAccess(id, dto);
    return {
      success: true,
      code: 'OK',
      message: 'Acceso de staff generado',
      data,
    };
  }

  @Post('staff-accesses/:id/revoke')
  @HttpCode(HttpStatus.OK)
  async revokeStaffAccess(@Param('id') id: string) {
    const data = await this.eventsService.revokeStaffAccess(id);
    return {
      success: true,
      code: 'OK',
      message: 'Acceso de staff revocado',
      data,
    };
  }

  @Put('events/:id/coupon-campaign')
  async setCampaign(
    @Param('id') id: string,
    @Body() dto: SetCampaignDto,
  ) {
    const data = await this.eventsService.setCampaign(id, dto);
    return {
      success: true,
      code: 'OK',
      message: 'Campaña configurada con éxito',
      data,
    };
  }
}
