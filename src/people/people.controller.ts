import {
  Body,
  Controller,
  Delete,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { Person } from '@prisma/client';

import { UseJwtGuard } from '@/auth/guards/jwt.guard';

import { AddRelativeDto } from './dto/add-relative.dto';
import { AddSpouseDto } from './dto/add-spouse.dto';
import { ConnectUserDto } from './dto/connect-user.dto';
import { OwnerGuard } from './guards/owner.guard';
import { PersonGuard } from './guards/person.guard';
import { SpouseGuard } from './guards/spouse.guard';
import { PeopleService } from './people.service';

@PersonGuard()
@OwnerGuard()
@UseJwtGuard()
@Controller('/trees/:treeId/:personId')
export class PeopleController {
  constructor(private readonly peopleService: PeopleService) {}

  @Post('/spouse')
  @SpouseGuard()
  addSpouse(
    @Param('treeId', ParseUUIDPipe) treeId: string,
    @Param('personId', ParseUUIDPipe) personId: string,
    @Body() addSpouseDto: AddSpouseDto,
  ): Promise<Person> {
    return this.peopleService.addSpouse(treeId, personId, addSpouseDto);
  }

  @Post('/relative')
  addRelative(
    @Param('treeId', ParseUUIDPipe) treeId: string,
    @Param('personId', ParseUUIDPipe) personId: string,
    @Body() addRelativeDto: AddRelativeDto,
  ): Promise<Person> {
    return this.addRelative(treeId, personId, addRelativeDto);
  }

  @Post('/connectUser')
  connectUser(
    @Param('personId', ParseUUIDPipe) personId: string,
    @Body() connectUserDto: ConnectUserDto,
  ): Promise<Person> {
    return this.peopleService.connectUser(connectUserDto.userId, personId);
  }

  @Delete('/spouse')
  removeSpouse() {}

  @Delete('/relative')
  removeRelative() {}

  @Post('/removeUser')
  removeUser() {}

  // check that birth date is younger than parents and older that children
  @Patch()
  update() {}
}
