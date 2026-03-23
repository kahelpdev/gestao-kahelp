import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles, RolesGuard } from '../auth/guards/roles.guard';
import { FlowSyncService } from './flow-sync.service';
import { FlowSyncConfigDto } from './dto/flow-sync-config.dto';

@Controller('flow-sync')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FlowSyncController {
  constructor(private flowSyncService: FlowSyncService) {}

  @Post('import')
  @Roles('OWNER' as any, 'ADMIN' as any)
  syncFromFlow(@Request() req, @Body() dto: FlowSyncConfigDto) {
    return this.flowSyncService.syncFromFlow(req.user.organizationId, dto);
  }

  @Get('status')
  getSyncStatus(@Request() req) {
    return this.flowSyncService.getSyncStatus(req.user.organizationId);
  }
}
