import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';
import { AddNodeDto } from '@/trees/dto/add-node.dto';
import { UpdateNodeDto } from '@/trees/dto/update-node.dto';

@Injectable()
export class NodesService {
  constructor(private readonly prismaService: PrismaService) {}

  add(
    treeId: string,
    { x, y, dateOfBirth, dateOfDeath, firstName, lastName, sex }: AddNodeDto,
  ) {
    return this.prismaService.node.create({
      data: {
        treeId,
        x,
        y,
        person: {
          create: { sex, lastName, firstName, dateOfBirth, dateOfDeath },
        },
      },
      include: { person: true },
    });
  }

  remove(nodeId: string) {
    return this.prismaService.node.delete({ where: { id: nodeId } });
  }

  update(
    nodeId: string,
    { dateOfBirth, dateOfDeath, firstName, lastName, sex, x, y }: UpdateNodeDto,
  ) {
    return this.prismaService.node.update({
      where: { id: nodeId },
      data: {
        x,
        y,
        person: {
          update: {
            data: { dateOfBirth, dateOfDeath, firstName, lastName, sex },
          },
        },
      },
      include: { person: true },
    });
  }
}
