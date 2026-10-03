export declare class CreateEventDto {
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
}
export declare class TransitionEventDto {
    target: string;
}
export declare class AddActivityDto {
    name: string;
    category: string;
    maxClaimsPerUser: number;
    productIds?: string[];
}
export declare class AddStaffAccessDto {
    label: string;
    canCheckIn?: boolean;
    allowedActivityIds?: string[];
}
export declare class SetCampaignDto {
    codePrefix: string;
    discountLabel: string;
    policy?: string;
    minSentiment?: number;
    expiresAt: string;
    maxCoupons?: number;
}
