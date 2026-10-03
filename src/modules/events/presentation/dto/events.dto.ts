import { IsNotEmpty, IsString, IsEnum, IsNumber, IsOptional, IsArray, IsBoolean } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  publicCode!: string;

  @IsString()
  @IsNotEmpty()
  type!: string;

  @IsString()
  @IsNotEmpty()
  location!: string;

  @IsString()
  @IsNotEmpty()
  city!: string;

  @IsString()
  @IsOptional()
  timezone?: string;

  @IsString()
  @IsNotEmpty()
  startsAt!: string;

  @IsString()
  @IsNotEmpty()
  endsAt!: string;

  @IsNumber()
  capacity!: number;

  @IsNumber()
  attendanceGoal!: number;
}

export class TransitionEventDto {
  @IsString()
  @IsNotEmpty()
  target!: string;
}

export class AddActivityDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  category!: string;

  @IsNumber()
  maxClaimsPerUser!: number;

  @IsArray()
  @IsOptional()
  productIds?: string[];
}

export class AddStaffAccessDto {
  @IsString()
  @IsNotEmpty()
  label!: string;

  @IsBoolean()
  @IsOptional()
  canCheckIn?: boolean;

  @IsArray()
  @IsOptional()
  allowedActivityIds?: string[];
}

export class SetCampaignDto {
  @IsString()
  @IsNotEmpty()
  codePrefix!: string;

  @IsString()
  @IsNotEmpty()
  discountLabel!: string;

  @IsString()
  @IsOptional()
  policy?: string;

  @IsNumber()
  @IsOptional()
  minSentiment?: number;

  @IsString()
  @IsNotEmpty()
  expiresAt!: string;

  @IsNumber()
  @IsOptional()
  maxCoupons?: number;
}
