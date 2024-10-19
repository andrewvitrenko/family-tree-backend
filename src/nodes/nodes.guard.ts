import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UseGuards,
} from '@nestjs/common';
import { isUUID } from 'class-validator';

import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class NodesGuardFactory implements CanActivate {
  constructor(private readonly prismaService: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user.userId;
    const { treeId, nodeId } = request.params;

    if (!isUUID(treeId) || !isUUID(nodeId)) {
      throw new BadRequestException('Invalid ids');
    }

    const tree = await this.prismaService.tree.findUnique({
      where: { id: treeId, ownerId: userId, nodes: { some: { id: nodeId } } },
    });

    return Boolean(tree);
  }
}

export const NodesGuard = () => UseGuards(NodesGuardFactory);
