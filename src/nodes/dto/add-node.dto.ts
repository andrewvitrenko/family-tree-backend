import { Sex } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class AddNodeDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsNumber()
  x: number;

  @IsNumber()
  y: number;

  @IsDateString()
  dateOfBirth: string;

  @IsDateString()
  @IsOptional()
  dateOfDeath?: string;

  @IsEnum(Sex)
  sex: Sex;
}
