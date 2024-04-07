import { Module } from '@nestjs/common';

import { PrismaModule } from '@/prisma/prisma.module';

import { PersonController } from './person.controller';
import { PersonService } from './person.service';

@Module({
  providers: [PersonService],
  controllers: [PersonController],
  imports: [PrismaModule],
})
export class PersonModule {}
