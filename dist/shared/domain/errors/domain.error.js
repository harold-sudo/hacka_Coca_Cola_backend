export class DomainError extends Error {
    details;
    constructor(message, details) {
        super(message);
        this.details = details;
        this.name = this.constructor.name;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
export class QrInvalidError extends DomainError {
    code = 'QR_INVALID';
    statusCode = 404;
    constructor() {
        super('Código no reconocido o inválido');
    }
}
export class QrWrongEventError extends DomainError {
    code = 'QR_WRONG_EVENT';
    statusCode = 422;
    constructor() {
        super('Este pase es de otro evento');
    }
}
export class AlreadyCheckedInError extends DomainError {
    code = 'ALREADY_CHECKED_IN';
    statusCode = 409;
    constructor(checkInAt) {
        super(`Asistencia ya registrada a las ${checkInAt.toISOString()}`, { checkInAt });
    }
}
export class NotCheckedInError extends DomainError {
    code = 'NOT_CHECKED_IN';
    statusCode = 409;
    constructor() {
        super('Debe pasar primero por el acceso de check-in');
    }
}
export class BenefitAlreadyRedeemedError extends DomainError {
    code = 'BENEFIT_ALREADY_REDEEMED';
    statusCode = 409;
    constructor(lastClaimAt) {
        super(`El usuario ya retiró su muestra de esta actividad a las ${lastClaimAt.toISOString()}`, {
            lastClaimAt,
        });
    }
}
export class ActivityNotAllowedError extends DomainError {
    code = 'ACTIVITY_NOT_ALLOWED';
    statusCode = 403;
    constructor() {
        super('Actividad no habilitada para este acceso de staff');
    }
}
export class ProductNotInActivityError extends DomainError {
    code = 'PRODUCT_NOT_IN_ACTIVITY';
    statusCode = 422;
    constructor() {
        super('Producto no disponible en esta actividad');
    }
}
export class RegistrationCancelledError extends DomainError {
    code = 'REGISTRATION_CANCELLED';
    statusCode = 422;
    constructor() {
        super('La inscripción se encuentra cancelada');
    }
}
export class EventNotActiveError extends DomainError {
    code = 'EVENT_NOT_ACTIVE';
    statusCode = 422;
    constructor() {
        super('El evento no está activo');
    }
}
export class InvalidCredentialsError extends DomainError {
    code = 'INVALID_CREDENTIALS';
    statusCode = 401;
    constructor() {
        super('Credenciales inválidas');
    }
}
export class StaffAccessRevokedError extends DomainError {
    code = 'STAFF_ACCESS_REVOKED';
    statusCode = 401;
    constructor() {
        super('Acceso revocado');
    }
}
export class FeedbackNotReprocessableError extends DomainError {
    code = 'FEEDBACK_NOT_REPROCESSABLE';
    statusCode = 409;
    constructor() {
        super('Solo se puede reprocesar feedback en estado FAILED');
    }
}
//# sourceMappingURL=domain.error.js.map