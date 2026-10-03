import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from '../application/auth.service.js';
import { AdminLoginRequestDto, StaffLoginRequestDto } from './dto/auth.dto.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('admin/login')
  @HttpCode(HttpStatus.OK)
  async adminLogin(@Body() dto: AdminLoginRequestDto) {
    const data = await this.authService.adminLogin(dto.email, dto.password);
    return {
      success: true,
      code: 'OK',
      message: 'Inicio de sesión administrativo exitoso',
      data,
    };
  }

  @Post('staff/login')
  @HttpCode(HttpStatus.OK)
  async staffLogin(@Body() dto: StaffLoginRequestDto) {
    const data = await this.authService.staffLogin(dto.eventCode, dto.pin);
    return {
      success: true,
      code: 'OK',
      message: 'Inicio de sesión de staff exitoso',
      data,
    };
  }
}
