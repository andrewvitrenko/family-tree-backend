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
export class TreesGuardFactory implements CanActivate {
  constructor(private readonly prismaService: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user.userId;
    const treeId = request.params.id;

    if (!isUUID(treeId)) {
      throw new BadRequestException('Tree id is invalid');
    }

    const tree = await this.prismaService.tree.findUnique({
      where: { id: treeId },
    });

    return userId === tree.ownerId;
  }
}

export const TreesGuard = () => UseGuards(TreesGuardFactory);
