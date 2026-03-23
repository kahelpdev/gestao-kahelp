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
import { SprintsService } from './sprints.service';
import { CreateSprintDto } from './dto/create-sprint.dto';
import { UpdateSprintDto } from './dto/update-sprint.dto';

@Controller('sprints')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SprintsController {
  constructor(private sprintsService: SprintsService) {}

  @Post()
  @Roles('OWNER' as any, 'ADMIN' as any)
  create(@Request() req, @Body() dto: CreateSprintDto) {
    return this.sprintsService.create(req.user.organizationId, dto);
  }

  @Get()
  findAll(@Request() req, @Query('teamId') teamId?: string) {
    return this.sprintsService.findAll(req.user.organizationId, teamId);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.sprintsService.findOne(req.user.organizationId, id);
  }

  @Patch(':id')
  @Roles('OWNER' as any, 'ADMIN' as any)
  update(@Request() req, @Param('id') id: string, @Body() dto: UpdateSprintDto) {
    return this.sprintsService.update(req.user.organizationId, id, dto);
  }

  @Post(':id/activate')
  @Roles('OWNER' as any, 'ADMIN' as any)
  activate(@Request() req, @Param('id') id: string) {
    return this.sprintsService.activate(req.user.organizationId, id);
  }

  @Post(':id/archive')
  @Roles('OWNER' as any, 'ADMIN' as any)
  archive(@Request() req, @Param('id') id: string) {
    return this.sprintsService.archive(req.user.organizationId, id);
  }

  @Delete(':id')
  @Roles('OWNER' as any)
  remove(@Request() req, @Param('id') id: string) {
    return this.sprintsService.remove(req.user.organizationId, id);
  }
}
