import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SprintStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSprintDto } from './dto/create-sprint.dto';
import { UpdateSprintDto } from './dto/update-sprint.dto';

@Injectable()
export class SprintsService {
  constructor(private prisma: PrismaService) {}

  async create(organizationId: string, dto: CreateSprintDto) {
    const team = await this.prisma.team.findFirst({
      where: { id: dto.teamId, organizationId },
    });
    if (!team) throw new NotFoundException('Time não encontrado');

    return this.prisma.sprint.create({
      data: {
        name: dto.name,
        goal: dto.goal,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        teamId: dto.teamId,
        organizationId,
      },
    });
  }

  async findAll(organizationId: string, teamId?: string) {
    return this.prisma.sprint.findMany({
      where: {
        organizationId,
        ...(teamId && { teamId }),
      },
      include: {
        team: { select: { id: true, name: true } },
        _count: { select: { tasks: true } },
      },
      orderBy: { startDate: 'desc' },
    });
  }

  async findOne(organizationId: string, sprintId: string) {
    const sprint = await this.prisma.sprint.findFirst({
      where: { id: sprintId, organizationId },
      include: {
        team: { select: { id: true, name: true } },
        tasks: {
          include: {
            assignedTo: { select: { id: true, name: true } },
            project: { select: { id: true, name: true, color: true } },
          },
        },
      },
    });
    if (!sprint) throw new NotFoundException('Sprint não encontrada');
    return sprint;
  }

  async update(organizationId: string, sprintId: string, dto: UpdateSprintDto) {
    await this.findOne(organizationId, sprintId);

    const data: any = { ...dto };
    if (dto.startDate) data.startDate = new Date(dto.startDate);
    if (dto.endDate) data.endDate = new Date(dto.endDate);

    return this.prisma.sprint.update({
      where: { id: sprintId },
      data,
    });
  }

  async activate(organizationId: string, sprintId: string) {
    const sprint = await this.findOne(organizationId, sprintId);

    // Desativar todas as sprints ativas do mesmo time
    await this.prisma.sprint.updateMany({
      where: {
        organizationId,
        teamId: sprint.teamId,
        status: SprintStatus.ACTIVE,
      },
      data: { status: SprintStatus.COMPLETED },
    });

    return this.prisma.sprint.update({
      where: { id: sprintId },
      data: { status: SprintStatus.ACTIVE },
    });
  }

  async archive(organizationId: string, sprintId: string) {
    await this.findOne(organizationId, sprintId);
    return this.prisma.sprint.update({
      where: { id: sprintId },
      data: { status: SprintStatus.COMPLETED },
    });
  }

  async remove(organizationId: string, sprintId: string) {
    const sprint = await this.findOne(organizationId, sprintId);
    if (sprint.status === SprintStatus.ACTIVE) {
      throw new BadRequestException('Não é possível excluir uma sprint ativa');
    }
    await this.prisma.sprint.delete({ where: { id: sprintId } });
    return { message: 'Sprint removida com sucesso' };
  }
}
