export abstract class DomainError extends Error {
  abstract readonly code: string;
  abstract readonly statusCode: number;

  constructor(
    message: string,
    public readonly details?: Record<string, any>,
  ) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class QrInvalidError extends DomainError {
  readonly code = 'QR_INVALID';
  readonly statusCode = 404;
  constructor() {
    super('Código no reconocido o inválido');
  }
}

export class QrWrongEventError extends DomainError {
  readonly code = 'QR_WRONG_EVENT';
  readonly statusCode = 422;
  constructor() {
    super('Este pase es de otro evento');
  }
}

export class AlreadyCheckedInError extends DomainError {
  readonly code = 'ALREADY_CHECKED_IN';
  readonly statusCode = 409;
  constructor(checkInAt: Date) {
    super(`Asistencia ya registrada a las ${checkInAt.toISOString()}`, { checkInAt });
  }
}

export class NotCheckedInError extends DomainError {
  readonly code = 'NOT_CHECKED_IN';
  readonly statusCode = 409;
  constructor() {
    super('Debe pasar primero por el acceso de check-in');
  }
}

export class BenefitAlreadyRedeemedError extends DomainError {
  readonly code = 'BENEFIT_ALREADY_REDEEMED';
  readonly statusCode = 409;
  constructor(lastClaimAt: Date) {
    super(`El usuario ya retiró su muestra de esta actividad a las ${lastClaimAt.toISOString()}`, {
      lastClaimAt,
    });
  }
}

export class ActivityNotAllowedError extends DomainError {
  readonly code = 'ACTIVITY_NOT_ALLOWED';
  readonly statusCode = 403;
  constructor() {
    super('Actividad no habilitada para este acceso de staff');
  }
}

export class ProductNotInActivityError extends DomainError {
  readonly code = 'PRODUCT_NOT_IN_ACTIVITY';
  readonly statusCode = 422;
  constructor() {
    super('Producto no disponible en esta actividad');
  }
}

export class RegistrationCancelledError extends DomainError {
  readonly code = 'REGISTRATION_CANCELLED';
  readonly statusCode = 422;
  constructor() {
    super('La inscripción se encuentra cancelada');
  }
}

export class EventNotActiveError extends DomainError {
  readonly code = 'EVENT_NOT_ACTIVE';
  readonly statusCode = 422;
  constructor() {
    super('El evento no está activo');
  }
}

export class InvalidCredentialsError extends DomainError {
  readonly code = 'INVALID_CREDENTIALS';
  readonly statusCode = 401;
  constructor() {
    super('Credenciales inválidas');
  }
}

export class StaffAccessRevokedError extends DomainError {
  readonly code = 'STAFF_ACCESS_REVOKED';
  readonly statusCode = 401;
  constructor() {
    super('Acceso revocado');
  }
}

export class FeedbackNotReprocessableError extends DomainError {
  readonly code = 'FEEDBACK_NOT_REPROCESSABLE';
  readonly statusCode = 409;
  constructor() {
    super('Solo se puede reprocesar feedback en estado FAILED');
  }
}
