import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(createdById: string, dto: CreateTaskDto) {
    return this.prisma.sprintTask.create({
      data: {
        title: dto.title,
        description: dto.description,
        status: dto.status,
        priority: dto.priority,
        storyPoints: dto.storyPoints,
        estimatedHours: dto.estimatedHours,
        flowCardId: dto.flowCardId,
        sprintId: dto.sprintId || null,
        projectId: dto.projectId || null,
        assignedToId: dto.assignedToId || null,
        createdById,
      },
      include: {
        assignedTo: { select: { id: true, name: true } },
        project: { select: { id: true, name: true, color: true } },
        sprint: { select: { id: true, name: true } },
      },
    });
  }

  async findAll(filters: {
    sprintId?: string;
    projectId?: string;
    assignedToId?: string;
    status?: string;
    backlogOnly?: boolean;
  }) {
    const where: any = {};
    if (filters.sprintId) where.sprintId = filters.sprintId;
    if (filters.projectId) where.projectId = filters.projectId;
    if (filters.assignedToId) where.assignedToId = filters.assignedToId;
    if (filters.status) where.status = filters.status;
    if (filters.backlogOnly) where.sprintId = null;

    return this.prisma.sprintTask.findMany({
      where,
      include: {
        assignedTo: { select: { id: true, name: true } },
        project: { select: { id: true, name: true, color: true } },
        sprint: { select: { id: true, name: true, status: true } },
      },
      orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async findOne(taskId: string) {
    const task = await this.prisma.sprintTask.findUnique({
      where: { id: taskId },
      include: {
        assignedTo: { select: { id: true, name: true, email: true } },
        createdBy: { select: { id: true, name: true } },
        project: { select: { id: true, name: true, color: true } },
        sprint: { select: { id: true, name: true, status: true } },
      },
    });
    if (!task) throw new NotFoundException('Tarefa não encontrada');
    return task;
  }

  async update(taskId: string, dto: UpdateTaskDto) {
    await this.findOne(taskId);

    const data: any = { ...dto };
    // Allow setting sprintId to null (remove from sprint / send to backlog)
    if (dto.sprintId === null) data.sprintId = null;

    return this.prisma.sprintTask.update({
      where: { id: taskId },
      data,
      include: {
        assignedTo: { select: { id: true, name: true } },
        project: { select: { id: true, name: true, color: true } },
        sprint: { select: { id: true, name: true } },
      },
    });
  }

  async assignToSprint(taskId: string, sprintId: string) {
    await this.findOne(taskId);
    return this.prisma.sprintTask.update({
      where: { id: taskId },
      data: { sprintId },
      include: {
        sprint: { select: { id: true, name: true } },
      },
    });
  }

  async removeFromSprint(taskId: string) {
    await this.findOne(taskId);
    return this.prisma.sprintTask.update({
      where: { id: taskId },
      data: { sprintId: null },
    });
  }

  async remove(taskId: string) {
    await this.findOne(taskId);
    await this.prisma.sprintTask.delete({ where: { id: taskId } });
    return { message: 'Tarefa removida com sucesso' };
  }
}
