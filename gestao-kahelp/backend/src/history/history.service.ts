import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HistoryService {
  constructor(private prisma: PrismaService) {}

  async getAllocationReport(
    organizationId: string,
    filters?: { sprintId?: string; projectId?: string },
  ) {
    const users = await this.prisma.user.findMany({
      where: { organizationId, active: true },
      select: {
        id: true,
        name: true,
        email: true,
        assignedTasks: {
          where: {
            ...(filters?.sprintId && { sprintId: filters.sprintId }),
            ...(filters?.projectId && { projectId: filters.projectId }),
          },
          include: {
            project: { select: { id: true, name: true, color: true } },
            sprint: { select: { id: true, name: true, status: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { name: 'asc' },
    });

    return users.map((user) => {
      const totalEstimated = user.assignedTasks.reduce(
        (sum, t) => sum + (t.estimatedHours || 0),
        0,
      );
      const totalSpent = user.assignedTasks.reduce(
        (sum, t) => sum + (t.timeSpent || 0),
        0,
      );

      return {
        user: { id: user.id, name: user.name, email: user.email },
        tasks: user.assignedTasks,
        summary: {
          totalTasks: user.assignedTasks.length,
          totalEstimatedHours: totalEstimated,
          totalTimeSpent: totalSpent,
          byStatus: {
            todo: user.assignedTasks.filter((t) => t.status === 'TODO').length,
            inProgress: user.assignedTasks.filter((t) => t.status === 'IN_PROGRESS').length,
            review: user.assignedTasks.filter((t) => t.status === 'REVIEW').length,
            done: user.assignedTasks.filter((t) => t.status === 'DONE').length,
          },
        },
      };
    });
  }

  async getSprintHistory(organizationId: string) {
    return this.prisma.sprint.findMany({
      where: { organizationId },
      include: {
        team: { select: { id: true, name: true } },
        tasks: {
          include: {
            assignedTo: { select: { id: true, name: true } },
            project: { select: { id: true, name: true } },
          },
        },
        _count: { select: { tasks: true } },
      },
      orderBy: { startDate: 'desc' },
    });
  }
}
