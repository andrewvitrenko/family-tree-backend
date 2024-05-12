import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UseGuards,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { PrismaService } from '@/prisma/prisma.service';

type Role = 'member' | 'owner';

export const Roles = Reflector.createDecorator<Role>();

@Injectable()
export class TreesGuardFactory implements CanActivate {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user.userId;
    const treeId = request.params.id;
    const role = this.reflector.get(Roles, context.getHandler()) ?? 'owner';

    const tree = await this.prismaService.tree.findUnique({
      where: { id: treeId },
      include: { people: true },
    });

    let isAllowed: boolean;

    if (role === 'owner') {
      isAllowed = tree.ownerId === userId;
    } else {
      isAllowed = tree.people.some((person) => person.userId === userId);
    }

    if (!isAllowed) {
      throw new ForbiddenException('User does not have permissions');
    }

    return true;
  }
}

export const TreesGuard = () => UseGuards(TreesGuardFactory);
