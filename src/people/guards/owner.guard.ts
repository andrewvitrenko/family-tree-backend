import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
class OwnerGuardFactory implements CanActivate {
  constructor(private readonly prismaService: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const { userId } = request.user;
    const { treeId } = request.params;

    const tree = await this.prismaService.tree.findUnique({
      where: { id: treeId },
    });

    if (!tree) {
      throw new NotFoundException('Tree not found');
    }

    if (tree.ownerId !== userId) {
      throw new ForbiddenException('User cannot change this tree');
    }

    return true;
  }
}

export const OwnerGuard = () => UseGuards(OwnerGuardFactory);
