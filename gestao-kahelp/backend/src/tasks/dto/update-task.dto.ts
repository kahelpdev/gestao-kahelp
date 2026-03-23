import { IsEnum, IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { TaskStatus } from '@prisma/client';

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @IsInt()
  @Min(0)
  @IsOptional()
  priority?: number;

  @IsInt()
  @IsOptional()
  storyPoints?: number;

  @IsNumber()
  @IsOptional()
  estimatedHours?: number;

  @IsNumber()
  @IsOptional()
  timeSpent?: number;

  @IsString()
  @IsOptional()
  sprintId?: string | null;

  @IsString()
  @IsOptional()
  projectId?: string;

  @IsString()
  @IsOptional()
  assignedToId?: string;

  @IsString()
  @IsOptional()
  flowCardId?: string;
}
