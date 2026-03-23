import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { AddMemberDto } from './dto/add-member.dto';

@Injectable()
export class TeamsService {
  constructor(private prisma: PrismaService) {}

  async create(organizationId: string, dto: CreateTeamDto) {
    return this.prisma.team.create({
      data: { ...dto, organizationId },
    });
  }

  async findAll(organizationId: string) {
    return this.prisma.team.findMany({
      where: { organizationId },
      include: {
        _count: { select: { members: true, sprints: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(organizationId: string, teamId: string) {
    const team = await this.prisma.team.findFirst({
      where: { id: teamId, organizationId },
      include: {
        members: {
          include: { user: { select: { id: true, name: true, email: true } } },
        },
        sprints: {
          orderBy: { startDate: 'desc' },
          take: 5,
        },
      },
    });
    if (!team) throw new NotFoundException('Time não encontrado');
    return team;
  }

  async update(organizationId: string, teamId: string, dto: UpdateTeamDto) {
    await this.findOne(organizationId, teamId);
    return this.prisma.team.update({
      where: { id: teamId },
      data: dto,
    });
  }

  async addMember(organizationId: string, teamId: string, dto: AddMemberDto) {
    await this.findOne(organizationId, teamId);

    const existing = await this.prisma.teamMember.findUnique({
      where: { teamId_userId: { teamId, userId: dto.userId } },
    });
    if (existing) throw new ConflictException('Usuário já é membro deste time');

    return this.prisma.teamMember.create({
      data: {
        teamId,
        userId: dto.userId,
        role: dto.role,
      },
      include: { user: { select: { id: true, name: true, email: true } } },
    });
  }

  async removeMember(organizationId: string, teamId: string, userId: string) {
    await this.findOne(organizationId, teamId);
    const member = await this.prisma.teamMember.findUnique({
      where: { teamId_userId: { teamId, userId } },
    });
    if (!member) throw new NotFoundException('Membro não encontrado no time');

    await this.prisma.teamMember.delete({
      where: { id: member.id },
    });
    return { message: 'Membro removido do time com sucesso' };
  }

  async remove(organizationId: string, teamId: string) {
    await this.findOne(organizationId, teamId);
    await this.prisma.team.delete({ where: { id: teamId } });
    return { message: 'Time removido com sucesso' };
  }
}
