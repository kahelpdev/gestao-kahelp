import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { HistoryService } from './history.service';

@Controller('history')
@UseGuards(JwtAuthGuard)
export class HistoryController {
  constructor(private historyService: HistoryService) {}

  @Get('allocation')
  getAllocationReport(
    @Request() req,
    @Query('sprintId') sprintId?: string,
    @Query('projectId') projectId?: string,
  ) {
    return this.historyService.getAllocationReport(
      req.user.organizationId,
      { sprintId, projectId },
    );
  }

  @Get('sprints')
  getSprintHistory(@Request() req) {
    return this.historyService.getSprintHistory(req.user.organizationId);
  }
}
