import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UseGuards,
} from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class TreesGuardFactory implements CanActivate {
  constructor(private readonly prismaService: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user.userId;
    const treeId = request.params.id;

    const tree = await this.prismaService.tree.findUnique({
      where: { id: treeId },
    });

    return userId === tree.ownerId;
  }
}

export const TreesGuard = () => UseGuards(TreesGuardFactory);
