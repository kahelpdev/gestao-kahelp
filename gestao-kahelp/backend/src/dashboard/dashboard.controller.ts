import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get('monitor')
  getExecutionMonitor(
    @Request() req,
    @Query('projectId') projectId?: string,
    @Query('assignedToId') assignedToId?: string,
  ) {
    return this.dashboardService.getExecutionMonitor(
      req.user.organizationId,
      { projectId, assignedToId },
    );
  }

  @Get('sprint-summary')
  getSprintSummary(@Request() req) {
    return this.dashboardService.getSprintSummary(req.user.organizationId);
  }
}
