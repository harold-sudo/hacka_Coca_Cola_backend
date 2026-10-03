import { AuthService } from '../application/auth.service.js';
import { AdminLoginRequestDto, StaffLoginRequestDto } from './dto/auth.dto.js';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    adminLogin(dto: AdminLoginRequestDto): Promise<{
        success: boolean;
        code: string;
        message: string;
        data: {
            accessToken: string;
            refreshToken: string;
            admin: {
                id: string;
                email: string;
                fullName: string;
                role: string;
            };
        };
    }>;
    staffLogin(dto: StaffLoginRequestDto): Promise<{
        success: boolean;
        code: string;
        message: string;
        data: {
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
        };
    }>;
}
