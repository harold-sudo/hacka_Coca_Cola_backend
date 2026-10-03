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
import { Controller, Post, Get, Body, Headers, UnauthorizedException, HttpCode, HttpStatus, } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ScanningService } from '../application/scanning.service.js';
import { CheckInRequestDto, SamplingRequestDto } from './dto/scan.dto.js';
let ScanningController = class ScanningController {
    scanningService;
    jwtService;
    constructor(scanningService, jwtService) {
        this.scanningService = scanningService;
        this.jwtService = jwtService;
    }
    extractStaff(authHeader) {
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException('Token de staff requerido');
        }
        const token = authHeader.split(' ')[1];
        try {
            const decoded = this.jwtService.verify(token);
            if (decoded.role !== 'STAFF') {
                throw new UnauthorizedException('El token provisto no pertenece a un staff');
            }
            return {
                staffAccessId: decoded.sub,
                eventId: decoded.eventId,
                canCheckIn: decoded.canCheckIn,
                allowedActivityIds: decoded.allowedActivityIds || [],
            };
        }
        catch {
            throw new UnauthorizedException('Token de staff inválido o expirado');
        }
    }
    async checkIn(auth, dto) {
        const staff = this.extractStaff(auth);
        const data = await this.scanningService.checkIn(staff, dto.qrToken, dto.clientScanId, new Date(dto.scannedAt));
        return {
            success: true,
            code: 'CHECK_IN_SUCCESS',
            message: `Bienvenido/a ${data.firstName}`,
            data,
        };
    }
    async sampling(auth, dto) {
        const staff = this.extractStaff(auth);
        const data = await this.scanningService.claimSampling(staff, dto.qrToken, dto.activityId, dto.productId, dto.clientScanId, new Date(dto.scannedAt));
        return {
            success: true,
            code: 'SAMPLING_CLAIMED',
            message: `Entrega aprobada: ${data.product?.name || 'Muestra'} (${data.claimNumber} de ${data.maxClaims})`,
            data,
        };
    }
    async getOfflineManifest(auth) {
        const staff = this.extractStaff(auth);
        const data = await this.scanningService.getOfflineManifest(staff.eventId);
        return {
            success: true,
            code: 'OK',
            message: 'Manifiesto offline obtenido con éxito',
            data,
        };
    }
};
__decorate([
    Post('check-in'),
    HttpCode(HttpStatus.OK),
    __param(0, Headers('authorization')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, CheckInRequestDto]),
    __metadata("design:returntype", Promise)
], ScanningController.prototype, "checkIn", null);
__decorate([
    Post('sampling'),
    HttpCode(HttpStatus.CREATED),
    __param(0, Headers('authorization')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, SamplingRequestDto]),
    __metadata("design:returntype", Promise)
], ScanningController.prototype, "sampling", null);
__decorate([
    Get('offline-manifest'),
    __param(0, Headers('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ScanningController.prototype, "getOfflineManifest", null);
ScanningController = __decorate([
    Controller('scan'),
    __metadata("design:paramtypes", [ScanningService,
        JwtService])
], ScanningController);
export { ScanningController };
//# sourceMappingURL=scanning.controller.js.map