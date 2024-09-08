import { Injectable } from '@nestjs/common';
import { Node } from '@prisma/client';

import { PrismaService } from '@/prisma/prisma.service';
import { AddNodeDto } from '@/trees/dto/add-node.dto';
import { UpdateNodeDto } from '@/trees/dto/update-node.dto';

@Injectable()
export class NodesService {
  constructor(private readonly prismaService: PrismaService) {}

  addChild(
    treeId: string,
    parentId: string,
    { x, y, ...person }: AddNodeDto,
  ): Promise<Node> {
    return this.prismaService.node.create({
      data: {
        treeId,
        x,
        y,
        person: { create: person },
        parents: { create: { parentId } },
      },
      include: { person: true },
    });
  }

  addParent(
    treeId: string,
    childId: string,
    { x, y, ...person }: AddNodeDto,
  ): Promise<Node> {
    return this.prismaService.node.create({
      data: {
        treeId,
        x,
        y,
        person: { create: person },
        children: { create: { childId } },
      },
      include: { person: true, children: true },
    });
  }

  remove(nodeId: string): Promise<Node> {
    return this.prismaService.node.delete({ where: { id: nodeId } });
  }

  update(nodeId: string, { x, y, ...person }: UpdateNodeDto): Promise<Node> {
    return this.prismaService.node.update({
      where: { id: nodeId },
      data: {
        x,
        y,
        person: { update: person },
      },
      include: { person: true },
    });
  }
}
