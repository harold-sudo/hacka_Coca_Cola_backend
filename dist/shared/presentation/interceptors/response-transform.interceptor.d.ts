import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
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
export declare class ResponseTransformInterceptor<T> implements NestInterceptor<T, any> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
}
