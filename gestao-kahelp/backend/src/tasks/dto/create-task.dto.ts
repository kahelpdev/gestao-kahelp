import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { TaskStatus } from '@prisma/client';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

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

  @IsString()
  @IsOptional()
  sprintId?: string;

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
