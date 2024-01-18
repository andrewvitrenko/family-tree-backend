import { Injectable } from '@nestjs/common';
import { Person } from '@prisma/client';

import { AddRelativeDto } from '@/person/dto/add-relative.dto';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class PersonService {
  constructor(private prismaService: PrismaService) {}

  async create() {}

  find(name: string) {
    return this.prismaService.person.findMany({
      where: {
        OR: [
          { firstName: { contains: name, mode: 'insensitive' } },
          {
            lastName: {
              contains: name,
              mode: 'insensitive',
            },
          },
        ],
      },
    });
  }

  addRelative({
    childId,
    parentId,
    personId,
    spouseId,
  }: AddRelativeDto): Promise<Person> {
    return this.prismaService.person.update({
      where: { id: personId },
      data: {
        ...(childId && {
          children: {
            create: { childId, parentId: personId },
          },
        }),
        ...(parentId && {
          parents: {
            create: { parentId, childId: personId },
          },
        }),
        ...(spouseId && {
          spouse: {
            create: {},
          },
        }),
      },
    });
  }

  removeRelative() {}
}
