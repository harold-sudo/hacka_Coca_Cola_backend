import { EventsService } from '../application/events.service.js';
import { CreateEventDto, TransitionEventDto, AddActivityDto, AddStaffAccessDto, SetCampaignDto } from './dto/events.dto.js';
export declare class EventsController {
    private readonly eventsService;
    constructor(eventsService: EventsService);
    listEvents(): Promise<{
        success: boolean;
        code: string;
        message: string;
        data: any[];
    }>;
    createEvent(dto: CreateEventDto): Promise<{
        success: boolean;
        code: string;
        message: string;
        data: {
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
        };
    }>;
    getEvent(id: string): Promise<{
        success: boolean;
        code: string;
        message: string;
        data: any;
    }>;
    transitionEvent(id: string, dto: TransitionEventDto): Promise<{
        success: boolean;
        code: string;
        message: string;
        data: {
            success: boolean;
            status: string;
        };
    }>;
    publishEvent(id: string): Promise<{
        success: boolean;
        code: string;
        message: string;
        data: {
            success: boolean;
            status: string;
        };
    }>;
    startEvent(id: string): Promise<{
        success: boolean;
        code: string;
        message: string;
        data: {
            success: boolean;
            status: string;
        };
    }>;
    completeEvent(id: string): Promise<{
        success: boolean;
        code: string;
        message: string;
        data: {
            success: boolean;
            status: string;
        };
    }>;
    cancelEvent(id: string): Promise<{
        success: boolean;
        code: string;
        message: string;
        data: {
            success: boolean;
            status: string;
        };
    }>;
    addActivity(id: string, dto: AddActivityDto): Promise<{
        success: boolean;
        code: string;
        message: string;
        data: {
            id: `${string}-${string}-${string}-${string}-${string}`;
            name: string;
            category: string;
            maxClaimsPerUser: number;
            isActive: boolean;
            productIds: string[];
        };
    }>;
    toggleActivity(id: string): Promise<{
        success: boolean;
        code: string;
        message: string;
        data: {
            id: string;
            isActive: boolean;
        };
    }>;
    addStaffAccess(id: string, dto: AddStaffAccessDto): Promise<{
        success: boolean;
        code: string;
        message: string;
        data: {
            staffAccess: {
                id: `${string}-${string}-${string}-${string}-${string}`;
                label: string;
                canCheckIn: boolean;
                allowedActivityIds: string[];
                revokedAt: null;
            };
            pin: string;
        };
    }>;
    revokeStaffAccess(id: string): Promise<{
        success: boolean;
        code: string;
        message: string;
        data: {
            id: string;
            revokedAt: string;
        };
    }>;
    setCampaign(id: string, dto: SetCampaignDto): Promise<{
        success: boolean;
        code: string;
        message: string;
        data: {
            codePrefix: string;
            discountLabel: string;
            policy: any;
            minSentiment: number;
            expiresAt: string;
        };
    }>;
}
