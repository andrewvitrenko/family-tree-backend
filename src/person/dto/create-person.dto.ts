import { Sex } from '@prisma/client';

export class CreatePersonDto {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  sex: Sex;
}
