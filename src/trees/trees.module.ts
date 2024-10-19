import { Module } from '@nestjs/common';

import { PrismaModule } from '@/prisma/prisma.module';

import { TreesController } from './trees.controller';
import { TreesService } from './trees.service';

@Module({
  controllers: [TreesController],
  providers: [TreesService],
  imports: [PrismaModule],
})
export class TreesModule {}
