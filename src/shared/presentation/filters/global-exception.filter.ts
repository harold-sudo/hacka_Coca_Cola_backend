import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { DomainError } from '../../domain/errors/domain.error.js';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const requestId = (request.headers['x-request-id'] as string) || crypto.randomUUID();

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
      const message = typeof res === 'object' && (res as any).message ? (res as any).message : exception.message;

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
}
