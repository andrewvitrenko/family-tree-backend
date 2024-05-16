import { Injectable } from '@nestjs/common';
import { Person, Sex } from '@prisma/client';

import { PrismaService } from '@/prisma/prisma.service';

import { AddRelativeDto, Relation } from './dto/add-relative.dto';
import { AddSpouseDto } from './dto/add-spouse.dto';

@Injectable()
export class PeopleService {
  constructor(private readonly prismaService: PrismaService) {}

  async addSpouse(
    treeId: string,
    personId: string,
    { dateOfBirth, dateOfDeath, sex, firstName, lastName }: AddSpouseDto,
  ): Promise<Person> {
    const { children } = await this.prismaService.person.findUnique({
      where: { id: personId },
      select: { children: true },
    });

    const spouse = await this.prismaService.person.create({
      data: {
        treeId,
        firstName,
        lastName,
        sex,
        dateOfBirth: new Date(dateOfBirth).toISOString(),
        dateOfDeath: dateOfDeath && new Date(dateOfDeath).toISOString(),
      },
    });

    if (sex === Sex.MALE) {
      await this.prismaService.person.update({
        where: { id: spouse.id },
        data: { wife: { create: { wifeId: personId } } },
      });
    } else {
      await this.prismaService.person.update({
        where: { id: spouse.id },
        data: {
          husband: { create: { husbandId: personId } },
        },
      });
    }

    if (children.length) {
      await this.prismaService.person.update({
        where: { id: spouse.id },
        data: {
          children: {
            createMany: { data: children.map(({ childId }) => ({ childId })) },
          },
        },
      });
    }

    return await this.prismaService.person.findUnique({
      where: { id: spouse.id },
      include: { children: true, husband: true, wife: true },
    });
  }

  async addRelative(
    treeId: string,
    personId: string,
    {
      dateOfBirth,
      firstName,
      lastName,
      relation,
      sex,
      dateOfDeath,
    }: AddRelativeDto,
  ): Promise<Person> {
    const { wife, husband, parents } =
      await this.prismaService.person.findUnique({
        where: { id: personId },
        select: { wife: true, husband: true, parents: true },
      });

    const relative = await this.prismaService.person.create({
      data: {
        firstName,
        lastName,
        sex,
        dateOfBirth: new Date(dateOfBirth).toISOString(),
        dateOfDeath: dateOfDeath && new Date(dateOfDeath).toISOString(),
        treeId,
      },
    });

    if (relation === Relation.CHILD) {
      await this.prismaService.person.update({
        where: { id: relative.id },
        data: {
          parents: {
            createMany: {
              data: [
                { parentId: personId },
                { parentId: wife?.wifeId ?? husband?.husbandId },
              ],
            },
          },
        },
      });
    } else {
      // if person has parents - add a spouse and create all the children
      if (Array.isArray(parents) && parents.length) {
        const parent = parents[0].parentId;
        const { children } = await this.prismaService.person.findUnique({
          where: { id: parent },
          select: { children: true },
        });

        await this.prismaService.person.update({
          where: { id: relative.id },
          data: {
            ...(sex === Sex.FEMALE && {
              husband: { create: { husbandId: parent } },
            }),
            ...(sex === Sex.MALE && {
              wife: { create: { wifeId: parent } },
            }),
            children: {
              createMany: {
                data: children.map(({ childId }) => ({ childId })),
              },
            },
          },
        });
      }

      // add only child if no other parents found
      await this.prismaService.person.update({
        where: { id: relative.id },
        data: {
          children: { create: { childId: personId } },
        },
      });
    }

    return await this.prismaService.person.findUnique({
      where: { id: relative.id },
      include: { wife: true, husband: true, children: true, parents: true },
    });
  }

  async connectUser(userId: string, personId: string): Promise<Person> {
    const { dateOfBirth, firstName, lastName, sex } =
      await this.prismaService.user.findUnique({
        where: { id: userId },
      });

    const person = await this.prismaService.person.update({
      where: { id: personId },
      data: { firstName, lastName, sex, dateOfBirth, userId },
    });

    return person;
  }
}
