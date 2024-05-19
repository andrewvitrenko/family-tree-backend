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
class PersonGuardFactory implements CanActivate {
  constructor(private readonly prismaService: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const { personId, treeId } = request.params;

    const person = await this.prismaService.person.findUnique({
      where: { id: personId },
    });

    if (!person) {
      throw new NotFoundException('Not found person');
    }

    if (person.treeId !== treeId) {
      throw new ForbiddenException('Person does not belong to tree');
    }

    return true;
  }
}

export const PersonGuard = () => UseGuards(PersonGuardFactory);
