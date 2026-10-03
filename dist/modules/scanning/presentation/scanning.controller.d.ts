import { JwtService } from '@nestjs/jwt';
import { ScanningService } from '../application/scanning.service.js';
import { CheckInRequestDto, SamplingRequestDto } from './dto/scan.dto.js';
export declare class ScanningController {
    private readonly scanningService;
    private readonly jwtService;
    constructor(scanningService: ScanningService, jwtService: JwtService);
    private extractStaff;
    checkIn(auth: string, dto: CheckInRequestDto): Promise<{
        success: boolean;
        code: string;
        message: string;
        data: {
            registrationId: string;
            firstName: string;
            checkInAt: Date | null;
            isRecurrent: boolean;
        };
    }>;
    sampling(auth: string, dto: SamplingRequestDto): Promise<{
        success: boolean;
        code: string;
        message: string;
        data: {
            interactionId: string;
            firstName: string;
            product: {
                id: string;
                name: string;
            } | null;
            claimNumber: number;
            maxClaims: number;
            scannedAt: Date;
        };
    }>;
    getOfflineManifest(auth: string): Promise<{
        success: boolean;
        code: string;
        message: string;
        data: {
            eventId: string;
            generatedAt: Date;
            entries: {
                qrHash: string;
                firstName: string;
                status: import("@prisma/client").$Enums.RegistrationStatus;
                checkInAt: Date | null;
            }[];
        };
    }>;
}
