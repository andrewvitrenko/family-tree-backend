import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateTreeDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
