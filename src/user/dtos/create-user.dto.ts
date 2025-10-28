import { IsEmail, IsNotEmpty, IsString, MinLength, IsUUID, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsOptional()
  roleId: string;

  @IsUUID()
  @IsNotEmpty({ message: 'profileId is required' })
  profileId: string;
}
