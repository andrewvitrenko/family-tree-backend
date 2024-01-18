import { Controller, Get, Query } from '@nestjs/common';

import { UseJwtGuard } from '@/guards/jwt.guard';
import { PersonService } from '@/person/person.service';
// TODO: add admin|viewer roles
@UseJwtGuard()
@Controller('person')
export class PersonController {
  constructor(private personService: PersonService) {}

  @Get()
  find(@Query('name') name: string) {
    return this.personService.find(name);
  }
}
