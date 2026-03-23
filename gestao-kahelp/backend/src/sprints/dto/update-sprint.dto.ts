import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { SprintStatus } from '@prisma/client';

export class UpdateSprintDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  goal?: string;

  @IsEnum(SprintStatus)
  @IsOptional()
  status?: SprintStatus;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;
}
