import { Injectable } from '@nestjs/common';
import { SprintStatus, TaskStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getExecutionMonitor(
    organizationId: string,
    filters?: { projectId?: string; assignedToId?: string },
  ) {
    const activeSprint = await this.prisma.sprint.findFirst({
      where: { organizationId, status: SprintStatus.ACTIVE },
      select: { id: true, name: true, startDate: true, endDate: true },
    });

    const where: any = {
      status: TaskStatus.IN_PROGRESS,
      sprint: { organizationId },
    };
    if (filters?.projectId) where.projectId = filters.projectId;
    if (filters?.assignedToId) where.assignedToId = filters.assignedToId;

    const executingTasks = await this.prisma.sprintTask.findMany({
      where,
      include: {
        assignedTo: { select: { id: true, name: true } },
        project: { select: { id: true, name: true, color: true } },
        sprint: { select: { id: true, name: true, status: true } },
      },
    });

    // Also get tasks in progress without a sprint (backlog deviations)
    const backlogExecuting = await this.prisma.sprintTask.findMany({
      where: {
        status: TaskStatus.IN_PROGRESS,
        sprintId: null,
        createdBy: { organizationId },
        ...(filters?.projectId && { projectId: filters.projectId }),
        ...(filters?.assignedToId && { assignedToId: filters.assignedToId }),
      },
      include: {
        assignedTo: { select: { id: true, name: true } },
        project: { select: { id: true, name: true, color: true } },
      },
    });

    const planned = executingTasks.filter(
      (t) => activeSprint && t.sprintId === activeSprint.id,
    );

    const deviations = [
      ...executingTasks.filter(
        (t) => !activeSprint || t.sprintId !== activeSprint.id,
      ),
      ...backlogExecuting.map((t) => ({
        ...t,
        sprint: null,
        deviationReason: 'Executando tarefa do backlog (sem sprint)',
      })),
    ];

    return {
      activeSprint,
      planned,
      deviations,
      hasDeviations: deviations.length > 0,
      summary: {
        totalExecuting: planned.length + deviations.length,
        plannedCount: planned.length,
        deviationCount: deviations.length,
      },
    };
  }

  async getSprintSummary(organizationId: string) {
    const sprints = await this.prisma.sprint.findMany({
      where: { organizationId },
      include: {
        _count: { select: { tasks: true } },
        tasks: {
          select: { status: true, estimatedHours: true, timeSpent: true },
        },
      },
      orderBy: { startDate: 'desc' },
      take: 5,
    });

    return sprints.map((sprint) => {
      const totalTasks = sprint.tasks.length;
      const doneTasks = sprint.tasks.filter(
        (t) => t.status === TaskStatus.DONE,
      ).length;
      const totalEstimated = sprint.tasks.reduce(
        (sum, t) => sum + (t.estimatedHours || 0),
        0,
      );
      const totalSpent = sprint.tasks.reduce(
        (sum, t) => sum + (t.timeSpent || 0),
        0,
      );

      return {
        id: sprint.id,
        name: sprint.name,
        status: sprint.status,
        startDate: sprint.startDate,
        endDate: sprint.endDate,
        totalTasks,
        doneTasks,
        progress: totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0,
        totalEstimatedHours: totalEstimated,
        totalTimeSpent: totalSpent,
      };
    });
  }
}
