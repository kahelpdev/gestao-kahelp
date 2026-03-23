import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSprintDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  goal?: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsString()
  @IsNotEmpty()
  teamId: string;
}
