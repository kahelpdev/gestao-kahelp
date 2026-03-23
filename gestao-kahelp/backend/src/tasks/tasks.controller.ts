import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles, RolesGuard } from '../auth/guards/roles.guard';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Post()
  @Roles('OWNER' as any, 'ADMIN' as any)
  create(@Request() req, @Body() dto: CreateTaskDto) {
    return this.tasksService.create(req.user.userId, dto);
  }

  @Get()
  findAll(
    @Query('sprintId') sprintId?: string,
    @Query('projectId') projectId?: string,
    @Query('assignedToId') assignedToId?: string,
    @Query('status') status?: string,
    @Query('backlog') backlog?: string,
  ) {
    return this.tasksService.findAll({
      sprintId,
      projectId,
      assignedToId,
      status,
      backlogOnly: backlog === 'true',
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Patch(':id')
  @Roles('OWNER' as any, 'ADMIN' as any)
  update(@Param('id') id: string, @Body() dto: UpdateTaskDto) {
    return this.tasksService.update(id, dto);
  }

  @Post(':id/assign-sprint/:sprintId')
  @Roles('OWNER' as any, 'ADMIN' as any)
  assignToSprint(@Param('id') id: string, @Param('sprintId') sprintId: string) {
    return this.tasksService.assignToSprint(id, sprintId);
  }

  @Post(':id/remove-sprint')
  @Roles('OWNER' as any, 'ADMIN' as any)
  removeFromSprint(@Param('id') id: string) {
    return this.tasksService.removeFromSprint(id);
  }

  @Delete(':id')
  @Roles('OWNER' as any)
  remove(@Param('id') id: string) {
    return this.tasksService.remove(id);
  }
}
