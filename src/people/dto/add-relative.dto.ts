import { Sex } from '@prisma/client';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export enum Relation {
  PARENT = 'parent',
  CHILD = 'child',
}

export class AddRelativeDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEnum(Sex)
  sex: Sex;

  @IsDate()
  dateOfBirth: string;

  @IsDate()
  @IsOptional()
  dateOfDeath?: string;

  @IsEnum(Relation)
  relation: Relation;
}
