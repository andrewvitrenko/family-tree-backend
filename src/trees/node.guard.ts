import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UseGuards,
} from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class NodeGuardFactory implements CanActivate {
  constructor(private readonly prismaService: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user.userId;
    const { treeId, nodeId } = request.params;

    const tree = await this.prismaService.tree.findUnique({
      where: { id: treeId, ownerId: userId, nodes: { some: { id: nodeId } } },
    });

    return Boolean(tree);
  }
}

export const NodeGuard = () => UseGuards(NodeGuardFactory);
