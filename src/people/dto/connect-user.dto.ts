import { IsUUID } from 'class-validator';

export class ConnectUserDto {
  @IsUUID()
  userId: string;
}
