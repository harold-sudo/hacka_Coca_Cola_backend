export declare abstract class DomainError extends Error {
    readonly details?: Record<string, any> | undefined;
    abstract readonly code: string;
    abstract readonly statusCode: number;
    constructor(message: string, details?: Record<string, any> | undefined);
}
export declare class QrInvalidError extends DomainError {
    readonly code = "QR_INVALID";
    readonly statusCode = 404;
    constructor();
}
export declare class QrWrongEventError extends DomainError {
    readonly code = "QR_WRONG_EVENT";
    readonly statusCode = 422;
    constructor();
}
export declare class AlreadyCheckedInError extends DomainError {
    readonly code = "ALREADY_CHECKED_IN";
    readonly statusCode = 409;
    constructor(checkInAt: Date);
}
export declare class NotCheckedInError extends DomainError {
    readonly code = "NOT_CHECKED_IN";
    readonly statusCode = 409;
    constructor();
}
export declare class BenefitAlreadyRedeemedError extends DomainError {
    readonly code = "BENEFIT_ALREADY_REDEEMED";
    readonly statusCode = 409;
    constructor(lastClaimAt: Date);
}
export declare class ActivityNotAllowedError extends DomainError {
    readonly code = "ACTIVITY_NOT_ALLOWED";
    readonly statusCode = 403;
    constructor();
}
export declare class ProductNotInActivityError extends DomainError {
    readonly code = "PRODUCT_NOT_IN_ACTIVITY";
    readonly statusCode = 422;
    constructor();
}
export declare class RegistrationCancelledError extends DomainError {
    readonly code = "REGISTRATION_CANCELLED";
    readonly statusCode = 422;
    constructor();
}
export declare class EventNotActiveError extends DomainError {
    readonly code = "EVENT_NOT_ACTIVE";
    readonly statusCode = 422;
    constructor();
}
export declare class InvalidCredentialsError extends DomainError {
    readonly code = "INVALID_CREDENTIALS";
    readonly statusCode = 401;
    constructor();
}
export declare class StaffAccessRevokedError extends DomainError {
    readonly code = "STAFF_ACCESS_REVOKED";
    readonly statusCode = 401;
    constructor();
}
export declare class FeedbackNotReprocessableError extends DomainError {
    readonly code = "FEEDBACK_NOT_REPROCESSABLE";
    readonly statusCode = 409;
    constructor();
}
