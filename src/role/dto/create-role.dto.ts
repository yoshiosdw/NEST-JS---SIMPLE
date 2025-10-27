import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsInt, IsString } from 'class-validator';

export class CreateRoleDto {
  @IsString()
    @IsNotEmpty()
    name: string;
}
