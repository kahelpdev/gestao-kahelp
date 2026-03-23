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
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { AddMemberDto } from './dto/add-member.dto';

@Controller('teams')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TeamsController {
  constructor(private teamsService: TeamsService) {}

  @Post()
  @Roles('OWNER' as any, 'ADMIN' as any)
  create(@Request() req, @Body() dto: CreateTeamDto) {
    return this.teamsService.create(req.user.organizationId, dto);
  }

  @Get()
  findAll(@Request() req) {
    return this.teamsService.findAll(req.user.organizationId);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.teamsService.findOne(req.user.organizationId, id);
  }

  @Patch(':id')
  @Roles('OWNER' as any, 'ADMIN' as any)
  update(@Request() req, @Param('id') id: string, @Body() dto: UpdateTeamDto) {
    return this.teamsService.update(req.user.organizationId, id, dto);
  }

  @Post(':id/members')
  @Roles('OWNER' as any, 'ADMIN' as any)
  addMember(@Request() req, @Param('id') id: string, @Body() dto: AddMemberDto) {
    return this.teamsService.addMember(req.user.organizationId, id, dto);
  }

  @Delete(':id/members/:userId')
  @Roles('OWNER' as any, 'ADMIN' as any)
  removeMember(
    @Request() req,
    @Param('id') id: string,
    @Param('userId') userId: string,
  ) {
    return this.teamsService.removeMember(req.user.organizationId, id, userId);
  }

  @Delete(':id')
  @Roles('OWNER' as any)
  remove(@Request() req, @Param('id') id: string) {
    return this.teamsService.remove(req.user.organizationId, id);
  }
}
