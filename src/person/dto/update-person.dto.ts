import { Sex } from '@prisma/client';

export class UpdatePersonDto {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  sex: Sex;
}
