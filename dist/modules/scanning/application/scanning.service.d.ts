import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service.js';
export interface StaffContext {
    staffAccessId: string;
    eventId: string;
    canCheckIn: boolean;
    allowedActivityIds: string[];
}
export declare class ScanningService {
    private readonly prisma;
    private readonly configService;
    private readonly secret;
    private readonly previousSecret?;
    constructor(prisma: PrismaService, configService: ConfigService);
    checkIn(staff: StaffContext, qrToken: string, clientScanId: string, scannedAt: Date): Promise<{
        registrationId: string;
        firstName: string;
        checkInAt: Date | null;
        isRecurrent: boolean;
    }>;
    claimSampling(staff: StaffContext, qrToken: string, activityId: string, productId: string | undefined, clientScanId: string, scannedAt: Date): Promise<{
        interactionId: string;
        firstName: string;
        product: {
            id: string;
            name: string;
        } | null;
        claimNumber: number;
        maxClaims: number;
        scannedAt: Date;
    }>;
    getOfflineManifest(eventId: string): Promise<{
        eventId: string;
        generatedAt: Date;
        entries: {
            qrHash: string;
            firstName: string;
            status: import("@prisma/client").$Enums.RegistrationStatus;
            checkInAt: Date | null;
        }[];
    }>;
}
