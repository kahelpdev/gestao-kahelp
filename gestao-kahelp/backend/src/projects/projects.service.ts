import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async create(organizationId: string, dto: CreateProjectDto) {
    return this.prisma.project.create({
      data: { ...dto, organizationId },
    });
  }

  async findAll(organizationId: string) {
    return this.prisma.project.findMany({
      where: { organizationId },
      include: { _count: { select: { tasks: true } } },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(organizationId: string, projectId: string) {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, organizationId },
      include: { _count: { select: { tasks: true } } },
    });
    if (!project) throw new NotFoundException('Projeto não encontrado');
    return project;
  }

  async update(organizationId: string, projectId: string, dto: UpdateProjectDto) {
    await this.findOne(organizationId, projectId);
    return this.prisma.project.update({
      where: { id: projectId },
      data: dto,
    });
  }

  async remove(organizationId: string, projectId: string) {
    await this.findOne(organizationId, projectId);
    await this.prisma.project.delete({ where: { id: projectId } });
    return { message: 'Projeto removido com sucesso' };
  }
}
