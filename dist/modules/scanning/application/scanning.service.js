var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable, ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service.js';
import { QrTokenService } from '../../../shared/infrastructure/security/qr-token.service.js';
import { AlreadyCheckedInError, BenefitAlreadyRedeemedError, NotCheckedInError, QrInvalidError, QrWrongEventError, RegistrationCancelledError, ActivityNotAllowedError, ProductNotInActivityError, } from '../../../shared/domain/errors/domain.error.js';
import { RegistrationStatus, CheckInMethod } from '@prisma/client';
let ScanningService = class ScanningService {
    prisma;
    configService;
    secret;
    previousSecret;
    constructor(prisma, configService) {
        this.prisma = prisma;
        this.configService = configService;
        this.secret = this.configService.get('QR_SIGNING_SECRET') || 'qr-default-secret';
        this.previousSecret = this.configService.get('QR_SIGNING_SECRET_PREVIOUS') || undefined;
    }
    async checkIn(staff, qrToken, clientScanId, scannedAt) {
        if (!staff.canCheckIn) {
            throw new ForbiddenException('Este acceso de staff no está autorizado para check-in');
        }
        const verification = QrTokenService.verify(qrToken, staff.eventId, this.secret, this.previousSecret);
        const qrHash = QrTokenService.computeHash(qrToken);
        const registration = await this.prisma.registration.findUnique({
            where: { qrHash },
            include: { participant: true, event: true },
        });
        if (!registration) {
            if (!verification.valid)
                throw new QrInvalidError();
            throw new QrInvalidError();
        }
        if (registration.eventId !== staff.eventId) {
            throw new QrWrongEventError();
        }
        if (registration.status === RegistrationStatus.CANCELLED) {
            throw new RegistrationCancelledError();
        }
        if (registration.status === RegistrationStatus.ATTENDED) {
            throw new AlreadyCheckedInError(registration.checkInAt || new Date());
        }
        const updated = await this.prisma.registration.update({
            where: { id: registration.id },
            data: {
                status: RegistrationStatus.ATTENDED,
                checkInAt: scannedAt,
                checkInMethod: CheckInMethod.QR_ONLINE,
                checkInStaffAccessId: staff.staffAccessId,
                checkInClientScanId: clientScanId,
                lastActivityAt: scannedAt,
            },
            include: { participant: true },
        });
        return {
            registrationId: updated.id,
            firstName: updated.participant.fullName.split(' ')[0],
            checkInAt: updated.checkInAt,
            isRecurrent: updated.participant.isRecurrent,
        };
    }
    async claimSampling(staff, qrToken, activityId, productId, clientScanId, scannedAt) {
        if (staff.allowedActivityIds.length > 0 && !staff.allowedActivityIds.includes(activityId)) {
            throw new ActivityNotAllowedError();
        }
        const activity = await this.prisma.activity.findUnique({
            where: { id: activityId },
            include: { products: { include: { product: true } } },
        });
        if (!activity || activity.eventId !== staff.eventId || !activity.isActive) {
            throw new ActivityNotAllowedError();
        }
        if (productId) {
            const isProductAllowed = activity.products.some((ap) => ap.productId === productId);
            if (!isProductAllowed) {
                throw new ProductNotInActivityError();
            }
        }
        const qrHash = QrTokenService.computeHash(qrToken);
        const registration = await this.prisma.registration.findUnique({
            where: { qrHash },
            include: {
                participant: true,
                interactions: {
                    where: { activityId },
                    orderBy: { claimNumber: 'asc' },
                },
            },
        });
        if (!registration || registration.eventId !== staff.eventId) {
            throw new QrInvalidError();
        }
        if (registration.status !== RegistrationStatus.ATTENDED) {
            throw new NotCheckedInError();
        }
        const existingClaims = registration.interactions;
        if (existingClaims.length >= activity.maxClaimsPerUser) {
            const lastClaim = existingClaims[existingClaims.length - 1];
            throw new BenefitAlreadyRedeemedError(lastClaim.scannedAt);
        }
        const nextClaimNumber = existingClaims.length + 1;
        const [interaction] = await this.prisma.$transaction([
            this.prisma.interaction.create({
                data: {
                    registrationId: registration.id,
                    activityId: activity.id,
                    productId: productId || null,
                    staffAccessId: staff.staffAccessId,
                    claimNumber: nextClaimNumber,
                    clientScanId,
                    scannedAt,
                },
                include: { product: true },
            }),
            this.prisma.registration.update({
                where: { id: registration.id },
                data: { lastActivityAt: scannedAt },
            }),
        ]);
        return {
            interactionId: interaction.id,
            firstName: registration.participant.fullName.split(' ')[0],
            product: interaction.product
                ? { id: interaction.product.id, name: interaction.product.name }
                : null,
            claimNumber: nextClaimNumber,
            maxClaims: activity.maxClaimsPerUser,
            scannedAt: interaction.scannedAt,
        };
    }
    async getOfflineManifest(eventId) {
        const registrations = await this.prisma.registration.findMany({
            where: { eventId },
            include: { participant: true },
        });
        return {
            eventId,
            generatedAt: new Date(),
            entries: registrations.map((r) => ({
                qrHash: r.qrHash,
                firstName: r.participant.fullName.split(' ')[0],
                status: r.status,
                checkInAt: r.checkInAt,
            })),
        };
    }
};
ScanningService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService,
        ConfigService])
], ScanningService);
export { ScanningService };
//# sourceMappingURL=scanning.service.js.map