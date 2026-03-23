import { Module } from '@nestjs/common';
import { FlowSyncController } from './flow-sync.controller';
import { FlowSyncService } from './flow-sync.service';

@Module({
  controllers: [FlowSyncController],
  providers: [FlowSyncService],
  exports: [FlowSyncService],
})
export class FlowSyncModule {}
