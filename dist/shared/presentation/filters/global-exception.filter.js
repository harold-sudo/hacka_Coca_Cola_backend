var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var GlobalExceptionFilter_1;
import { Catch, HttpException, HttpStatus, Logger, } from '@nestjs/common';
import { DomainError } from '../../domain/errors/domain.error.js';
let GlobalExceptionFilter = GlobalExceptionFilter_1 = class GlobalExceptionFilter {
    logger = new Logger(GlobalExceptionFilter_1.name);
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const requestId = request.headers['x-request-id'] || crypto.randomUUID();
        if (exception instanceof DomainError) {
            return response.status(exception.statusCode).json({
                success: false,
                code: exception.code,
                message: exception.message,
                details: exception.details,
                meta: { requestId },
            });
        }
        if (exception instanceof HttpException) {
            const status = exception.getStatus();
            const res = exception.getResponse();
            const message = typeof res === 'object' && res.message ? res.message : exception.message;
            return response.status(status).json({
                success: false,
                code: status === 400 ? 'VALIDATION_ERROR' : 'HTTP_ERROR',
                message: Array.isArray(message) ? message.join('; ') : message,
                details: typeof res === 'object' ? res : undefined,
                meta: { requestId },
            });
        }
        this.logger.error('Unhandled internal error', exception);
        return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            code: 'INTERNAL_ERROR',
            message: 'Ha ocurrido un error inesperado en el servidor',
            meta: { requestId },
        });
    }
};
GlobalExceptionFilter = GlobalExceptionFilter_1 = __decorate([
    Catch()
], GlobalExceptionFilter);
export { GlobalExceptionFilter };
//# sourceMappingURL=global-exception.filter.js.map