import {
  Controller,
  Post,
  Get,
  Body,
  Headers,
  UnauthorizedException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ScanningService, StaffContext } from '../application/scanning.service.js';
import { CheckInRequestDto, SamplingRequestDto } from './dto/scan.dto.js';

@Controller('scan')
export class ScanningController {
  constructor(
    private readonly scanningService: ScanningService,
    private readonly jwtService: JwtService,
  ) {}

  private extractStaff(authHeader?: string): StaffContext {
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
    } catch {
      throw new UnauthorizedException('Token de staff inválido o expirado');
    }
  }

  @Post('check-in')
  @HttpCode(HttpStatus.OK)
  async checkIn(
    @Headers('authorization') auth: string,
    @Body() dto: CheckInRequestDto,
  ) {
    const staff = this.extractStaff(auth);
    const data = await this.scanningService.checkIn(
      staff,
      dto.qrToken,
      dto.clientScanId,
      new Date(dto.scannedAt),
    );
    return {
      success: true,
      code: 'CHECK_IN_SUCCESS',
      message: `Bienvenido/a ${data.firstName}`,
      data,
    };
  }

  @Post('sampling')
  @HttpCode(HttpStatus.CREATED)
  async sampling(
    @Headers('authorization') auth: string,
    @Body() dto: SamplingRequestDto,
  ) {
    const staff = this.extractStaff(auth);
    const data = await this.scanningService.claimSampling(
      staff,
      dto.qrToken,
      dto.activityId,
      dto.productId,
      dto.clientScanId,
      new Date(dto.scannedAt),
    );
    return {
      success: true,
      code: 'SAMPLING_CLAIMED',
      message: `Entrega aprobada: ${data.product?.name || 'Muestra'} (${data.claimNumber} de ${data.maxClaims})`,
      data,
    };
  }

  @Get('offline-manifest')
  async getOfflineManifest(@Headers('authorization') auth: string) {
    const staff = this.extractStaff(auth);
    const data = await this.scanningService.getOfflineManifest(staff.eventId);
    return {
      success: true,
      code: 'OK',
      message: 'Manifiesto offline obtenido con éxito',
      data,
    };
  }
}
