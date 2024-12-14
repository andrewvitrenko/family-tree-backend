import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UseGuards,
} from '@nestjs/common';
import { isUUID } from 'class-validator';
import { differenceInYears } from 'date-fns';
import { Request } from 'express';

import { MIN_PARENT_AGE } from '@/constants';
import { PrismaService } from '@/prisma/prisma.service';

import { AddNodeDto } from './dto/add-node.dto';

/**
 * Validates the conditions to add parent
 */
@Injectable()
class ParentGuardFactory implements CanActivate {
  constructor(private readonly prismaService: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context
      .switchToHttp()
      .getRequest<Request<{ nodeId: string }, unknown, AddNodeDto>>();
    const { nodeId } = req.params;

    if (!isUUID(nodeId)) throw new BadRequestException('Invalid id');

    const child = await this.prismaService.node.findUnique({
      where: { id: nodeId },
      select: { person: { select: { dateOfBirth: true } }, parents: true },
    });

    if (!child) throw new BadRequestException('Invalid id');

    if (child.parents.length > 1) {
      throw new BadRequestException('Cannot have more than 2 parents');
    }

    const parent = req.body;

    if (
      differenceInYears(child.person.dateOfBirth, parent.dateOfBirth) <
      MIN_PARENT_AGE
    ) {
      throw new BadRequestException('Invalid dates of birth');
    }

    return true;
  }
}

export const ParentsGuard = () => UseGuards(ParentGuardFactory);
