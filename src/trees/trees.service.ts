import { Injectable } from '@nestjs/common';
import { Prisma, Tree } from '@prisma/client';

import { PrismaService } from '@/prisma/prisma.service';
import { CreateTreeDto } from '@/trees/dto/create-tree.dto';
import { UpdateTreeDto } from '@/trees/dto/update-tree.dto';
import { PaginatedData, QueryParams } from '@/types/common';

@Injectable()
export class TreesService {
  constructor(private prismaService: PrismaService) {}

  getOne(id: string): Promise<Tree> {
    return this.prismaService.tree.findUnique({
      where: { id },
      include: { people: true },
    });
  }

  async getMany(
    userId: string,
    { page, search, take }: QueryParams,
  ): Promise<PaginatedData<Tree>> {
    const filter: Prisma.TreeWhereInput = {
      AND: [
        { people: { some: { userId } } },
        {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ],
    };

    const trees = await this.prismaService.tree.findMany({
      where: filter,
      take,
      skip: (page - 1) * take,
    });

    const total = await this.prismaService.tree.count({ where: filter });

    return {
      data: trees,
      total,
    };
  }

  async create(ownerId: string, createTreeDto: CreateTreeDto): Promise<Tree> {
    const tree = await this.prismaService.tree.create({
      data: { ownerId, ...createTreeDto },
      include: { people: true },
    });

    const { dateOfBirth, firstName, lastName, sex } =
      await this.prismaService.user.findUnique({
        where: { id: ownerId },
      });

    await this.prismaService.person.create({
      data: {
        firstName,
        lastName,
        dateOfBirth,
        sex,
        userId: ownerId,
        treeId: tree.id,
      },
    });

    return tree;
  }

  update(id: string, updateTreeDto: UpdateTreeDto): Promise<Tree> {
    return this.prismaService.tree.update({
      where: { id },
      data: updateTreeDto,
      include: { people: true },
    });
  }

  remove(id: string): Promise<Tree> {
    return this.prismaService.tree.delete({ where: { id } });
  }
}
