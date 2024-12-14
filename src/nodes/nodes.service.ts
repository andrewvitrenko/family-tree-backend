import { Injectable } from '@nestjs/common';
import { Node, Prisma } from '@prisma/client';

import { PrismaService } from '@/prisma/prisma.service';

import { AddNodeDto } from './dto/add-node.dto';
import { UpdateNodeDto } from './dto/update-node.dto';

@Injectable()
export class NodesService {
  constructor(private readonly prismaService: PrismaService) {}

  addFirstNode(treeId: string, addNodeDto: AddNodeDto): Promise<Node> {
    return this.create(treeId, addNodeDto);
  }

  addChild(
    treeId: string,
    nodeId: string,
    addNodeDto: AddNodeDto,
  ): Promise<Node> {
    return this.create(treeId, addNodeDto, {
      parents: { create: { parentId: nodeId } },
    });
  }

  addParent(
    treeId: string,
    nodeId: string,
    addNodeDto: AddNodeDto,
  ): Promise<Node> {
    return this.create(treeId, addNodeDto, {
      children: { create: { childId: nodeId } },
    });
  }

  remove(nodeId: string): Promise<Node> {
    return this.prismaService.node.delete({
      where: { id: nodeId },
      include: { person: true },
    });
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

  private create(
    treeId: string,
    { x, y, ...person }: AddNodeDto,
    relations?: {
      parents?: Prisma.RelationCreateNestedManyWithoutChildInput;
      children?: Prisma.RelationCreateNestedManyWithoutParentInput;
    },
  ): Promise<Node> {
    return this.prismaService.node.create({
      data: {
        x,
        y,
        treeId,
        person: { create: person },
        ...relations,
      },
      include: { parents: true, children: true, person: true },
    });
  }
}
