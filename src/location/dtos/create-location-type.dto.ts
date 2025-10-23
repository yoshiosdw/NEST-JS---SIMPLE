// src/location/dtos/create-location-type.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateLocationTypeDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
