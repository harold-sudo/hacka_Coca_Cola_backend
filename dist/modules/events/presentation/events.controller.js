var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Controller, Get, Post, Patch, Put, Param, Body, HttpCode, HttpStatus, } from '@nestjs/common';
import { EventsService } from '../application/events.service.js';
import { CreateEventDto, TransitionEventDto, AddActivityDto, AddStaffAccessDto, SetCampaignDto, } from './dto/events.dto.js';
let EventsController = class EventsController {
    eventsService;
    constructor(eventsService) {
        this.eventsService = eventsService;
    }
    async listEvents() {
        const data = await this.eventsService.listEvents();
        return {
            success: true,
            code: 'OK',
            message: 'Eventos obtenidos con éxito',
            data,
        };
    }
    async createEvent(dto) {
        const data = await this.eventsService.createEvent(dto);
        return {
            success: true,
            code: 'OK',
            message: 'Evento creado con éxito',
            data,
        };
    }
    async getEvent(id) {
        const data = await this.eventsService.getEvent(id);
        return {
            success: true,
            code: 'OK',
            message: 'Evento obtenido con éxito',
            data,
        };
    }
    async transitionEvent(id, dto) {
        const data = await this.eventsService.transitionEvent(id, dto.target);
        return {
            success: true,
            code: 'OK',
            message: `Estado actualizado a ${dto.target}`,
            data,
        };
    }
    async publishEvent(id) {
        const data = await this.eventsService.transitionEvent(id, 'PUBLISHED');
        return {
            success: true,
            code: 'OK',
            message: 'Evento publicado con éxito',
            data,
        };
    }
    async startEvent(id) {
        const data = await this.eventsService.transitionEvent(id, 'ACTIVE');
        return {
            success: true,
            code: 'OK',
            message: 'Evento iniciado con éxito',
            data,
        };
    }
    async completeEvent(id) {
        const data = await this.eventsService.transitionEvent(id, 'COMPLETED');
        return {
            success: true,
            code: 'OK',
            message: 'Evento completado',
            data,
        };
    }
    async cancelEvent(id) {
        const data = await this.eventsService.transitionEvent(id, 'CANCELLED');
        return {
            success: true,
            code: 'OK',
            message: 'Evento cancelado',
            data,
        };
    }
    async addActivity(id, dto) {
        const data = await this.eventsService.addActivity(id, dto);
        return {
            success: true,
            code: 'OK',
            message: 'Actividad agregada con éxito',
            data,
        };
    }
    async toggleActivity(id) {
        const data = await this.eventsService.toggleActivity(id);
        return {
            success: true,
            code: 'OK',
            message: 'Estado de la actividad actualizado',
            data,
        };
    }
    async addStaffAccess(id, dto) {
        const data = await this.eventsService.addStaffAccess(id, dto);
        return {
            success: true,
            code: 'OK',
            message: 'Acceso de staff generado',
            data,
        };
    }
    async revokeStaffAccess(id) {
        const data = await this.eventsService.revokeStaffAccess(id);
        return {
            success: true,
            code: 'OK',
            message: 'Acceso de staff revocado',
            data,
        };
    }
    async setCampaign(id, dto) {
        const data = await this.eventsService.setCampaign(id, dto);
        return {
            success: true,
            code: 'OK',
            message: 'Campaña configurada con éxito',
            data,
        };
    }
};
__decorate([
    Get('events'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "listEvents", null);
__decorate([
    Post('events'),
    HttpCode(HttpStatus.CREATED),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateEventDto]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "createEvent", null);
__decorate([
    Get('events/:id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "getEvent", null);
__decorate([
    Post('events/:id/transition'),
    HttpCode(HttpStatus.OK),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, TransitionEventDto]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "transitionEvent", null);
__decorate([
    Post('events/:id/publish'),
    HttpCode(HttpStatus.OK),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "publishEvent", null);
__decorate([
    Post('events/:id/start'),
    HttpCode(HttpStatus.OK),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "startEvent", null);
__decorate([
    Post('events/:id/complete'),
    HttpCode(HttpStatus.OK),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "completeEvent", null);
__decorate([
    Post('events/:id/cancel'),
    HttpCode(HttpStatus.OK),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "cancelEvent", null);
__decorate([
    Post('events/:id/activities'),
    HttpCode(HttpStatus.CREATED),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, AddActivityDto]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "addActivity", null);
__decorate([
    Patch('activities/:id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "toggleActivity", null);
__decorate([
    Post('events/:id/staff-accesses'),
    HttpCode(HttpStatus.CREATED),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, AddStaffAccessDto]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "addStaffAccess", null);
__decorate([
    Post('staff-accesses/:id/revoke'),
    HttpCode(HttpStatus.OK),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "revokeStaffAccess", null);
__decorate([
    Put('events/:id/coupon-campaign'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, SetCampaignDto]),
    __metadata("design:returntype", Promise)
], EventsController.prototype, "setCampaign", null);
EventsController = __decorate([
    Controller(),
    __metadata("design:paramtypes", [EventsService])
], EventsController);
export { EventsController };
//# sourceMappingURL=events.controller.js.map