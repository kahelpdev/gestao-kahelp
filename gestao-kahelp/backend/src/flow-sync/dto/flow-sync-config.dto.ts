import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class FlowSyncConfigDto {
  @IsString()
  @IsNotEmpty()
  flowBaseUrl: string;

  @IsString()
  @IsNotEmpty()
  flowApiToken: string;

  @IsString()
  @IsOptional()
  flowBoardId?: string;
}
