import {
  Controller,
  Get,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Person } from '@prisma/client';

import { UseJwtGuard } from '@/guards/jwt.guard';
import { PersonService } from '@/person/person.service';
import { PaginatedData } from '@/types/common';

@UseJwtGuard()
@Controller('person')
export class PersonController {
  constructor(private personService: PersonService) {}

  @Post()
  create() {}

  @Get()
  getMany(
    @Query('search') search: string,
    @Query('page', ParseIntPipe) page: number,
    @Query('take', ParseIntPipe) take: number,
  ): Promise<PaginatedData<Person>> {
    return this.personService.getMany({ search, take, page });
  }

  @Patch()
  update() {}
}
