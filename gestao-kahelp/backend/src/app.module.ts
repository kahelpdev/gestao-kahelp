import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { TeamsModule } from './teams/teams.module';
import { ProjectsModule } from './projects/projects.module';
import { SprintsModule } from './sprints/sprints.module';
import { TasksModule } from './tasks/tasks.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { HistoryModule } from './history/history.module';
import { FlowSyncModule } from './flow-sync/flow-sync.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    OrganizationsModule,
    TeamsModule,
    ProjectsModule,
    SprintsModule,
    TasksModule,
    DashboardModule,
    HistoryModule,
    FlowSyncModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
