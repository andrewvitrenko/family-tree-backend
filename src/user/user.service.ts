import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { genSalt, hash } from 'bcrypt';

import { PrismaService } from '@/prisma/prisma.service';
import { PaginatedData, QueryParams } from '@/types/common';
import { SecureUser } from '@/types/user';
import { CreateUserDto } from '@/user/dto/create-user.dto';
import { UpdateUserDto } from '@/user/dto/update-user.dto';
import { exclude } from '@/utils';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async get(id: string): Promise<SecureUser> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
      include: { person: true },
    });

    return exclude(user, ['password']);
  }

  async getMany({
    take,
    search,
    page,
  }: QueryParams): Promise<PaginatedData<SecureUser>> {
    const filter: Prisma.UserWhereInput = {
      OR: [
        {
          lastName: {
            contains: search,
            mode: 'insensitive',
          },
        },
        { firstName: { contains: search, mode: 'insensitive' } },
      ],
    };

    const users = await this.prismaService.user.findMany({
      where: filter,
      skip: (page - 1) * take,
      take,
      include: { person: true },
    });

    const total = await this.prismaService.user.count({ where: filter });

    return {
      data: users.map((user) => exclude(user, ['password'])),
      total,
    };
  }

  async create({
    birthDate,
    email,
    firstName,
    lastName,
    password,
    sex,
  }: CreateUserDto): Promise<SecureUser> {
    const existing = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (existing) {
      throw new ConflictException('User already exists');
    }

    const user = await this.prismaService.user.create({
      data: {
        email,
        firstName,
        lastName,
        password: await hash(password, await genSalt()),
        person: {
          create: {
            lastName,
            firstName,
            birthDate: new Date(birthDate).toISOString(),
            sex,
          },
        },
      },
      include: { person: true },
    });

    return exclude(user, ['password']);
  }

  async update(
    id: string,
    { birthDate, email, firstName, lastName, sex }: UpdateUserDto,
  ): Promise<SecureUser> {
    const user = await this.prismaService.user.update({
      where: { id },
      data: {
        email,
        firstName,
        lastName,
        person: { update: { birthDate, sex, firstName, lastName } },
      },
      include: { person: true },
    });

    return exclude(user, ['password']);
  }

  async remove(id: string): Promise<SecureUser> {
    const user = await this.prismaService.user.delete({ where: { id } });

    return exclude(user, ['password']);
  }
}
