import { Injectable } from '@nestjs/common';
import { Prisma, Tree } from '@prisma/client';

import { PrismaService } from '@/prisma/prisma.service';
import { CreateTreeDto } from '@/trees/dto/create-tree.dto';
import { UpdateTreeDto } from '@/trees/dto/update-tree.dto';
import { PaginatedData, Pagination } from '@/types/pagination';

@Injectable()
export class TreesService {
  constructor(private prismaService: PrismaService) {}

  getOne(id: string): Promise<Tree> {
    return this.prismaService.tree.findUnique({
      where: { id },
      include: { nodes: { include: { person: true } } },
    });
  }

  async getMany(
    userId: string,
    { page, search, take }: Pagination,
  ): Promise<PaginatedData<Tree>> {
    const filter: Prisma.TreeWhereInput = {
      AND: [
        { ownerId: userId },
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
      orderBy: { createdAt: 'desc' },
    });

    const total = await this.prismaService.tree.count({ where: filter });

    return {
      data: trees,
      total,
    };
  }

  async create(ownerId: string, createTreeDto: CreateTreeDto): Promise<Tree> {
    const user = await this.prismaService.user.findUnique({
      where: { id: ownerId },
    });

    const tree = await this.prismaService.tree.create({
      data: {
        ownerId,
        ...createTreeDto,
        nodes: {
          create: {
            x: 0,
            y: 0,
            person: {
              create: {
                dateOfBirth: user.dateOfBirth,
                firstName: user.firstName,
                lastName: user.lastName,
                sex: user.sex,
              },
            },
          },
        },
      },
      include: { nodes: { include: { person: true } } },
    });

    return tree;
  }

  update(id: string, updateTreeDto: UpdateTreeDto): Promise<Tree> {
    return this.prismaService.tree.update({
      where: { id },
      data: updateTreeDto,
      include: { nodes: true },
    });
  }

  remove(id: string): Promise<Tree> {
    return this.prismaService.tree.delete({ where: { id } });
  }
}
