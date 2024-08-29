import { Module } from '@nestjs/common';

import { PrismaModule } from '@/prisma/prisma.module';

import { NodesService } from './nodes.service';
import { TreesController } from './trees.controller';
import { TreesService } from './trees.service';

@Module({
  controllers: [TreesController],
  providers: [TreesService, NodesService],
  imports: [PrismaModule],
})
export class TreesModule {}
