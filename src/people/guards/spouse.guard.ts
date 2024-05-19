import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UseGuards,
} from '@nestjs/common';
import { differenceInYears } from 'date-fns';
import { Request } from 'express';

import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
class SpouseGuardFactory implements CanActivate {
  constructor(private readonly prismaService: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const { personId } = request.params;
    const { dateOfBirth, sex } = request.body;

    const person = await this.prismaService.person.findUnique({
      where: { id: personId },
    });

    if (person.sex === sex) {
      throw new BadRequestException("Can't have two spouses with same sex");
    }

    const spouse1Age = differenceInYears(
      new Date(),
      new Date(person.dateOfBirth),
    );

    const spouse2Age = differenceInYears(new Date(), new Date(dateOfBirth));

    if (spouse1Age < 18 || spouse2Age < 18) {
      throw new BadRequestException('Not old enough to marry');
    }

    return true;
  }
}

export const SpouseGuard = () => UseGuards(SpouseGuardFactory);
