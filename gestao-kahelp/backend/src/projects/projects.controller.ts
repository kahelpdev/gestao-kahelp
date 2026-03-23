import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles, RolesGuard } from '../auth/guards/roles.guard';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Controller('projects')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Post()
  @Roles('OWNER' as any, 'ADMIN' as any)
  create(@Request() req, @Body() dto: CreateProjectDto) {
    return this.projectsService.create(req.user.organizationId, dto);
  }

  @Get()
  findAll(@Request() req) {
    return this.projectsService.findAll(req.user.organizationId);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.projectsService.findOne(req.user.organizationId, id);
  }

  @Patch(':id')
  @Roles('OWNER' as any, 'ADMIN' as any)
  update(@Request() req, @Param('id') id: string, @Body() dto: UpdateProjectDto) {
    return this.projectsService.update(req.user.organizationId, id, dto);
  }

  @Delete(':id')
  @Roles('OWNER' as any)
  remove(@Request() req, @Param('id') id: string) {
    return this.projectsService.remove(req.user.organizationId, id);
  }
}
