import { IsEmail, IsNotEmpty, IsString, MinLength, IsUUID } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  roleId: string;

  @IsUUID()
  @IsNotEmpty({ message: 'profileId is required' })
  profileId: string;
}
