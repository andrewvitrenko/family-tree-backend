import { Injectable } from '@nestjs/common';
import { Tree } from '@prisma/client';

import { PrismaService } from '@/prisma/prisma.service';
import { CreateTreeDto } from '@/trees/dto/create-tree.dto';
import { UpdateTreeDto } from '@/trees/dto/update-tree.dto';

@Injectable()
export class TreesService {
  constructor(private prismaService: PrismaService) {}

  getOne(id: string): Promise<Tree> {
    return this.prismaService.tree.findUnique({
      where: { id },
      include: { people: true },
    });
  }

  getAll(userId: string): Promise<Tree[]> {
    return this.prismaService.tree.findMany({
      where: { people: { some: { userId } } },
    });
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
