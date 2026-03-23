import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FlowSyncService {
  private readonly logger = new Logger(FlowSyncService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Placeholder for Flow API integration.
   * When the Flow API endpoint is configured, this method will:
   * 1. Fetch cards from Flow's "Alocado" column
   * 2. Map Flow cards to SprintTask records
   * 3. Create/update tasks in the local database
   * 4. Return a sync report
   */
  async syncFromFlow(organizationId: string, config: { flowBaseUrl: string; flowApiToken: string; flowBoardId?: string }) {
    this.logger.log(`Sync requested for org ${organizationId}`);
    this.logger.log(`Flow URL: ${config.flowBaseUrl}`);

    // TODO: Implement actual Flow API integration
    // Example implementation:
    //
    // const response = await fetch(`${config.flowBaseUrl}/api/boards/${config.flowBoardId}/cards`, {
    //   headers: { 'Authorization': `Bearer ${config.flowApiToken}` },
    // });
    // const flowCards = await response.json();
    //
    // for (const card of flowCards) {
    //   await this.prisma.sprintTask.upsert({
    //     where: { flowCardId: card.id },
    //     create: {
    //       title: card.title,
    //       description: card.description,
    //       flowCardId: card.id,
    //       estimatedHours: card.estimatedHours,
    //       assignedToId: await this.findUserByFlowId(card.assigneeId),
    //       createdById: systemUserId,
    //     },
    //     update: {
    //       title: card.title,
    //       status: this.mapFlowStatus(card.status),
    //       timeSpent: card.timeSpent,
    //     },
    //   });
    // }

    return {
      message: 'Flow sync não configurado ainda. Configure o endpoint do Flow para ativar a sincronização.',
      status: 'pending_configuration',
      organizationId,
      timestamp: new Date().toISOString(),
    };
  }

  async getSyncStatus(organizationId: string) {
    const tasksWithFlowId = await this.prisma.sprintTask.count({
      where: {
        flowCardId: { not: null },
        createdBy: { organizationId },
      },
    });

    const totalTasks = await this.prisma.sprintTask.count({
      where: {
        createdBy: { organizationId },
      },
    });

    return {
      totalTasks,
      syncedFromFlow: tasksWithFlowId,
      localOnly: totalTasks - tasksWithFlowId,
      lastSync: null, // TODO: Track last sync timestamp
    };
  }
}
