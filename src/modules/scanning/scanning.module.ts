import { Module } from '@nestjs/common';
import { ScanningService } from './application/scanning.service.js';
import { ScanningController } from './presentation/scanning.controller.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [AuthModule],
  controllers: [ScanningController],
  providers: [ScanningService],
  exports: [ScanningService],
})
export class ScanningModule {}
