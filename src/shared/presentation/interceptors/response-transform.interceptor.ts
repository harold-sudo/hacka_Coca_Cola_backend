import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request } from 'express';

export interface StandardApiResponse<T> {
  success: boolean;
  code: string;
  message: string;
  data: T;
  meta: {
    requestId: string;
    [key: string]: any;
  };
}

@Injectable()
export class ResponseTransformInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const requestId = (request.headers['x-request-id'] as string) || crypto.randomUUID();

    return next.handle().pipe(
      map((result) => {
        // If response is already formatted as envelope
        if (result && typeof result === 'object' && 'success' in result && 'data' in result) {
          if (!result.meta) result.meta = {};
          result.meta.requestId = requestId;
          return result;
        }

        return {
          success: true,
          code: 'OK',
          message: 'Operación ejecutada con éxito',
          data: result,
          meta: {
            requestId,
          },
        };
      }),
    );
  }
}
