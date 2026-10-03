import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module.js';
import { GlobalExceptionFilter } from './shared/presentation/filters/global-exception.filter.js';
import { ResponseTransformInterceptor } from './shared/presentation/interceptors/response-transform.interceptor.js';
async function bootstrap() {
    const logger = new Logger('Bootstrap');
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api/v1');
    app.enableCors({
        origin: '*',
        credentials: true,
    });
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.useGlobalInterceptors(new ResponseTransformInterceptor());
    app.useGlobalFilters(new GlobalExceptionFilter());
    const port = process.env.PORT || 3000;
    await app.listen(port);
    logger.log(`🚀 Coca-Cola Event Intelligence API is running on http://localhost:${port}/api/v1`);
}
bootstrap();
//# sourceMappingURL=main.js.map