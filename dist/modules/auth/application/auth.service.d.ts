import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service.js';
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    adminLogin(email: string, password: string): Promise<{
        accessToken: string;
        refreshToken: string;
        admin: {
            id: string;
            email: string;
            fullName: string;
            role: string;
        };
    }>;
    staffLogin(eventCode: string, pin: string): Promise<{
        staffToken: string;
        event: {
            id: string;
            name: string;
            publicCode: string;
            status: string;
        };
        staffAccess: {
            id: string;
            label: string;
            canCheckIn: boolean;
            allowedActivityIds: string[];
        };
        activities: {
            id: string;
            name: string;
            category: string;
            maxClaimsPerUser: number;
        }[];
    }>;
}
