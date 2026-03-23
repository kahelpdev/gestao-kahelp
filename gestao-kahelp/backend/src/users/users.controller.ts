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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  @Roles('OWNER' as any, 'ADMIN' as any)
  create(@Request() req, @Body() dto: CreateUserDto) {
    return this.usersService.create(req.user.organizationId, dto);
  }

  @Get()
  findAll(@Request() req) {
    return this.usersService.findAll(req.user.organizationId);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.usersService.findOne(req.user.organizationId, id);
  }

  @Patch(':id')
  @Roles('OWNER' as any, 'ADMIN' as any)
  update(@Request() req, @Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(req.user.organizationId, id, dto);
  }

  @Delete(':id')
  @Roles('OWNER' as any)
  remove(@Request() req, @Param('id') id: string) {
    return this.usersService.remove(req.user.organizationId, id);
  }
}
