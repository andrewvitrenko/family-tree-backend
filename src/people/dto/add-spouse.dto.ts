import { Sex } from '@prisma/client';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class AddSpouseDto {
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
}
