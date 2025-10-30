// src/user/user.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { Profile } from '../profile/profile.entity';
import { AbilityModule } from '../common/abilities/ability.module';
import { AuthModule } from '../auth/auth.module';
import { Role } from 'src/role/role.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Profile, Role]),
    AbilityModule,
    forwardRef(() => AuthModule), // supaya JwtService tersedia
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
