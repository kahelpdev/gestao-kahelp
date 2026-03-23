import { Body, Controller, Get, Patch, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';
import { OrganizationsService } from './organizations.service';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

@Controller('organizations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrganizationsController {
  constructor(private organizationsService: OrganizationsService) {}

  @Get('me')
  findMine(@Request() req) {
    return this.organizationsService.findOne(req.user.organizationId);
  }

  @Patch('me')
  @Roles('OWNER' as any)
  update(@Request() req, @Body() dto: UpdateOrganizationDto) {
    return this.organizationsService.update(req.user.organizationId, dto);
  }
}
