import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTreeDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
