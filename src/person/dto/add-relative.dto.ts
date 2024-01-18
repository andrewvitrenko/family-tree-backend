import { IsNumber, IsOptional } from 'class-validator';

export class AddRelativeDto {
  @IsNumber()
  personId: number;

  @IsOptional()
  @IsNumber()
  childId?: number;

  @IsOptional()
  @IsNumber()
  parentId?: number;

  @IsNumber()
  @IsOptional()
  spouseId?: number;
}
