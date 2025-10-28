import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsInt } from 'class-validator';

export class CreateLocationDto {
  @IsNotEmpty()
  main_warehouse: string;

  @IsNotEmpty()
  code: string;

  @IsNotEmpty()
  name: string;

  @IsOptional()
  additional_info?: string;

  @IsNotEmpty()
  locationTypeId: string;

  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : Number(value)))
  capacity?: number;

  @IsOptional()
   @Transform(({ value }) => (value === '' ? undefined : Number(value)))
  parentId?: number;
}
