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
 * Validates the conditions to add a child
 */
@Injectable()
class ChildGuardFactory implements CanActivate {
  constructor(private readonly prismaService: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context
      .switchToHttp()
      .getRequest<Request<{ nodeId: string }, unknown, AddNodeDto>>();

    const { nodeId } = req.params;

    if (!isUUID(nodeId)) throw new BadRequestException('Invalid id');

    const parent = await this.prismaService.node.findUnique({
      where: { id: nodeId },
      select: { person: { select: { dateOfBirth: true } } },
    });

    if (!parent) throw new BadRequestException('Invalid id');

    const child = req.body;

    if (
      differenceInYears(child.dateOfBirth, parent.person.dateOfBirth) <
      MIN_PARENT_AGE
    ) {
      throw new BadRequestException('Invalid dates of birth');
    }

    return true;
  }
}

export const ChildGuard = () => UseGuards(ChildGuardFactory);
