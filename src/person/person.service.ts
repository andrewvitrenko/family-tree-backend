import { Injectable } from '@nestjs/common';
import { Person, Prisma } from '@prisma/client';

import { PrismaService } from '@/prisma/prisma.service';
import { PaginatedData, QueryParams } from '@/types/common';

@Injectable()
export class PersonService {
  constructor(private prismaService: PrismaService) {}

  async getMany({
    page,
    search,
    take,
  }: QueryParams): Promise<PaginatedData<Person>> {
    const filter: Prisma.PersonWhereInput = {
      OR: [
        {
          firstName: { contains: search, mode: 'insensitive' },
        },
        { lastName: { contains: search, mode: 'insensitive' } },
      ],
    };

    const persons = await this.prismaService.person.findMany({
      where: filter,
      skip: page * take,
      take,
    });

    const total = await this.prismaService.person.count({ where: filter });

    return { data: persons, total };
  }
}
