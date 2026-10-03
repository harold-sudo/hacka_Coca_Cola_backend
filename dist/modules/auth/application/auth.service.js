var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service.js';
import { InvalidCredentialsError } from '../../../shared/domain/errors/domain.error.js';
import * as argon2 from 'argon2';
let AuthService = class AuthService {
    prisma;
    jwtService;
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async adminLogin(email, password) {
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
    async staffLogin(eventCode, pin) {
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
        let validStaffAccess = null;
        for (const access of event.staffAccesses) {
            if (access.revokedAt)
                continue;
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
};
AuthService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService,
        JwtService])
], AuthService);
export { AuthService };
//# sourceMappingURL=auth.service.js.map