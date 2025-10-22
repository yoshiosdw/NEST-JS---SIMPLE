// src/profile/dtos/create-profile.dto.ts
import { IsString, IsOptional } from 'class-validator';

export class CreateProfileDto {
  @IsOptional()
  @IsString()
  nik?: string;

  @IsOptional()
  @IsString()
  fullName?: string;

  @IsString()
  address: string;
}
