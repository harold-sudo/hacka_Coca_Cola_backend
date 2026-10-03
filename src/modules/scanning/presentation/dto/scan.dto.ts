import { IsNotEmpty, IsString, IsUUID, IsOptional, IsISO8601 } from 'class-validator';

export class CheckInRequestDto {
  @IsString()
  @IsNotEmpty({ message: 'El token QR es obligatorio' })
  qrToken!: string;

  @IsUUID('4', { message: 'clientScanId debe ser un UUID válido' })
  @IsNotEmpty()
  clientScanId!: string;

  @IsISO8601()
  @IsNotEmpty()
  scannedAt!: string;
}

export class SamplingRequestDto {
  @IsString()
  @IsNotEmpty({ message: 'El token QR es obligatorio' })
  qrToken!: string;

  @IsString()
  @IsNotEmpty({ message: 'activityId es obligatorio' })
  activityId!: string;

  @IsString()
  @IsOptional()
  productId?: string;

  @IsUUID('4', { message: 'clientScanId debe ser un UUID válido' })
  @IsNotEmpty()
  clientScanId!: string;

  @IsISO8601()
  @IsNotEmpty()
  scannedAt!: string;
}
