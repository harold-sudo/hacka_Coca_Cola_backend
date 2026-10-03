import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service.js';
import { CreateEventDto, AddActivityDto, AddStaffAccessDto, SetCampaignDto } from '../presentation/dto/events.dto.js';
export declare class EventsService {
    private readonly prisma;
    private memoryEvents;
    constructor(prisma: PrismaService);
    listEvents(): Promise<any[]>;
    getEvent(id: string): Promise<any>;
    createEvent(dto: CreateEventDto): Promise<{
        id: `${string}-${string}-${string}-${string}-${string}`;
        status: string;
        activities: never[];
        staff: never[];
        campaign: null;
        name: string;
        publicCode: string;
        type: string;
        location: string;
        city: string;
        timezone?: string;
        startsAt: string;
        endsAt: string;
        capacity: number;
        attendanceGoal: number;
    }>;
    transitionEvent(id: string, targetStatus: string): Promise<{
        success: boolean;
        status: string;
    }>;
    addActivity(eventId: string, dto: AddActivityDto): Promise<{
        id: `${string}-${string}-${string}-${string}-${string}`;
        name: string;
        category: string;
        maxClaimsPerUser: number;
        isActive: boolean;
        productIds: string[];
    }>;
    toggleActivity(activityId: string): Promise<{
        id: string;
        isActive: boolean;
    }>;
    addStaffAccess(eventId: string, dto: AddStaffAccessDto): Promise<{
        staffAccess: {
            id: `${string}-${string}-${string}-${string}-${string}`;
            label: string;
            canCheckIn: boolean;
            allowedActivityIds: string[];
            revokedAt: null;
        };
        pin: string;
    }>;
    revokeStaffAccess(staffId: string): Promise<{
        id: string;
        revokedAt: string;
    }>;
    setCampaign(eventId: string, dto: SetCampaignDto): Promise<{
        codePrefix: string;
        discountLabel: string;
        policy: any;
        minSentiment: number;
        expiresAt: string;
    }>;
    private formatEvent;
}
