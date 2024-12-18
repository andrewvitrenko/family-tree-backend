import {
  BadRequestException,
  CanActivate,
  ConflictException,
  ExecutionContext,
  Injectable,
  UseGuards,
} from '@nestjs/common';
import { isUUID } from 'class-validator';

import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class FirstNodeGuardFactory implements CanActivate {
  constructor(private readonly prismaService: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { treeId } = request.params;

    if (!isUUID(treeId)) {
      throw new BadRequestException('Invalid id');
    }

    const { nodes } = await this.prismaService.tree.findUnique({
      where: { id: treeId },
      select: { nodes: true },
    });

    if (nodes.length) {
      throw new ConflictException(
        'There are nodes in the tree. Use addChild or addParent endpoints to add new nodes',
      );
    }

    return true;
  }
}

export const FirstNodeGuard = () => UseGuards(FirstNodeGuardFactory);
