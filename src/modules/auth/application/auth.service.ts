import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service.js';
import { InvalidCredentialsError, StaffAccessRevokedError } from '../../../shared/domain/errors/domain.error.js';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async adminLogin(email: string, password: string) {
    const admin = await this.prisma.adminUser.findUnique({
      where: { email },
    });

    if (!admin || !admin.isActive) {
      throw new InvalidCredentialsError();
    }

    const isMatch = await argon2.verify(admin.passwordHash, password);
    if (!isMatch) {
      throw new InvalidCredentialsError();
    }

    await this.prisma.adminUser.update({
      where: { id: admin.id },
      data: { lastLoginAt: new Date() },
    });

    const payload = {
      sub: admin.id,
      role: 'ADMIN',
      adminRole: admin.role,
      email: admin.email,
    };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    return {
      accessToken,
      refreshToken,
      admin: {
        id: admin.id,
        email: admin.email,
        fullName: admin.fullName,
        role: admin.role,
      },
    };
  }

  async staffLogin(eventCode: string, pin: string) {
    const event = await this.prisma.event.findUnique({
      where: { publicCode: eventCode.toUpperCase().trim() },
      include: {
        activities: { where: { isActive: true } },
        staffAccesses: true,
      },
    });

    if (!event) {
      throw new InvalidCredentialsError();
    }

    // Verify staff PIN
    let validStaffAccess = null;
    for (const access of event.staffAccesses) {
      if (access.revokedAt) continue;
      const isMatch = await argon2.verify(access.pinHash, pin);
      if (isMatch) {
        validStaffAccess = access;
        break;
      }
    }

    if (!validStaffAccess) {
      throw new InvalidCredentialsError();
    }

    const payload = {
      sub: validStaffAccess.id,
      role: 'STAFF',
      eventId: event.id,
      canCheckIn: validStaffAccess.canCheckIn,
      allowedActivityIds: validStaffAccess.allowedActivityIds,
    };

    const staffToken = this.jwtService.sign(payload, { expiresIn: '12h' });

    return {
      staffToken,
      event: {
        id: event.id,
        name: event.name,
        publicCode: event.publicCode,
        status: event.status,
      },
      staffAccess: {
        id: validStaffAccess.id,
        label: validStaffAccess.label,
        canCheckIn: validStaffAccess.canCheckIn,
        allowedActivityIds: validStaffAccess.allowedActivityIds,
      },
      activities: event.activities.map((a) => ({
        id: a.id,
        name: a.name,
        category: a.category,
        maxClaimsPerUser: a.maxClaimsPerUser,
      })),
    };
  }
}
